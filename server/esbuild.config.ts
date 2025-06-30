import { build } from 'esbuild';
import { unlinkSync, existsSync } from 'fs';

const outfile = 'build/index.js';

if (existsSync(outfile)) {
  unlinkSync(outfile);
}

build({
  entryPoints: ['server/src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: outfile,
  external: [],
  tsconfig: './server/tsconfig.json'
}).catch(() => process.exit(1));