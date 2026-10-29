import { cn } from "@/lib/utils";

export const SectionHeading = ({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
      className
    )}
  >
    <div className="max-w-xl">
      <h2
        id={id}
        className="text-3xl font-medium tracking-[-0.04em] text-balance md:text-4xl"
      >
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 text-[15px] leading-7 text-pretty">
        {description}
      </p>
    </div>
    {children}
  </div>
);
