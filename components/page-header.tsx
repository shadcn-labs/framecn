export const PageHeader = ({
  children,
  description,
  title,
}: {
  children?: React.ReactNode;
  description?: React.ReactNode;
  title: React.ReactNode;
}) => (
  <header>
    <h1 className="heading-title">{title}</h1>
    {description ? (
      <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-7 text-pretty">
        {description}
      </p>
    ) : null}
    {children ? (
      <div className="mt-6 flex flex-wrap items-center gap-2">{children}</div>
    ) : null}
  </header>
);
