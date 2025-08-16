---
isDraft: false
isLimited: false
title: URL をリンクカードに変換する Remark プラグインを作る
category: tech
tags: [ts, markdown, astro]
description: "外部ページ URL から OGP 情報を取得してリンクカードを生成する remark プラグインを実装しました。"
publishDate: 2025-08-16T23:30:21+09:00
updateDate: 2025-08-17T00:52:41+09:00
relatedArticles: []
---

remark を使用して URL 文字列をリンクカードに変換するライブラリとして [`remark-link-card`](https://github.com/gladevise/remark-link-card/) があります。非常に便利なライブラリですが、以下の点をどうにかできないかと思っていました。

- `img` タグのレンダリングにおける fallback 処理ができない
- favicon を Google の API から取得しているため画質がガビガビ

以上の問題を解決するため、URL からリンクカードを生成する remark プラグインを自前で作成しました。

## ライブラリ

- `unist-util-visit: 5.0.0`
- `@types/mdast: 4.0.4`
- `open-graph-scraper: 6.10.0`
- `tailwindcss: 3.4.13`

Tailwind CSS を使うと組みあがった HTML 要素に直接スタイルを当てることができます。

## 実装

コードは `remark-link-card` をかなり参考にしています。

https://github.com/gladevise/remark-link-card/blob/main/index.js

### mdast ノードのパース

```ts:remark-bare-link.ts
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import ogs from "open-graph-scraper";

export default function remarkBareLink() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node, index) => {

      // <p> タグの子要素が1つであるかどうか判定
      if (node.children.length !== 1 || !index) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      // 子要素の処理
      visit(paragraphNode, 'text', (textNode) => {
        // URL であるかどうかを判定
        const urls = textNode.value.match(
          /(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/g
        );

        if (!urls || urls.length !== 1) return;

        // OGP データを fetch する Promise
        transformer.push(async () => {
          const ogp = await fetchOgp(urls[0]);

          // リンクカード HTML のレンダリング
          const linkCard = generateLinkCard(ogp);
          const linkCardNode = {
            type: "html",
            value: linkCard,
          }

          // 差し替え
          tree.children.splice(index, 1, linkCardNode as { type: "text", value: string });
        });
      });
    });

    // Promise を処理
    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-bare-link] Error: ${error}`);
    }
  }
}
```

remark では `visit` 関数をネストさせていくことによって HTML のノードを表現します。今回の実装では `<p>` タグをターゲットとし、その子要素が独立したテキスト要素である場合に処理を当てます。
\
テキストが URL 文字列であるかどうかを正規表現で判定し、URL である場合に fetcher 関数に渡します。返却された HTML 要素で `<p>` タグを丸ごと置き換えます。

### fetcher

```ts:remark-bare-link.ts
interface OgpData {
  url: string;
  resUrl: string;
  sitename: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
};

const fetchOgp = async (url: string): Promise<OgpData> => {

  const data = {
    url: url,
    resUrl: "",
    sitename: "",
    title: "",
    description: "",
    image: "",
    favicon: "",
  }

  try {
    // ogp 取得
    const { result } = await ogs({ url });

    // 画像 URL のバリデーション
    const image = await validateImageUrl(result.ogImage?.[0]?.url ?? "");
    const favicon = await validateFaviconUrl(url, result.favicon ?? "");

    data.resUrl = result.ogUrl ?? "";
    data.sitename = result.ogSiteName ?? "";
    data.title = result.ogTitle ?? "";
    data.description = result.ogDescription ?? "";
    data.image = image;
    data.favicon = favicon;

    return data;
  } catch (error) {
    console.error(`[remark-bare-link] Error: ${error}`);
    return data;
  }
};
```

OGP 情報は `open-graph-scraper` の `ogs` を用いることで簡単に取得できます。

### img タグのレンダリング制御

```ts:remark-bare-link.ts
const validateImageUrl = async (image: string) => {
  if (!image || image === "") return "";

  // バリデーション
  try {
    const res = await fetch(image, { method: "GET" });
    const contentType = res.headers.get("content-type");

    if (res.ok && contentType?.startsWith("image/")) {

      // URL が長すぎる場合は base64 encode
      if (image.length > 1000) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:${contentType};base64,${base64}`
      }

      return image;
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
}
```

`ogs` から OGP Image の情報を取得できなかった場合、`img` タグのレンダリングをあきらめてほかの HTML ノードに置き替えられるようにします。このバリデーション関数は `ogs` が返却した画像 URL にもう一度リクエストを送ってバリデーションを行います[^1]。
\
また、画像 URL は正常に返却されるものの、URL が長すぎて結局レンダリングがうまくいかない場合がありました。そのような画像は Base64 にエンコードして埋め込むことにします。

[^1]: コードの雑さには目を瞑っていただけると嬉しいです...

### favicon の取得

```ts:remark-bare-link.ts
const validateFaviconUrl = async (url: string, favicon: string) => {
  if (!favicon || favicon === "") return "";

  let reqUrl;

  // パスの差分吸収
  if (/^https?:\/\//.test(favicon)) {
    reqUrl = favicon;
  } else if (favicon.startsWith("/")) {
    reqUrl = `${new URL(url).origin}${favicon}`;
  } else {
    reqUrl = `${new URL(url).origin}/${favicon}`;
  }

  // バリデーション
  try {
    const res = await fetch(reqUrl, {
      method: "GET",
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      },
    });

    const contentType = res.headers.get("content-type");

    if (res.ok && contentType?.startsWith("image/")) {
      return res.url;
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
};
```

オリジナルは `ogs` がレスポンスした favicon の URL に関係なく Google の API (`https://www.google.com/s2/favicons?domain=XXXXX`) から favicon を拾っていますが、今回の実装では `ogs` の URL を利用します。

favicon の URL が絶対パスで帰ってくる場合と、origin からの相対パスで帰ってくる場合があるので、その差分をうまく吸収します。

### renderer

取得した OGP 情報をもとにリンクカードの HTML をレンダリングします。

```ts:remark-bare-link.ts
const generateLinkCard = (data: OgpData): string => {
  const { url, resUrl, sitename, title, description, image, favicon } = data;

  const dom =
    `<div>
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        ...
      </a>
    </div>
  `
  return dom
}
```

スタイリングは Tailwind CSS で行っています。他のプラグインを使っている場合、衝突を避けるために `div` タグを使ったりクラスや id を当てたりするなどの工夫が有効です。

### 完成したコード

https://gist.github.com/s-inoue0108/8ef62da4a88ccdbb0d139af65c660d39

## Astro で使う

`astro.config.mjs` にプラグインを渡します。

```js:astro.config.mjs
import { defineConfig } from "astro/config";
import remarkBareLink from "./src/plugins/remark-bare-link";

export default defineConfig({
  // ...

  remarkPlugins: [
  	// ...,
  	remarkBareLink,
  ],
});
```

`<a>` タグに他のプラグインを当てている場合、渡す順序に気を付けましょう（一番最後がいいと思います）。
