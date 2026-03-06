import { useEffect, useRef } from 'react';

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Logs
        </span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={clear}
        >
          Clear
        </button>
      </div>
      <div
        className={cn(
          'h-48 overflow-y-auto rounded-md border bg-black/80 p-2 font-mono text-xs',
        )}
      >
        {entries.length === 0 && (
          <span className="text-muted-foreground">No logs yet...</span>
        )}
        {entries.map((entry) => (
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
