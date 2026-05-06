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

  // '*.{json,jsonc}': ['biome check --staged'],
  // '.github/workflows/**/*.y(a?)ml': [
  //   'zizmor --no-exit-codes',
  // ],

  'package-lock.json': [
    'lockfile-lint --path package-lock.json --validate-https --allowed-hosts npm',
  ],

  '*.{ts,tsx,(m|c)js,jsx}': (/** @type {string[]} */ files) => {
    return [`biome check --no-errors-on-unmatched ${files.join(' ')}`]
  },

  '*.yaml': ['yamllint -c .yamllint.yml'],

  // '*.{scss,css}': ['stylelint --fix', "prettier --write"],

  // '*.{png,jpeg,jpg,gif,svg}': [
  //   'imagemin-lint-staged' // @davidsneighbour/imagemin-lint-staged
  // ],

  // '!(CHANGELOG)**/*.{md,markdown}': [
  //   'markdownlint-cli2',
  //   'npm run lint:vale'
  // ],

  // '**/*.ts?(x)': () => [
  //   'tsc -p tsconfig.json --noEmit', "prettier --write"
  // ],

  // 'layouts/**/*.*': [
  //   './bin/hugo/refactor layouts'
  // ],

  // '**/*.*': [
  //   'npx secretlint'
  // ]

  '*.jsonnet': [
    'jsonnetfmt -i *.jsonnet',
  ],
}
