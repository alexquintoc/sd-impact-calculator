import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
mkdirSync('.local/tests', { recursive: true });
await build({ entryPoints: ['apps/calculator/client/src/workspace/WorkspaceProvider.test.ts'], bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', outfile: '.local/tests/provider.test.cjs' });
const result = spawnSync(process.execPath, ['--test', '.local/tests/provider.test.cjs'], { stdio: 'inherit' });
process.exitCode = result.status ?? 1;
