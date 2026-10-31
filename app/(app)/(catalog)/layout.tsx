import { CatalogGallery } from "@/components/catalog-gallery";
import {
  CatalogProvider,
  ComponentPanelShell,
} from "@/components/component-panel-shell";

const CatalogLayout = ({ children }: { children: React.ReactNode }) => (
  <CatalogProvider>
    <CatalogGallery />
    <ComponentPanelShell>{children}</ComponentPanelShell>
  </CatalogProvider>
);
export default CatalogLayout;
