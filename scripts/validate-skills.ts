#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const DEFAULT_SKILLS_ROOT = "ai/skills";

const SkillFrontmatterSchema = z
    .object({
        id: z.string().min(1),
        name: z.string().min(1).optional(),
        description: z.string().min(1).max(1024).optional(),
    })
    .passthrough();

type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;

interface CliOptions {
    root: string;
    verbose: boolean;
    help: boolean;
}

interface SkillValidationResult {
    skillDirectory: string;
    skillName: string;
    skillFile: string;
    frontmatter: SkillFrontmatter;
}

class ValidationError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

/**
 * Prints command usage.
 *
 * @param scriptName - The current script name.
 */
function printHelp(scriptName: string): void {
    console.log(`Usage:
  ${scriptName} --root ai/skills
  ${scriptName} --root skills --verbose

Options:
  --root <path>     Skills root directory. Default: ${DEFAULT_SKILLS_ROOT}
  --verbose         Print validated skill paths.
  --help            Show this help message.

Validation rules:
  - The skills root must exist.
  - Each direct child directory is treated as one skill.
  - Each skill directory must contain SKILL.md.
  - SKILL.md must start with YAML frontmatter.
  - Frontmatter must contain an id field.
  - The skill directory name must match the frontmatter id.
  - If name exists, it must match id.
  - id must match /^[a-z0-9-]+$/.
`);
}

/**
 * Parses CLI arguments.
 *
 * @param argv - Process argument list without node and script path.
 * @returns Parsed CLI options.
 */
function parseCliOptions(argv: readonly string[]): CliOptions {
    const options: CliOptions = {
        root: DEFAULT_SKILLS_ROOT,
        verbose: false,
        help: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];

        switch (argument) {
            case "--root": {
                const value = argv[index + 1];

                if (value === undefined || value.startsWith("--")) {
                    throw new ValidationError("Missing value for --root.");
                }

                options.root = value;
                index += 1;
                break;
            }

            case "--verbose": {
                options.verbose = true;
                break;
            }

            case "--help": {
                options.help = true;
                break;
            }

            default: {
                throw new ValidationError(`Unknown option: ${argument}`);
            }
        }
    }

    return options;
}

/**
 * Extracts YAML frontmatter and Markdown body from a SKILL.md file.
 *
 * @param content - Raw SKILL.md content.
 * @param filePath - File path used for error messages.
 * @returns Parsed frontmatter and Markdown body.
 */
function extractFrontmatter(content: string, filePath: string): {
    frontmatter: unknown;
    body: string;
} {
    if (!content.startsWith("---\n")) {
        throw new ValidationError(`${filePath}: SKILL.md must start with YAML frontmatter.`);
    }

    const closingFenceIndex = content.indexOf("\n---", 4);

    if (closingFenceIndex === -1) {
        throw new ValidationError(`${filePath}: YAML frontmatter is missing its closing --- fence.`);
    }

    const yamlContent = content.slice(4, closingFenceIndex).trim();
    const body = content.slice(closingFenceIndex + 4).trim();

    if (yamlContent.length === 0) {
        throw new ValidationError(`${filePath}: YAML frontmatter must not be empty.`);
    }

    if (body.length === 0) {
        throw new ValidationError(`${filePath}: Markdown body must not be empty.`);
    }

    try {
        return {
            frontmatter: parseYaml(yamlContent),
            body,
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        throw new ValidationError(`${filePath}: Failed to parse YAML frontmatter: ${message}`);
    }
}

/**
 * Validates one skill directory.
 *
 * @param skillDirectory - Absolute path to the skill directory.
 * @returns Validated skill metadata.
 */
async function validateSkillDirectory(skillDirectory: string): Promise<SkillValidationResult> {
    const skillName = path.basename(skillDirectory);
    const skillFile = path.join(skillDirectory, "SKILL.md");
    const skillFileStat = await stat(skillFile).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        throw new ValidationError(`${skillDirectory}: Missing SKILL.md. ${message}`);
    });

    if (!skillFileStat.isFile()) {
        throw new ValidationError(`${skillFile}: SKILL.md must be a file.`);
    }

    const content = await readFile(skillFile, "utf8");
    const extracted = extractFrontmatter(content, skillFile);

    const parsed = SkillFrontmatterSchema.safeParse(extracted.frontmatter);

    if (!parsed.success) {
        throw new ValidationError(`${skillFile}: Invalid frontmatter: ${z.prettifyError(parsed.error)}`);
    }

    const frontmatter = parsed.data;

    if (!/^[a-z0-9-]+$/.test(frontmatter.id)) {
        throw new ValidationError(
            `${skillFile}: Frontmatter id "${frontmatter.id}" must match /^[a-z0-9-]+$/.`,
        );
    }

    if (skillName !== frontmatter.id) {
        throw new ValidationError(
            `${skillFile}: Skill directory "${skillName}" must match frontmatter id "${frontmatter.id}".`,
        );
    }

    if (frontmatter.name !== undefined && frontmatter.name !== frontmatter.id) {
        throw new ValidationError(
            `${skillFile}: Optional frontmatter name "${frontmatter.name}" must match id "${frontmatter.id}".`,
        );
    }

    return {
        skillDirectory,
        skillName,
        skillFile,
        frontmatter,
    };
}

/**
 * Validates all direct child skill directories in a skills root.
 *
 * @param rootDirectory - Skills root directory.
 * @param verbose - Whether to print validated paths.
 */
async function validateSkills(rootDirectory: string, verbose: boolean): Promise<void> {
    const absoluteRoot = path.resolve(process.cwd(), rootDirectory);
    const rootStat = await stat(absoluteRoot).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        throw new ValidationError(`Skills root does not exist: ${absoluteRoot}. ${message}`);
    });

    if (!rootStat.isDirectory()) {
        throw new ValidationError(`Skills root is not a directory: ${absoluteRoot}`);
    }

    const entries = await readdir(absoluteRoot, {
        withFileTypes: true,
    });

    const skillDirectories = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(absoluteRoot, entry.name))
        .sort((left, right) => left.localeCompare(right));

    if (skillDirectories.length === 0) {
        throw new ValidationError(`No skill directories found in: ${absoluteRoot}`);
    }

    const seenIds = new Set<string>();

    for (const skillDirectory of skillDirectories) {
        const result = await validateSkillDirectory(skillDirectory);

        if (seenIds.has(result.frontmatter.id)) {
            throw new ValidationError(`Duplicate skill id found: ${result.frontmatter.id}`);
        }

        seenIds.add(result.frontmatter.id);

        if (verbose) {
            console.log(`Validated: ${path.relative(process.cwd(), result.skillFile)}`);
        }
    }

    console.log(`Validated ${skillDirectories.length} skill(s) in ${path.relative(process.cwd(), absoluteRoot)}.`);
}

/**
 * Main entrypoint.
 */
async function main(): Promise<void> {
    const scriptName = path.basename(process.argv[1] ?? "validate-skills.ts");

    try {
        const options = parseCliOptions(process.argv.slice(2));

        if (options.help) {
            printHelp(scriptName);
            return;
        }

        await validateSkills(options.root, options.verbose);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        console.error(`Error: ${message}`);
        console.error("");
        printHelp(scriptName);
        process.exitCode = 1;
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    await main();
}