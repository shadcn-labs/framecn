import { AppActionsNotch } from "@/components/app-actions";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { CommandMenu } from "@/components/command-menu";
import { NavItemGithub } from "@/components/nav-item-github";
import { SiteFooter } from "@/components/site-footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WebMcpTools } from "@/components/web-mcp-tools";
import { APP_NAV } from "@/constants/nav";
import { AGENT_DOCS_DIRECTIVE_TEXT } from "@/lib/agent-discovery/directive";
import { source } from "@/lib/source";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <blockquote className="sr-only">{AGENT_DOCS_DIRECTIVE_TEXT}</blockquote>
      <WebMcpTools />
      <AppSidebar
        search={
          <CommandMenu
            navItems={APP_NAV.map((item) => ({
              href: item.href,
              label: item.name,
            }))}
            tree={source.pageTree}
          />
        }
        github={<NavItemGithub />}
      />
      {/* The inset column is transparent: the page sits in a rounded card and the footer below it on the sidebar surface. */}
      <SidebarInset className="min-w-0 bg-transparent md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
        <div className="bg-card flex min-h-svh min-w-0 flex-col md:min-h-[calc(100svh-1rem)] md:rounded-xl md:shadow-sm md:ring-1 md:ring-border/60">
          <AppActionsNotch />
          <AppTopbar />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
        <SiteFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
