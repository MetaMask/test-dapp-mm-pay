import { createContext, useContext, useState, type ReactNode } from 'react';

export type WalletProvider = 'dynamic' | 'privy' | 'rainbowkit';

type WalletProviderContextType = {
  selectedProvider: WalletProvider;
  setSelectedProvider: (provider: WalletProvider) => void;
};

const WalletProviderContext = createContext<
  WalletProviderContextType | undefined
>(undefined);

type WalletProviderContextProviderProps = {
  children: ReactNode;
};

export function WalletProviderContextProvider({
  children,
}: WalletProviderContextProviderProps) {
  const isDynamicEnabled = Boolean(import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID);

  const [selectedProvider, setSelectedProvider] = useState<WalletProvider>(
    isDynamicEnabled ? 'dynamic' : 'rainbowkit',
  );

  return (
    <WalletProviderContext.Provider
      value={{ selectedProvider, setSelectedProvider }}
    >
      {children}
    </WalletProviderContext.Provider>
  );
}

export function useWalletProvider() {
  const context = useContext(WalletProviderContext);
  if (context === undefined) {
    throw new Error(
      'useWalletProvider must be used within a WalletProviderContextProvider',
    );
  }
  return context;
}
