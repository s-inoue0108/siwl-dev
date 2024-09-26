import { z, defineCollection, reference } from 'astro:content';

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(reference('tag')).optional(),
    publishDate: z.date(),
    updateDate: z.date().optional(),
    relatedArticle: z.array(reference('blog')).optional(),
  }),
});

const tagCollection = defineCollection({
  type: 'data',
  schema: z.object({
    isDraft: z.boolean().default(false),
    name: z.string(),
  }),
});

const linkCollection = defineCollection({
  type: 'data',
  schema: z.object({
    isDraft: z.boolean().default(false),
    name: z.string(),
    description: z.string().optional(),
    url: z.string(),
  }),
});

export const collections = {
  'article': articleCollection,
  'tag': tagCollection,
  "link": linkCollection,
};