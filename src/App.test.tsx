import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import App from './App';

vi.mock('@dynamic-labs/sdk-react-core', () => ({
  DynamicContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  DynamicWidget: () => <div>Connect Wallet</div>,
}));

vi.mock('@dynamic-labs/ethereum', () => ({
  EthereumWalletConnectors: [],
}));

vi.mock('@dynamic-labs/wagmi-connector', () => ({
  DynamicWagmiConnector: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => children,
  useAccount: () => ({
    address: '0x1234567890abcdef1234567890abcdef12345678',
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
    connector: {
      id: 'metamask',
      name: 'MetaMask',
    },
    chain: {
      id: 1,
      name: 'Ethereum',
    },
  }),
  useBalance: () => ({
    data: { value: 1000000000000000000n, decimals: 18 },
    isLoading: false,
  }),
  useChainId: () => 1,
  useReadContract: () => ({
    data: 1000000000000000000n,
    isLoading: false,
    error: null,
  }),
  useWriteContract: () => ({
    writeContract: vi.fn(),
    data: '0x1234567890abcdef',
    isPending: false,
    isError: false,
    error: null,
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: true,
    data: { status: 'success' },
  }),
  useWalletClient: () => ({
    data: {
      account: { address: '0x1234567890abcdef1234567890abcdef12345678' },
    },
    isLoading: false,
  }),
  usePublicClient: () => ({
    readContract: vi.fn(),
  }),
  useSendTransaction: () => ({
    sendTransaction: vi.fn(),
    data: '0x1234567890abcdef',
    isPending: false,
    isError: false,
    error: null,
  }),
  useSimulateContract: () => ({
    data: { request: {} },
    isLoading: false,
    error: null,
  }),
  useSwitchChain: () => ({
    switchChain: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useQuery: () => ({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useMutation: () => ({
    mutate: vi.fn(),
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

vi.mock('@privy-io/react-auth', () => ({
  PrivyProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@privy-io/wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => children,
  createConfig: vi.fn(() => ({})),
}));

vi.mock('./components/integration-router', () => ({
  IntegrationRouter: () => <div>Integration Router</div>,
}));

vi.mock('./components/mode-toggle', () => ({
  ModeToggle: () => <div>Theme Toggle</div>,
}));

vi.mock('./components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({ actualTheme: 'dark' }),
}));

vi.mock('./components/wallet-provider-dynamic', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('./components/aave-account-status', () => ({
  AaveAccountStatus: () => <div>Aave Account Status</div>,
}));

vi.mock('./components/connection-status', () => ({
  ConnectionStatus: () => <div>Connection Status</div>,
}));

vi.mock('./components/wallet-provider-renderer', () => ({
  WalletProviderRenderer: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('./components/wallet-provider-selector', () => ({
  WalletProviderSelector: () => <div>Wallet Provider Selector</div>,
}));

vi.mock('./components/wallet-provider-privy', () => ({
  WalletProviderPrivy: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('./contexts/aave-provider', () => ({
  AaveProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('./contexts/wallet-provider-context', () => ({
  WalletProviderContextProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children,
  useWalletProvider: () => ({ selectedProvider: 'dynamic' }),
}));

vi.mock('./lib/wagmi', () => ({
  config: {},
  rootConfig: {
    chains: [],
    transports: {},
  },
  CHAIN_CONFIGS: [],
}));

vi.mock('@aave/react', () => ({
  useUserSupplies: () => ({
    data: [],
    error: null,
  }),
  chainId: 1,
  errAsync: vi.fn(),
  evmAddress: vi.fn(),
  useWithdraw: () => [vi.fn(), false],
}));

vi.mock('@aave/react/viem', () => ({
  useSendTransaction: () => [vi.fn()],
}));

vi.mock('@reservoir0x/relay-kit-hooks', () => ({
  useQuote: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
