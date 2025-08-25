export const INTEGRATION_TYPES = {
  RELAY_API: 'relay-api',
  RELAY_PRIVY: 'relay-privy',
  BICONOMY_API: 'biconomy-api',
  BICONOMY_DYNAMIC: 'biconomy-dynamic',
  AAVE: 'aave',
} as const;

export type IntegrationType =
  (typeof INTEGRATION_TYPES)[keyof typeof INTEGRATION_TYPES];

export const INTEGRATION_LABELS = {
  [INTEGRATION_TYPES.RELAY_API]: 'Relay.link via API',
  [INTEGRATION_TYPES.RELAY_PRIVY]: 'Relay.link via Privy',
  [INTEGRATION_TYPES.BICONOMY_API]: 'Biconomy via API',
  [INTEGRATION_TYPES.BICONOMY_DYNAMIC]: 'Biconomy via Dynamic',
  [INTEGRATION_TYPES.AAVE]: 'AAVE',
} as const;

export const INTEGRATION_DESCRIPTIONS = {
  [INTEGRATION_TYPES.RELAY_API]: 'Direct API integration with Relay.link',
  [INTEGRATION_TYPES.RELAY_PRIVY]:
    'Relay.link integration through Privy wallet',
  [INTEGRATION_TYPES.BICONOMY_API]: 'Direct API integration with Biconomy',
  [INTEGRATION_TYPES.BICONOMY_DYNAMIC]:
    'Biconomy integration through Dynamic wallet',
} as const;
