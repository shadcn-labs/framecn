---
description: Verify HMAC-SHA256 signatures on incoming webhook requests and prevent replay attacks with timestamp validation.
---


# Webhook Security

Secure your webhook endpoints with HMAC signature verification, timestamp validation, and proper secret management.

## HMAC Signature Verification

Every webhook request includes an `X-Webhook-Signature` header containing an HMAC-SHA256 signature. This signature proves the request originated from Editframe and hasn't been tampered with.

### Signature Format

```
X-Webhook-Signature: <hmac-sha256-hex-digest>
```

The signature is computed as:
```
HMAC-SHA256(webhook_secret, request_body)
```

Where:
- `webhook_secret` is your API key's webhook secret
- `request_body` is the raw JSON request body as a string

### Verification Implementation

#### Node.js / TypeScript

```typescript
import crypto from "node:crypto";

function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  // Compute expected signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express middleware
app.post("/webhooks/editframe", (req, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const secret = process.env.EDITFRAME_WEBHOOK_SECRET!;

  // Get raw body (before JSON parsing)
  const rawBody = JSON.stringify(req.body);

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(401).send("Invalid signature");
  }

  // Signature is valid - process event
  const event = req.body;
  res.status(200).send("OK");
});
```

**Critical**: Hash the raw request body string, not the parsed JSON object. JSON serialization order can vary, producing different hashes.

#### Express with Raw Body

To verify signatures correctly, you need access to the raw request body:

```typescript
import express from "express";
import bodyParser from "body-parser";

const app = express();

// Capture raw body for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    (req as any).rawBody = buf.toString('utf8');
  }
}));

app.post("/webhooks/editframe", (req, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const rawBody = (req as any).rawBody;
  const secret = process.env.EDITFRAME_WEBHOOK_SECRET!;

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(401).send("Invalid signature");
  }

  // Process event
  res.status(200).send("OK");
});
```

#### Next.js API Routes

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "node:crypto";

// Disable body parsing to access raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const signature = req.headers["x-webhook-signature"] as string;
  const rawBody = await getRawBody(req);
  const secret = process.env.EDITFRAME_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(rawBody);
  // Process event

  res.status(200).send("OK");
}
```

#### Python (Flask)

```python
import hmac
import hashlib
from flask import Flask, request

app = Flask(__name__)
WEBHOOK_SECRET = "your-webhook-secret"

@app.route("/webhooks/editframe", methods=["POST"])
def handle_webhook():
    signature = request.headers.get("X-Webhook-Signature")
    payload = request.get_data()

    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected_signature):
        return "Invalid signature", 401

    event = request.get_json()
    # Process event

    return "OK", 200
```

#### Ruby (Rails)

```ruby
require 'openssl'

class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def editframe
    signature = request.headers["X-Webhook-Signature"]
    payload = request.raw_post
    secret = ENV["EDITFRAME_WEBHOOK_SECRET"]

    expected_signature = OpenSSL::HMAC.hexdigest(
      OpenSSL::Digest.new('sha256'),
      secret,
      payload
    )

    unless ActiveSupport::SecurityUtils.secure_compare(signature, expected_signature)
      render plain: "Invalid signature", status: :unauthorized
      return
    end

    event = JSON.parse(payload)
    # Process event

    render plain: "OK", status: :ok
  end
end
```

## Secret Management

### Retrieving Your Webhook Secret

When you create an API key, you receive:
1. **API Key**: For authenticating API requests
2. **Webhook Secret**: For verifying webhook signatures

**Important**: The webhook secret is only shown once during API key creation. Store it securely immediately.

### Storing Secrets

Never hardcode secrets in your application code. Use environment variables or a secrets manager:

```bash
# .env
EDITFRAME_API_KEY=ef_live_...
EDITFRAME_WEBHOOK_SECRET=abc123...
```

```typescript
// Load from environment
const secret = process.env.EDITFRAME_WEBHOOK_SECRET;
if (!secret) {
  throw new Error("EDITFRAME_WEBHOOK_SECRET not configured");
}
```

### Rotating Secrets

To rotate your webhook secret:

1. Go to your API key detail page
2. Click "Regenerate Webhook Secret"
3. Update your application with the new secret
4. Deploy the updated application

**Warning**: Old signatures will fail after secret rotation. Update your application before rotating secrets in production.

## Replay Attack Prevention

Prevent replay attacks by implementing timestamp validation:

```typescript
interface WebhookEvent {
  topic: string;
  data: {
    created_at: string;  // ISO 8601 timestamp
    // ... other fields
  };
}

function isWebhookRecent(event: WebhookEvent, maxAgeSeconds: number = 300): boolean {
  const eventTime = new Date(event.data.created_at).getTime();
  const now = Date.now();
  const ageSeconds = (now - eventTime) / 1000;

  return ageSeconds >= 0 && ageSeconds <= maxAgeSeconds;
}

// In webhook handler
app.post("/webhooks/editframe", (req, res) => {
  const event = req.body;

  // Verify signature first
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  // Check timestamp (5 minute tolerance)
  if (!isWebhookRecent(event, 300)) {
    return res.status(400).send("Webhook timestamp out of range");
  }

  // Process event
  res.status(200).send("OK");
});
```

## Idempotency

Webhooks may be delivered multiple times due to retries. Implement idempotency to prevent duplicate processing:

```typescript
const processedEventIds = new Set<string>();

app.post("/webhooks/editframe", async (req, res) => {
  const event = req.body;
  const eventId = `${event.topic}:${event.data.id}`;

  // Check if already processed
  if (processedEventIds.has(eventId)) {
    console.log(`Duplicate webhook ignored: ${eventId}`);
    return res.status(200).send("OK"); // Still return 200 to stop retries
  }

  // Verify signature
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  // Process event
  await processWebhookEvent(event);

  // Mark as processed
  processedEventIds.add(eventId);

  res.status(200).send("OK");
});
```

For production, use a database or Redis to track processed events:

```typescript
import { db } from "./database";

async function isEventProcessed(eventId: string): Promise<boolean> {
  const record = await db.query(
    "SELECT 1 FROM processed_webhooks WHERE event_id = $1",
    [eventId]
  );
  return record.rows.length > 0;
}

async function markEventProcessed(eventId: string): Promise<void> {
  await db.query(
    "INSERT INTO processed_webhooks (event_id, processed_at) VALUES ($1, NOW())",
    [eventId]
  );
}
```

## Security Checklist

- [ ] Verify HMAC signature on every webhook request
- [ ] Use timing-safe comparison for signature verification
- [ ] Hash the raw request body, not parsed JSON
- [ ] Store webhook secrets in environment variables or secrets manager
- [ ] Implement timestamp validation to prevent replay attacks
- [ ] Implement idempotency to prevent duplicate processing
- [ ] Use HTTPS for webhook endpoints (required)
- [ ] Return 200 OK quickly, process events asynchronously
- [ ] Log signature verification failures for security monitoring
- [ ] Rotate webhook secrets periodically

## Common Security Mistakes

### 1. Hashing Parsed JSON

**Wrong:**
```typescript
const signature = crypto
  .createHmac("sha256", secret)
  .update(JSON.stringify(req.body)) // Different serialization!
  .digest("hex");
```

**Right:**
```typescript
const signature = crypto
  .createHmac("sha256", secret)
  .update(req.rawBody) // Raw body as received
  .digest("hex");
```

### 2. Non-Timing-Safe Comparison

**Wrong:**
```typescript
if (signature === expectedSignature) { // Vulnerable to timing attacks
  // ...
}
```

**Right:**
```typescript
if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
  // ...
}
```

### 3. Ignoring Signature Verification

**Never do this:**
```typescript
// DON'T: Process webhooks without verification
app.post("/webhooks/editframe", (req, res) => {
  // No signature check - anyone can send fake webhooks!
  processEvent(req.body);
  res.status(200).send("OK");
});
```

## Next Steps

- [testing.md](references/testing.md) — Test signature verification locally
- [troubleshooting.md](references/troubleshooting.md) — Debug signature verification issues
- [getting-started.md](references/getting-started.md) — Complete webhook setup guide
