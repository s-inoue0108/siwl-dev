---
isDraft: true
title: Astro SSR + Google Apps Script で静的サイトにお問い合わせフォームを実装する
category: tech
tags: [astro, solid, gas]
description: Astro の SSR 機能と Google Apps Script を利用して、お問い合わせフォームを実装します。
publishDate: 2024-12-08T17:54:26+09:00
updateDate: 2024-12-08T17:54:26+09:00
relatedArticles: []
---

## バージョン

- Astro `v4.15.9`
- @astrojs/cloudflare `v9.2.1`
- TypeScript `v5.6.2`

執筆時点で Astro `v5` がリリースされていますが、`v4` の環境です。また、@astrojs/cloudflare は Latest Release (`v12`) のものを用いるとデプロイに失敗するため、`v9` を用いています。

## Astro サーバーサイドの実装

Astro のエンドポイントを用いて、GAS アプリケーションにリクエストを送るサーバーを実装します。

https://docs.astro.build/ja/guides/endpoints/