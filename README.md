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

# SIWL Contents CLI

コンテンツ管理を行うための CLI です。`/cli` に実行ファイルがあります。

```bash
$ siwl <action> <filename> <model>
```

## `<model>`

`/content/config.ts` にスキーマ定義があります。

| modal      | description                                                                  | filetype |
| :--------- | :--------------------------------------------------------------------------- | :------- |
| `article`  | ブログ記事を扱います。                                                       | MARKDOWN |
| `tag`      | ブログのタグを扱います。                                                     | YAML     |
| `bookmark` | Web ページのブックマークを扱います。                                         | YAML     |
| `work`     | ポートフォリオページの制作物を扱います。                                     | YAML     |
| `fixed`    | プライバシーポリシー、ニュースレターなど、固定表示するコンテンツを扱います。 | MARKDOWN |

> [!TIP]
> 何も指定していない場合は `article` を参照します。

## `<action>`

### 共通のもの

以下のコマンドは `<model>` `<filename>` を **_指定せず_** 実行します。
開発サーバの起動、公開設定の反映などがあります。

| action   | description                                                                                                                                                     |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serve`  | 開発サーバを起動し、localhost にアクセスします。                                                                                                                |
| `deploy` | `edit` リモートブランチにすべての変更内容を反映し、`main` ブランチにマージします。[^1] 自動でデプロイを実行し、新しいアプリケーションインスタンスを作成します。 |
| `log`    | 変更履歴を表示します。                                                                                                                                          |
| `help`   | ヘルプを表示します。                                                                                                                                            |

[^1]: `git switch edit -> git add . -> git commit -m "edit: message" -> git push origin edit -> git switch main -> git merge edit -> git push origin main -> git switch edit`

### 引数をとるもの

以下のコマンドは `<model>` や `<filename>` を **_指定して_** 実行します。
コンテンツの追加・削除・編集などのコマンドがあります。

| action                        | description                                                                                                                                                  |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add <filename> <model>`      | `/content/<model>/` に `<filename>.md` または `<filename>.yaml` を追加し、スキーマを初期化します。                                                           |
| `remove <filename> <model>`   | `/content/<model>/` から `<filename>.md` または `<filename>.yaml` を削除します。                                                                             |
| `open <filename> <model>`     | `<filename>.md` または `<filename>.yaml` を Visual Studio code で開きます。                                                                                  |
| `draft <filename> <model> `   | `<filename>.md` または `<filename>.yaml` の `isDraft` プロパティを `true` に変更し、下書き設定に戻します。                                                   |
| `publish <filename> <model> ` | `<filename>.md` または `<filename>.yaml` の `isDraft` プロパティを `false` に変更し、公開設定にします。`updateDate` プロパティのタイムスタンプを更新します。 |
| `list <model>`                | `<model>` を一覧表示します。下書き設定になっているコンテンツはハイライト表示します。                                                                         |

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
