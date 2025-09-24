import { createContext, useContext, useState, type ReactNode } from 'react';

import { WalletProvider as WalletProviderOptions } from '@/constants/wallets';

export type WalletProvider =
  | WalletProviderOptions.Dynamic
  | WalletProviderOptions.Privy
  | WalletProviderOptions.Rainbowkit;

type WalletProviderContextType = {
  selectedProvider: WalletProviderOptions;
  setSelectedProvider: (provider: WalletProviderOptions) => void;
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

  const [selectedProvider, setSelectedProvider] =
    useState<WalletProviderOptions>(
      isDynamicEnabled
        ? WalletProviderOptions.Dynamic
        : WalletProviderOptions.Rainbowkit,
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
