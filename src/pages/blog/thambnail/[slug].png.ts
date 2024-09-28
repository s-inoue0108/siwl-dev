import { type APIContext } from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { getImageResponse } from "../../../utils/api/generateImage";

export const getStaticPaths = async () => {
  const articles = await getCollection("article", ({ data }) => {
    return import.meta.env.PROD ? data.isDraft === false : true;
  });

  if (!articles || articles.length === 0) return [];

  return articles.map((article) => ({
    params: { slug: article.slug },
  }));
};


export const GET = async ({ params }: APIContext) => {
  const article = await getEntry("article", params.slug as CollectionEntry<"article">["slug"]);

  const imageResponse = await getImageResponse(article.data.title);
  return imageResponse;
};