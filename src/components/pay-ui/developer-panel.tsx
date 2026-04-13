import { CheckCircle2, Clock, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLog, type LogEntry } from '@/hooks/use-log';
import { cn } from '@/lib/utils';

type ExecutionStatus = 'pending' | 'active' | 'success';

export type DeveloperPanelExecutionState = {
  capabilitiesLoading: boolean;
  isAuxiliaryFundsSupported: boolean;
  sendCallsStatus: 'idle' | 'pending' | 'success' | 'error';
  callsStatus: { status: number } | null;
  sendCallsId: string | null;
};

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
  return 'text-pay-fg-muted';
}

function sourceLabel(entry: LogEntry): string {
  return entry.source === 'mmpay' ? '[MM Pay]' : '[console]';
}

function getExecutionStepStatuses(
  state: DeveloperPanelExecutionState,
): [ExecutionStatus, ExecutionStatus, ExecutionStatus] {
  let capability: ExecutionStatus = 'pending';
  if (state.capabilitiesLoading) {
    capability = 'active';
  } else if (state.isAuxiliaryFundsSupported) {
    capability = 'success';
  }

  let buildCalls: ExecutionStatus = 'pending';
  if (capability === 'success') {
    if (state.sendCallsStatus === 'pending') {
      buildCalls = 'active';
    } else if (
      state.sendCallsStatus === 'success' ||
      state.sendCallsStatus === 'error'
    ) {
      buildCalls = 'success';
    } else if (state.callsStatus && state.sendCallsStatus === 'idle') {
      buildCalls = 'success';
    }
  }

  let execute: ExecutionStatus = 'pending';
  if (state.sendCallsStatus === 'success') {
    if (state.callsStatus && state.callsStatus.status >= 200) {
      execute = 'success';
    } else {
      execute = 'active';
    }
  }

  return [capability, buildCalls, execute];
}

type DeveloperPanelProps = {
  execution: DeveloperPanelExecutionState;
};

function stepTitleClass(status: ExecutionStatus): string {
  if (status === 'success') {
    return 'text-green-400';
  }
  if (status === 'active') {
    return 'text-orange-400';
  }
  return 'text-pay-fg-section';
}

function executionBadgeVariant(
  status: ExecutionStatus,
): 'payPending' | 'payActive' | 'paySuccess' {
  if (status === 'success') {
    return 'paySuccess';
  }
  if (status === 'active') {
    return 'payActive';
  }
  return 'payPending';
}

function StepStatusIcon({ status }: { status: ExecutionStatus }) {
  if (status === 'success') {
    return <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-400" />;
  }
  if (status === 'active') {
    return (
      <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-orange-400" />
    );
  }
  return <Clock className="h-4 w-4 flex-shrink-0 text-pay-border-strong" />;
}

const executionStepsConfig = [
  {
    title: 'Capability Check',
    method: 'wallet_getCapabilities',
    details: 'auxiliaryFunds: supported',
  },
  {
    title: 'Build Calls',
    method: 'wallet_sendCalls',
    details: 'batching funding + supply',
  },
  {
    title: 'Execute Transaction',
    method: 'wallet_getCallsStatus',
    details: 'on-chain execution',
  },
] as const;

function isPolling(execution: DeveloperPanelExecutionState): boolean {
  return (
    execution.sendCallsStatus === 'success' &&
    (execution.callsStatus === null || execution.callsStatus.status < 200)
  );
}

export function DeveloperPanel({ execution }: DeveloperPanelProps) {
  const { entries, clear } = useLog();
  const [showConsole, setShowConsole] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const polling = isPolling(execution);

  const visible = showConsole
    ? entries
    : entries.filter((entry) => entry.source === 'mmpay');

  const [s1, s2, s3] = getExecutionStepStatuses(execution);
  const stepStatuses: ExecutionStatus[] = [s1, s2, s3];

  const callIdDetail =
    execution.sendCallsId === null
      ? 'awaiting call ID'
      : `call ID: ${execution.sendCallsId.slice(0, 10)}…`;

  const stepDetails = [
    executionStepsConfig[0].details,
    executionStepsConfig[1].details,
    callIdDetail,
  ];

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visible]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 rounded-2xl border border-pay-border bg-pay-surface p-6 shadow-xl"
    >
      <h2 className="mb-4 text-xl text-pay-fg">{'Under the hood'}</h2>

      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-wide text-pay-fg-muted">
          Execution Steps
        </h3>

        {executionStepsConfig.map((step, index) => {
          const status = stepStatuses[index] ?? 'pending';

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StepStatusIcon status={status} />
                  <span className={`text-sm ${stepTitleClass(status)}`}>
                    {step.title}
                  </span>
                </div>
                <Badge variant={executionBadgeVariant(status)}>{status}</Badge>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-xs text-pay-fg-subtle">
                  <span className="text-pay-fg-muted">method:</span>{' '}
                  {step.method}
                </p>
                <p className="text-xs text-pay-fg-subtle">
                  {stepDetails[index]}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-wide text-pay-fg-muted">
            Live Execution Logs
          </h3>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="payGhostLink"
              className={
                showConsole
                  ? 'text-pay-fg-muted hover:text-pay-fg'
                  : 'text-cyan-400 hover:text-cyan-300'
              }
              onClick={() => {
                setShowConsole((prev) => !prev);
              }}
            >
              {showConsole ? 'Hide console' : 'Show console'}
            </Button>
            <Button
              type="button"
              variant="payGhostLink"
              className="text-pay-fg-muted hover:text-pay-fg"
              onClick={clear}
            >
              Clear
            </Button>
          </div>
        </div>

        <ScrollArea className="h-64 rounded-lg border border-pay-code-border bg-pay-code-bg/40">
          <div className="p-4 font-mono text-xs">
            {visible.length === 0 ? (
              <div className="py-8 text-center text-pay-fg-subtle">
                Waiting for execution...
              </div>
            ) : (
              <div className="space-y-1">
                {visible.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn('break-all', levelColor(entry))}
                  >
                    <span className="mr-1 opacity-50">{entry.timestamp}</span>
                    <span className="mr-1 font-bold">{sourceLabel(entry)}</span>
                    <span>{entry.message}</span>
                  </motion.div>
                ))}
                {polling && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 pt-1 text-orange-400"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>polling wallet_getCallsStatus…</span>
                  </motion.div>
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
