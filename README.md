# SIWL.dev

![SIWL.dev](https://siwl.dev/siwl-logo.svg)

- [https://siwl.dev](https://siwl.dev)
- [Cloudflare Dashboard](https://dash.cloudflare.com/36267a6e8ba52f5b9b2f32b9ffd99e7b)
- [Contact Form](https://docs.google.com/forms/d/1Zxo_7-OUUfw8pjO1k-7yELuQrGw5I17Osp3IZnfc_LI/edit)
- [Zenn](https://zenn.dev/s_inoue0108)

## 記事の書き方

### 新しく記事を書く

1. 記事を追加します：

```bash
$ siwl -f <filename> add
```

2. 開発サーバを起動します：

```bash
$ siwl -d
# or
pnpm run dev
```

3. `src/content/article/<filename>.md` のスキーマと内容を編集します。

```bash
# current: src/content
$ code article/<filename>.md
```

4. 記事を公開設定にします：

```bash
$ siwl -f <filename> pub
```

5. 変更を反映します：

```bash
$ siwl -b <branch>
# or
$ git switch <branch>
$ git add .
$ git commit -m "edit article"
$ git push origin <branch>
$ git switch main
$ git merge <branch>
$ git push origin main
$ git switch <branch>
```

### 既存の記事を更新する

1. 記事の公開状態を更新します：

```bash
# 下書きにする
$ siwl -f <filename> dft
# 公開する
$ siwl -f <filename> pub
```

3. 開発サーバを起動します：

```bash
$ siwl -d
# or
pnpm run dev
```

4. 記事の内容を更新します：

```bash
# current: src/content
$ code article/<filename>.md
```

5. 変更を反映します：

```bash
$ siwl -b <branch>
# or
$ git switch <branch>
$ git add .
$ git commit -m "edit article"
$ git push origin <branch>
$ git switch main
$ git merge <branch>
$ git push origin main
$ git switch <branch>
```

## ルーティング

### ページルート

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

## CLI

### Content Management CLI

Node.js/TypeScript/CommanderJS で作成しており、`/.cli/siwl.ts` が実行ファイルです。

```bash
# using pnpm
$ pnpm run siwl <action> -opt
```

以上は NPM スクリプト `tsx /.cli/siwl.ts` を実行します。

#### 利用可能な `<model>`

| `<model>`  | description                  | filetype |
| :--------- | :--------------------------- | :------- |
| `article`  | ブログの記事                 | MARKDOWN |
| `tag`      | ブログのタグ                 | YAML     |
| `bookmark` | Webページのブックマーク      | YAML     |
| `work`     | ポートフォリオページの制作物 | YAML     |

> [!IMPORTANT]
> `<model>` が未指定あるいは typo の場合は `article` モデルを参照します。

#### 利用可能な `<action>`

| `<action>`     | `-opt`                     | description                                                                                                |
| :------------- | :------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `add\|new`     | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を作成し、スキーマを初期化します。                             |
| `remove\|rm`   | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を削除します。                                                 |
| `draft\|dft`   | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を下書きにもどします。                                         |
| `publish\|pub` | `-f <filename> -m <model>` | `src/content/<model>/<filename>.(md\|yaml)` を公開設定にし、`article` の場合はタイムスタンプを更新します。 |
| `list\|ls`     | `-m <model>`               | `src/content/<model>/` を公開状態を含めて一覧表示します。                                                  |
|                | `-h`                       | Content Management CLI のヘルプを表示します。                                                              |
|                | `-v`                       | Content Management CLI のバージョンを表示します。                                                          |

> [!TIP]
> `<action> -h` でコマンド毎のヘルプを表示します。

### Content Management CLI + 汎用オプション

`/.cli/siwl.ts` をフォークした `/.cli/siwl.sh` を実行します。

```bash
$ siwl -opt <action>
```

> [!IMPORTANT]
> 以上のコマンドを実行するためには、次のエイリアスを `~/.bashrc` に設定する必要があります。
> 
> ```bash
> alias siwl="source <local-dir>/.cli/siwl.sh"
> ```

このエイリアスは Content Management CLI のほかに、以下の汎用オプションを提供します。

| `-opt`                       | description                                                                              |
| :--------------------------- | :--------------------------------------------------------------------------------------- |
| `-d`                         | 開発サーバを起動します。                                                                 |
| `-b <branch>`                | `origin/<branch>`へ変更を push し、`origin/main` へマージします。                        |
| `-s`                         | 現在のローカルブランチの内容を `origin/main` の内容で同期します。                        |
| `-e <service> -f <filename>` | Markdown を `<service>` の形式へ変換し、エクスポートします。                             |
| `-h`                         | プロジェクトに関連する Web ページの情報と、Content Management CLI のヘルプを表示します。 |

## Markdown の構文

GitHub-Flavored Markdown をベースに、拡張構文を導入しています。

> [!NOTE]
> 詳細は https://siwl.dev/blog/articles/markdown-syntax-guide にあります。

> [!TIP]
> ZennのMarkdown記法: https://zenn.dev/zenn/articles/markdown-guide

### 見出し

```md
## レベル1
### レベル2
#### レベル3
```

> [!WARNING]
> `<h1>`, `<h5>`, `<h6>` は使用できません。

### リスト

#### 列挙

```md
- ul-1
- ul-2
  - ul-2-1
  - ul-2-2
```

#### 番号付き

```md
1. ol-1
2. ol-2
3. 1. ol-3-1
   2. ol-3-2
```

### インラインスタイル

#### 強調

```md
これは **強調** されます。
```

#### 取り消し線

```md
~取り消し線~ がつきます。

<!--or-->

~~取り消し線~~ がつきます。
```

#### イタリック

```md
これは *イタリック* になります。
```

### 文末脚注

```md
これは脚注です[^1]。

<!--footnote-->
[^1]: ここに脚注がきます。
```

### 区切り線

```md:区切り線
---
```

### リンク

#### むき出しのリンク

URLが独立した行にある場合にのみ変換されます。

```md
https://siwl.dev/blog/articles/renewal-note

<!--or-->

<https://siwl.dev/blog/articles/renewal-note>
```

#### インラインリンク

```md
[リニューアルノート](https://siwl.dev/blog/articles/renewal-note) はインラインリンクです。

https://siwl.dev/blog/articles/renewal-note はインラインリンクです。

[相対パスによるリンク](/blog/articles/renewal-note) は内部リンクです。
```

### 画像

画像ファイルは `./images/` に格納することを推奨します。キャプションをつける場合は1行空けます。

```md
![プロフィール画像](./images/profile-image.jpg)

*[!image] 画像の例*
```

### 表

キャプションをつける場合は1行空けます。

```md
*[!table] テーブルの例*

| a     | b     |     c |   d   |
| ----- | :---- | ----: | :---: |
| aaaaa | bbbbb | ccccc | ddddd |
| aaaa  | bbbb  |  cccc | dddd  |
| aaa   | bbb   |   ccc |  ddd  |
```

### コード

[https://shiki.matsu.io/languages](Shiki) を使用しています。

#### インラインコード

```md:インラインコード
`inline code`
```

#### タイトル付きコードブロック

タイトルは必須です。

````md
```ts:TypeScriptによる例
const text: string = "Hello, world!";

const displayTextType = (text: string) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```
````

### 引用

#### 通常の引用

```md
> 通常の引用
```

#### コールアウト

title は省略可能です。

```md
> [!type] title
>
> text text text
```

| type        | description      | color   |
| :---------- | :--------------- | :------ |
| `quote`     | 強調したい引用   | default |
| `note`      | 補足             | default |
| `info`      | 付帯する情報     | blue    |
| `important` | 重要事項         | violet  |
| `warn`      | 警告             | amber   |
| `alert`     | 強い警告         | red     |
| `tip`       | 小ネタ           | green   |
| `math`      | 数学の公式や定理 | orange  |

### 数式

$ \KaTeX $ を使用しています。詳細は https://katex.org/docs/supported, https://katex.org/docs/support_table

#### インライン数式

```md
$ f(x) = e^x $ はインライン数式です。
```

#### 別行立て数式

```tex
$$
f(t) = \sum_{n = 0}^\infty \frac{t^n}{n!} \left. \frac{d^{n}f(t)}{dt^n}\right|_{t = 0}
$$
```

### 埋め込み

URLが独立した行にある場合、かつURLの形式が以下に示す例の通りである場合に変換されます。

#### YouTube

```md
<!--https://www.youtube.com/watch?v=<query>-->
https://www.youtube.com/watch?v=sTxY93pA1zI
```

#### Twitter (X)

```md
<!--https://x.com/<user>/status/<query>-->
https://x.com/astrodotbuild/status/1844403385375862824

<!-- or -->

<!--https://twitter.com/<user>/status/<query>-->
https://twitter.com/astrodotbuild/status/1844403385375862824
```

#### GitHub Gist

```md:Gist
<!--https://gist.github.com/<user>/<query>-->
https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899
```

## Zenn への投稿

`$ siwl -e zenn -f <filename>` を実行すると、[Zenn](https://zenn.dev) のリポジトリへ Markdown を輸送することができます。