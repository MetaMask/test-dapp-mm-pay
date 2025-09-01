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
    acc[chainConfig.chain.id] = INFURA_KEY
      ? http(chainConfig.rpcUrl)
      : http(chainConfig.chain.rpcUrls.default.http[0]);
    return acc;
  },
  {},
);

export const rootConfig = {
  chains: [base, arbitrum],
  transports,
} as const;

export const config = createConfig({
  ...rootConfig,
  multiInjectedProviderDiscovery: false,
});
