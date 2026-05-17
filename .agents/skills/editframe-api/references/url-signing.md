---
description: Generate short-lived signed CDN tokens to enable browser-based playback of private Editframe media files securely.
---


# URL Signing

URL signing enables browsers to access Editframe's media endpoints without exposing your API key.

## The Problem

Your backend has an API key. Your browser needs to play video from Editframe's CDN. You cannot put the API key in the browser — it would grant full access to your account.

URL signing solves this: your backend generates a short-lived, scoped token that authorizes the browser to access a specific URL. The token expires after a set time (typically 1 hour) and only works for the URL it was created for.

## When You Need URL Signing

**You need URL signing if:**
- Your application renders Editframe compositions in a browser
- You use `<ef-video>`, `<ef-audio>`, or other media elements with `src` pointing to Editframe URLs
- You need browser access to `/api/v1/transcode/*` endpoints for adaptive streaming

**You don't need URL signing if:**
- You only render videos server-side (using `createRender` and `downloadRender`)
- All media playback happens in your backend

## How It Works

```mermaid
sequenceDiagram
    participant Browser
    participant YourServer
    participant EditframeAPI
    
    Browser->>YourServer: POST /sign-url {url}
    YourServer->>EditframeAPI: POST /api/v1/url-token {url}
    Note over YourServer,EditframeAPI: Authenticated with API key
    EditframeAPI->>YourServer: {token: "jwt..."}
    YourServer->>Browser: {token: "jwt..."}
    Browser->>EditframeAPI: GET /api/v1/transcode/...
    Note over Browser,EditframeAPI: Authorization: Bearer jwt...
    EditframeAPI->>Browser: Media data
```

1. Browser needs to access a media URL
2. Browser requests a token from your server
3. Your server calls `createURLToken` with your API key
4. Editframe returns a signed JWT
5. Browser uses the JWT to access the media URL

## Implementation

### Server-Side: Token Generation

Create an endpoint that proxies to `/api/v1/url-token`:

```typescript
// server.js
import express from "express";
import { Client, createURLToken } from "@editframe/api";

const app = express();
const client = new Client(process.env.EDITFRAME_API_KEY);

app.post("/sign-url", express.json(), async (req, res) => {
  try {
    const { url } = req.body;
    
    // Generate signed token
    const token = await createURLToken(client, url);
    
    res.json({ token });
  } catch (error) {
    console.error("Failed to sign URL:", error);
    res.status(500).json({ error: "Failed to sign URL" });
  }
});

app.listen(3000);
```

### Client-Side: Configuration

In your Editframe Elements project, configure the signing endpoint:

```html
<!-- Configure signing URL -->
<ef-configuration signingURL="/sign-url"></ef-configuration>

<!-- Media elements automatically use signed URLs -->
<ef-timegroup mode="contain" class="w-[1280px] h-[720px]">
  <ef-video src="https://editframe.com/api/v1/transcode/manifest.m3u8?url=..."></ef-video>
</ef-timegroup>
```

Set up an Elements project with `npm create @editframe` if you haven't already. See the `editframe-create` skill for setup instructions.

When `<ef-video>` loads, it:
1. Detects the `src` requires authentication
2. POSTs to `/sign-url` with `{url: "https://editframe.com/api/v1/transcode/..."}`
3. Receives `{token: "jwt..."}`
4. Adds `Authorization: Bearer jwt...` to the media request

## Token Lifecycle

Tokens are valid for 1 hour by default. The browser caches tokens and reuses them for the same URL until they expire.

For transcode endpoints, the browser signs the base URL once and reuses the token for all segments:

```
Base URL: https://editframe.com/api/v1/transcode
Segments: /1080p/init.m4s, /1080p/1.m4s, /1080p/2.m4s, ...
```

One token covers all segments for a given source video.

## Alternative: Anonymous Tokens

If your application uses session cookies (users logged into editframe.com), you can use the anonymous token flow:

```typescript
// server.js (session-based)
app.post("/sign-url", async (req, res) => {
  const { url } = req.body;
  
  // No API key needed — relies on session cookie
  const response = await fetch("https://editframe.com/ef-sign-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include session cookie
    body: JSON.stringify({ url }),
  });
  
  const { token } = await response.json();
  res.json({ token });
});
```

This pattern is less common. Most applications use API key authentication.

## Integration with Composition Skills

URL signing coordinates with the elements-composition and react-composition skills:

- **elements-composition**: Use `<ef-configuration signingURL>` to set up signing for HTML compositions
- **react-composition**: Use `<Configuration signingURL>` component for React-based compositions

Both skills document the client-side integration. This skill documents the server-side token generation.

## Debugging

If media fails to load:

1. Check browser console for 401 errors
2. Verify `/sign-url` endpoint is accessible
3. Confirm API key is valid: `curl -H "Authorization: Bearer $API_KEY" https://editframe.com/api/v1/organization`
4. Check token expiry: decode the JWT and inspect the `exp` claim

Tokens are standard JWTs. Use [jwt.io](https://jwt.io) to inspect them.
