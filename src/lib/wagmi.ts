import { createConfig as createPrivyConfig } from '@privy-io/wagmi';
import type { Chain, Transport } from 'viem';
import { createConfig, http } from 'wagmi';
import { arbitrum, base } from 'wagmi/chains';

const INFURA_KEY: string = import.meta.env.VITE_INFURA_KEY;

export const CHAIN_CONFIGS: { chain: Chain; rpcUrl: string }[] = [
  {
    chain: arbitrum,
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  {
    chain: base,
    rpcUrl: `https://base-mainnet.infura.io/v3/${INFURA_KEY}`,
  },
];

const transports = CHAIN_CONFIGS.reduce<Record<number, Transport>>(
  (acc, chainConfig) => {
    acc[chainConfig.chain.id] = http(chainConfig.rpcUrl);
    return acc;
  },
  {},
);

const rootConfig = {
  chains: [base, arbitrum],
  transports,
} as const;

export const config = createConfig({
  ...rootConfig,
  multiInjectedProviderDiscovery: false,
});

export const privyConfig = createPrivyConfig(rootConfig);
