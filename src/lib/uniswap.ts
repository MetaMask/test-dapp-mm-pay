import { SWAP_ROUTER_02_ADDRESSES, Token as UniToken } from '@uniswap/sdk-core';
import { type Address, isAddress, zeroAddress } from 'viem';

import { COMMON_TOKENS, KNOWN_LOGOS } from '@/constants/tokens';
import {
  QUOTER_V2_ADDRESSES,
  UNISWAP_V3_FACTORY_ADDRESSES,
} from '@/constants/uniswap';
import type { Token } from '@/types/swap';

// Check if Uniswap V3 is deployed on the chain
export function isUniswapV3Supported(chainId: number): boolean {
  return (
    chainId in UNISWAP_V3_FACTORY_ADDRESSES && chainId in QUOTER_V2_ADDRESSES
  );
}

export function getUniswapFactoryAddress(chainId: number): Address {
  const address = UNISWAP_V3_FACTORY_ADDRESSES[chainId];
  if (!address || !isAddress(address)) {
    throw new Error(`Uniswap V3 Factory not found on chain ${chainId}`);
  }
  return address;
}

export function getUniswapQuoterAddress(chainId: number): Address {
  const address = QUOTER_V2_ADDRESSES[chainId];
  if (!address || !isAddress(address)) {
    throw new Error(`Uniswap V3 Quoter not found on chain ${chainId}`);
  }
  return address;
}

export function getUniswapSwapRouterAddress(chainId: number): Address {
  const address = SWAP_ROUTER_02_ADDRESSES(chainId);
  if (!address || !isAddress(address)) {
    throw new Error(`SwapRouter not found on chain ${chainId}`);
  }
  return address;
}

export function toUniswapToken(token: Token, chainId: number): UniToken {
  if (
    !token.address ||
    token.address === zeroAddress ||
    token.symbol === 'ETH'
  ) {
    const wethAddress = getWETHAddress(chainId);
    if (!wethAddress) {
      throw new Error(`WETH not configured for chain ${chainId}`);
    }

    return new UniToken(chainId, wethAddress, 18, 'WETH', 'Wrapped Ethereum');
  }

  return new UniToken(
    chainId,
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  );
}

function getWETHAddress(chainId: number): string | null {
  const chainTokens = COMMON_TOKENS[chainId];
  return chainTokens?.WETH?.address ?? null;
}

// Get token list for a specific chain
export function getTokensForChain(chainId: number): Token[] {
  const tokens = COMMON_TOKENS[chainId] ?? {};
  const tokenList = Object.entries(tokens).map(([id, tokenData]) => ({
    id: id.toLowerCase(),
    symbol: tokenData.symbol,
    name: tokenData.name,
    decimals: tokenData.decimals,
    address: tokenData.address,
    logoURI: getTokenLogo(tokenData),
    chainId,
  }));

  tokenList.unshift({
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    // @ts-expect-error intentional empty address for native ETH
    address: '',
    logoURI: getTokenLogo({
      address: `0x${'e'.repeat(40)}`,
      chainId: 1,
      symbol: 'ETH',
    }),
    chainId,
  });

  return tokenList;
}

export function getTokenLogo(
  token: Pick<Token, 'address' | 'chainId' | 'symbol'> | null,
) {
  if (!token) {
    return '';
  }

  if (KNOWN_LOGOS[token.symbol.toLowerCase() as keyof typeof KNOWN_LOGOS]) {
    return KNOWN_LOGOS[token.symbol.toLowerCase() as keyof typeof KNOWN_LOGOS];
  }

  return `https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/tokens/${
    token.chainId
  }/${token.address.toLowerCase()}/logo-128.png`;
}
