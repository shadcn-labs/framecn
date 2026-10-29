const AspectRatio = ({
  ratio = 1,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio?: number }) => (
  <div
    data-slot="aspect-ratio"
    style={{
      aspectRatio: ratio,
      position: "relative",
      width: "100%",
      ...style,
    }}
    {...props}
  />
);

export { AspectRatio };
