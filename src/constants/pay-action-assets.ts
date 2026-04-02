import aaveLogo from '@/assets/aave.svg';
import hyperliquidLogo from '@/assets/hyperliquid.svg';
import polymarketLogo from '@/assets/polymarket.svg';

export const PAY_ACTION_LOGOS = {
  aave: { src: aaveLogo, label: 'Aave' },
  hyperliquid: { src: hyperliquidLogo, label: 'Hyperliquid' },
  polymarket: { src: polymarketLogo, label: 'Polymarket' },
} as const;

export type PayDemoActionType = keyof typeof PAY_ACTION_LOGOS;
