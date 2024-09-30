import { getCollection } from "astro:content";

export const allTags = await getCollection("tag", ({ data }) => {
  return import.meta.env.PROD ? data.isDraft === false : true;
});
