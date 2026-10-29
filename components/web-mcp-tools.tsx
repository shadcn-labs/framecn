"use client";

import { useEffect } from "react";

import { ROUTES } from "@/constants/routes";
import { componentMarkdownUrl } from "@/lib/docs";

type ToolExecute = (
  input: unknown,
  options: { signal: AbortSignal }
) => Promise<unknown>;

interface ModelContextApi {
  registerTool?: (
    def: {
      description: string;
      execute: ToolExecute;
      inputSchema: Record<string, unknown>;
      name: string;
    },
    options?: { signal: AbortSignal }
  ) => (() => void) | undefined;
}

const getPath = (input: unknown, fallback: string): string => {
  if (
    typeof input === "object" &&
    input !== null &&
    "path" in input &&
    typeof (input as { path: unknown }).path === "string"
  ) {
    return (input as { path: string }).path;
  }

  return fallback;
};

export const WebMcpTools = () => {
  useEffect(() => {
    const { modelContext } = navigator as Navigator & {
      modelContext?: ModelContextApi;
    };
    const registerTool = modelContext?.registerTool;
    if (typeof registerTool !== "function") {
      return;
    }

    const ac = new AbortController();
    const cleanups: (() => void)[] = [];

    const register = (def: {
      description: string;
      execute: ToolExecute;
      inputSchema: Record<string, unknown>;
      name: string;
    }) => {
      const maybeCleanup = registerTool.call(modelContext, def, {
        signal: ac.signal,
      });
      if (typeof maybeCleanup === "function") {
        cleanups.push(maybeCleanup);
      }
    };

    register({
      description:
        "Navigate this tab to a framecn documentation path (e.g. /docs/installation).",
      execute: (input) => {
        const path = getPath(input, ROUTES.DOCS);
        window.location.assign(path);

        return Promise.resolve({ ok: true, path });
      },
      inputSchema: {
        properties: {
          path: {
            description: "Path beginning with /docs",
            type: "string",
          },
        },
        type: "object",
      },
      name: "framecn_open_docs",
    });

    register({
      description:
        "Fetch the published shadcn registry manifest (registry.json) for this site.",
      execute: async (_input, { signal }) => {
        const res = await fetch(`${window.location.origin}${ROUTES.REGISTRY}`, {
          signal,
        });
        if (!res.ok) {
          return { ok: false, status: res.status };
        }

        return res.json();
      },
      inputSchema: { properties: {}, type: "object" },
      name: "framecn_fetch_registry",
    });

    register({
      description:
        "Fetch the markdown documentation (install command, source, usage, API) for a framecn component by id (e.g. caption-highlight).",
      execute: async (input, { signal }) => {
        const id =
          typeof input === "object" &&
          input !== null &&
          "id" in input &&
          typeof input.id === "string"
            ? input.id
            : "";
        const res = await fetch(
          `${window.location.origin}${componentMarkdownUrl(encodeURIComponent(id))}`,
          { signal }
        );
        if (!res.ok) {
          return { ok: false, status: res.status };
        }

        return { markdown: await res.text(), ok: true };
      },
      inputSchema: {
        properties: {
          id: {
            description: "Component id, as in /components/<category>/<id>",
            type: "string",
          },
        },
        required: ["id"],
        type: "object",
      },
      name: "framecn_fetch_component_docs",
    });

    register({
      description: "Open the llms.txt documentation index for this site.",
      execute: () => {
        window.location.assign(ROUTES.LLMS);

        return Promise.resolve({ ok: true, path: ROUTES.LLMS });
      },
      inputSchema: { properties: {}, type: "object" },
      name: "framecn_open_llms_index",
    });

    return () => {
      ac.abort();
      for (const fn of cleanups) {
        fn();
      }
    };
  }, []);

  return null;
};
