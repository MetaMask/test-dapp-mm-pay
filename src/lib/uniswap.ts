import { KNOWN_LOGOS } from '@/constants/tokens';
import type { Token } from '@/types/swap';

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
