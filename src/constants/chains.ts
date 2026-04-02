import { arbitrum, base } from 'wagmi/chains';

import arbitrumLogo from '@/assets/arbitrum.svg';
import baseLogo from '@/assets/base.svg';

type ChainMeta = {
  iconUrl: string;
  iconBackground: string;
};

export const CHAIN_META: Record<number, ChainMeta> = {
  [base.id]: {
    iconUrl: baseLogo,
    iconBackground: '#0052ff',
  },
  [arbitrum.id]: {
    iconUrl: arbitrumLogo,
    iconBackground: '#96bedc',
  },
};
