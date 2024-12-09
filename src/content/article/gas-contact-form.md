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

## reCAPTCHA の用意

GAS アプリケーションとの通信を [Google reCAPTCHA](https://www.google.com/recaptcha/about/) (`v3`) にフィルタリングします。次の URL へアクセスし、reCAPTCHA 認証のためのサイトキーとシークレットキーを取得します。

> [!tip]
>
> 開発サーバーからのリクエストを検証したい場合、`localhost` からの認証をするためのキーを別途取得しておくとよいです。

キー情報は環境変数に保存します。

```dotenv:.env
PUBLIC_SITE_KEY=****************
SECRET_KEY=****************
```

Astro では、`PUBLIC_` プレフィックスをつけた変数のみをクライアントサイドで利用できます。サイトキーはクライアントサイドから参照するため、つけておきます。

https://docs.astro.build/ja/guides/environment-variables/


## Astro サーバーサイドの実装

Astro のエンドポイントを用いて、reCAPTCHA サーバーに検証リクエスト、次いで GAS アプリケーションにリクエストを送るサーバーを実装します。

### SSR アダプターの導入

Astro `v4` では SSR（On-demand Rendering）を利用するために、ホスト先のランタイム環境に対応したアダプターを用意する必要があります。今回は Cloudflare のアダプターを用います（他にも Vercel や Netlify 向けのアダプターがあります）。

```bash:インストール
$ npm astro add cloudflare
```

`astro.config.mjs` に次の内容を追記します。

```js:astro.config.mjs
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  // ...
  output: "hybrid",
  adapter: cloudflare(),
})
```

> [!important] Astro v5 の場合
>
> Astro `v5` ではレンダリングオプション `hybrid` が[削除されたようです](https://docs.astro.build/en/guides/upgrade-to/v5/#removed-hybrid-rendering-mode)。SSG ベースのプロジェクトの一部で SSR を利用するためには、代わりに `static` オプションを利用します。

### エンドポイントの実装

フォームからの入力を受け取るエンドポイントを `src/pages/` に作成します。

https://docs.astro.build/ja/guides/endpoints/