import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const frontendRoot = resolve(__dirname, '..');
const repoRoot = resolve(frontendRoot, '..');

const defaultApiBaseUrl = '/api';
const envFiles = [
  resolve(repoRoot, '.env.dev'),
  resolve(repoRoot, '.env'),
  resolve(frontendRoot, '.env.dev'),
  resolve(frontendRoot, '.env'),
];

const parsedEnv = {};

for (const envPath of envFiles) {
  if (!existsSync(envPath)) {
    continue;
  }

  const file = readFileSync(envPath, 'utf-8');
  for (const rawLine of file.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const withoutQuotes = rawValue.replace(/^['"]|['"]$/g, '');
    parsedEnv[key] = withoutQuotes;
  }
}

const processApiBaseUrl = process.env.BACKEND_API_BASE_URL?.trim();
const localOrDefaultApiBaseUrl = parsedEnv.BACKEND_API_BASE_URL || defaultApiBaseUrl;

const apiBaseUrl = processApiBaseUrl || localOrDefaultApiBaseUrl;
const runtimeEnvPath = resolve(frontendRoot, 'src', 'app', 'core', 'runtime-env.ts');

const normalizedApiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
const content = `export const runtimeEnv = {
  apiBaseUrl: '${normalizedApiBaseUrl}',
} as const;
`;

mkdirSync(dirname(runtimeEnvPath), { recursive: true });
writeFileSync(runtimeEnvPath, content, 'utf-8');
