import { readFile, writeFile } from "node:fs/promises";

const registry = JSON.parse(await readFile("registry.json", "utf-8"));
const imports = new Map();
for (const item of registry.items) {
  for (const file of item.files ?? []) {
    if (!file.target || !file.path.startsWith("registry/bases/editframe/")) {
      continue;
    }
    const source = `@/${file.path.replace(/\.(tsx?|jsx?)$/, "")}`;
    const target = `@/${file.target.replace(/\.(tsx?|jsx?)$/, "")}`;
    imports.set(source, target);
    if (source.endsWith("/index")) {
      imports.set(source.slice(0, -6), target);
    }
  }
}
// Registry source paths are development-only. Installed files use project aliases.
for (const item of registry.items) {
  if (
    item.name !== "framecn-ui" &&
    !item.files?.some((file) =>
      file.path.startsWith("registry/bases/editframe/ui/")
    )
  ) {
    continue;
  }
  const path = `public/r/${item.name}.json`;
  const published = JSON.parse(await readFile(path, "utf-8"));
  for (const file of published.files ?? []) {
    file.content = file.content.replaceAll(
      /(["'])(@\/[^"']+)\1/g,
      (match, quote, source) => {
        const target = imports.get(source);
        return target ? `${quote}${target}${quote}` : match;
      }
    );
  }
  await writeFile(path, `${JSON.stringify(published, null, 2)}\n`);
}
