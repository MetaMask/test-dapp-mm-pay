import { getTokenLogo } from './uniswap';

import { COMMON_TOKENS } from '@/constants/tokens';
import type { Token } from '@/types/swap';

export function getTokensByChain(chainId: number) {
  const tokens = COMMON_TOKENS[chainId];

  if (!tokens) {
    throw new Error(`No tokens found for chain ${chainId}`);
  }

  return Object.values(tokens).map((token) => ({
    ...token,
    logoURI: token.logoURI ?? getTokenLogo(token),
  }));
}

export function getToken(
  token: Pick<Token, 'address' | 'chainId' | 'logoURI' | 'symbol'>,
) {
  const tokens = getTokensByChain(token.chainId);

  const foundToken = tokens.find(
    (knownTokens) =>
      knownTokens.address.toLowerCase() === token.address.toLowerCase(),
  );

  if (!foundToken) {
    throw new Error(
      `Token ${token.address} not found on chain ${token.chainId}`,
    );
  }

  return {
    ...foundToken,
    logoURI: foundToken.logoURI ?? getTokenLogo(token),
  };
}
