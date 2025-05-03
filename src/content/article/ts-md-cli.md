---
isDraft: false
isLimited: false
title: Markdown 管理 CLI を作って npm パッケージ化する
category: tech
tags: [ts, markdown]
description: "ローカルリポジトリの Markdown エントリを管理する CLI を TypeScript で制作し、npm パッケージ化して公開してみました。"
publishDate: 2025-05-04T01:05:29+09:00
updateDate: 2025-05-04T01:47:51+09:00
relatedArticles: [article-export-cmd]
---

TypeScript ライブラリ制作の勉強の一環で、`@s-inoue0108/mdcli` というパッケージを作っています。このツールの紹介がてら、npm パッケージとして開発するうえで躓いた部分を忘れないうちに残しておこうと思います。

https://www.npmjs.com/package/@s-inoue0108/mdcli

## 参考

`zenn-cli` という OSS をかなり参考にしました。これは [Zenn](https://zenn.dev) が提供する CLI ツールで、記事をローカルの Markdown で管理できるようになります。

https://www.npmjs.com/package/zenn-cli

今回のパッケージは、`zenn-cli` からプレビュー機能（フロントエンド部分）を除いた形をモデルとして開発しています。

また、パッケージングにあたってはこれらの記事を参考にしています。

https://zenn.dev/k0kishima/articles/d75f4dc5bd1a26

https://zenn.dev/wakamsha/articles/about-publishing-node-packages

## tsconfig.json をつくる

今回はトランスパイル済みの JS のみを npm のリポジトリに流したいので、`dist` ディレクトリにビルド生成物を吐くように設定します。

```json:tsconfig.json
"outDir": "./dist"
```


## npm パッケージ化する

`package.json` を生成して、中身をいじります。

```bash
npm init
```

```json:package.json
{
  "name": "@s-inoue0108/mdcli",
  "version": "0.1.0",
  "description": "hogehoge",
  "main": "dist/mdcli.js",
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build",
  },
  "type": "module",
  "author": "Shota Inoue",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "dist"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/s-inoue0108/mdcli.git"
  },
}
```

一部のフィールドの説明を書いておきます。

- `main`
  - エントリポイントとなるファイルのパスを記述します。
- `scripts`
  - npm スクリプトを設定します。`prepare` を設定しておくと、`npm install` や `npm publish` 時に設定値のスクリプトが実行されます（`publish` 時にトランスパイルしてくれる）。
- `files`
  - `npm install` 時に `node_modules` にロードするディレクトリやファイルを指定できます（ホワイトリスト）。対照的に、`.npmignore` はブラックリストの役割を果たします。パッケージ使用時はトランスパイル済みの JS しかいらないためこのような設定にしています。

ひととおり設定したら、以下のコマンドでパッケージを公開します。`@username` で名前空間をつけてあるパッケージは `access=public` でのみ公開できます。

```bash
npm publish
```

### package.json の細かい設定

`zenn-cli` は `npm install` した直後に `npx zenn init` で初期化することができます。このような挙動は、エントリポイントとなる JS へのエイリアスを `package.json` の `bin` フィールドに貼ることで達成できます。

```json:package.json
"bin": {
  "zenn": "dist/mdcli.js"
}
```

また、`package.json` はユーザー定義のフィールドを使用することもできます。