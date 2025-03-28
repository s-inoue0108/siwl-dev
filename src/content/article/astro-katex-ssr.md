---
isDraft: false
isLimited: false
title: Astro で KaTeX をプリレンダリングする
category: tech
tags: [astro, ts]
description: Astro で remark/rehype を用いずに KaTeX をレンダリングする実装を行いました。
publishDate: 2024-10-17T00:00:00+09:00
updateDate: 2025-01-07T23:33:39+09:00
relatedArticles: []
---

```bash:インストール
npm i katex
```

## KaTeX の SSR

KaTeX には数式表現を HTML 文字列に変換する `katex.renderToString` API が用意されています。

https://katex.org/docs/api#server-side-rendering-or-rendering-to-a-string

以上を用いると、ヘッドレス CMS から返却された HTML など、remark/rehype を用いない場合でも KaTeX をプリレンダリングすることができます。

## 実装

HTML をパースするために `cheerio` を利用します。

https://github.com/cheeriojs/cheerio

```bash:インストール
npm i cheerio
```

```ts
import { load } from "cheerio";

// CMS から返ってきた HTML 文字列で初期化する
let $ = load(html);
```

### レンダリング処理

デリミタ（区切り文字）で囲われた部分の文字列のみレンダリングするようにします。インラインであれば `$`、別行立てには `$$` を用います。

> [!important]
> 
> インラインと別行立てのデリミタ処理がバッティングしてはいけないため、`$$ $$` に囲まれた部分を抽出する正規表現は、`$` にマッチングしないように `[^\$]+` を用います。
> また、先に別行立てをレンダリングすることで、別行立てがインラインとしてレンダリングされることを防ぎます。

```ts
import katex from "katex";

// 先に別行立てをレンダリング
const renderedDisplayText = $.html().replaceAll(/\$\$[^\$]+\$\$/g, (text: string) => {
	return katex.renderToString(text.replaceAll("$", "").replaceAll(/(<br>|<\\br>|<br \/>|&nbsp;|amp;)/g, ""), { output: "html", displayMode: true });
});

// インラインをレンダリング
const renderedText = renderedDisplayText.replaceAll(/\$[^\$]+\$/g, (text: string) => {
  return katex.renderToString(text.replaceAll("$", "").replaceAll(/(<br>|<\\br>|<br \/>|&nbsp;|amp;)/g, ""), { output: "html", displayMode: false });
});
```

### code タグのエスケープ

`<code>` 内のテキストはデリミタとなる `$` が使用される可能性が高く、しかもレンダリングされると困ります。Cheerio を利用して `<code>` でラップされたテキストを取り出し、一時的に保持してレンダリング後に差し戻す処理を実装します。

```ts
// <code> のテキストを抽出
const innerTexts: string[] = [];
$("code").each((_, elm) => {
  innerTexts.push($(elm).text());
  $(elm).text("");
});

/*
 * レンダリング
 */

// 再び初期化
$ = load(renderedText);

// <code>にテキストを差し戻す
$("code").each((idx, elm) => {
	$(elm).text(innerTexts[idx]);
});
```

### HTML のレンダリング

```astro
---
import "katex/dist/katex.min.css";   // CSS

/*
 * レンダリング
 */

const renderedHtml = $.html();
---

<div set:html={renderedHtml} />
```

## おまけ：CSR による実装

以上の実装は KaTeX の [Auto-render Extension](https://katex.org/docs/autorender) を代わりに使うことで簡単に達成できます。
Astroの場合、Client で 処理する JS は `<script>` 内に記述します。

```astro:src/pages/article/[slug].astro
---
// .....
---
<script>
  import { renderMathInElement } from "katex/dist/contrib/auto-render";

  document.addEventListener("DOMContentLoaded", () => {
    renderMathInElement(document.body, {
      delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
      ],
      ignoredTags: ["code"],
    });
  });
</script>
```

## Usage

```tex
$$
\lim_{n \to \infty} \frac{1}{n} \sum_{k=0}^{n-1} f \left( \frac{k}{n} \right) = \int_{0}^{1} f(x) dx
$$
```

$$
\lim_{n \to \infty} \frac{1}{n} \sum_{k=0}^{n-1} f \left( \frac{k}{n} \right) = \int_{0}^{1} f(x) dx
$$