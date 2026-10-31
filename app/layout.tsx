import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Analytics } from "@/components/analytics";
import { HapticEffects } from "@/components/haptic-effects";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SoundEffects } from "@/components/ui/sound";
import { META_THEME_COLORS } from "@/constants/site";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { JsonLdScripts } from "@/seo/json-ld";

import "@/styles/globals.css";
import { baseMetadata } from "@/seo/metadata";

export const metadata: Metadata = baseMetadata;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <JsonLdScripts />
      <script>
        {`
          try {
            if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
            }
          } catch {}
        `}
      </script>
      <meta name="theme-color" content={META_THEME_COLORS.light} />
    </head>
    <body
      className={cn(
        "text-foreground group/body overscroll-none font-sans antialiased [--footer-height:--spacing(14)] [--header-height:--spacing(12)] xl:[--footer-height:--spacing(24)]",
        fontVariables
      )}
    >
      <NuqsAdapter>
        <SoundEffects>
          <HapticEffects />
          <ThemeProvider>
            {children}
            <Toaster position="top-center" />
            <Analytics />
          </ThemeProvider>
        </SoundEffects>
      </NuqsAdapter>
    </body>
  </html>
);

export default RootLayout;
