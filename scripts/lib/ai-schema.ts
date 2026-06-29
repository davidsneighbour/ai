import { z } from "zod";

/**
 * Shared input field schema used by prompts and skills.
 */
export const InputFieldSchema = z.object({
	required: z.boolean().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
});

/**
 * Shared external reference schema used by all AI asset front matter.
 */
export const ReferenceSchema = z
	.object({
		name: z.string().min(1).optional(),
		src: z.url({ protocol: /^https?$/ }).meta({ pattern: "^https?:\\/\\/" }),
		note: z.string().min(1).optional(),
	})
	.strict();

export const ReferencesSchema = z.array(ReferenceSchema).min(1).optional();

/**
 * VS Code custom agent schema.
 */
export const AgentSchema = z
	.object({
		description: z
			.string()
			.min(1)
			.describe("Short description shown in the Chat view agent picker."),
		name: z
			.string()
			.min(1)
			.regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)
			.optional()
			.describe("Display name shown in the Chat view agent picker."),
		"argument-hint": z
			.string()
			.min(1)
			.optional()
			.describe("Hint text shown in the chat input field for this agent."),
		tools: z
			.array(z.string())
			.optional()
			.describe("Tools or tool sets available to this agent."),
		agents: z
			.array(z.string())
			.optional()
			.describe("Subagents that can be delegated to by this agent."),
		model: z.string().optional().describe("Language model used by this agent."),
		handoffs: z
			.array(z.string())
			.optional()
			.describe("Agents this agent can hand off to."),
		target: z
			.string()
			.optional()
			.describe("Target surface where this agent is available."),
		id: z.string().min(1).optional(),
		title: z.string().min(1).optional(),
		version: z.string().optional(),
		references: ReferencesSchema,
	})
	.strict();

/**
 * Prompt schema.
 */
export const PromptSchema = z
	.object({
		description: z
			.string()
			.min(1)
			.optional()
			.describe("A short description of the prompt."),
		name: z
			.string()
			.min(1)
			.regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/)
			.describe(
				"The canonical prompt identifier, used after typing / in chat.",
			),
		"argument-hint": z
			.string()
			.min(1)
			.optional()
			.describe(
				"Hint text shown in the chat input field to guide users on how to interact with the prompt.",
			),
		agent: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The agent used for running the prompt: ask, agent, plan, or the name of a custom agent. By default, the current agent is used. If tools are specified, the default agent is agent.",
			),
		model: z
			.string()
			.optional()
			.describe(
				"The language model used when running the prompt. If not specified, the currently selected model in model picker is used.",
			),
		tools: z
			.array(z.string())
			.optional()
			.describe(
				"A list of tool or tool set names that are available for this prompt. Can include built-in tools, tool sets, MCP tools, or tools contributed by extensions. To include all tools of an MCP server, use the <server name>/* format.",
			),

		type: z.enum(["agent", "task", "review", "system"]).optional(),
		skills: z.array(z.string()).optional(),
		strict: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		version: z.string().optional(),
		inputs: z.record(z.string(), InputFieldSchema).optional(),
		references: ReferencesSchema,
	})
	.strict();

/**
 * Instruction schema.
 */
export const InstructionSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.optional()
			.describe("Display name shown in the UI. Defaults to the file name."),
		description: z
			.string()
			.min(1)
			.optional()
			.describe("Short description shown on hover in the Chat view."),
		applyTo: z
			.string()
			.optional()
			.describe(
				"Glob pattern that defines which files the instructions apply to automatically, relative to the workspace root. Use ** to apply to all files. If not specified, the instructions are not applied automatically, but you can still add them manually to a chat request.",
			),
		title: z.string().min(1).optional(),
		version: z.string().optional(),
		source: z.string().optional(),
		references: ReferencesSchema,
	})
	.strict();

/**
 * Skill schema.
 */
export const SkillSchema = z
	.object({
		id: z.string().min(1),
		title: z.string().min(1),
		type: z.literal("skill").optional(),
		description: z.string().min(1),
		version: z.string().optional(),
		tags: z.array(z.string()).optional(),
		inputs: z.record(z.string(), InputFieldSchema).optional(),
		// installable-skill extended fields
		name: z.string().min(1).optional(),
		category: z.string().optional(),
		triggers: z.array(z.string()).optional(),
		input_types: z.array(z.string()).optional(),
		output_types: z.array(z.string()).optional(),
		strict: z.boolean().optional(),
		references: ReferencesSchema,
	})
	.strict();

/**
 * Documentation schema.
 */
export const DocSchema = z
	.object({
		id: z.string().min(1),
		title: z.string().min(1),
		description: z.string().min(1),
		tags: z.array(z.string()).optional(),
		version: z.string().optional(),
		references: ReferencesSchema,
	})
	.strict();

/**
 * Registry item kinds.
 */
export type RegistryItemKind =
	| "agent"
	| "prompt"
	| "skill"
	| "instruction"
	| "doc";

/**
 * Allowed frontmatter keys per kind.
 */
export const AllowedKeys: Record<RegistryItemKind, Set<string>> = {
	agent: new Set([
		"description",
		"name",
		"argument-hint",
		"tools",
		"agents",
		"model",
		"handoffs",
		"target",
		"id",
		"title",
		"version",
		"references",
	]),
	prompt: new Set([
		"description",
		"name",
		"argument-hint",
		"agent",
		"model",
		"tools",
		"type",
		"skills",
		"strict",
		"tags",
		"version",
		"inputs",
		"references",
	]),
	instruction: new Set([
		"name",
		"description",
		"applyTo",
		"title",
		"version",
		"source",
		"references",
	]),
	skill: new Set([
		"id",
		"name",
		"title",
		"type",
		"description",
		"version",
		"tags",
		"inputs",
		"category",
		"triggers",
		"input_types",
		"output_types",
		"strict",
		"references",
	]),
	doc: new Set(["id", "title", "description", "tags", "version", "references"]),
};

export type AgentFrontmatter = z.infer<typeof AgentSchema>;
export type PromptFrontmatter = z.infer<typeof PromptSchema>;
export type SkillFrontmatter = z.infer<typeof SkillSchema>;
export type DocFrontmatter = z.infer<typeof DocSchema>;
export type InstructionFrontmatter = z.infer<typeof InstructionSchema>;
