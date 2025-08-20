module.exports = {
  root: true,

  extends: ['@metamask/eslint-config'],
  parserOptions: {
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@metamask/eslint-config-typescript'],
      rules: {
        'import/no-unassigned-import': 'off',
        'import/extensions': 'off',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/match-description': 'off',
        'jsdoc/require-param-type': 'off',
        'no-restricted-globals': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    {
      files: ['*.js', '*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
    },

    {
      files: ['vite.config.ts', 'tailwind.config.ts', 'postcss.config.js'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'import/unambiguous': 'off',
        'import/no-nodejs-modules': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },

    {
      files: ['src/vite-env.d.ts'],
      rules: {
        'import/unambiguous': 'off',
      },
    },

    {
      files: ['*.test.ts', '*.test.js', '*.test.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],

  ignorePatterns: [
    '.eslintrc.cjs',
    '.prettierrc.json',
    'build/',
    'dist/',
    'docs/',
    '.yarn/',
    'node_modules/',
  ],
};
