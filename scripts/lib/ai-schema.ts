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
        id: z.string().min(1),
        title: z.string().min(1),
        type: z.enum(['agent', 'task', 'review', 'system']),
        description: z.string().min(1),
        model: z.string().optional(),
        tools: z.array(z.string()).optional(),
        skills: z.array(z.string()).optional(),
        strict: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        version: z.string().optional(),
        inputs: z.record(z.string(), InputFieldSchema).optional(),
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
export type RegistryItemKind = 'prompt' | 'skill' | 'doc';

/**
 * Allowed frontmatter keys per kind.
 */
export const AllowedKeys: Record<RegistryItemKind, Set<string>> = {
    prompt: new Set([
        'id',
        'title',
        'type',
        'description',
        'model',
        'tools',
        'skills',
        'strict',
        'tags',
        'version',
        'inputs',
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
    doc: new Set(['id', 'title', 'description', 'tags', 'version']),
};

export type PromptFrontmatter = z.infer<typeof PromptSchema>;
export type SkillFrontmatter = z.infer<typeof SkillSchema>;
export type DocFrontmatter = z.infer<typeof DocSchema>;