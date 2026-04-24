import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type LogLevel = 'log' | 'warn' | 'error' | 'info';

export type LogEntry = {
  id: number;
  timestamp: string;
  level: LogLevel;
  source: 'console' | 'mmpay';
  message: string;
};

type LogContextValue = {
  entries: LogEntry[];
  log: (message: string, level?: LogLevel) => void;
  clear: () => void;
};

export const LogContext = createContext<LogContextValue>({
  entries: [],
  log: () => undefined,
  clear: () => undefined,
});

let idCounter = 0;

function fmt(args: unknown[]): string {
  return args
    .map((a) =>
      typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a),
    )
    .join(' ');
}

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const addEntry = useCallback(
    (source: LogEntry['source'], level: LogLevel, message: string) => {
      const entry: LogEntry = {
        id: (idCounter += 1),
        timestamp: new Date().toLocaleTimeString('en', { hour12: false }),
        level,
        source,
        message,
      };
      setEntries((prev) => [...prev.slice(-199), entry]);
    },
    [],
  );

  const log = useCallback(
    (message: string, level: LogLevel = 'log') => {
      addEntry('mmpay', level, message);
    },
    [addEntry],
  );

  const clear = useCallback(() => setEntries([]), []);

  const originals = useRef<Record<LogLevel, (...args: unknown[]) => void>>({
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
  });

  useEffect(() => {
    const orig = originals.current;
    (['log', 'warn', 'error', 'info'] as LogLevel[]).forEach((level) => {
      (console as any)[level] = (...args: unknown[]) => {
        orig[level](...args);
        addEntry('console', level, fmt(args));
      };
    });
    return () => {
      (['log', 'warn', 'error', 'info'] as LogLevel[]).forEach((level) => {
        (console as any)[level] = orig[level];
      });
    };
  }, [addEntry]);

  return (
    <LogContext.Provider value={{ entries, log, clear }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLog() {
  return useContext(LogContext);
}
