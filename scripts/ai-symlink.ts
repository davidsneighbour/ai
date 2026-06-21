#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CONFIG = {
	sourcePath: path.join(os.homedir(), "github.com/davidsneighbour/ai/ai"),
	targetPath: path.join(os.homedir(), ".ai"),
	expectedSourceType: "directory",
	allowRoot: process.env.ALLOW_ROOT_POSTINSTALL_SYMLINK === "1",
};

class SymlinkError extends Error {
	constructor(message, details = {}) {
		super(message);
		this.name = "SymlinkError";
		this.details = details;
	}
}

function reportOk(message) {
	console.log(`ok: ${message}`);
}

function reportError(error) {
	console.error("error: could not ensure ~/.ai symlink");

	if (error instanceof SymlinkError) {
		console.error(error.message);

		for (const [key, value] of Object.entries(error.details)) {
			console.error(`${key}: ${value}`);
		}

		return;
	}

	if (error instanceof Error) {
		console.error(error.message);
		return;
	}

	console.error(String(error));
}

async function pathExists(filePath) {
	try {
		await fs.lstat(filePath);
		return true;
	} catch (error) {
		if (error && error.code === "ENOENT") {
			return false;
		}

		throw error;
	}
}

async function assertNotUnsafeRootRun() {
	if (typeof process.getuid !== "function") {
		return;
	}

	if (process.getuid() !== 0) {
		return;
	}

	if (CONFIG.allowRoot) {
		return;
	}

	throw new SymlinkError(
		"Refusing to run as root. In postinstall scripts this commonly creates /root/.ai instead of the user's ~/.ai.",
		{
			hint: "Run npm install without sudo, or set ALLOW_ROOT_POSTINSTALL_SYMLINK=1 if this is intentional.",
			sourcePath: CONFIG.sourcePath,
			targetPath: CONFIG.targetPath,
		},
	);
}

async function assertSourceIsValid() {
	let stats: Awaited<ReturnType<typeof fs.lstat>>;

	try {
		stats = await fs.lstat(CONFIG.sourcePath);
	} catch (error) {
		if (error && error.code === "ENOENT") {
			throw new SymlinkError(
				"The source path does not exist. Refusing to create a broken symlink.",
				{
					sourcePath: CONFIG.sourcePath,
				},
			);
		}

		throw error;
	}

	if (CONFIG.expectedSourceType === "directory" && !stats.isDirectory()) {
		throw new SymlinkError(
			"The source path exists, but it is not a directory.",
			{
				sourcePath: CONFIG.sourcePath,
			},
		);
	}
}

async function getComparableRealPath(filePath) {
	return fs.realpath(filePath);
}

async function assertExistingSymlinkIsCorrect() {
	const linkTarget = await fs.readlink(CONFIG.targetPath);
	const absoluteLinkTarget = path.isAbsolute(linkTarget)
		? linkTarget
		: path.resolve(path.dirname(CONFIG.targetPath), linkTarget);

	let existingRealPath: string;

	try {
		existingRealPath = await getComparableRealPath(absoluteLinkTarget);
	} catch (_error) {
		throw new SymlinkError(
			"The target already exists as a symlink, but it points to a missing or inaccessible path.",
			{
				targetPath: CONFIG.targetPath,
				currentLinkTarget: linkTarget,
				expectedLinkTarget: CONFIG.sourcePath,
			},
		);
	}

	const expectedRealPath = await getComparableRealPath(CONFIG.sourcePath);

	if (existingRealPath !== expectedRealPath) {
		throw new SymlinkError(
			"The target already exists as a symlink, but it points somewhere else.",
			{
				targetPath: CONFIG.targetPath,
				currentLinkTarget: linkTarget,
				expectedLinkTarget: CONFIG.sourcePath,
			},
		);
	}

	reportOk(`${CONFIG.targetPath} already points to ${CONFIG.sourcePath}`);
}

async function createSymlink() {
	try {
		await fs.symlink(CONFIG.sourcePath, CONFIG.targetPath, "dir");
		reportOk(`created ${CONFIG.targetPath} -> ${CONFIG.sourcePath}`);
	} catch (error) {
		if (error && error.code === "EEXIST") {
			await ensureSymlink();
			return;
		}

		throw error;
	}
}

async function ensureSymlink() {
	await assertSourceIsValid();

	const targetExists = await pathExists(CONFIG.targetPath);

	if (!targetExists) {
		await createSymlink();
		return;
	}

	const targetStats = await fs.lstat(CONFIG.targetPath);

	if (!targetStats.isSymbolicLink()) {
		throw new SymlinkError(
			"The target path already exists and is not a symlink. Refusing to replace it.",
			{
				targetPath: CONFIG.targetPath,
				expectedLinkTarget: CONFIG.sourcePath,
			},
		);
	}

	await assertExistingSymlinkIsCorrect();
}

async function main() {
	await assertNotUnsafeRootRun();
	await ensureSymlink();
}

main().catch((error) => {
	reportError(error);
	process.exitCode = 1;
});
