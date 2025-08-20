/* eslint-disable @typescript-eslint/consistent-type-definitions */
// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_INFURA_KEY: string;
    readonly VITE_BICONOMY_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
