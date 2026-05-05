import { cn } from "@/lib/utils";

export const LogoMark = ({
  className,
  ...props
}: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    className={cn("size-4", className)}
    {...props}
  >
    <path
      d="M4 2v2m18 16h-2m-3.5 0H10c-2.828 0-4.243 0-5.121-.879C4 18.243 4 16.828 4 14V7.5M20 22V12c0-3.771 0-5.657-1.172-6.828S15.771 4 12 4H2"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.8 12 12 16.8m3.84-10.08-9.12 9.12"
      strokeWidth={1.92}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const getLogoMarkSVG = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" stroke="${color}" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 2v2m18 16h-2m-3.5 0H10c-2.828 0-4.243 0-5.121-.879C4 18.243 4 16.828 4 14V7.5M20 22V12c0-3.771 0-5.657-1.172-6.828S15.771 4 12 4H2" stroke-width="1.5"/>
    <path d="M16.8 12 12 16.8m3.84-10.08-9.12 9.12" stroke-width="1.92"/>
  </svg>
`;
