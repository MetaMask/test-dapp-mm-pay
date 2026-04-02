import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'motion/react';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { PrivyConnector } from '@/components/privy-connector';
import { WalletProvider } from '@/constants/wallets';
import { useWalletProvider } from '@/contexts/wallet-provider-context';

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletStatusBar() {
  const { selectedProvider } = useWalletProvider();
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-end gap-2"
    >
      {isConnected && address ? (
        <>
          <div className="flex items-center gap-2 rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm text-pay-fg-muted">
              {chain?.name ?? 'Unknown'}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 px-3 py-2">
            <span className="text-sm text-pay-fg-muted">Balance:</span>
            <span className="text-sm text-pay-fg">
              {balanceLoading || !balance
                ? '…'
                : `${formatEther(balance.value)} ${balance.symbol}`}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 px-3 py-2">
            <span className="font-mono text-sm text-pay-fg-muted">
              {truncateAddress(address)}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-400">Connected</span>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {selectedProvider === WalletProvider.Privy ? (
            <PrivyConnector />
          ) : null}
          {selectedProvider === WalletProvider.Dynamic ? (
            <DynamicWidget />
          ) : null}
          {selectedProvider === WalletProvider.Rainbowkit ? (
            <ConnectButton />
          ) : null}
        </div>
      )}
    </motion.div>
  );
}
