---
isDraft: false
title: Astro, Giscus で静的サイトにコメント機能をつける
category: tech
tags: [astro, ts, js]
description: GitHub の Discussions 機能を利用してコメント機能を提供する Giscus を利用して、Astro による静的サイトにコメント機能をつけました。その内容をまとめます。
publishDate: 2025-01-01T18:09:24+09:00
updateDate: 2025-01-01T19:39:25+09:00
relatedArticles: []
---

## Giscus とは

### 導入

**Giscus** は GitHub の Discussions 機能を利用することで、SSG ベースのサイトにコメント機能を付与する仕組みです。Web サイトが Git によって管理されていれば、簡単に導入することができます。

https://giscus.app/ja

ただし、リポジトリが以下の条件を満たしている必要があります：

1. Public リポジトリである
2. [Giscus](https://github.com/apps/giscus) アプリがインストールされている
3. リポジトリの Discussions 機能が有効化されている

### 基本の実装

上のサイトからもろもろの設定を行ったら、Giscus の埋め込みを行うための `<script>` がわかります。次のような Astro コンポーネントを作成します：

```astro:src/components/Comments.astro
---

---

<section>
  <script src="https://giscus.app/client.js"
    data-repo="[リポジトリを記述]"
    data-repo-id="[リポジトリIDを記述]"
    data-category="[カテゴリ名を記述]"
    data-category-id="[カテゴリIDを記述]"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="dark_dimmed"
    data-lang="ja"
    data-loading="lazy"
    crossorigin="anonymous"
    async>
  </script>
</section>
```

これを記事詳細ページを生成する `[slug].astro` で読み込むだけです：

```astro:src/pages/[slug].astro
---
import Comments from "../../components/Comments.astro";
---

...
<Comments />
...
```

## ダークモード対応

この Issue が参考になります。

https://github.com/giscus/giscus/issues/336

`<script>` タグを埋め込むのではなく、`document.createElement("script")` で動的にスクリプトを生成するのがミソです。`theme` は `localStorage` から引っ張ってこれるようにします。

```astro:src/components/Comments:astro
---

---

<div id="comments" />

<script>
	const theme = window.localStorage.getItem("theme") ?? (document.documentElement.classList.contains("dark") ? "dark" : "light");
	const giscusTheme = theme === "dark" ? "theme_dark" : "theme_light";

	const giscusAttributes: GiscusAttributes = {
		src: "https://giscus.app/client.js",
		"data-repo": "s-inoue0108/siwl-dev",
		"data-repo-id": "R_kgDOM92vyA",
		"data-category": "Announcements",
		"data-category-id": "DIC_kwDOM92vyM4Clpeq",
		"data-mapping": "pathname",
		"data-reactions-enabled": "1",
		"data-emit-metadata": "0",
		"data-theme": giscusTheme,
		"data-lang": "ja",
		"data-loading": "lazy",
		crossorigin: "anonymous",
		async: "",
	};

	const giscusScript = document.createElement("script");
	Object.entries(giscusAttributes).forEach(([key, value]) => giscusScript.setAttribute(key, value));
	document.getElementById("comments")!.appendChild(giscusScript);
</script>
```

また、Tailwind CSS で `class` スタイルのダークモードを導入している場合は、[こちらの記事](https://www.maxpou.fr/blog/giscus-with-astro/)の実装が参考になると思います。