---
description: Configure a webhook endpoint URL to receive Editframe event notifications for render completion and file processing.
---


# Getting Started with Webhooks

Configure webhooks to receive real-time notifications when renders complete or files finish processing.

## Prerequisites

- An Editframe account with API access
- A publicly accessible HTTPS endpoint to receive webhooks
- Ability to verify HMAC signatures in your application

## Step 1: Create a Webhook Endpoint

Create an endpoint in your application that accepts POST requests:

```typescript
import express from "express";
import crypto from "node:crypto";

const app = express();
app.use(express.json());

app.post("/webhooks/editframe", async (req, res) => {
  const signature = req.headers["x-webhook-signature"];
  const payload = req.body;

  // TODO: Verify signature (see Step 3)

  console.log("Webhook received:", payload.topic);

  // Respond quickly - process events asynchronously
  res.status(200).send("OK");

  // Process event in background
  processWebhookEvent(payload).catch(console.error);
});

app.listen(3000);
```

Your endpoint must:
- Accept POST requests with JSON body
- Respond with 200 OK within 30 seconds
- Verify the `X-Webhook-Signature` header
- Handle events idempotently (events may be delivered multiple times)

## Step 2: Register Your Webhook

Register your webhook URL when creating an API key. You can do this via the Editframe dashboard or programmatically:

### Via Dashboard

1. Go to [editframe.com/resource/api_keys](https://editframe.com/resource/api_keys)
2. Click "Create API Key"
3. Fill in the form:
   - **Name**: "My Application"
   - **Webhook URL**: `https://your-app.com/webhooks/editframe`
   - **Webhook Events**: Select events to receive:
     - `render.completed`
     - `render.failed`
     - `file.ready`
4. Click "Create"
5. Copy and securely store:
   - **API Key** (for making API requests)
   - **Webhook Secret** (for verifying signatures)

### Via API (Programmatic)

```typescript
import { db } from "@/sql-client.server";
import { createApiKey } from "@/createApiKey.server";
import { generateApiToken } from "@/util/scryptPromise.server";
import crypto from "node:crypto";

// Generate tokens
const apiToken = crypto.randomBytes(32).toString("hex");
const webhookSecret = crypto.randomBytes(32).toString("hex");

// Create API key with webhook configuration
const apiKey = await createApiKey({
  token: apiToken,
  webhookSecret: webhookSecret,
  name: "My Application",
  orgId: "your-org-id",
  userId: "your-user-id",
  webhookUrl: "https://your-app.com/webhooks/editframe",
  webhookEvents: ["render.completed", "render.failed", "file.ready"],
  expired_at: null, // or set expiration date
});

console.log("API Key ID:", apiKey.id);
console.log("API Token:", apiToken); // Store securely
console.log("Webhook Secret:", webhookSecret); // Store securely
```

## Step 3: Verify Webhook Signatures

Every webhook request includes an `X-Webhook-Signature` header containing an HMAC-SHA256 signature. Verify this signature to ensure the request is from Editframe:

```typescript
import crypto from "node:crypto";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
app.post("/webhooks/editframe", async (req, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const payload = JSON.stringify(req.body);
  const secret = process.env.EDITFRAME_WEBHOOK_SECRET!;

  if (!verifyWebhookSignature(payload, signature, secret)) {
    console.error("Invalid webhook signature");
    return res.status(401).send("Invalid signature");
  }

  // Signature is valid - process event
  const { topic, data } = req.body;
  console.log(`Verified webhook: ${topic}`);

  res.status(200).send("OK");
});
```

**Critical**: Hash the raw request body as received, not the parsed JSON object. Different JSON serialization can produce different hashes.

## Step 4: Handle Webhook Events

Process events based on their topic:

```typescript
async function processWebhookEvent(event: WebhookEvent) {
  const { topic, data } = event;

  switch (topic) {
    case "render.completed":
      console.log(`Render ${data.id} completed`);
      console.log(`Download URL: ${data.download_url}`);
      console.log(`Duration: ${data.duration_ms}ms`);
      console.log(`Size: ${data.byte_size} bytes`);

      // Download the render
      const response = await fetch(data.download_url);
      const videoBuffer = await response.arrayBuffer();
      // ... save or process video
      break;

    case "render.failed":
      console.error(`Render ${data.id} failed`);
      // ... notify user or retry
      break;

    case "file.ready":
      console.log(`File ${data.id} is ready`);
      // ... use file in composition
      break;

    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }
}
```

## Step 5: Test Your Webhook

Use the Editframe dashboard to send a test webhook:

1. Go to your API key detail page
2. Click "Test Webhook"
3. Select a topic (e.g., "render.completed")
4. Click "Send Test"

Your endpoint should receive a test webhook with sample data. Check your server logs to verify the webhook was received and the signature was validated.

## Local Development

For local testing, use a tunneling service like ngrok:

```bash
# Start your local server
npm run dev

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL as your webhook URL
# Example: https://abc123.ngrok.io/webhooks/editframe
```

Update your API key's webhook URL to the ngrok URL, then trigger events to test locally.

See [testing.md](references/testing.md) for more testing strategies.

## Production Considerations

When deploying to production:

1. **Use HTTPS**: Webhook URLs must use HTTPS (not HTTP)
2. **Store secrets securely**: Never commit webhook secrets to version control
3. **Respond quickly**: Return 200 OK within 30 seconds
4. **Process asynchronously**: Handle events in background jobs/queues
5. **Implement idempotency**: Use event IDs to prevent duplicate processing
6. **Log delivery failures**: Monitor webhook delivery in the dashboard
7. **Handle retries**: Events may be delivered multiple times

## Next Steps

- [events.md](references/events.md) — Learn about all event types and payload structures
- [security.md](references/security.md) — Deep dive into signature verification
- [testing.md](references/testing.md) — Advanced testing strategies
- [troubleshooting.md](references/troubleshooting.md) — Debug common issues
