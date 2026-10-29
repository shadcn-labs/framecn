export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-w-0 flex-1 flex-col">{children}</div>;
}
