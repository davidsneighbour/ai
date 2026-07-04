import assert from "node:assert/strict";
import { type ExecFileException, execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { fileURLToPath } from "node:url";
import {
	formatGitignorePath,
	parseLinkDefinitions,
	requireSafeRelativePath,
	SymlinkError,
} from "./ai-symlink.ts";

interface LinkerRun {
	readonly exitCode: number;
	readonly stderr: string;
	readonly stdout: string;
}

const scriptPath = fileURLToPath(new URL("./ai-symlink.ts", import.meta.url));
const repoRoot = path.dirname(path.dirname(scriptPath));
const sourceAgentGuidelinesPath = path.join(repoRoot, "AGENTS.md");
const sourceAgentsPath = path.join(repoRoot, "agents");
const sourceSkillsPath = path.join(repoRoot, "skills");

async function makeTempDir(t: TestContext, prefix: string): Promise<string> {
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), `${prefix}-`));

	t.after(async () => {
		await fs.rm(directory, { force: true, recursive: true });
	});

	return directory;
}

function runLinker(args: readonly string[], cwd: string): Promise<LinkerRun> {
	return new Promise((resolve) => {
		execFile(
			process.execPath,
			[scriptPath, ...args],
			{
				cwd,
			},
			(error: ExecFileException | null, stdout, stderr) => {
				resolve({
					exitCode: getExitCode(error),
					stderr,
					stdout,
				});
			},
		);
	});
}

function getExitCode(error: ExecFileException | null): number {
	if (error === null) {
		return 0;
	}

	if (typeof error.code === "number") {
		return error.code;
	}

	return 1;
}

async function assertSkillsLinkPointsToSource(linkPath: string): Promise<void> {
	await assertDirectoryLinkPointsToSource(linkPath, sourceSkillsPath);
}

async function assertDirectoryLinkPointsToSource(
	linkPath: string,
	sourcePath: string,
): Promise<void> {
	const stats = await fs.lstat(linkPath);
	const linkTarget = await fs.readlink(linkPath);

	assert.equal(stats.isSymbolicLink(), true);
	assert.equal(path.isAbsolute(linkTarget), false);
	assert.equal(await fs.realpath(linkPath), await fs.realpath(sourcePath));
}

async function assertFileLinkPointsToSource(
	linkPath: string,
	sourcePath: string,
): Promise<void> {
	const stats = await fs.lstat(linkPath);
	const linkTarget = await fs.readlink(linkPath);

	assert.equal(stats.isSymbolicLink(), true);
	assert.equal(path.isAbsolute(linkTarget), false);
	assert.equal(await fs.realpath(linkPath), await fs.realpath(sourcePath));
}

test("parseLinkDefinitions reads the selected linking section", () => {
	const definitions = parseLinkDefinitions(
		{
			linking: {
				global: {
					skills: ".agents/skills",
				},
				local: {
					skills: [".workspace/skills", ".claude/skills"],
				},
			},
		},
		"local",
		"config.toml",
	);

	assert.deepEqual(definitions, [
		{
			sourceRelativePath: "skills",
			targetRelativePath: ".workspace/skills",
		},
		{
			sourceRelativePath: "skills",
			targetRelativePath: ".claude/skills",
		},
	]);
});

test("parseLinkDefinitions rejects empty target arrays", () => {
	assert.throws(
		() =>
			parseLinkDefinitions(
				{
					linking: {
						global: {
							skills: [],
						},
					},
				},
				"global",
				"config.toml",
			),
		SymlinkError,
	);
});

test("requireSafeRelativePath rejects paths that could escape the base", () => {
	for (const unsafePath of [
		"/tmp/skills",
		"C:/tmp/skills",
		"../skills",
		"./skills",
		"skills/..",
		"skills//codex",
		"~/skills",
		"skills/~codex",
		"skills/codex plugin",
		"skills\tcodex",
	]) {
		assert.throws(
			() => requireSafeRelativePath(unsafePath, "test path", "config.toml"),
			SymlinkError,
			unsafePath,
		);
	}
});

test("formatGitignorePath returns a gitignore-compatible target path", () => {
	assert.equal(
		formatGitignorePath(
			{
				action: "created",
				sourcePath: "/repo/skills",
				sourceRelativePath: "skills",
				sourceKind: "directory",
				targetPath: path.join("/workspace", ".agents", "skills"),
				targetRelativePath: ".agents/skills",
			},
			"/workspace",
		),
		".agents/skills/",
	);
});

test("formatGitignorePath keeps file target paths unsuffixed", () => {
	assert.equal(
		formatGitignorePath(
			{
				action: "created",
				sourcePath: "/repo/AGENTS.md",
				sourceRelativePath: "AGENTS.md",
				sourceKind: "file",
				targetPath: path.join("/workspace", ".agents", "agents.md"),
				targetRelativePath: ".agents/agents.md",
			},
			"/workspace",
		),
		".agents/agents.md",
	);
});

test("local mode creates configured symlinks", async (t) => {
	const cwd = await makeTempDir(t, "ai-linker-local");
	const agentsMdPath = path.join(cwd, ".agents", "agents.md");
	const agentsPath = path.join(cwd, ".agents", "agents");
	const linkPath = path.join(cwd, ".agents", "skills");
	const claudeSkillsPath = path.join(cwd, ".claude", "skills");
	const result = await runLinker(["local", "--verbose"], cwd);

	assert.equal(result.exitCode, 0, result.stderr);
	await assertFileLinkPointsToSource(agentsMdPath, sourceAgentGuidelinesPath);
	await assertDirectoryLinkPointsToSource(agentsPath, sourceAgentsPath);
	await assertSkillsLinkPointsToSource(linkPath);
	await assertSkillsLinkPointsToSource(claudeSkillsPath);
});

test("local mode recognises existing correct symlinks", async (t) => {
	const cwd = await makeTempDir(t, "ai-linker-existing");
	const linkPath = path.join(cwd, ".agents", "skills");

	assert.equal((await runLinker(["local"], cwd)).exitCode, 0);

	const result = await runLinker(["--mode", "local", "--verbose"], cwd);

	assert.equal(result.exitCode, 0, result.stderr);
	await assertSkillsLinkPointsToSource(linkPath);
});

test("local mode only replaces a mismatched symlink with force", async (t) => {
	const cwd = await makeTempDir(t, "ai-linker-force");
	const wrongTarget = await makeTempDir(t, "ai-linker-wrong-target");
	const linkPath = path.join(cwd, ".agents", "skills");

	await fs.mkdir(path.dirname(linkPath), { recursive: true });
	await fs.symlink(wrongTarget, linkPath, "dir");

	const noForceResult = await runLinker(["local"], cwd);

	assert.equal(noForceResult.exitCode, 1);
	assert.equal(await fs.realpath(linkPath), await fs.realpath(wrongTarget));

	const forceResult = await runLinker(["local", "--force", "--verbose"], cwd);

	assert.equal(forceResult.exitCode, 0, forceResult.stderr);
	await assertSkillsLinkPointsToSource(linkPath);
});
