import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import {
  ConnectButton,
  useAccountModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';
import { motion } from 'motion/react';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { PrivyConnector } from '@/components/privy-connector';
import { CHAIN_META } from '@/constants/chains';
import { WalletProvider } from '@/constants/wallets';
import { useWalletProvider } from '@/contexts/wallet-provider-context';

function getChainIcon(chainId: number | undefined) {
  if (!chainId) {
    return { iconUrl: null, iconBackground: null };
  }
  const meta = CHAIN_META[chainId];
  return {
    iconUrl: meta?.iconUrl ?? null,
    iconBackground: meta?.iconBackground ?? null,
  };
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatBalance(value: bigint, decimals: number): string {
  const full = formatUnits(value, decimals);
  const dotIndex = full.indexOf('.');
  if (dotIndex === -1) {
    return full;
  }
  return `${full.slice(0, dotIndex)}.${full.slice(dotIndex + 1, dotIndex + 7)}`;
}

function RainbowKitConnectedCards({
  address,
  chain,
  balance,
  balanceLoading,
}: {
  address: string;
  chain: { id: number; name: string } | undefined;
  balance: { value: bigint; decimals: number; symbol: string } | undefined;
  balanceLoading: boolean;
}) {
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { iconUrl, iconBackground } = getChainIcon(chain?.id);

  // openAccountModal is undefined when the connected chain isn't in RainbowKit's
  // supported chains list — fall back to the chain modal so the user can switch.
  const handleAccountClick = openAccountModal ?? openChainModal;
  const isUnsupportedChain = !openAccountModal;

  return (
    <>
      <button
        onClick={openChainModal}
        className="flex items-center gap-2 rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 px-3 py-2 transition-colors hover:bg-pay-surface-muted"
      >
        {iconUrl ? (
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundColor: iconBackground ?? undefined }}
          >
            <img src={iconUrl} alt={chain?.name} className="h-full w-full" />
          </span>
        ) : (
          <div
            className={`h-2 w-2 rounded-full ${isUnsupportedChain ? 'bg-yellow-500' : 'bg-blue-500'}`}
          />
        )}
        <span className="text-sm text-pay-fg-muted">
          {isUnsupportedChain ? 'Wrong Network' : (chain?.name ?? 'Unknown')}
        </span>
      </button>

      <div className="flex items-center gap-2 rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 px-3 py-2">
        <span className="text-sm text-pay-fg-muted">Balance:</span>
        <span className="text-sm text-pay-fg">
          {balanceLoading || !balance
            ? '…'
            : `${formatBalance(balance.value, balance.decimals)} ${balance.symbol}`}
        </span>
      </div>

      <button
        onClick={handleAccountClick}
        className="flex items-center gap-2 rounded-lg border border-pay-border-strong bg-pay-surface-muted/50 px-3 py-2 transition-colors hover:bg-pay-surface-muted"
      >
        <span className="font-mono text-sm text-pay-fg-muted">
          {truncateAddress(address)}
        </span>
      </button>

      <button
        onClick={handleAccountClick}
        className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 transition-colors hover:bg-green-500/20"
      >
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm text-green-400">Connected</span>
      </button>
    </>
  );
}

export function WalletStatusBar() {
  const { selectedProvider } = useWalletProvider();
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-end gap-2"
    >
      {isConnected && address ? (
        <RainbowKitConnectedCards
          address={address}
          chain={chain}
          balance={balance}
          balanceLoading={balanceLoading}
        />
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
