import { motion } from 'motion/react';
import { useState } from 'react';

import metamaskLogo from './assets/mm-logo.svg';

import { ModeToggle } from '@/components/mode-toggle';
import {
  ActionSelector,
  type PayDemoActionType,
} from '@/components/pay-ui/action-selector';
import { ComingSoonActionPanel } from '@/components/pay-ui/coming-soon-action-panel';
import {
  DeveloperPanel,
  type DeveloperPanelExecutionState,
} from '@/components/pay-ui/developer-panel';
import { WalletStatusBar } from '@/components/pay-ui/wallet-status-bar';
import { WalletProviderRenderer } from '@/components/wallet-provider-renderer';
import { WalletProviderSelector } from '@/components/wallet-provider-selector';
import { AaveProvider } from '@/contexts/aave-provider';
import { ThemeProvider } from '@/contexts/theme-provider';
import { WalletProviderContextProvider } from '@/contexts/wallet-provider-context';
import { LogProvider } from '@/hooks/use-log';
import { AaveDepositMmPayDemoGrid } from '@/integrations/mmpay/aave-deposit-mmpay';

const IDLE_DEVELOPER_EXECUTION: DeveloperPanelExecutionState = {
  capabilitiesLoading: false,
  isAuxiliaryFundsSupported: false,
  sendCallsStatus: 'idle',
  callsStatus: null,
  sendCallsId: null,
};

const COMING_SOON_LABEL: Record<Exclude<PayDemoActionType, 'aave'>, string> = {
  hyperliquid: 'Hyperliquid',
  polymarket: 'Polymarket',
};

function MainContent() {
  const [selectedAction, setSelectedAction] =
    useState<PayDemoActionType>('aave');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-pay-border bg-pay-surface/50 p-4"
      >
        <ActionSelector
          selectedAction={selectedAction}
          onSelectAction={setSelectedAction}
        />
      </motion.div>

      {selectedAction === 'aave' ? (
        <AaveDepositMmPayDemoGrid />
      ) : (
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
            <ComingSoonActionPanel
              actionTitle={COMING_SOON_LABEL[selectedAction]}
            />
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
            <DeveloperPanel execution={IDLE_DEVELOPER_EXECUTION} />
          </div>
        </div>
      )}
    </>
  );
}

export function AppMmPay() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WalletProviderContextProvider>
        <div
          data-mm-pay-demo
          className="min-h-screen bg-gradient-to-br from-pay-page-from via-pay-page-via to-pay-page-to p-4 md:p-6"
        >
          <div className="mx-auto max-w-7xl space-y-4">
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={metamaskLogo}
                      alt="MetaMask"
                      className="h-8 w-8"
                    />
                    <h1 className="text-2xl text-pay-fg md:text-3xl">
                      MetaMask Pay Demo
                    </h1>
                  </div>
                  <p className="text-sm text-pay-fg-muted">
                    Complete any onchain action from any token in one click
                  </p>
                </div>

                <div className="flex flex-row items-end gap-2">
                  {/* WalletStatusBar needs RainbowKit context */}
                  <WalletProviderRenderer>
                    <WalletStatusBar />
                  </WalletProviderRenderer>
                  <div className="flex flex-row flex-wrap items-center justify-end gap-2">
                    <WalletProviderSelector />
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </motion.header>

            {/* Main content also needs wallet context for Aave etc. */}
            <WalletProviderRenderer>
              <AaveProvider>
                <LogProvider>
                  <MainContent />
                </LogProvider>
              </AaveProvider>
            </WalletProviderRenderer>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="py-3 text-center"
            >
              <span className="inline-flex items-center gap-2 text-xs text-pay-fg-subtle">
                experimental app - funds used may be lost.
              </span>
            </motion.div>
          </div>
        </div>
      </WalletProviderContextProvider>
    </ThemeProvider>
  );
}
