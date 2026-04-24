import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function ErrorContainer({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return (
    <Collapsible defaultOpen className="mt-4 w-full">
      <CollapsibleTrigger className="text-left text-sm font-medium text-destructive hover:underline">
        Error
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Alert variant="destructive" className="mt-2">
          <AlertDescription className="max-h-64 overflow-auto font-mono text-xs">
            <pre className="whitespace-pre-wrap">{error.message}</pre>
            {error.stack ? (
              <pre className="mt-2 whitespace-pre-wrap opacity-90">
                {error.stack}
              </pre>
            ) : null}
          </AlertDescription>
        </Alert>
      </CollapsibleContent>
    </Collapsible>
  );
}
