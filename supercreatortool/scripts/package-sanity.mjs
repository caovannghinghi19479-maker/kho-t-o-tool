import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'apps/electron/dist/main.js',
  'apps/electron/dist/preload.js',
  'apps/server/dist/index.js',
  'apps/renderer/dist/index.html',
  'workers/main.py',
  'electron-builder.yml'
];

const missing = required.filter((p) => !fs.existsSync(path.join(root, p)));
if (missing.length) {
  console.error('Packaging sanity check failed. Missing build artifacts:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

const builderConfig = fs.readFileSync(path.join(root, 'electron-builder.yml'), 'utf-8');
for (const expected of ['productName: SuperCreatorTool', 'win:', 'mac:']) {
  if (!builderConfig.includes(expected)) {
    console.error(`Packaging sanity check failed. electron-builder.yml missing: ${expected}`);
    process.exit(1);
  }
}

console.log('Packaging sanity check passed. All required artifacts are present.');
