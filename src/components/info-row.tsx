export function InfoRow({
  label,
  children,
  imageURL,
}: {
  label: string;
  children: React.ReactNode;
  imageURL?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>

      <span className={'flex items-center gap-x-1'}>
        {children}
        {imageURL && <img src={imageURL} className="h-4 w-4" />}
      </span>
    </div>
  );
}
