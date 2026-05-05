"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ControlConfig } from "@/lib/customizer-config";

interface ComponentCustomizerProps {
  controls: ControlConfig;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export const ComponentCustomizer = ({
  controls,
  values,
  onChange,
}: ComponentCustomizerProps) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {Object.entries(controls).map(([key, ctrl]) => {
      const id = `ctrl-${key}`;
      return (
        <div key={key} className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor={id}
              className="text-xs font-medium text-fd-muted-foreground"
            >
              {ctrl.label}
            </Label>
            {ctrl.type === "number" && (
              <span className="font-mono text-xs tabular-nums text-fd-muted-foreground">
                {values[key] as number}
              </span>
            )}
          </div>

          {ctrl.type === "text" && (
            <Input
              id={id}
              type="text"
              value={values[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
            />
          )}

          {ctrl.type === "number" && (
            <Slider
              id={id}
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step}
              value={[values[key] as number]}
              onValueChange={(v) => onChange(key, v[0] as number)}
            />
          )}

          {ctrl.type === "color" && (
            <div className="flex items-center gap-2">
              <input
                id={id}
                type="color"
                value={values[key] as string}
                onChange={(e) => onChange(key, e.target.value)}
                className="size-9 shrink-0 cursor-pointer rounded-md border border-fd-border bg-transparent p-0.5"
              />
              <Input
                type="text"
                value={values[key] as string}
                onChange={(e) => onChange(key, e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          )}

          {ctrl.type === "select" && (
            <NativeSelect
              value={values[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
            >
              {ctrl.options.map((opt) => (
                <NativeSelectOption key={opt} value={opt}>
                  {opt}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}

          {ctrl.type === "boolean" && (
            <Switch
              id={id}
              checked={values[key] as boolean}
              onCheckedChange={(checked) => onChange(key, checked)}
            />
          )}
        </div>
      );
    })}
  </div>
);
