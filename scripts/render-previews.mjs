#!/usr/bin/env node
/**
 * Render real, full-duration light/dark catalog previews, then publish media only.
 *
 * pnpm previews:render --origin http://localhost:3000 --bucket framecn-previews \
 *   --base-url https://media.example.com [--only caption-highlight,arc-carousel] [--render-only]
 *
 * Requires synced registry sources, a running development server, system Chrome
 * (CHROME_PATH overrides the macOS default), ffmpeg, ffprobe, and Wrangler auth.
 * --render-only writes only .preview-media/; it never uploads or edits the manifest.
 * Upload flags: https://developers.cloudflare.com/workers/wrangler/commands/r2/#r2-object-put
 */
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { once } from "node:events";
import { createReadStream, existsSync } from "node:fs";
import {
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import { createJiti } from "jiti";
import { launch } from "puppeteer-core";

const root = path.resolve(import.meta.dirname, "..");
const local = path.join(root, ".preview-media");
const manifestFile = path.join(root, "lib/preview-media-manifest.json");
const themes = ["light", "dark"];
const width = 960;
const height = 540;
const fps = 24;
const log = (message) => console.log(`[previews] ${message}`);
const usage = `Usage: pnpm previews:render --origin http://localhost:3000 --bucket framecn-previews --base-url https://media.example.com [--only id,id] [--render-only]\nCHROME_PATH: system Chrome executable (defaults to /Applications/Google Chrome.app/Contents/MacOS/Google Chrome).\nRequires ffmpeg, ffprobe, synced Pro sources, and Wrangler authentication for publishing.\nLocal output/cache: .preview-media/. Two uploads run concurrently; compositions render sequentially.`;

const { values } = parseArgs({
  options: {
    "base-url": { type: "string" },
    bucket: { default: "framecn-previews", type: "string" },
    help: { default: false, type: "boolean" },
    only: { type: "string" },
    origin: { default: "http://localhost:3000", type: "string" },
    "render-only": { default: false, type: "boolean" },
  },
  strict: true,
});

const mediaOrigin = (value, label) => {
  if (!value) {
    throw new Error(`${label} is required.\n${usage}`);
  }
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error(
      `${label} must be an HTTP(S) origin without credentials, path, query, or fragment.`
    );
  }
  return url.origin;
};

const command = (binary, args, { inherit = false } = {}) => {
  const { promise, reject, resolve } = Promise.withResolvers();
  const child = spawn(binary, args, {
    cwd: root,
    env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
    stdio: ["ignore", inherit ? "inherit" : "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr = (stderr + chunk).slice(-16_000);
  });
  child.on("error", reject);
  child.on("close", (code) => {
    if (code === 0) {
      resolve(stdout.trim());
    } else {
      reject(
        new Error(
          `${binary} ${args.join(" ")} exited ${code}: ${stderr.trim()}`
        )
      );
    }
  });
  return promise;
};

const atomicJson = async (file, value) => {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
      flag: "wx",
    });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
};

const fileHash = async (file) => {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) {
    hash.update(chunk);
  }
  return hash.digest("hex");
};

/* eslint-disable no-await-in-loop -- Walk directories serially to bound open files. */
const treeFiles = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await treeFiles(file)));
    } else if (entry.isFile()) {
      files.push(file);
    }
  }
  return files.toSorted();
};
/* eslint-enable no-await-in-loop */

/* eslint-disable no-await-in-loop -- Resolve candidates in precedence order; stop at the first actual file. */
const resolveSource = async (specifier, from) => {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) {
    return;
  }
  const base = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(from), specifier);
  for (const suffix of [
    "",
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".json",
    ".css",
    "/index.ts",
    "/index.tsx",
    "/index.js",
  ]) {
    const candidate = `${base}${suffix}`;
    if (!existsSync(candidate)) {
      continue;
    }
    const details = await stat(candidate);
    if (details.isFile()) {
      return candidate;
    }
  }
  throw new Error(
    `Missing source import ${specifier} in ${path.relative(root, from)}; sync registry sources first.`
  );
};
/* eslint-enable no-await-in-loop */

// Hash real local dependency contents, not timestamps. Registry indexes are
// included but traversed per selected entry rather than importing every preview.
/* eslint-disable no-await-in-loop -- Dependency traversal extends its own bounded work queue. */
const dependencyFiles = async (seeds) => {
  const found = new Set();
  const pending = [...seeds];
  while (pending.length) {
    const file = pending.pop();
    if (found.has(file)) {
      continue;
    }
    found.add(file);
    if (!/\.(?:[cm]?[jt]sx?|css)$/u.test(file)) {
      continue;
    }
    if (
      ["registry/__index__.tsx", "registry/pro/__index__.tsx"].includes(
        path.relative(root, file)
      )
    ) {
      continue;
    }
    const source = await readFile(file, "utf-8");
    const imports =
      /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\bexport\s*\*\s*from\s*)["'](?<specifier>[^"']+)["']/gu;
    for (const match of source.matchAll(imports)) {
      const dependency = await resolveSource(match.groups.specifier, file);
      if (dependency) {
        pending.push(dependency);
      }
    }
  }
  return [...found].toSorted();
};
/* eslint-enable no-await-in-loop */

/* eslint-disable no-await-in-loop -- Hash files in stable order without retaining their contents. */
const fingerprint = async (files, toolchain) => {
  const hash = createHash("sha256").update(JSON.stringify(toolchain));
  for (const file of files) {
    hash
      .update(path.relative(root, file))
      .update("\0")
      .update(await readFile(file))
      .update("\0");
  }
  return hash.digest("hex");
};
/* eslint-enable no-await-in-loop */

/* eslint-disable no-await-in-loop -- Preflight registry entries before allocating rendering resources. */
const registrySources = async (items) => {
  const indexes = new Map();
  const result = new Map();
  for (const item of items) {
    const relative = item.pro
      ? "registry/pro/__index__.tsx"
      : "registry/__index__.tsx";
    const index = path.join(root, relative);
    if (!indexes.has(index)) {
      indexes.set(index, await readFile(index, "utf-8").catch(() => ""));
    }
    const source = indexes.get(index);
    if (!source.includes(`"${item.id}": {`)) {
      throw new Error(
        `Missing registry entry ${item.id} in ${relative}. Run pnpm pro:sync with private-source access before rendering.`
      );
    }
    const specifiers = [
      ...source.matchAll(/["'](?<specifier>@\/registry\/[^"']+)["']/gu),
    ]
      .map((match) => match.groups.specifier)
      .filter(
        (specifier) =>
          specifier.endsWith(`/${item.id}`) ||
          specifier.endsWith(`/${item.id}/config`)
      );
    if (specifiers.length < 2) {
      throw new Error(
        `Cannot locate component and config sources for ${item.id} in ${relative}.`
      );
    }
    const files = await Promise.all(
      specifiers.map((specifier) => resolveSource(specifier, index))
    );
    result.set(item.id, [index, ...files]);
  }
  return result;
};
/* eslint-enable no-await-in-loop */

const validateVideo = async (file, metadata) => {
  const probe = JSON.parse(
    await command("ffprobe", [
      "-v",
      "error",
      "-count_frames",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      file,
    ])
  );
  const streams = probe.streams ?? [];
  const video = streams.find((stream) => stream.codec_type === "video");
  const duration = Number(video?.duration ?? probe.format?.duration);
  const [rateNumerator, rateDenominator] = String(video?.avg_frame_rate)
    .split("/")
    .map(Number);
  if (
    streams.length !== 1 ||
    video?.codec_name !== "h264" ||
    video?.pix_fmt !== "yuv420p" ||
    video?.width !== width ||
    video?.height !== height ||
    Number(video?.nb_read_frames) !== metadata.durationInFrames ||
    Math.abs(rateNumerator / rateDenominator - fps) > 0.001 ||
    Math.abs(duration - metadata.durationInFrames / fps) > 1 / fps
  ) {
    throw new Error(
      `Invalid encoded clip ${file}: expected ${width}x${height}, H264/yuv420p, no audio, ${metadata.durationInFrames} frames at ${fps}fps; got ${JSON.stringify(video)}.`
    );
  }
};

/* eslint-disable no-await-in-loop -- Validate the two cached assets serially with bounded disk usage. */
const readCache = async (directory, inputHash) => {
  try {
    const cached = JSON.parse(
      await readFile(path.join(directory, "complete.json"), "utf-8")
    );
    if (cached.inputHash !== inputHash) {
      return;
    }
    for (const extension of ["mp4", "jpg"]) {
      if (
        (await fileHash(path.join(directory, `preview.${extension}`))) !==
        cached.hashes[extension]
      ) {
        return;
      }
    }
    await validateVideo(path.join(directory, "preview.mp4"), cached.metadata);
    return cached;
  } catch {
    // A missing or stale local cache is re-rendered by the caller.
  }
};
/* eslint-enable no-await-in-loop */

/* eslint-disable no-await-in-loop -- Each frame must seek, paint, capture, and drain before advancing. */
const render = async (browser, item, theme, origin, directory, inputHash) => {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors = [];
  let encoder;
  let encoded;
  let encoderSettled;
  let encoderFailure;
  const record = (message) => {
    errors.push(message);
  };
  const assertHealthy = () => {
    if (encoderFailure) {
      throw encoderFailure;
    }
    if (errors.length) {
      throw new Error(errors.join("\n"));
    }
  };
  try {
    await page.setViewport({ deviceScaleFactor: 1, height, width });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: theme },
      { name: "prefers-reduced-motion", value: "no-preference" },
    ]);
    page.on("pageerror", (error) => record(`Page error: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") {
        record(`Console error: ${message.text()}`);
      }
    });
    page.on("requestfailed", (request) =>
      record(`Asset failed: ${request.url()} (${request.failure()?.errorText})`)
    );
    page.on("response", (response) => {
      if (response.status() >= 400) {
        record(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
    const url = `${origin}/preview-render/${encodeURIComponent(item.id)}?theme=${theme}`;
    const response = await page.goto(url, {
      timeout: 120_000,
      waitUntil: "networkidle0",
    });
    if (!response?.ok()) {
      throw new Error(
        `Render route returned HTTP ${response?.status()}: ${url}`
      );
    }
    try {
      await page.waitForFunction(
        () => typeof window.__FRAMECN_PREVIEW_RENDER__?.seek === "function",
        { timeout: 120_000 }
      );
    } catch (error) {
      assertHealthy();
      throw new Error(
        `Render API did not become ready at ${url}: ${error.message}`,
        { cause: error }
      );
    }
    assertHealthy();
    const metadata = await page.evaluate(() => {
      const api = window.__FRAMECN_PREVIEW_RENDER__;
      return {
        durationInFrames: api.durationInFrames,
        fps: api.fps,
        height: api.height,
        name: api.name,
        theme: api.theme,
        width: api.width,
      };
    });
    if (
      metadata.name !== item.id ||
      metadata.theme !== theme ||
      metadata.width !== width ||
      metadata.height !== height ||
      metadata.fps !== fps ||
      !Number.isSafeInteger(metadata.durationInFrames) ||
      metadata.durationInFrames <= 0
    ) {
      throw new Error(
        `Invalid render API metadata: ${JSON.stringify(metadata)}`
      );
    }
    const temporaryVideo = path.join(directory, "preview.pending.mp4");
    const temporaryPoster = path.join(directory, "preview.pending.jpg");
    // Browser JPEGs are full-range; normalize to limited-range YUV for portable H264 playback.
    encoder = spawn(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-f",
        "image2pipe",
        "-vcodec",
        "mjpeg",
        "-framerate",
        String(fps),
        "-i",
        "pipe:0",
        "-an",
        "-c:v",
        "libx264",
        "-threads",
        "2",
        "-crf",
        "25",
        "-preset",
        "fast",
        "-vf",
        "scale=in_range=pc:out_range=tv,format=yuv420p",
        "-color_range",
        "tv",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        temporaryVideo,
      ],
      { cwd: root, stdio: ["pipe", "ignore", "pipe"] }
    );
    let encoderError = "";
    encoder.stderr.on("data", (chunk) => {
      encoderError = (encoderError + chunk).slice(-16_000);
    });
    const completion = Promise.withResolvers();
    encoded = completion.promise;
    encoder.on("error", completion.reject);
    encoder.stdin.on("error", completion.reject);
    encoder.on("close", (code) => {
      if (code === 0) {
        completion.resolve();
      } else {
        completion.reject(new Error(`ffmpeg exited ${code}: ${encoderError}`));
      }
    });
    // Observe immediately, retain the failure, and rethrow it from capture or the final await.
    const observeEncoder = async () => {
      try {
        await encoded;
      } catch (error) {
        encoderFailure = error;
      }
    };
    encoderSettled = observeEncoder();
    const posterFrame = Math.min(
      metadata.durationInFrames - 1,
      Math.max(1, Math.floor(metadata.durationInFrames * 0.4))
    );
    for (let frame = 0; frame < metadata.durationInFrames; frame += 1) {
      await page.evaluate(
        (outputFrame) => window.__FRAMECN_PREVIEW_RENDER__.seek(outputFrame),
        frame
      );
      assertHealthy();
      const image = await page.screenshot({
        captureBeyondViewport: false,
        clip: { height, width, x: 0, y: 0 },
        quality: 92,
        type: "jpeg",
      });
      if (frame === posterFrame) {
        await writeFile(temporaryPoster, image);
      }
      if (!encoder.stdin.write(image)) {
        await Promise.race([
          once(encoder.stdin, "drain"),
          encoded.then(() => {
            throw new Error("Encoder stopped before all frames were supplied.");
          }),
        ]);
      }
      if (frame % (fps * 5) === 0) {
        log(
          `${item.id}/${theme}: frame ${frame + 1}/${metadata.durationInFrames}`
        );
      }
    }
    encoder.stdin.end();
    await encoded;
    assertHealthy();
    await validateVideo(temporaryVideo, metadata);
    await rename(temporaryVideo, path.join(directory, "preview.mp4"));
    await rename(temporaryPoster, path.join(directory, "preview.jpg"));
    const hashes = {
      jpg: await fileHash(path.join(directory, "preview.jpg")),
      mp4: await fileHash(path.join(directory, "preview.mp4")),
    };
    const complete = { hashes, inputHash, metadata };
    await atomicJson(path.join(directory, "complete.json"), complete);
    return complete;
  } finally {
    if (encoder && encoder.exitCode === null) {
      encoder.kill("SIGKILL");
    }
    await encoderSettled;
    await context.close();
    await rm(path.join(directory, "preview.pending.mp4"), { force: true });
    await rm(path.join(directory, "preview.pending.jpg"), { force: true });
  }
};
/* eslint-enable no-await-in-loop */

/* eslint-disable no-await-in-loop -- Two workers claim one upload at a time to cap active Wrangler processes. */
const uploadMedia = async (jobs, bucket) => {
  let cursor = 0;
  let failure;
  const worker = async () => {
    while (!failure && cursor < jobs.length) {
      const job = jobs[cursor];
      cursor += 1;
      try {
        log(`Uploading ${job.key}`);
        await command(
          path.join(root, "node_modules/.bin/wrangler"),
          [
            "r2",
            "object",
            "put",
            `${bucket}/${job.key}`,
            "--remote",
            "--file",
            job.file,
            "--content-type",
            job.type,
            "--cache-control",
            "public, max-age=31536000, immutable",
          ],
          { inherit: true }
        );
      } catch (error) {
        failure = new Error(
          `Upload failed for ${job.id}/${job.theme} (${job.key}): ${error.message}`,
          { cause: error }
        );
      }
    }
  };
  await Promise.all([worker(), worker()]);
  if (failure) {
    throw failure;
  }
};
/* eslint-enable no-await-in-loop */

const acquireLock = async () => {
  const file = path.join(local, "render.lock");
  try {
    const lock = await open(file, "wx");
    await lock.writeFile(String(process.pid));
    await lock.close();
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
    const pid = Number(await readFile(file, "utf-8"));
    if (!Number.isSafeInteger(pid) || pid < 1) {
      throw new Error(
        `Invalid render lock ${file}; remove it only if no preview render is running.`,
        { cause: error }
      );
    }
    try {
      process.kill(pid, 0);
    } catch (processError) {
      if (processError.code !== "ESRCH") {
        throw processError;
      }
      await rm(file);
      return acquireLock();
    }
    throw new Error(`Another preview renderer is running (PID ${pid}).`, {
      cause: error,
    });
  }
  return () => rm(file, { force: true });
};

/* eslint-disable no-await-in-loop -- Render one composition/theme at a time to bound Chrome and encoder resource usage. */
const renderCatalog = async (browser, items, origin, sources, toolchain) => {
  // Include renderer imports, CSS, local assets and toolchain. Source stays local.
  const commonSeeds = [
    path.join(root, "scripts/render-previews.mjs"),
    path.join(root, "package.json"),
    path.join(root, "pnpm-lock.yaml"),
    path.join(root, "tsconfig.json"),
    path.join(root, "next.config.mjs"),
    path.join(root, "postcss.config.mjs"),
    path.join(root, "lib/catalog.ts"),
    path.join(root, "app/layout.tsx"),
    path.join(root, "app/preview-render/[name]/page.tsx"),
    path.join(root, "components/preview-render-stage.tsx"),
    ...(await treeFiles(path.join(root, "styles"))),
    ...(await treeFiles(path.join(root, "public"))),
  ];
  const assets = {};
  const uploads = [];
  const inputStates = [];
  for (const item of items) {
    const files = await dependencyFiles([
      ...commonSeeds,
      ...sources.get(item.id),
    ]);
    for (const theme of themes) {
      try {
        const inputHash = await fingerprint(files, {
          ...toolchain,
          name: item.id,
          theme,
        });
        const directory = path.join(local, item.id, theme, inputHash);
        await mkdir(directory, { recursive: true });
        let completed = await readCache(directory, inputHash);
        if (completed) {
          log(`Reusing validated ${item.id}/${theme}`);
        } else {
          log(`Rendering ${item.id}/${theme}`);
          completed = await render(
            browser,
            item,
            theme,
            origin,
            directory,
            inputHash
          );
        }
        inputStates.push({ files, inputHash, name: item.id, theme });
        const prefix = `previews/${item.id}/${theme}`;
        const video = `${prefix}/${completed.hashes.mp4}.mp4`;
        const poster = `${prefix}/${completed.hashes.jpg}.jpg`;
        (assets[item.id] ??= {})[theme] = { poster, video };
        uploads.push(
          {
            file: path.join(directory, "preview.mp4"),
            id: item.id,
            key: video,
            theme,
            type: "video/mp4",
          },
          {
            file: path.join(directory, "preview.jpg"),
            id: item.id,
            key: poster,
            theme,
            type: "image/jpeg",
          }
        );
      } catch (error) {
        throw new Error(`${item.id}/${theme}: ${error.message}`, {
          cause: error,
        });
      }
    }
  }
  return { assets, inputStates, uploads };
};
/* eslint-enable no-await-in-loop */

/* eslint-disable no-await-in-loop -- Recheck inputs in the same deterministic order as initial hashing. */
const assertUnchangedInputs = async (inputStates, toolchain) => {
  for (const state of inputStates) {
    const current = await fingerprint(state.files, {
      ...toolchain,
      name: state.name,
      theme: state.theme,
    });
    if (current !== state.inputHash) {
      throw new Error(
        `Sources changed during rendering ${state.name}/${state.theme}. Run again to render a consistent revision.`
      );
    }
  }
};
/* eslint-enable no-await-in-loop */

const selectCatalogItems = (catalog, only) => {
  const requested =
    only === undefined
      ? undefined
      : [...new Set(only.split(",").map((id) => id.trim()))];
  if (requested?.some((id) => !id || !catalog.some((item) => item.id === id))) {
    throw new Error(`--only contains an empty or unknown catalog ID: ${only}`);
  }
  const selected = requested
    ? catalog.filter((item) => requested.includes(item.id))
    : catalog;
  if (!selected.length) {
    throw new Error("Catalog selection is empty.");
  }
  return selected;
};

const main = async () => {
  if (values.help) {
    console.log(usage);
    return;
  }
  const origin = mediaOrigin(values.origin, "--origin");
  const baseUrl = mediaOrigin(values["base-url"], "--base-url");
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/u.test(values.bucket)) {
    throw new Error("Invalid --bucket name.");
  }
  const { CATALOG } = await createJiti(import.meta.url).import(
    path.join(root, "lib/catalog.ts")
  );
  const items = selectCatalogItems(CATALOG, values.only);
  // Preflight the complete selection before touching any production manifest.
  const sources = await registrySources(items);
  const initialManifestText = await readFile(manifestFile, "utf-8");
  const previous = JSON.parse(initialManifestText);
  if (
    previous.version !== 1 ||
    !previous.components ||
    typeof previous.components !== "object" ||
    Array.isArray(previous.components)
  ) {
    throw new Error(
      "Invalid preview media manifest; expected version 1 with components object."
    );
  }
  const retainedIds = Object.keys(previous.components).filter(
    (id) => !items.some((item) => item.id === id)
  );
  if (
    !values["render-only"] &&
    previous.baseUrl !== baseUrl &&
    retainedIds.length
  ) {
    throw new Error(
      "Cannot change --base-url while retaining unselected manifest entries. Render the complete catalog against the existing media origin."
    );
  }
  const executablePath =
    process.env.CHROME_PATH ||
    (process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "");
  if (!executablePath || !existsSync(executablePath)) {
    throw new Error(
      "System Chrome not found; set CHROME_PATH to its executable."
    );
  }
  const toolchain = {
    ffmpeg: await command("ffmpeg", ["-version"]),
    ffprobe: await command("ffprobe", ["-version"]),
    fps,
    height,
    node: process.version,
    origin,
    width,
  };
  await mkdir(local, { recursive: true });
  const unlock = await acquireLock();
  let browser;
  try {
    browser = await launch({
      args: ["--hide-scrollbars", "--force-color-profile=srgb"],
      executablePath,
      headless: true,
      protocolTimeout: 120_000,
    });
    toolchain.chrome = await browser.version();
    const { assets, inputStates, uploads } = await renderCatalog(
      browser,
      items,
      origin,
      sources,
      toolchain
    );
    await browser.close();
    browser = undefined;
    await assertUnchangedInputs(inputStates, toolchain);
    if (values["render-only"]) {
      await atomicJson(path.join(local, "rendered-assets.json"), {
        baseUrl,
        components: assets,
        version: 1,
      });
      log(
        `Rendered ${items.length} components in both themes. No upload or production manifest change (--render-only).`
      );
      return;
    }
    await uploadMedia(uploads, values.bucket);
    await assertUnchangedInputs(inputStates, toolchain);
    if ((await readFile(manifestFile, "utf-8")) !== initialManifestText) {
      throw new Error(
        "Manifest changed during this run; refusing to overwrite another edit. Media uploads are immutable and safe to reuse."
      );
    }
    await atomicJson(manifestFile, {
      baseUrl,
      components: { ...previous.components, ...assets },
      version: 1,
    });
    log(
      `Published ${items.length} components in both themes; atomically updated lib/preview-media-manifest.json.`
    );
  } finally {
    try {
      await browser?.close();
    } finally {
      await unlock();
    }
  }
};

try {
  await main();
} catch (error) {
  console.error(`[previews] ${error.message}`);
  process.exitCode = 1;
}
