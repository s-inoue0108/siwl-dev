---
isDraft: true
title: Astro, Giscus で静的サイトにコメント機能をつける
category: tech
tags: [astro, ts, js]
description: Astro による静的サイトにコメント機能をつけました。その内容をまとめます。
publishDate: 2025-01-01T18:09:24+09:00
updateDate: 2025-01-01T18:09:24+09:00
relatedArticles: []
---

## Giscus

**Giscus** は GitHub の Discussion 機能を利用することで、SSG ベースのサイトにコメント機能を付与する仕組みです。Web サイトが Git によって管理されていれば、簡単に導入することができます。

https://giscus.app/ja

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

...
<Comments />
...
---
```

## ダークモード対応

この Issue が参考になります。

https://github.com/giscus/giscus/issues/336

`<script>` タグを埋め込むのではなく、`document.createElement("script")` で動的にスクリプトを生成するのがミソです。