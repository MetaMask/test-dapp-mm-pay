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
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
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

vi.mock('./lib/wagmi', () => ({
  config: {},
}));

describe('App', () => {
  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
