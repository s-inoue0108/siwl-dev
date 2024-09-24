import { z, defineCollection, reference } from 'astro:content';

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    isDraft: z.boolean(),
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    publishDate: z.number(),
    updateDate: z.number().optional(),
    relatedArticle: z.array(reference('blog')).optional(),
  }),
});

export const collections = {
  'article': articleCollection,
};

export type Collections = typeof collections;