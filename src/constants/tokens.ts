import type { Token } from '@/types/swap';

// Common token addresses for different chains
export const COMMON_TOKENS: Record<number, Record<string, Token>> = {
  // Ethereum Mainnet
  1: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    },
    DAI: {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
  },
  // Base Mainnet
  8453: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0x4200000000000000000000000000000000000006',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  },
  // Arbitrum One
  42161: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    },
    ARB: {
      symbol: 'ARB',
      name: 'Arbitrum',
      decimals: 18,
      address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    },
  },
  // Sepolia Testnet
  11155111: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    },
  },
};
