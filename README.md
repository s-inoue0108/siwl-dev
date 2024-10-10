# SIWL.dev

![SIWL.dev](https://siwl.dev/siwl-logo.svg)

- [https://siwl.dev](https://siwl.dev)
- [Cloudflare Dashboard](https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b)

# 記事を書く

1. プロジェクトのターミナルで以下を実行します：

```bash
$ siwl add -f <filename>
```

2. 開発サーバを起動します：

```bash
$ pnpm run dev
```

3. `src/content/<filename>.md` のスキーマと内容を編集します。

4. 記事を公開設定にします：

```bash
$ siwl publish -f <filename>
```

5. 変更を反映します：

```bash
$ git add .
$ git commit -m "edit: <filename>"
$ git push origin main
# あるいは
$ siwl-deploy
```

# ルーティング

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

**実行：**

```bash
$ pnpm run siwl <action> -f <filename> -m <model>
```

## シェルスクリプトによる実行

以下のエイリアスを `~/.bash_profile` に記載することで、`.cli/siwl.sh` を実行することができます。

```bash
alias siwl="source <local-dir>/.cli/siwl.sh"
```

**実行：**

```bash
$ siwl <action> -f <filename> -m <model>
```

## CLI コマンド

プロジェクト内の任意のディレクトリから実行可能です。

### 利用可能な `<model>`

| model    | description                    | filetype |
| :------- | :----------------------------- | :------- |
| article  | ブログの記事を扱います。       | MARKDOWN |
| tag      | ブログのタグを扱います。       | YAML     |
| bookmark | ブックマークリンクを扱います。 | YAML     |

> [!TIP] Tip
> `-m <model>` へ何も指定していない場合や、typo の場合は `article` モデルを参照します。

### `<action>`

| action       | option                     | description                                                                                                |
| :----------- | :------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `add\|new`   | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を作成し、スキーマを初期化します。                             |
| `rm\|delete` | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を削除します。                                                 |
| `draft`      | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を下書きにもどします。                                         |
| `publish`    | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を公開設定にし、`article` の場合はタイムスタンプを更新します。 |
| `ls\|list`   | `-m <model>`               | `src/content/<model>/` を公開状態を含めて一覧表示します。                                                  |

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
