import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, sepolia, abstract } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'MetaMask Pay DApp',
  projectId: 'demo-project-id',
  chains: [
    base,
    abstract,
    arbitrum,
    ...(process.env.NODE_ENV === 'development' ? [sepolia] : []),
  ],
  ssr: false, // Since this is a client-side app
});
