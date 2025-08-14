import type { Address } from 'viem';
import { baseSepolia } from 'viem/chains';

// Default mint quantities
export const DEFAULT_MINT_QUANTITY = 1;
export const MAX_MINT_QUANTITY = 10;

// Default collection image placeholder
export const DEFAULT_COLLECTION_IMAGE = '/assets/mm-logo.svg';
export const DEFAULT_NFT_IMAGE = '/assets/mm-logo.svg';

export const NFT_CONTRACTS: Record<number, Address> = {
  [baseSepolia.id]: '0x097fF9Cf279Dab00080310490A9e6DeEF52C404a',
};
