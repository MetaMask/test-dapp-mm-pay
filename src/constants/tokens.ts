import { mcWeth } from '@biconomy/abstractjs';
import type { Address } from 'viem';

import type { Token } from '@/types/swap';

export const AUSDC_BASE = {
  symbol: 'aUSDC',
  name: 'Aave USD Coin',
  decimals: 6,
  address: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB' as Address,
  logoURI:
    'https://assets.coingecko.com/coins/images/14318/standard/aUSDC.e260d492.png',
  chainId: 8453,
};

// Common token addresses for different chains
export const COMMON_TOKENS: Record<number, Record<string, Token>> = {
  // Ethereum Mainnet
  1: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      chainId: 1,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: 1,
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      chainId: 1,
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      chainId: 1,
    },
    DAI: {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      chainId: 1,
    },
  },
  // Base Mainnet
  8453: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0x4200000000000000000000000000000000000006',
      chainId: 8453,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      chainId: 8453,
    },
    aUSDC: AUSDC_BASE,
  },
  // Arbitrum One
  42161: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      chainId: 42161,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      chainId: 42161,
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      chainId: 42161,
    },
    ARB: {
      symbol: 'ARB',
      name: 'Arbitrum',
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      chainId: 42161,
    },
  },
  // Sepolia Testnet
  11155111: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      chainId: 11155111,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      chainId: 11155111,
    },
  },
};

export const KNOWN_LOGOS = {
  weth: 'https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/42161/0x82af49447d8a07e3bd95bd0d56f35241523fbab1/logo-alt-128.png',
};

// TODO: Temp hack to get WETH address on all chains
export const mcWETH = mcWeth;
mcWETH.addressOn = (chainId: number) => {
  const address = COMMON_TOKENS[chainId]?.WETH?.address;

  return address as `0x${string}`;
};
