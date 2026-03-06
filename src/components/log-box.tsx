import { useEffect, useRef, useState } from 'react';

import { useLog, type LogEntry } from '@/hooks/use-log';
import { cn } from '@/lib/utils';

function levelColor(entry: LogEntry): string {
  if (entry.source === 'mmpay') {
    return 'text-cyan-400';
  }
  if (entry.level === 'error') {
    return 'text-red-400';
  }
  if (entry.level === 'warn') {
    return 'text-yellow-400';
  }
  return 'text-muted-foreground';
}

function sourceLabel(entry: LogEntry): string {
  return entry.source === 'mmpay' ? '[MMPay]' : '[console]';
}

export function LogBox() {
  const { entries, clear } = useLog();
  const [showConsole, setShowConsole] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const visible = showConsole
    ? entries
    : entries.filter((entry) => entry.source === 'mmpay');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visible]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Logs
          </span>
          <button
            className={cn(
              'text-xs',
              showConsole
                ? 'text-muted-foreground hover:text-foreground'
                : 'text-cyan-400 hover:text-cyan-300',
            )}
            onClick={() => setShowConsole((prev) => !prev)}
          >
            {showConsole ? 'Hide console' : 'Show console'}
          </button>
        </div>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={clear}
        >
          Clear
        </button>
      </div>
      <div className="h-48 overflow-y-auto rounded-md border bg-black/80 p-2 font-mono text-xs">
        {visible.length === 0 && (
          <span className="text-muted-foreground">No logs yet...</span>
        )}
        {visible.map((entry) => (
          <div key={entry.id} className={cn('break-all', levelColor(entry))}>
            <span className="mr-1 opacity-50">{entry.timestamp}</span>
            <span className="mr-1 font-bold">{sourceLabel(entry)}</span>
            <span>{entry.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
