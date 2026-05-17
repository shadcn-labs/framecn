---
description: "Test Editframe webhook endpoints locally using ngrok tunnels, webhook.site inspection, and the CLI test command."
---


# Testing Webhooks

Test your webhook endpoint before deploying to production using local tunneling, test services, and the Editframe dashboard.

## Local Testing with ngrok

Test webhooks locally by exposing your development server with ngrok:

### 1. Install ngrok

```bash
# macOS (Homebrew)
brew install ngrok

# Or download from https://ngrok.com/download
```

### 2. Start Your Local Server

```bash
# Start your application
npm run dev

# Server running on http://localhost:3000
```

### 3. Create ngrok Tunnel

```bash
# Expose port 3000
ngrok http 3000
```

ngrok will output:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 4. Configure Webhook URL

Update your API key's webhook URL to the ngrok URL:

```
https://abc123.ngrok.io/webhooks/editframe
```

You can do this via:
- Editframe dashboard → API Keys → Edit
- Or programmatically via API

### 5. Trigger Test Webhooks

Trigger events to test your endpoint:

```typescript
import { Client, createRender } from "@editframe/api";

const client = new Client(process.env.EDITFRAME_API_KEY);

// Create a render - triggers render.created webhook
const render = await createRender(client, {
  html: `<ef-timegroup mode="contain" class="w-[1920px] h-[1080px]">
    <ef-text>Test</ef-text>
  </ef-timegroup>`,
  width: 1920,
  height: 1080,
  fps: 30,
});

// Wait for completion - triggers render.completed webhook
console.log("Check your local server for webhook events");
```

### 6. Monitor Requests

View all webhook requests in the ngrok dashboard:
```
http://127.0.0.1:4040
```

The dashboard shows:
- Request headers (including `X-Webhook-Signature`)
- Request body (webhook event)
- Response status and body
- Timing information

## Testing with webhook.site

Use webhook.site to inspect webhook payloads without writing code:

### 1. Get a Test URL

Visit [webhook.site](https://webhook.site) to get a unique URL:
```
https://webhook.site/abc-123-def
```

### 2. Configure Webhook

Set your API key's webhook URL to the webhook.site URL.

### 3. Trigger Events

Create renders or upload files to trigger webhooks.

### 4. Inspect Payloads

View webhook requests in webhook.site's interface:
- Full request headers
- JSON payload
- Signature verification (manual)

**Note**: webhook.site doesn't verify signatures. Use this for payload inspection only.

## Test Webhook from Dashboard

Send test webhooks directly from the Editframe dashboard:

### 1. Navigate to API Key

Go to your API key detail page:
```
https://editframe.com/resource/api_keys/<key-id>
```

### 2. Send Test Webhook

1. Click "Test Webhook"
2. Select a topic (e.g., "render.completed")
3. Click "Send Test"

The dashboard will send a test webhook with sample data:

```json
{
  "topic": "webhook.test",
  "data": {
    "id": "your-api-key-id",
    "org_id": "your-org-id"
  }
}
```

### 3. Verify Receipt

Check your webhook endpoint logs to verify:
- Request received
- Signature verified successfully
- Event processed

## Unit Testing

Test webhook signature verification in unit tests:

```typescript
import { describe, test, expect } from "vitest";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "./webhooks";

describe("webhook signature verification", () => {
  const secret = "test-webhook-secret";

  test("verifies valid signature", () => {
    const payload = JSON.stringify({
      topic: "render.completed",
      data: { id: "test-id" }
    });

    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    expect(verifyWebhookSignature(payload, signature, secret)).toBe(true);
  });

  test("rejects invalid signature", () => {
    const payload = JSON.stringify({
      topic: "render.completed",
      data: { id: "test-id" }
    });

    const signature = "invalid-signature";

    expect(verifyWebhookSignature(payload, signature, secret)).toBe(false);
  });

  test("rejects tampered payload", () => {
    const payload = JSON.stringify({
      topic: "render.completed",
      data: { id: "test-id" }
    });

    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Tamper with payload
    const tamperedPayload = payload.replace("test-id", "hacked-id");

    expect(verifyWebhookSignature(tamperedPayload, signature, secret)).toBe(false);
  });
});
```

## Integration Testing

Test webhook handling end-to-end:

```typescript
import { describe, test, expect } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import { app } from "./app"; // Your Express app

describe("webhook endpoint", () => {
  const secret = process.env.EDITFRAME_WEBHOOK_SECRET!;

  function signPayload(payload: object): string {
    const body = JSON.stringify(payload);
    return crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
  }

  test("accepts valid webhook", async () => {
    const payload = {
      topic: "render.completed",
      data: {
        id: "test-render-id",
        status: "complete",
        download_url: "https://example.com/video.mp4"
      }
    };

    const signature = signPayload(payload);

    const response = await request(app)
      .post("/webhooks/editframe")
      .set("X-Webhook-Signature", signature)
      .send(payload);

    expect(response.status).toBe(200);
  });

  test("rejects invalid signature", async () => {
    const payload = {
      topic: "render.completed",
      data: { id: "test-id" }
    };

    const response = await request(app)
      .post("/webhooks/editframe")
      .set("X-Webhook-Signature", "invalid")
      .send(payload);

    expect(response.status).toBe(401);
  });

  test("rejects missing signature", async () => {
    const payload = {
      topic: "render.completed",
      data: { id: "test-id" }
    };

    const response = await request(app)
      .post("/webhooks/editframe")
      .send(payload);

    expect(response.status).toBe(401);
  });
});
```

## Manual Testing Script

Create a script to send test webhooks:

```typescript
// scripts/send-test-webhook.ts
import crypto from "node:crypto";

const WEBHOOK_URL = "http://localhost:3000/webhooks/editframe";
const WEBHOOK_SECRET = process.env.EDITFRAME_WEBHOOK_SECRET!;

async function sendTestWebhook(topic: string, data: object) {
  const payload = JSON.stringify({ topic, data });

  const signature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  console.log(`Sending ${topic} webhook...`);

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": signature,
    },
    body: payload,
  });

  console.log(`Response: ${response.status} ${response.statusText}`);
  console.log(await response.text());
}

// Test render.completed
await sendTestWebhook("render.completed", {
  id: "test-render-id",
  status: "complete",
  created_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  failed_at: null,
  width: 1920,
  height: 1080,
  fps: 30,
  byte_size: 15728640,
  duration_ms: 5000,
  md5: "098f6bcd4621d373cade4e832627b4f6",
  metadata: null,
  download_url: "https://example.com/video.mp4"
});
```

Run the script:
```bash
npx tsx scripts/send-test-webhook.ts
```

## Monitoring Webhook Logs

Check webhook delivery logs in the Editframe dashboard:

1. Go to your API key detail page
2. View "Webhook Deliveries" section
3. See:
   - Delivery timestamp
   - HTTP status code
   - Response headers/body
   - Retry attempts
   - Success/failure status

Use these logs to debug webhook issues.

## Testing Checklist

Before deploying to production:

- [ ] Signature verification works correctly
- [ ] Endpoint responds with 200 OK within 30 seconds
- [ ] Invalid signatures are rejected with 401
- [ ] Events are processed idempotently
- [ ] Errors don't crash the server
- [ ] Events are logged for debugging
- [ ] Retry logic handles transient failures
- [ ] ngrok tunnel tested successfully
- [ ] Test webhook from dashboard works
- [ ] Integration tests pass

## Common Testing Issues

### ngrok URL Not Accessible

**Problem**: Webhooks aren't reaching your local server

**Solution**:
1. Check ngrok is running: `http://127.0.0.1:4040`
2. Verify ngrok URL in API key configuration
3. Check local server is running on correct port
4. Check firewall settings

### Signature Verification Fails

**Problem**: All webhooks rejected with 401

**Solution**:
1. Verify you're using the correct webhook secret
2. Hash the raw request body, not parsed JSON
3. Check secret isn't corrupted (no extra spaces/newlines)
4. Test with the manual testing script

### Webhooks Not Received

**Problem**: Events triggered but no webhooks received

**Solution**:
1. Check webhook URL is correct
2. Verify webhook events are selected in API key config
3. Check webhook delivery logs for errors
4. Test with webhook.site to isolate issues

## Next Steps

- [troubleshooting.md](references/troubleshooting.md) — Debug webhook issues
- [security.md](references/security.md) — Verify signatures correctly
- [events.md](references/events.md) — Understand webhook payloads
