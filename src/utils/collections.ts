import { getCollection } from "astro:content";

export const allArticles = await getCollection("article");
export const allTags = await getCollection("tag");