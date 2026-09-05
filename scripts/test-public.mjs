import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
await build({ entryPoints: ['apps/calculator/client/src/public-site/criteria.test.ts'], bundle: true, platform: 'node', format: 'cjs', tsconfig: 'apps/calculator/tsconfig.json', outfile: '.local/tests/public.test.cjs' });
const result = spawnSync(process.execPath, ['--test', '.local/tests/public.test.cjs'], { stdio: 'inherit' });
process.exitCode = result.status ?? 1;
