export function ErrorContainer({ error }: { error: Error | null }) {
  return (
    <details className="overflow-scroll" open>
      <summary className="text-destructive">Error</summary>
      <div className="flex w-full flex-col gap-y-2 rounded-lg border border-destructive bg-destructive/10 p-4">
        <pre>{error?.message}</pre>
        <pre>{error?.stack}</pre>
      </div>
    </details>
  );
}
