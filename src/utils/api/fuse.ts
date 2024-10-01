import { type CollectionEntry } from "astro:content";
import Fuse from "fuse.js";
import { type FuseResult } from "fuse.js";

// Generate word segments with related article slugs
interface Segment {
  word: string;
  relateSlug: CollectionEntry<"article">["slug"];
}

export class SearchClient {
  private _articles: CollectionEntry<"article">[];

  constructor(articles: CollectionEntry<"article">[]) {
    this._articles = articles;
  }

  private getSegments = async (articles: CollectionEntry<"article">[]) => {
    const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
    const segments: Segment[] = [];

    articles.forEach(({ slug, data }) => {
      const wordsFromTitle = segmenter.segment(data.title);
      const wordsFromDescription = segmenter.segment(data.description ?? "");

      for (const data of wordsFromTitle) {
        if (data.isWordLike && data.segment.length > 1) {
          segments.push({ word: data.segment, relateSlug: slug });
        }
      }

      for (const data of wordsFromDescription) {
        if (data.isWordLike && data.segment.length > 1) {
          segments.push({ word: data.segment, relateSlug: slug });
        }
      }
    });

    // uniqueな配列
    const uniqueSegments = Array.from(
      new Map(segments.map((seg) => [JSON.stringify(seg), seg])).values()
    );

    return uniqueSegments;
  }

  private fuseClient = async (
    segments: Segment[],
    threshold: number = 0.2,
    minMatchCharLength: number = 2
  ): Promise<Fuse<Segment>> => {
    return new Fuse(segments, {
      keys: ["word"],
      threshold: threshold,
      minMatchCharLength: minMatchCharLength,
    });
  };

  createClient = async () => {
    const client = this.fuseClient(await this.getSegments(this._articles));
    return client;
  }

  getData = (hits: FuseResult<Segment>[]) => {
    const returnArticles: CollectionEntry<"article">[] = [];
    hits.forEach((hit) => {
      const filteredArticles = this._articles.filter((article) => {
        return article.slug === hit.item.relateSlug;
      });
      returnArticles.push(...filteredArticles);
    });
    return Array.from(
      new Map(returnArticles.map((article) => [JSON.stringify(article), article])).values()
    );
  };
}