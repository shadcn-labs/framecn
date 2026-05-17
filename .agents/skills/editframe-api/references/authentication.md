---
description: "How API keys work, Client class behavior, and authentication patterns for server-side and browser-based applications"
---


# Authentication

The Editframe API uses API keys for server-side authentication and URL tokens for browser-based media access.

## Client Class

The `Client` class handles authentication for all API requests:

```typescript
import { Client } from "@editframe/api";

// With API key (server-side)
const client = new Client(process.env.EDITFRAME_API_KEY);

// Without API key (browser with session cookies)
const client = new Client();
```

### Server-Side Authentication

When you provide an API key, the Client adds a Bearer token to all requests:

```typescript
const client = new Client(process.env.EDITFRAME_API_KEY);

// This request includes: Authorization: Bearer <your-api-key>
const render = await createRender(client, { html: "..." });
```

The API key is validated on every request. Invalid or expired keys return a 401 Unauthorized response.

Get your API key from the Editframe dashboard at Settings → API Keys.

### Browser-Based Authentication

When no API key is provided, the Client relies on session cookies:

```typescript
const client = new Client(); // No API key

// This request includes: credentials: 'include'
// Relies on session cookie from editframe.com login
const render = await createRender(client, { html: "..." });
```

This pattern works when your application runs on the same domain as Editframe or when users are logged into editframe.com. For most applications, you'll use server-side authentication instead.

## Authentication Patterns

### Pattern 1: Server-Side Rendering

Your backend holds the API key and makes all API calls:

```typescript
// server.js
import { Client, createRender } from "@editframe/api";

const client = new Client(process.env.EDITFRAME_API_KEY);

app.post("/render", async (req, res) => {
  const render = await createRender(client, {
    html: req.body.composition,
    width: 1920,
    height: 1080,
  });
  
  res.json({ renderId: render.id });
});
```

The API key never leaves your server. This is the most secure pattern.

### Pattern 2: Browser Playback with URL Signing

Your backend holds the API key. Your frontend needs to play media through Editframe's CDN. Use URL signing to create scoped, short-lived tokens:

```typescript
// server.js
import { Client, createURLToken } from "@editframe/api";

const client = new Client(process.env.EDITFRAME_API_KEY);

app.post("/sign-url", async (req, res) => {
  const token = await createURLToken(client, req.body.url);
  res.json({ token });
});
```

```html
<!-- frontend.html -->
<ef-configuration signingURL="/sign-url"></ef-configuration>
<ef-video src="https://editframe.com/api/v1/transcode/..."></ef-video>
```

The browser requests a token from your server, which uses the API key to generate it. The token authorizes access to a specific URL for a limited time (typically 1 hour).

See [references/url-signing.md](references/url-signing.md) for complete implementation details.

## Security Best Practices

1. **Never expose API keys in client-side code**. API keys grant full access to your Editframe account.

2. **Use environment variables** to store API keys:
   ```bash
   EDITFRAME_API_KEY=ef_yoursecret_yourkeyid
   ```

3. **Rotate keys periodically**. Create a new key, update your application, then delete the old key.

4. **Use separate keys for development and production**. This limits the blast radius if a development key is compromised.

5. **Monitor API usage**. The Editframe dashboard shows which API keys are being used and how often.

## Error Handling

Authentication failures return 401 Unauthorized:

```typescript
try {
  const render = await createRender(client, { html: "..." });
} catch (error) {
  if (error.message.includes("401")) {
    console.error("Invalid API key");
  }
}
```

All SDK functions throw on non-OK responses. The error message includes the HTTP status and response text.
