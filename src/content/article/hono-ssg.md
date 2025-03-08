---
isDraft: false
isLimited: false
title: Hono v4 で Markdown を SSG する
category: tech
tags: [ts, hono, markdown]
description: "話題の Web フレームワーク Hono の、v4 へのメジャーバージョンアップで追加された機能である SSG を試してみました。"
publishDate: 2025-03-08T23:06:42+09:00
updateDate: 2025-03-08T23:42:49+09:00
relatedArticles: []
---

## Hono

https://github.com/honojs/hono

https://hono.dev/

```bash:インストール
npm create hono@latest
```

[Vite ベース](https://zenn.dev/yusukebe/articles/92fcb0ef03b151) で動きます。

## Markdown パーサを作る

unified ベースのフロントマター付き Markdown パーサを作ります。

```ts
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import yaml from 'yaml';
import { type ArticleFrontmatter } from '../api/articles';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkToc from 'remark-toc';
// @ts-ignore
import rlc from "remark-link-card";
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeExternalLinks from 'rehype-external-links';

export const parser = unified()
  .use(remarkParse)                // markdown to mdast
  // mdast
  .use(remarkFrontmatter)          // frontmatter
  .use(remarkExtractFrontmatter, { // frontmatter metadata
    yaml: yaml.parse,
    name: "frontmatter",
  })
  .use(remarkToc)                  // table of contents
  .use(remarkGfm)                  // gfm
  .use(remarkBreaks)               // line break
  .use(rlc)                        // link card
  .use(remarkMath)                 // math equation
  .use(remarkRehype,               // mdast to hast
    { allowDangerousHtml: true }
  )
  // hast
  .use(rehypeRaw)                  // allow raw html
  .use(rehypeKatex)                // math equation
  .use(rehypeExternalLinks)        // external link
  .use(rehypePrettyCode)           // syntax highlight
  .use(rehypeStringify,            // hast to html
    { allowDangerousHtml: true }
  )
  .freeze();
```

これを使用して、Markdown から記事のデータを生成する API を定義します。

```ts
import fs from "fs/promises";
import { parser } from "../utils/parser";

export const getArticles = async () => {
  const markdowns = await fs.readdir("articles/");
  const articles: Article[] = [];

  for (const markdown of markdowns) {
    const markdownFile = await fs.readFile(`articles/${markdown}`, 'utf8');
    const body = await parser.process(markdownFile);
    const id = markdown.replace(/(?:\.md|\.markdown)$/, "");

    articles.push({
      id,
      body,
    });
  }

  return articles;
}

export const getArticle = async (id: string) => {
  const markdownFile = await fs.readFile(`articles/${id}.md`, 'utf8');
  const body = await parser.process(markdownFile);
  const id = markdown.replace(/(?:\.md|\.markdown)$/, "");

  return { id, body };
}
```

## Router

パスパラメータを含むルーティングは次のようにして構築できます（Hono は[ルーティング](https://hono-ja.pages.dev/docs/concepts/routers)が大きな魅力です！）。`ssgParams` ヘルパーは、Next.js での `getStaticPath` に相当する静的 path のジェネレータです。

```tsx:index.tsx
import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import { getArticles, getArticle } from "./api/articles";
import ArticleBody from "./components/ArticleBody";

const blogPage = new Hono().basePath("/blog");

blogPage.get(
	"/articles/:id{^[a-z0-9-]+$}",
	ssgParams(async () => {
		const articles = await getArticles();
		return articles.map((article) => ({ id: article.id }));
	}),

	async (c) => {
		const id = c.req.param("id");
		const article = await getArticle(id);
		if (!article) {
			return c.notFound();
		}
		return c.render(
			<main>
        <ArticleBody article={article} />
      </main>
		);
	}
);
```

## JSX

Hono では JSX も使用できます。`ArticleBody` コンポーネントを作成し、パースした HTML を埋め込みます。

```tsx:ArticleBody.tsx
import type { FC } from "hono/jsx";
import { type Article } from "../api/articles";

interface Props {
	article: Article;
}

const ArticleBody: FC<Props> = ({ article }) => {
	return (
		<section>
			<div dangerouslySetInnerHTML={{ __html: article.body }} />
		</section>
	);
};

export default ArticleBody;
```

## SSG 設定

以前は SSG 用の `ts` ファイルを作る必要があったようですが、最近は [`@hono/vite-ssg`](https://www.npmjs.com/package/@hono/vite-ssg) プラグインをインストールすると事足りるようです。

```ts:vite.config.ts
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import ssg from '@hono/vite-ssg'

export default defineConfig({
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    ssg(),
  ]
})
```

## ビルド

```bash
npm run build
```