import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const postSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(180).regex(slugRegex, 'Slug must be kebab-case'),
  excerpt: z.string().min(10).max(300),
  content: z.record(z.any()),
  contentHtml: z.string().max(100000).optional().default(''),
  featuredImage: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED'])
});
