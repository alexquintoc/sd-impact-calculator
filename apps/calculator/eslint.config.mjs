import tseslint from 'typescript-eslint';
export default tseslint.config({
  ignores: ['dist/**', 'node_modules/**'],
}, {
  files: ['client/src/public-site/**/*.{ts,tsx}', 'client/src/workspace/WorkspaceProvider.tsx', 'client/src/components/SiteChrome.tsx', 'client/src/pages/Index.tsx'],
  languageOptions: { parser: tseslint.parser, parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } },
  plugins: { '@typescript-eslint': tseslint.plugin },
  rules: { 'no-debugger': 'error', 'no-duplicate-imports': 'error', 'no-unreachable': 'error', '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
});
