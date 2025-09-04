import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import { homepage } from './package.json';

// eslint-disable-next-line require-unicode-regexp
const basePath = homepage.replace(/^https?:\/\/[^/]+/, '');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  base: process.env.ENV === 'production' ? basePath : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
