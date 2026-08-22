import type { Config } from "release-it";

interface ConventionalCommit {
	type?: string;
	scope?: string;
	notes?: unknown[];
}

const minorTypes = new Set(["feat", "prompts", "instructions"]);

const patchTypes = new Set([
	"prompts",
	"instructions",
	"fix",
	"docs",
	"build",
	"chore",
	"ci",
	"perf",
	"refactor",
	"revert",
	"test",
]);

const config = {
	npm: {
		publish: false,
	},
	git: {
		requireCleanWorkingDir: true,
		commit: true,
		// biome-ignore lint/suspicious/noTemplateCurlyInString: release-it expands this placeholder.
		commitMessage: "chore(release): v${version}",
		commitArgs: ["--no-verify"],
		tag: true,
		// biome-ignore lint/suspicious/noTemplateCurlyInString: release-it expands this placeholder.
		tagName: "v${version}",
		push: true,
		pushArgs: ["--follow-tags"],
	},
	github: {
		release: true,
		// biome-ignore lint/suspicious/noTemplateCurlyInString: release-it expands this placeholder.
		releaseName: "v${version}",
		skipChecks: true,
		tokenRef: "GITHUB_TOKEN_CONTENT_PRIVATE",
		comments: {
			submit: true,
		},
	},
	plugins: {
		"@release-it/conventional-changelog": {
			infile: "CHANGELOG.md",
			preset: {
				name: "conventionalcommits",
				commitUrlFormat:
					"https://github.com/davidsneighbour/ai/commit/{{hash}}",
				compareUrlFormat:
					"https://github.com/davidsneighbour/ai/compare/{{previousTag}}...{{currentTag}}",
				types: [
					{ type: "feat", section: "Features" },
					{ type: "fix", section: "Bug Fixes" },
					{ type: "prompts", section: "Prompts" },
					{ type: "instructions", section: "Instructions" },
					{ type: "docs", section: "Documentation" },
					{ type: "build", section: "Build" },
					{ type: "ci", section: "Linting and Maintenance" },
					{ type: "chore", section: "Chores" },
					{ type: "refactor", section: "Refactoring" },
					{ type: "revert", section: "Reverts" },
					{ type: "test", section: "Tests" },
				],
			},
			whatBump(commits: ConventionalCommit[]) {
				let level: 2 | 1 | 0 | null = null;

				for (const commit of commits) {
					const notes = Array.isArray(commit.notes) ? commit.notes : [];
					const type = typeof commit.type === "string" ? commit.type : "";
					const scope = typeof commit.scope === "string" ? commit.scope : "";

					if (notes.length > 0) {
						return {
							level: 0,
							reason: "There are BREAKING CHANGES.",
						};
					}

					if (minorTypes.has(type) && scope !== "fix") {
						level = 1;
						continue;
					}

					if (level === null && patchTypes.has(type)) {
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
							? "There are minor-level commits."
							: "There are patch-level changes.",
				};
			},
		},
	},
} satisfies Config;

export default config;
