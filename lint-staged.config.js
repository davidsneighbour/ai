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
    }
};