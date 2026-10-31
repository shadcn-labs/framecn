import manifest from "@/lib/preview-media-manifest.json";

export type PreviewTheme = "light" | "dark";

interface PreviewMedia {
  video: string;
  poster: string;
}

const components: Record<
  string,
  Partial<Record<PreviewTheme, PreviewMedia>>
> = manifest.components;

export const getPreviewMedia = (
  name: string,
  theme: PreviewTheme
): PreviewMedia | undefined => {
  const media = components[name]?.[theme];
  const baseUrl = manifest.baseUrl.replace(/\/+$/u, "");

  if (manifest.version !== 1 || !baseUrl || !media?.video || !media.poster) {
    return undefined;
  }

  return {
    poster: `${baseUrl}/${media.poster.replace(/^\/+/u, "")}`,
    video: `${baseUrl}/${media.video.replace(/^\/+/u, "")}`,
  };
};
