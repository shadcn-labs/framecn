import { CatalogGallery } from "@/components/catalog-gallery";
import {
  CatalogProvider,
  ComponentPanelShell,
} from "@/components/component-panel-shell";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CatalogProvider>
      <CatalogGallery />
      <ComponentPanelShell>{children}</ComponentPanelShell>
    </CatalogProvider>
  );
}
