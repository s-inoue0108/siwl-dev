# SIWL.dev

![SIWL.dev](https://siwl.dev/siwl-logo.svg)

[https://siwl.dev](https://siwl.dev)

# ルーティング

## ホスティング

[Cloudflare](https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b)

## プロジェクトディレクトリの構成

## ページルート

`/utils/route.ts` の `_ROUTE_CONFIG` でページルートとメタ情報を管理しています。以下は例です。

```ts
[
	{
		name: "Home",
		matchers: [/^\/$/],
		rootpath: "/",
		description: "プログラミングについての情報を発信しています。",
		subsets: [...],
	},
];
```

# CLI

コンテンツ管理を行うための CLI です。

## パッケージマネージャによる実行

Node.js/TypeScript/CommanderJS で作成しており、`/.cli/siwl.ts` が実行ファイルです。

`package.json` にあるエイリアス `tsx .cli/siwl.ts` を実行します。`npm`, `yarn`, `pnpm` などを用います。

```bash
$ pnpm run siwl <action> -flag1 <cmd1> -flag2 <cmd2>
```

## シェルスクリプトによる実行

以下のエイリアスを `~/.bash_profile` に記載することで、`.cli/siwl.sh` を実行することができます。

> [!WARNING] Warning
> VSCode の `code` コマンド, `pnpm` および `git` を使用します。

```bash
alias siwl="source <local-dir>/.cli/siwl.sh"
```

```bash
$ siwl <action> -flag1 <cmd1> -flag2 <cmd2>
```

## 汎用コマンド

> [!WARNING] Warning
> `serve`, `deploy` はシェルスクリプトからしか実行できません。

| action                | description                                                                                                                                                           |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev\|serve -h`       | 開発サーバを起動します。`-h` オプションをつけるとエクスポートを実行します。                                                                                           |
| `build`               | ローカルでビルドを実行します。                                                                                                                                        |
| `preview`             | ローカルで実行したビルドをプレビューします。                                                                                                                          |
| `deploy -m <message>` | `edit` リモートブランチにすべての変更内容を反映し、`main` ブランチにマージします。[^1] 本番環境へのデプロイを実行し、新しいアプリケーションインスタンスを作成します。 |
| `help\|-h`            | ヘルプを表示します。                                                                                                                                                  |

[^1]: `git switch edit -> git add . -> git commit -m "edit: <message>" -> git push origin edit -> git switch main -> git merge edit -> git push origin main -> git switch edit`

## Content Management CLI

> [!WARNING] Warning
> `open` はシェルスクリプトからしか実行できません。

| action                                | description                                                                                                                                                  |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add\|new -f <filename> -m <model>`   | `/content/<model>/` に `<filename>.md` または `<filename>.yaml` を追加し、スキーマを初期化します。                                                           |
| `rm\|remove -f <filename> -m <model>` | `/content/<model>/` から `<filename>.md` または `<filename>.yaml` を削除します。                                                                             |
| `open -f <filename> -m <model>`       | `<filename>.md` または `<filename>.yaml` を Visual Studio code で開きます。                                                                                  |
| `draft -f <filename> -m <model>`      | `<filename>.md` または `<filename>.yaml` の `isDraft` プロパティを `true` に変更し、下書き設定に戻します。                                                   |
| `publish -f <filename> -m <model>`    | `<filename>.md` または `<filename>.yaml` の `isDraft` プロパティを `false` に変更し、公開設定にします。`updateDate` プロパティのタイムスタンプを更新します。 |
| `ls\|list -m <model>`                 | `<model>` を一覧表示します。下書き設定になっているコンテンツはハイライト表示します。                                                                         |

## `<model>`

`/content/config.ts` にスキーマ定義があります。

| modal      | description                          | filetype |
| :--------- | :----------------------------------- | :------- |
| `article`  | ブログ記事を扱います。               | MARKDOWN |
| `tag`      | ブログのタグを扱います。             | YAML     |
| `bookmark` | Web ページのブックマークを扱います。 | YAML     |

> [!TIP] Tip
> `-m <model>` へ何も指定していない場合は `article` モデルを参照します。

# Markdown の構文

GitHub-Flavored Markdown をベースに、拡張構文を導入しています。

## リンク

### リンクカード

行に URL のみを記載すると自動でリンクカードに変換します。

```md
https://example.com

<https://example.com>
```

### インラインリンク

通常の名前付きリンクや、行に URL 以外の文字列がある場合にはリンクカードに変換されません。また、相対パスで始まるリンクは内部リンクとなります。

```md
[例](https://example.com) はインラインリンクです。

https://example.com はインラインリンクです。

[これは相対パスなので、内部](/blog/1) インラインリンクです。
```

## コードブロック

````md
```language:title
"This is the CODE."
```
````

> [!NOTE]
> 利用可能な `language` の一覧 - https://shiki.matsu.io/languages

## 数式

```md
<!--インライン-->

$ f(x) = e^x $

<!--ディスプレイ-->

$$
\mathcal{L}[f(t)](s) = \int_0^\infty f(t)e^{-st} dt.
$$
```

マクロ $ \\RR $ はボールド体の R を出力します。
