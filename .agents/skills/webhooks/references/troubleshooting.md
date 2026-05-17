---
description: "Diagnose and fix common webhook issues: signature verification failures, delivery timeouts, retries, and missed events."
---


# Troubleshooting Webhooks

Debug common webhook issues and understand webhook delivery behavior.

## Signature Verification Failures

### Symptom

All webhooks are rejected with 401 Unauthorized or signature verification fails.

### Causes and Solutions

#### 1. Hashing Parsed JSON Instead of Raw Body

**Problem**: You're hashing `JSON.stringify(req.body)` instead of the raw request body.

**Why it fails**: JSON serialization order is not guaranteed. The signature was computed on the original body, which may have different key order.

**Solution**: Hash the raw body string as received:

```typescript
// Wrong
const signature = crypto
  .createHmac("sha256", secret)
  .update(JSON.stringify(req.body))
  .digest("hex");

// Right
const signature = crypto
  .createHmac("sha256", secret)
  .update(req.rawBody) // Raw body as string/buffer
  .digest("hex");
```

**Express setup**:
```typescript
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    (req as any).rawBody = buf.toString('utf8');
  }
}));
```

#### 2. Wrong Webhook Secret

**Problem**: Using the API key instead of the webhook secret.

**Solution**: Use the webhook secret (shown once during API key creation):

```typescript
// Wrong - this is your API key
const secret = "ef_live_abc123...";

// Right - this is your webhook secret
const secret = "whsec_abc123..." || process.env.EDITFRAME_WEBHOOK_SECRET;
```

If you lost your webhook secret, regenerate it in the dashboard.

#### 3. Secret Has Whitespace

**Problem**: Secret has extra spaces, tabs, or newlines.

**Solution**: Trim the secret:
```typescript
const secret = process.env.EDITFRAME_WEBHOOK_SECRET!.trim();
```

#### 4. Using Non-Timing-Safe Comparison

**Problem**: String comparison is vulnerable to timing attacks and may behave unexpectedly.

**Solution**: Use timing-safe comparison:
```typescript
// Wrong
if (signature === expectedSignature) { }

// Right
import crypto from "node:crypto";
if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) { }
```

### Debug Steps

1. **Log both signatures**:
```typescript
console.log("Received:", signature);
console.log("Expected:", expectedSignature);
console.log("Match:", signature === expectedSignature);
```

2. **Log the payload being hashed**:
```typescript
console.log("Raw body:", req.rawBody);
console.log("Body length:", req.rawBody.length);
```

3. **Verify secret is correct**:
```typescript
console.log("Secret length:", secret.length);
console.log("Secret starts with:", secret.substring(0, 10));
```

4. **Test with known payload**:
```typescript
const testPayload = '{"topic":"webhook.test","data":{"id":"test"}}';
const testSignature = crypto
  .createHmac("sha256", secret)
  .update(testPayload)
  .digest("hex");
console.log("Test signature:", testSignature);
```

## Timeout Errors

### Symptom

Webhooks fail with timeout errors in delivery logs. Events show multiple retry attempts.

### Cause

Your endpoint takes longer than 30 seconds to respond.

### Solution

Respond with 200 OK immediately, then process the event asynchronously:

```typescript
// Wrong - synchronous processing
app.post("/webhooks/editframe", async (req, res) => {
  await verifySignature(req);
  await processEvent(req.body); // Takes 60 seconds
  res.status(200).send("OK"); // Times out!
});

// Right - asynchronous processing
app.post("/webhooks/editframe", async (req, res) => {
  await verifySignature(req);

  // Respond immediately
  res.status(200).send("OK");

  // Process in background
  processEvent(req.body).catch(console.error);
});
```

Use a job queue for reliability:

```typescript
import { Queue } from "bull";

const webhookQueue = new Queue("webhooks");

app.post("/webhooks/editframe", async (req, res) => {
  await verifySignature(req);

  // Add to queue
  await webhookQueue.add({
    topic: req.body.topic,
    data: req.body.data,
  });

  res.status(200).send("OK");
});

// Process jobs in background
webhookQueue.process(async (job) => {
  await processEvent(job.data);
});
```

## Missed Webhooks

### Symptom

Expected webhooks are not received.

### Causes and Solutions

#### 1. Events Not Subscribed

**Problem**: Webhook events not configured on API key.

**Solution**: Update API key's webhook events:

```typescript
// Check current configuration
const apiKey = await db
  .selectFrom("identity.api_keys")
  .where("id", "=", apiKeyId)
  .select(["webhook_events", "webhook_url"])
  .executeTakeFirst();

console.log("Subscribed events:", apiKey.webhook_events);
console.log("Webhook URL:", apiKey.webhook_url);

// Update events
await db
  .updateTable("identity.api_keys")
  .where("id", "=", apiKeyId)
  .set({
    webhook_events: ["render.completed", "render.failed", "file.ready"]
  })
  .execute();
```

#### 2. Webhook URL Not Set

**Problem**: API key doesn't have a webhook URL configured.

**Solution**: Set the webhook URL in the dashboard or via API.

#### 3. Endpoint Returns Error

**Problem**: Your endpoint returns 4xx or 5xx status, causing Editframe to mark delivery as failed.

**Solution**: Fix endpoint errors. Check logs for error details.

#### 4. Firewall Blocking Requests

**Problem**: Firewall or load balancer blocks webhook requests.

**Solution**:
- Whitelist Editframe's IP ranges (check documentation)
- Verify endpoint is publicly accessible
- Test with `curl` from external server

### Debug Steps

1. **Check delivery logs** in the Editframe dashboard:
   - Go to API key detail page
   - View "Webhook Deliveries"
   - Check status codes and response bodies

2. **Verify webhook configuration**:
```typescript
// Test endpoint is reachable
fetch("https://your-app.com/webhooks/editframe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ test: true })
});
```

3. **Test with webhook.site**:
   - Temporarily set webhook URL to webhook.site
   - Trigger event
   - Verify webhook is sent

## Duplicate Webhooks

### Symptom

Same event is processed multiple times.

### Cause

Webhooks are retried on failure or timeout. Your endpoint may process the same event multiple times.

### Solution

Implement idempotency:

```typescript
const processedEvents = new Set<string>();

app.post("/webhooks/editframe", async (req, res) => {
  await verifySignature(req);

  const event = req.body;
  const eventId = `${event.topic}:${event.data.id}`;

  if (processedEvents.has(eventId)) {
    console.log(`Duplicate webhook: ${eventId}`);
    return res.status(200).send("OK"); // Still return 200
  }

  processedEvents.add(eventId);
  res.status(200).send("OK");

  await processEvent(event);
});
```

For production, use a database:

```typescript
async function isProcessed(eventId: string): Promise<boolean> {
  const result = await db.query(
    "SELECT 1 FROM processed_webhooks WHERE event_id = $1",
    [eventId]
  );
  return result.rows.length > 0;
}

async function markProcessed(eventId: string): Promise<void> {
  await db.query(
    "INSERT INTO processed_webhooks (event_id, processed_at) VALUES ($1, NOW()) ON CONFLICT DO NOTHING",
    [eventId]
  );
}
```

## Retry Behavior

### How Retries Work

When webhook delivery fails:
1. **First attempt**: Immediate delivery
2. **Second attempt**: 10 seconds later
3. **Third attempt**: 10 seconds later
4. **Max retries**: 3 attempts total
5. **Timeout**: 30 seconds per attempt

After 3 failed attempts, the event is marked as failed and retries stop.

### What Triggers Retries

Retries occur when:
- Endpoint returns 4xx or 5xx status code
- Request times out (>30 seconds)
- Network error (connection refused, DNS failure)

Retries **do not** occur when:
- Endpoint returns 200 OK (even if processing fails)

### Viewing Retry History

Check webhook delivery logs in the dashboard:
- Each attempt is logged with timestamp
- See status code and response for each attempt
- Failed events show number of retries

### Handling Retries in Your Endpoint

```typescript
app.post("/webhooks/editframe", async (req, res) => {
  try {
    await verifySignature(req);

    // Respond immediately
    res.status(200).send("OK");

    // Process asynchronously
    await processEvent(req.body);
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Still return 200 to prevent retries
    // Log error for manual investigation
    res.status(200).send("OK");
  }
});
```

**Important**: If you return an error status code, the webhook will be retried. Only return errors for transient failures that should be retried (e.g., database connection lost).

## Debugging Checklist

When webhooks aren't working:

1. **Verify configuration**:
   - [ ] Webhook URL is correct
   - [ ] Webhook URL uses HTTPS
   - [ ] Webhook events are selected
   - [ ] Endpoint is publicly accessible

2. **Test signature verification**:
   - [ ] Using correct webhook secret (not API key)
   - [ ] Hashing raw body (not parsed JSON)
   - [ ] Using timing-safe comparison
   - [ ] Secret has no extra whitespace

3. **Check endpoint behavior**:
   - [ ] Returns 200 OK within 30 seconds
   - [ ] Handles all subscribed event types
   - [ ] Implements idempotency
   - [ ] Logs errors for debugging

4. **Review delivery logs**:
   - [ ] Check status codes
   - [ ] Review response bodies
   - [ ] Count retry attempts
   - [ ] Look for patterns in failures

5. **Test locally**:
   - [ ] Use ngrok to expose local server
   - [ ] Send test webhook from dashboard
   - [ ] Run integration tests
   - [ ] Test with manual script

## Getting Help

If you're still experiencing issues:

1. **Check delivery logs** in the dashboard for detailed error messages
2. **Test with webhook.site** to isolate the issue
3. **Review webhook event payloads** in the [events.md](references/events.md) reference
4. **Contact support** with:
   - API key ID
   - Webhook event ID (from delivery logs)
   - Error messages from your logs
   - Steps to reproduce

## Common Error Messages

### "Invalid signature"

**Cause**: Signature verification failed

**Solution**: See [Signature Verification Failures](#signature-verification-failures)

### "Webhook URL is not set"

**Cause**: API key doesn't have webhook URL configured

**Solution**: Set webhook URL in API key configuration

### "Connection refused"

**Cause**: Endpoint is not reachable

**Solution**:
- Verify endpoint is running
- Check firewall rules
- Test with `curl` from external server

### "SSL certificate verify failed"

**Cause**: Endpoint uses invalid SSL certificate

**Solution**:
- Use a valid SSL certificate from a trusted CA
- For development, use ngrok which provides valid certificates

### "Timed out after 30000ms"

**Cause**: Endpoint took longer than 30 seconds to respond

**Solution**: See [Timeout Errors](#timeout-errors)

## Next Steps

- [security.md](references/security.md) — Review signature verification
- [testing.md](references/testing.md) — Test webhook endpoints
- [getting-started.md](references/getting-started.md) — Complete setup guide
- [events.md](references/events.md) — Webhook event reference
