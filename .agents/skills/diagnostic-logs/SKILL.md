---
name: diagnostic-logs
description: Create diagnostic logs with clear purpose, filterable identifiers, and stringified objects for easy browser console copying. Use when adding logging statements, debugging code, or creating diagnostic output.
---

# Diagnostic Logs

## Format

```typescript
console.log('[IDENTIFIER] Clear purpose message', JSON.stringify({ object: data }));
```

## Requirements

1. **Clear purpose** - What is this log telling you?
2. **Single filterable identifier** - `[UPPER_CASE]` prefix (e.g., `[THUMB_STRIP]`, `[RENDER]`)
3. **Stringified objects** - Use `JSON.stringify()` for easy copying from browser console
4. **Remove when done** - Delete diagnostic logs after debugging is complete

## Examples

```typescript
// ✅ Good
console.log('[THUMB_STRIP] Starting animation', JSON.stringify({ 
  loadingCount: 3,
  totalSlots: 10 
}));

// ❌ Bad - no identifier, object not stringified
console.log('Starting animation', { loadingCount: 3 });
```
