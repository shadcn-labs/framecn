import { cn } from "@/lib/utils";

export const SectionHeading = ({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) => (
  <h2 id={id} className={cn("heading-title text-center", className)}>
    {title}
  </h2>
);
