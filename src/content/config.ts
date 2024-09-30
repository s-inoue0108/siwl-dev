import { z, defineCollection, reference } from "astro:content";

const articleCollection = defineCollection({
  type: "content",
  schema: z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    description: z.string().optional(),
    category: reference("category").default("tech"),
    tags: z.array(reference("tag")).optional(),
    publishDate: z.date(),
    updateDate: z.date().optional(),
    relatedArticle: z.array(reference("blog")).optional(),
  }),
});

const categoryCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  })
});

const tagCollection = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    isDraft: z.boolean().default(false),
    name: z.string(),
    belong: reference("category").default("tech"),
    icon: image().optional(),
  }),
});

const bookmarkCollection = defineCollection({
  type: "data",
  schema: z.object({
    isDraft: z.boolean().default(false),
    name: z.string(),
    description: z.string().optional(),
    url: z.string(),
  }),
});

export const collections = {
  "article": articleCollection,
  "category": categoryCollection,
  "tag": tagCollection,
  "bookmark": bookmarkCollection,
};