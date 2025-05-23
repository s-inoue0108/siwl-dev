// collection data using for client component

import { getCollection } from "astro:content";

export const allArticles = await getCollection("article", ({ data }) => {
  return import.meta.env.PROD ? !data.isDraft && !data.isLimited : true;
});

export const allCategories = await getCollection("category");

export const allTags = await getCollection("tag", ({ data }) => {
  return import.meta.env.PROD ? !data.isDraft : true;
});