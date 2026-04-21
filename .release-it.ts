import type { Config } from 'release-it';

const config = {
  npm: {
    publish: false,
  },
  git: {
    requireCleanWorkingDir: true,
    commit: true,
    commitMessage: 'chore(release): v${version}',
    commitArgs: ['--no-verify'],
    tag: true,
    tagName: 'v${version}',
    push: true,
    pushArgs: ['--follow-tags'],
  },
  github: {
    release: true,
    releaseName: 'v${version}',
    skipChecks: true,
    tokenRef: 'GITHUB_TOKEN_CONTENT_PRIVATE',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      preset: {
        name: 'conventionalcommits',
        commitUrlFormat:
          'https://github.com/davidsneighbour/ai/commit/{{hash}}',
        compareUrlFormat:
          'https://github.com/davidsneighbour/ai/compare/{{previousTag}}...{{currentTag}}',
        types: [
          { type: 'content', section: 'Content' },
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'build', section: 'Build' },
          { type: 'chore', section: 'Chores' },
          { type: 'ci', section: 'CI' },
          { type: 'docs', section: 'Documentation' },
          { type: 'perf', section: 'Performance' },
          { type: 'refactor', section: 'Refactoring' },
          { type: 'revert', section: 'Reverts' },
          { type: 'style', section: 'Styles' },
          { type: 'test', section: 'Tests' },
        ],
      },
      writerOpts: {
        transform(commit: {
          subject?: string;
          raw: { committerDate?: string };
        }) {
          /*
          console.log(commit);
          {
            merge: null,
            revert: null,
            header: 'build(release): add date and author to changelog line',
            body: '',
            footer: null,
            notes: [],
            mentions: [],
            references: [],
            type: 'build',
            scope: 'release',
            subject: 'add date and author to changelog line',
            hash: '523a571d5c553fa1e6018f91bbde036d5bc2d37b',
            gitTags: ' (HEAD -> main)',
            committerDate: '2026-04-21',
            raw: {
              merge: null,
              revert: null,
              header: 'build(release): add date and author to changelog line',
              body: '',
              footer: null,
              notes: [],
              mentions: [],
              references: [],
              type: 'build',
              scope: 'release',
              subject: 'add date and author to changelog line',
              hash: '523a571d5c553fa1e6018f91bbde036d5bc2d37b',
              gitTags: ' (HEAD -> main)',
              committerDate: '2026-04-21 13:25:07 +0700'
            }
          }
          */
          const subject =
            typeof commit.subject === 'string' ? commit.subject : '';

          const date =
            typeof commit.raw.committerDate === 'string'
              ? commit.raw.committerDate
              : '';

          return {
            ...commit,
            subject: `${subject} (${date})`,
          };
        },
      },
      whatBump(commits: Array<{ type?: string; notes?: unknown[] }>) {
        let level: 2 | 1 | 0 | null = null;

        for (const commit of commits) {
          const notes = Array.isArray(commit.notes) ? commit.notes : [];
          const type = typeof commit.type === 'string' ? commit.type : '';

          if (notes.length > 0) {
            return {
              level: 0,
              reason: 'There are BREAKING CHANGES.',
            };
          }

          if (type === 'feat' || type === 'content') {
            level = 1;
            continue;
          }

          if (
            level === null &&
            ['fix', 'build', 'chore', 'ci', 'docs', 'perf', 'refactor', 'revert', 'style', 'test'].includes(type)
          ) {
            level = 2;
          }
        }

        if (level === null) {
          return false;
        }

        return {
          level,
          reason:
            level === 1
              ? 'There are feat/content commits.'
              : 'There are patch-level changes.',
        };
      },
    },
  },
} satisfies Config;

export default config;