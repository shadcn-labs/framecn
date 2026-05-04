---
name: poly-pizza-api
description: >
  Use this skill whenever an LLM agent needs to search, browse, or download 3D models
  from Poly Pizza (poly.pizza) using their REST API. Triggers on any task involving:
  finding free low-poly 3D models, searching the Poly Pizza catalogue, fetching model
  metadata or download URLs, retrieving popular models, or downloading .glb files from
  Poly Pizza. Use this skill proactively whenever the agent needs to obtain 3D assets
  programmatically, even if the user just says "find me a 3D model of X" without
  mentioning Poly Pizza by name.
---

# Poly Pizza API v1.1

Poly Pizza (https://poly.pizza) hosts 10,000+ free low-poly CC0 and CC-BY 3D models. The
API lets agents search, filter, and download them programmatically.

## Authentication

All requests require an API key obtained from https://poly.pizza/settings/api (requires
a free account). In this environment, the key is available as the `POLY_PIZZA_KEY`
environment variable. Pass it as a header:

```
X-Auth-Token: <your_api_key>
```

The key must be present on every request. There is no OAuth flow — it's a static token.

## Base URL

```
https://api.poly.pizza/v1/
```

All endpoints below are relative to this base.

## Endpoints

### Search models

```
GET /search/{query}
```

Returns models matching the keyword. URL-encode the query string.

**Query parameters:**

| Param    | Type    | Default | Description                                  |
|----------|---------|---------|----------------------------------------------|
| `limit`  | integer | 12      | Max results to return (max ~50)              |
| `cursor` | string  | —       | Pagination cursor from a previous response   |
| `format` | string  | `"glb"` | File format filter (`glb`, `fbx`, `obj`)     |
| `animated` | boolean | —    | Filter to only animated models               |
| `tricount`  | string | —     | Triangle count range, e.g. `"0-5000"`        |

**Example:**
```http
GET https://api.poly.pizza/v1/search/tree?limit=5
X-Auth-Token: your_key_here
```

**Response shape:**
```json
{
  "cursor": "some_cursor_string_or_null",
  "results": [
    {
      "ID": "5EGWBMpuXq",
      "Title": "Oak Tree",
      "Description": "A simple low poly oak tree",
      "Creator": {
        "Username": "someartist",
        "PURL": "https://poly.pizza/u/someartist"
      },
      "Thumbnail": "https://...jpg",
      "Download": "https://...glb",
      "DownloadFBX": "https://...fbx",
      "Licence": "CC-BY 4.0",
      "Tags": ["nature", "tree", "foliage"],
      "TriangleCount": 320,
      "Animated": false,
      "PublishedAt": "2021-08-15T04:32:11.000Z"
    }
    // ... more results
  ]
}
```

---

### Get popular models

```
GET /popular
```

Returns the most popular / trending models on the site.

**Query parameters:** same as search (`limit`, `cursor`, `format`, `animated`, `tricount`)

**Example:**
```http
GET https://api.poly.pizza/v1/popular?limit=10
X-Auth-Token: your_key_here
```

Response shape is identical to search.

---

### Get model by ID

```
GET /model/{id}
```

Returns full metadata for a single model by its unique ID.

**Example:**
```http
GET https://api.poly.pizza/v1/model/5EGWBMpuXq
X-Auth-Token: your_key_here
```

Response is a single model object (same shape as an entry in `results` above).

---

## Downloading a model

The `Download` field in the response is a direct CDN URL to the `.glb` file. To download
it, perform a plain GET request — **no auth header required** on the CDN URL itself.

```python
import requests

# First, search for the model
headers = {"X-Auth-Token": api_key}
resp = requests.get("https://api.poly.pizza/v1/search/chair", headers=headers, params={"limit": 1})
model = resp.json()["results"][0]

# Then download the .glb directly
glb_bytes = requests.get(model["Download"]).content
with open(f"{model['Title']}.glb", "wb") as f:
    f.write(glb_bytes)
```

---

## Licenses and attribution

| License  | Requirements                                                     |
|----------|------------------------------------------------------------------|
| **CC0**  | No attribution required — public domain                          |
| **CC-BY 4.0** | Must credit the creator. Format: `"[Title]" by [Username] (poly.pizza) CC-BY 4.0` |

Always check `model.Licence` and record credits for CC-BY models. A minimal attribution
line looks like:

```
"Oak Tree" by someartist (https://poly.pizza/u/someartist) CC-BY 4.0
```

---

## Pagination

Responses include a `cursor` field. If it's non-null, there are more results. Pass it as
`?cursor=<value>` on the next request (keep all other params the same).

```python
results = []
cursor = None
while True:
    params = {"limit": 24}
    if cursor:
        params["cursor"] = cursor
    data = requests.get(url, headers=headers, params=params).json()
    results.extend(data["results"])
    cursor = data.get("cursor")
    if not cursor:
        break
```

---

## Error handling

| Status | Meaning                        |
|--------|--------------------------------|
| 200    | OK                             |
| 401    | Missing or invalid API key     |
| 404    | Model ID not found             |
| 429    | Rate limit exceeded — back off |
| 500    | Server error — retry           |

On 429, wait at least 1 second before retrying. The API has no documented rate limit
ceiling; hobbyist use is free, commercial use is pay-as-you-go.

---

## Common patterns

### Find best match for a keyword
1. `GET /search/{keyword}?limit=5`
2. Pick the result with the lowest `TriangleCount` that still looks appropriate, or the
   first result if the task doesn't specify poly count.

### Batch fetch for a scene
Identify all needed asset types (e.g. "tree, rock, house, car"), then fire parallel
search requests for each keyword. Collect the top result per keyword.

### Download and save with attribution
```python
import requests, os

def fetch_model(api_key: str, keyword: str, out_dir: str) -> dict:
    headers = {"X-Auth-Token": api_key}
    r = requests.get(
        f"https://api.poly.pizza/v1/search/{keyword}",
        headers=headers,
        params={"limit": 1}
    )
    r.raise_for_status()
    results = r.json().get("results", [])
    if not results:
        raise ValueError(f"No models found for '{keyword}'")
    
    model = results[0]
    glb = requests.get(model["Download"])
    glb.raise_for_status()
    
    safe_name = model["Title"].replace(" ", "_")
    path = os.path.join(out_dir, f"{safe_name}.glb")
    with open(path, "wb") as f:
        f.write(glb.content)
    
    attribution = None
    if "CC-BY" in model.get("Licence", ""):
        attribution = (
            f'"{model["Title"]}" by {model["Creator"]["Username"]} '
            f'({model["Creator"]["PURL"]}) {model["Licence"]}'
        )
    
    return {"path": path, "model": model, "attribution": attribution}
```

---

## Notes

- Models are `.glb` (GLTF binary) by default, directly usable in Three.js, Babylon.js,
  Unity (with glTFast), Unreal, Godot, and most AR/VR frameworks.
- `DownloadFBX` is available on some models for Unity's native importer.
- The `Thumbnail` URL is a JPEG preview image, useful for showing a preview before
  downloading.
- Model IDs are stable — safe to cache and reference by ID later.
- The API key is obtained from https://poly.pizza/settings/api after creating a free account.
