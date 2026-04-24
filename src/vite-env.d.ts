/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_INFURA_KEY: string;
    readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
