import { CheckCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { parseUnits } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useBalance } from 'wagmi';

import { useAaveDepositMmPay } from './use-aave-deposit-mmpay';

import aaveLogo from '@/assets/aave.svg';
import {
  DeveloperPanel,
  type DeveloperPanelExecutionState,
} from '@/components/pay-ui/developer-panel';
import { StepProgress } from '@/components/pay-ui/step-progress';
import { TokenFlowVisualization } from '@/components/pay-ui/token-flow-visualization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AUSDC_BASE, COMMON_TOKENS } from '@/constants/tokens';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { getTokenLogo } from '@/lib/uniswap';

const DESTINATION_TOKEN = COMMON_TOKENS[base.id]?.USDC ?? null;
const ACTION_NAME = 'Aave';
const NETWORK_LABEL = 'Base';

function deriveMmpayDemoStep(operation: {
  sendCallsStatus: 'idle' | 'pending' | 'success' | 'error';
  callsStatus: { status: number } | null;
}): { currentStep: number; isComplete: boolean } {
  const { sendCallsStatus, callsStatus } = operation;

  if (sendCallsStatus === 'error') {
    return { currentStep: 0, isComplete: false };
  }

  if (sendCallsStatus === 'idle' && !callsStatus) {
    return { currentStep: 0, isComplete: false };
  }

  if (sendCallsStatus === 'pending') {
    return { currentStep: 1, isComplete: false };
  }

  if (sendCallsStatus === 'success' && callsStatus === null) {
    return { currentStep: 2, isComplete: false };
  }

  if (callsStatus && callsStatus.status < 200) {
    return { currentStep: 3, isComplete: false };
  }

  if (callsStatus && callsStatus.status >= 400) {
    return { currentStep: 0, isComplete: false };
  }

  if (callsStatus && callsStatus.status >= 200) {
    return { currentStep: 4, isComplete: true };
  }

  return { currentStep: 0, isComplete: false };
}

function getPrimaryButtonLabel(
  operation: ReturnType<typeof useAaveDepositMmPay>,
) {
  if (!operation.isAuxiliaryFundsSupported && !operation.capabilitiesLoading) {
    return 'auxiliaryFunds not supported';
  }
  if (operation.sendCallsStatus === 'pending') {
    return 'Confirming...';
  }
  return 'Fund & Deposit with MetaMask';
}

export type AaveMmPayDepositFlow = {
  amount: string;
  setAmount: (value: string) => void;
  amountInWei: bigint;
  destinationSymbol: string;
  operation: ReturnType<typeof useAaveDepositMmPay>;
  usdcBalance: ReturnType<typeof useTokenBalance>;
  aUsdcBalance: ReturnType<typeof useTokenBalance>;
  nativeSymbol: string;
  executionForDeveloperPanel: DeveloperPanelExecutionState;
};

export function useAaveMmPayDepositFlow(): AaveMmPayDepositFlow {
  const [amount, setAmount] = useState<string>('1');
  const { address } = useAccount();

  const amountInWei = parseUnits(
    amount || '0',
    DESTINATION_TOKEN?.decimals ?? 6,
  );

  const operation = useAaveDepositMmPay({ amount: amountInWei });
  const usdcBalance = useTokenBalance(DESTINATION_TOKEN);
  const aUsdcBalance = useTokenBalance(AUSDC_BASE);
  const { data: nativeBalance } = useBalance({ address });

  const nativeSymbol = nativeBalance?.symbol ?? 'ETH';

  // Refetch aUSDC balance once the tx is confirmed
  const hasRefetchedRef = useRef(false);
  useEffect(() => {
    if (operation.sendCallsStatus === 'pending') {
      hasRefetchedRef.current = false;
    }
  }, [operation.sendCallsStatus]);
  useEffect(() => {
    const status = operation.callsStatus?.status;
    if (!hasRefetchedRef.current && status !== undefined && status >= 200) {
      hasRefetchedRef.current = true;
      aUsdcBalance.refetch().catch(console.error);
    }
  }, [operation.callsStatus?.status, aUsdcBalance.refetch]);

  const executionForDeveloperPanel = useMemo(
    (): DeveloperPanelExecutionState => ({
      capabilitiesLoading: operation.capabilitiesLoading,
      isAuxiliaryFundsSupported: operation.isAuxiliaryFundsSupported,
      sendCallsStatus: operation.sendCallsStatus,
      callsStatus: operation.callsStatus,
      sendCallsId: operation.sendCallsId,
    }),
    [
      operation.capabilitiesLoading,
      operation.isAuxiliaryFundsSupported,
      operation.sendCallsStatus,
      operation.callsStatus,
      operation.sendCallsId,
    ],
  );

  return {
    amount,
    setAmount,
    amountInWei,
    destinationSymbol: DESTINATION_TOKEN?.symbol ?? 'USDC',
    operation,
    usdcBalance,
    aUsdcBalance,
    nativeSymbol,
    executionForDeveloperPanel,
  };
}

type UserPanelProps = AaveMmPayDepositFlow;

export function AaveDepositMmPayUserPanel({
  amount,
  setAmount,
  amountInWei,
  destinationSymbol,
  operation,
  usdcBalance,
  aUsdcBalance,
  nativeSymbol,
}: UserPanelProps) {
  const { currentStep, isComplete } = deriveMmpayDemoStep(operation);

  // Flash the aUSDC balance row when the value changes after the query is loaded
  const [balanceFlash, setBalanceFlash] = useState(false);
  const prevAUsdcBalance = useRef<string | undefined>(undefined);
  const aUsdcBalanceInitialized = useRef(false);
  useEffect(() => {
    if (!aUsdcBalance.isSuccess) {
      return undefined;
    }
    if (!aUsdcBalanceInitialized.current) {
      aUsdcBalanceInitialized.current = true;
      prevAUsdcBalance.current = aUsdcBalance.balanceDecimal;
      return undefined;
    }
    if (prevAUsdcBalance.current !== aUsdcBalance.balanceDecimal) {
      prevAUsdcBalance.current = aUsdcBalance.balanceDecimal;
      setBalanceFlash(true);
      const timer = setTimeout(() => setBalanceFlash(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [aUsdcBalance.balanceDecimal, aUsdcBalance.isSuccess]);

  const isExecuting =
    operation.sendCallsStatus === 'pending' ||
    (operation.sendCallsStatus === 'success' &&
      operation.callsStatus !== null &&
      operation.callsStatus.status < 200);

  const showProgress =
    isExecuting ||
    isComplete ||
    currentStep > 0 ||
    operation.sendCallsStatus !== 'idle';

  const tokenFlowActive =
    operation.sendCallsStatus !== 'idle' || operation.callsStatus !== null;

  const needsMoreThanHave =
    usdcBalance.balance !== undefined &&
    usdcBalance.balance !== null &&
    amountInWei > usdcBalance.balance;

  const disableSubmit =
    !operation.isAuxiliaryFundsSupported ||
    !amount ||
    amountInWei === 0n ||
    operation.sendCallsStatus === 'pending';

  const verbPhrase = 'Deposit to';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden rounded-2xl border border-pay-border bg-pay-surface p-5 shadow-xl"
    >
      {isExecuting ? (
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10"
        />
      ) : null}

      <div className="relative z-10">
        <div className="mb-4 space-y-3">
          <div>
            <h2 className="mb-1 text-lg text-pay-fg">
              {verbPhrase} {ACTION_NAME}
            </h2>
            <p className="text-sm text-pay-fg-muted">
              Input the amount you&apos;d like to deposit to{' '}
              <span className="text-pay-fg-accent">{ACTION_NAME}</span> and
              select the token to use in MetaMask.
            </p>
          </div>

          <div>
            <Label
              className="mb-1.5 block text-sm text-pay-fg-muted"
              htmlFor="mmpay-amount-demo"
            >
              {destinationSymbol} amount
            </Label>
            <div className="flex items-center gap-2">
              {DESTINATION_TOKEN ? (
                <img
                  className="size-9 shrink-0 rounded-full"
                  src={getTokenLogo(DESTINATION_TOKEN)}
                  alt={destinationSymbol}
                />
              ) : null}
              <Input
                id="mmpay-amount-demo"
                type="number"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
                disabled={isExecuting || isComplete}
                placeholder="1"
                className="h-11 min-w-0 flex-1 rounded-lg border-pay-border-strong bg-pay-surface-muted text-base text-pay-fg placeholder:text-pay-fg-subtle focus-visible:ring-pay-ring/50 md:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 divide-x divide-pay-border-strong rounded-lg border border-pay-border-strong bg-pay-surface-muted/50">
          <div className="px-3 py-2.5">
            <p className="mb-1 text-xs text-pay-fg-muted">You need</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-pay-fg">
                {amount || '0'} {destinationSymbol}
              </span>
              {needsMoreThanHave ? (
                <X className="h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden />
              ) : null}
            </div>
          </div>
          <div className="px-3 py-2.5">
            <p className="mb-1 text-xs text-pay-fg-muted">You have</p>
            <span className="text-sm text-pay-fg">
              {usdcBalance.balanceDecimal} {destinationSymbol}
            </span>
          </div>
          <motion.div
            className="px-3 py-2.5"
            animate={
              balanceFlash
                ? {
                    backgroundColor: [
                      'rgba(74,222,128,0.15)',
                      'rgba(74,222,128,0)',
                    ],
                  }
                : { backgroundColor: 'rgba(74,222,128,0)' }
            }
            transition={{ duration: 1.8, ease: 'easeOut' }}
          >
            <p className="mb-1 text-xs text-pay-fg-muted">aUSDC earned</p>
            <motion.span
              animate={
                balanceFlash
                  ? { scale: [1, 1.06, 1], color: ['#4ade80', 'currentColor'] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className="inline-block origin-left text-sm text-pay-fg"
            >
              {aUsdcBalance.balanceDecimal}
            </motion.span>
          </motion.div>
        </div>

        <motion.div
          animate={
            isExecuting
              ? {
                  boxShadow: [
                    '0 0 0px rgba(249, 115, 22, 0)',
                    '0 0 20px rgba(249, 115, 22, 0.3)',
                    '0 0 0px rgba(249, 115, 22, 0)',
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 rounded-lg border border-pay-accent/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-3"
        >
          <h3 className="mb-2 text-sm text-pay-fg-accent">
            MetaMask&apos;s got this
          </h3>
          <ul className="space-y-1.5 text-sm text-pay-fg-muted">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-pay-fg-accent">•</span>
              <span>You select which token to use in your wallet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-pay-fg-accent">•</span>
              <span>
                MetaMask converts to {destinationSymbol} and bridges to{' '}
                {NETWORK_LABEL}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-pay-fg-accent">•</span>
              <span>Completes the {ACTION_NAME} deposit</span>
            </li>
          </ul>
          <p className="mt-2 text-xs text-pay-fg-subtle">
            All handled in one flow
          </p>
        </motion.div>

        <TokenFlowVisualization
          isActive={tokenFlowActive}
          currentStep={currentStep}
          fromToken={{
            symbol: nativeSymbol,
            logoUrl: getTokenLogo({
              address: `0x${'e'.repeat(40)}`,
              chainId: 1,
              symbol: nativeSymbol,
            }),
          }}
          toToken={{
            symbol: destinationSymbol,
            logoUrl: DESTINATION_TOKEN ? getTokenLogo(DESTINATION_TOKEN) : '',
          }}
          destination={{
            symbol: ACTION_NAME,
            logoUrl: aaveLogo,
          }}
        />

        {showProgress ? (
          <div className="mb-4">
            <StepProgress
              currentStep={currentStep}
              isComplete={isComplete}
              actionName={ACTION_NAME}
            />
          </div>
        ) : null}

        <div>
          {isComplete ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-2 py-3 text-center"
            >
              <motion.div
                className="mb-1 flex items-center justify-center gap-2 text-green-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, times: [0, 0.5, 1] }}
              >
                <CheckCircle className="h-6 w-6" />
                <span className="text-xl">{ACTION_NAME} funded</span>
              </motion.div>
              <p className="text-sm text-pay-fg-muted">
                Converted your token to {destinationSymbol} on {NETWORK_LABEL}{' '}
                and completed the {ACTION_NAME} action
              </p>
            </motion.div>
          ) : (
            <Button
              asChild
              variant="payPrimary"
              disabled={disableSubmit}
              className="relative overflow-hidden"
            >
              <motion.button
                type="button"
                whileHover={{ scale: isExecuting ? 1 : 1.02 }}
                whileTap={{ scale: isExecuting ? 1 : 0.98 }}
                disabled={disableSubmit}
                onClick={() => {
                  operation.handleSubmit().catch(console.error);
                }}
              >
                <motion.div
                  animate={{ x: [-200, 200] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10">
                  {getPrimaryButtonLabel(operation)}
                </span>
              </motion.button>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AaveDepositMmPayDeveloperPanel({
  executionForDeveloperPanel,
}: Pick<AaveMmPayDepositFlow, 'executionForDeveloperPanel'>) {
  return <DeveloperPanel execution={executionForDeveloperPanel} />;
}

export function AaveDepositMmPayDemoGrid() {
  const flow = useAaveMmPayDepositFlow();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-2"
        >
          <h3 className="text-sm uppercase tracking-wide text-pay-fg-section">
            User Experience
          </h3>
        </motion.div>
        <AaveDepositMmPayUserPanel {...flow} />
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-2"
        >
          <h3 className="text-sm uppercase tracking-wide text-pay-fg-section">
            Developer View
          </h3>
        </motion.div>
        <AaveDepositMmPayDeveloperPanel
          executionForDeveloperPanel={flow.executionForDeveloperPanel}
        />
      </div>
    </div>
  );
}

export function AaveDepositMmPay() {
  const flow = useAaveMmPayDepositFlow();
  return (
    <div className="w-full max-w-md shrink-0">
      <AaveDepositMmPayUserPanel {...flow} />
    </div>
  );
}
