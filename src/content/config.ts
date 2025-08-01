import { z, defineCollection, reference } from "astro:content";

// 記事
const articleCollection = defineCollection({
  type: "content",
  schema: z.object({
    isDraft: z.boolean().default(true),
    isLimited: z.boolean().default(false),
    title: z.string(),
    description: z.string().optional(),
    category: reference("category").default("tech"),
    tags: z.array(reference("tag")).optional(),
    publishDate: z.date(),
    updateDate: z.date().optional(),
    relatedArticles: z.array(reference("article")).optional(),
  }),
});

// 記事カテゴリ
const categoryCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    colors: z.object({
      text: z.string(),
      textHover: z.string(),
      bg: z.string(),
      bgHover: z.string(),
      border: z.string(),
      borderHover: z.string(),
    }),
  })
});

// タグ
const tagCollection = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    isDraft: z.boolean().default(true),
    name: z.string(),
    belong: reference("category").default("tech"),
    icon: image().optional(),
  }),
});

// 固定コンテンツ
const fixedCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.date(),
    updateDate: z.date().optional(),
  })
})

// ブックマーク
const bookmarkCollection = defineCollection({
  type: "data",
  schema: z.object({
    isDraft: z.boolean().default(false),
    name: z.string(),
    url: z.string(),
  }),
});

// 制作物
const workCollection = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    description: z.string().optional(),
    url: z.string(),
    suburl: z.string().optional(),
    keywords: z.array(z.string()),
    image: image().optional(),
  }),
});

// 業績
const achievementCollection = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    description: z.string().optional(),
    url: z.string(),
    suburl: z.string().optional(),
    keywords: z.array(z.string()),
    image: image().optional(),
  }),
});

export const collections = {
  "article": articleCollection,
  "category": categoryCollection,
  "tag": tagCollection,
  "fixed": fixedCollection,
  "bookmark": bookmarkCollection,
  "work": workCollection,
  "achievement": achievementCollection
};