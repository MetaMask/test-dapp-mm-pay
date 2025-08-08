import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet } from 'wagmi/chains';
import { http } from 'wagmi';

const INFURA_KEY = import.meta.env.VITE_INFURA_KEY;

const transports = {
  [mainnet.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
  [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`),
  [base.id]: http(`https://base-mainnet.infura.io/v3/${INFURA_KEY}`),
};

export const config = getDefaultConfig({
  appName: 'MetaMask Pay DApp',
  projectId: 'demo-project-id',
  chains: [mainnet, base, arbitrum],
  transports,
  ssr: false, // Since this is a client-side app
});
