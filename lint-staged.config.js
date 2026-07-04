import path from 'node:path';

/**
 * Normalise staged file paths for shell command use.
 *
 * @param {string[]} files
 * @returns {string[]}
 */
function normaliseFiles(files) {
  return files.map((file) => path.relative(process.cwd(), file));
}

/**
 * Build a shell-safe quoted file list.
 *
 * @param {string[]} files
 * @returns {string}
 */
function quoteFiles(files) {
  return files.map((file) => `"${file.replaceAll('"', '\\"')}"`).join(' ');
}

/**
 * Determine whether the staged set contains AI-related files.
 *
 * @param {string[]} files
 * @returns {boolean}
 */
function hasAiFiles(files) {
  return files.some((file) => {
    const normalised = file.replaceAll('\\', '/');
    return (
      normalised.startsWith('ai/') ||
      normalised === 'scripts/ai.ts' ||
      normalised.startsWith('schemas/')
    );
  });
}

/**
 * @type {import('lint-staged').Configuration}
 *
 * lint-staged configuration.
 *
 * We keep this intentionally narrow:
 * - pre-commit runs staged-file tooling
 * - AI registry lint runs only when AI-related files are staged
 *
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': (files) => {
    const normalisedFiles = normaliseFiles(files);
    const commands = [];

    if (hasAiFiles(normalisedFiles)) {
      commands.push('node ./scripts/ai.ts lint');
    }

    return commands;
  },

  '*.{json,jsonc}': ['biome check --write --staged'],
  '.github/workflows/**/*.y(a?)ml': ['zizmor --no-exit-codes --fix'],
  'package-lock.json': [
    'lockfile-lint --path package-lock.json --validate-https --allowed-hosts npm',
  ],
  '*.{ts,tsx,(m|c)js,jsx}': [
    'biome check --write --staged --no-errors-on-unmatched',
  ],
  '*.y(a?)ml': ['yamllint -c .yamllint.yml'],
  '*.{scss,css}': ['stylelint --fix'],

  '!(CHANGELOG)**/*.{md,markdown}': ['markdownlint-cli2'],
  '**/*.ts?(x)': () => ['tsc-files --noEmit --pretty'],
  '**/*.*': ['secretlint --no-glob'],
}
