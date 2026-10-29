"use client";

import { RotateCcwIcon } from "lucide-react";
import dynamic from "next/dynamic";

import { ComponentCustomizer } from "@/components/component-customizer";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/video-preview";
import { useCustomizer } from "@/hooks/use-customizer";
import { usePreviewId } from "@/hooks/use-preview-id";
import type { ComponentConfig } from "@/lib/customizer-config";
import { cn } from "@/lib/utils";
import registry from "@/registry/__index__";

const ConfiguredPreview = ({
  name,
  config,
  hideCustomizer,
  className,
}: {
  name: string;
  config: ComponentConfig;
  hideCustomizer: boolean;
  className?: string;
}) => {
  const { componentProps, values, setValues, isDefault } = useCustomizer(
    name,
    config
  );
  const previewId = usePreviewId(name);
  return (
    <div className={cn("not-prose flex flex-col gap-4", className)}>
      <VideoPreview
        previewId={previewId}
        Component={registry[name].Component}
        componentProps={componentProps}
        durationInFrames={config.durationInFrames}
        fps={config.fps}
        previewBackdrop={config.previewBackdrop}
      />
      {!hideCustomizer && Object.keys(config.controls).length > 0 && (
        <section className="rounded-xl border p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-medium">Customize</h3>
            <Button
              size="sm"
              variant="ghost"
              disabled={isDefault}
              onClick={() => setValues(null)}
            >
              <RotateCcwIcon /> Reset
            </Button>
          </div>
          <ComponentCustomizer
            controls={config.controls}
            values={values}
            onChange={(key, value) => setValues({ [key]: value })}
          />
        </section>
      )}
    </div>
  );
};

const ClientPreview = dynamic(() => Promise.resolve(ConfiguredPreview), {
  ssr: false,
});

export const ComponentPreview = ({
  name,
  hideCustomizer = false,
  className,
}: {
  name: string;
  hideCode?: boolean;
  hideCustomizer?: boolean;
  className?: string;
}) => {
  const entry = registry[name];
  const previewId = usePreviewId(name);
  if (!entry) {
    return null;
  }
  if (entry.config) {
    return (
      <ClientPreview
        name={name}
        config={entry.config}
        hideCustomizer={hideCustomizer}
        className={className}
      />
    );
  }
  return (
    <VideoPreview
      previewId={previewId}
      Component={entry.Component}
      componentProps={{}}
    />
  );
};
