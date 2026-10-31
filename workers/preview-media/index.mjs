const CACHE_CONTROL = "public, max-age=31536000, immutable";
const MEDIA_KEY =
  /^previews\/[a-z0-9-]+\/(?:light|dark)\/[a-f0-9]{8,64}\.(?:mp4|webm|jpg)$/u;

const MEDIA_TYPES = { jpg: "image/jpeg", mp4: "video/mp4", webm: "video/webm" };

/** One satisfiable byte range, null for 416, or undefined when a full response is appropriate. */
const readRange = (request, metadata) => {
  const rangeHeader = request.headers.get("Range");
  const ifRange = request.headers.get("If-Range");
  const match =
    (!ifRange || ifRange === metadata.httpEtag) &&
    rangeHeader?.match(/^bytes=(?<start>\d*)-(?<end>\d*)$/u);
  if (!match) {
    return;
  }
  const { start, end } = match.groups;
  let offset;
  let last;
  if (start) {
    offset = Number(start);
    last = end ? Math.min(Number(end), metadata.size - 1) : metadata.size - 1;
  } else {
    const suffix = Number(end);
    offset = Math.max(0, metadata.size - suffix);
    last = metadata.size - 1;
  }
  if (
    !Number.isSafeInteger(offset) ||
    !Number.isSafeInteger(last) ||
    offset > last ||
    offset >= metadata.size ||
    (!start && !Number(end))
  ) {
    return null;
  }
  return { length: last - offset + 1, offset };
};

/** R2 stays private: this worker exposes only immutable rendered media, never source or bucket listings. */
export default {
  async fetch(request, env, context) {
    const cors = {
      "Access-Control-Allow-Headers": "Range, If-None-Match, If-Range",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers":
        "Content-Length, Content-Range, ETag, Accept-Ranges",
      "X-Content-Type-Options": "nosniff",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: { ...cors, "Access-Control-Max-Age": "86400" },
        status: 204,
      });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        headers: { ...cors, Allow: "GET, HEAD, OPTIONS" },
        status: 405,
      });
    }
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    if (!MEDIA_KEY.test(key)) {
      return new Response("Not found", { headers: cors, status: 404 });
    }
    const cacheKey = new Request(`${url.origin}${url.pathname}`);
    const cache = caches.default;
    if (request.method === "GET") {
      const cached = await cache.match(
        new Request(cacheKey, { headers: request.headers })
      );
      if (cached) {
        return cached;
      }
    }
    const metadata = await env.PREVIEWS.head(key);
    if (!metadata) {
      return new Response("Not found", { headers: cors, status: 404 });
    }
    const headers = new Headers(cors);
    metadata.writeHttpMetadata(headers);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", CACHE_CONTROL);
    headers.set("Content-Length", String(metadata.size));
    headers.set(
      "Content-Type",
      MEDIA_TYPES[key.slice(key.lastIndexOf(".") + 1)]
    );
    headers.set("ETag", metadata.httpEtag);
    headers.set("Last-Modified", metadata.uploaded.toUTCString());
    const ifNoneMatch = request.headers.get("If-None-Match");
    if (
      ifNoneMatch
        ?.split(",")
        .some(
          (value) =>
            value.trim() === "*" ||
            value.trim().replace(/^W\//u, "") === metadata.httpEtag
        )
    ) {
      headers.delete("Content-Length");
      return new Response(null, { headers, status: 304 });
    }
    if (request.method === "HEAD") {
      return new Response(null, { headers });
    }
    const range = readRange(request, metadata);
    if (range === null) {
      headers.set("Content-Range", `bytes */${metadata.size}`);
      headers.set("Content-Length", "0");
      return new Response(null, { headers, status: 416 });
    }
    if (range) {
      headers.set(
        "Content-Range",
        `bytes ${range.offset}-${range.offset + range.length - 1}/${metadata.size}`
      );
      headers.set("Content-Length", String(range.length));
    }
    const object = await env.PREVIEWS.get(key, range ? { range } : undefined);
    if (!object) {
      return new Response("Not found", { headers: cors, status: 404 });
    }
    const response = new Response(object.body, {
      headers,
      status: range ? 206 : 200,
    });
    if (!range || (range.offset === 0 && range.length === metadata.size)) {
      const complete = response.clone();
      const cacheHeaders = new Headers(headers);
      cacheHeaders.delete("Content-Range");
      context.waitUntil(
        cache.put(
          cacheKey,
          new Response(complete.body, { headers: cacheHeaders })
        )
      );
    }
    return response;
  },
};
