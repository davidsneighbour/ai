import { z } from 'zod';

/**
 * Shared input field schema used by prompts and skills.
 */
export const InputFieldSchema = z.object({
    required: z.boolean().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
});

/**
 * Prompt schema.
 */
export const PromptSchema = z
    .object({
        description: z.string().min(1).optional().describe('A short description of the prompt.'),
        name: z.string().min(1).regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/).optional().describe('The name of the prompt, used after typing / in chat. If not specified, the file name is used.'),
        'argument-hint': z.string().min(1).optional().describe('Hint text shown in the chat input field to guide users on how to interact with the prompt.'),
        agent: z.string().min(1).optional().describe('The agent used for running the prompt: ask, agent, plan, or the name of a custom agent. By default, the current agent is used. If tools are specified, the default agent is agent.'),
        model: z.string().optional().describe('The language model used when running the prompt. If not specified, the currently selected model in model picker is used.'),
        tools: z.array(z.string()).optional().describe('A list of tool or tool set names that are available for this prompt. Can include built-in tools, tool sets, MCP tools, or tools contributed by extensions. To include all tools of an MCP server, use the <server name>/* format.'),

        // probably obsolete overthinking
        title: z.string().min(1),
        type: z.enum(['agent', 'task', 'review', 'system']),
        skills: z.array(z.string()).optional(),
        strict: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        version: z.string().optional(),
        inputs: z.record(z.string(), InputFieldSchema).optional(),
    })
    .strict();

/**
 * Instruction schema.
 */
export const InstructionSchema = z
    .object({
        name: z.string().min(1).regex(/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/).optional().describe('Display name shown in the UI. Defaults to the file name.'),
        description: z.string().min(1).optional().describe('Short description shown on hover in the Chat view.'),
        applyTo: z.string().optional().describe('Glob pattern that defines which files the instructions apply to automatically, relative to the workspace root. Use ** to apply to all files. If not specified, the instructions are not applied automatically, but you can still add them manually to a chat request.'),
    })
    .strict();

/**
 * Skill schema.
 */
export const SkillSchema = z
    .object({
        id: z.string().min(1),
        title: z.string().min(1),
        type: z.literal('skill'),
        description: z.string().min(1),
        version: z.string().optional(),
        tags: z.array(z.string()).optional(),
        inputs: z.record(z.string(), InputFieldSchema).optional(),
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
    })
    .strict();

/**
 * Registry item kinds.
 */
export type RegistryItemKind = 'prompt' | 'skill' | 'instruction' | 'doc';

/**
 * Allowed frontmatter keys per kind.
 */
export const AllowedKeys: Record<RegistryItemKind, Set<string>> = {
    prompt: new Set([
        'description',
        'name',
        'argument-hint',
        'agent',
        'model',
        'tools',
        'title',
        'type',
        'skills',
        'strict',
        'tags',
        'version',
        'inputs',
    ]),
    instruction: new Set([
        'description',
        'applyTo',
    ]),
    skill: new Set([
        'id',
        'title',
        'type',
        'description',
        'version',
        'tags',
        'inputs',
    ]),
    doc: new Set([
        'id',
        'title',
        'description',
        'tags',
        'version'
    ]),
};

export type PromptFrontmatter = z.infer<typeof PromptSchema>;
export type SkillFrontmatter = z.infer<typeof SkillSchema>;
export type DocFrontmatter = z.infer<typeof DocSchema>;
export type InstructionFrontmatter = z.infer<typeof InstructionSchema>;
