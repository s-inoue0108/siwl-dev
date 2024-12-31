---
isDraft: false
title: Markdown記法の一覧
category: tech
tags: []
description: このブログで利用可能なMarkdown記法をまとめています。
publishDate: 2024-09-25T00:00:00+09:00
updateDate: 2024-12-31T20:35:14+09:00
relatedArticles: [renewal-note]
---

## フロントマター

記事のメタデータを管理します。Markdown のトップに必ず記載する必要があります。

```yaml:フロントマターの例
---
isDraft: false   # require [true or false]
title: Markdown記法の一覧   # require
category: tech   # require [tech or idea]
tags: [html, css, js]   # optional
description: このブログで利用可能なMarkdown記法をまとめています。 # optional
publishDate: yyyy-MM-ddTHH:mm:ss+09:00   # require
updateDate: yyyy-MM-ddTHH:mm:ss+09:00   # optional
relatedArticles: [renewal-note]   # optional
---
```

> [!tip] CLIについて
> 
> CLIを使用すると、`isDraft`, `publishDate` および `updateDate` の内容を変更することができます。
>
> ```bash:記事の追加
> # Markdownを生成し、isDraft, publishDate, updateDate を初期化します
> $ siwl -f <filename> add
> ```
>
> ```bash:記事の公開
> # isDraft = false, updateDate を更新します
> $ siwl -f <filename> pub
> ```
>
> ```bash:記事を下書きに戻す
> # isDraft = true
> $ siwl -f <filename> dft
> ```

## 見出し

```md:見出し
## レベル1
### レベル2
#### レベル3
```

> [!warn] 利用できる見出しについて
> 
> `<h1>` , `<h5>` , `<h6>` は使用できません。

## リスト

### 列挙

ネストを利用できます。

```md:列挙
- ul-1
- ul-2
  - ul-2-1
  - ul-2-2
```

- ul-1
- ul-2
  - ul-2-1
  - ul-2-2

### 番号付き

ネストを利用できます。

```md:番号付き
1. ol-1
2. ol-2
3. 1. ol-3-1
   2. ol-3-2
```

1. ol-1
2. ol-2
3. 1. ol-3-1
   2. ol-3-2

## インラインスタイル

### 強調

```md:強調
これは **強調** されます。
```

これは **強調** されます。

### 取り消し線

```md:取り消し線
~取り消し線~ がつきます。

<!--or-->

~~取り消し線~~ がつきます。
```

~取り消し線~ がつきます。

### イタリック

```md:イタリック
これは *イタリック* になります。
```

これは *イタリック* になります。

## 文末脚注

```md:脚注
これは脚注です[^1]。

<!--footnote-->
[^1]: ここに脚注がきます。
```

これは脚注です[^1]。

[^1]: ここに脚注がきます。

## 区切り線

```md:区切り線
---
```

## リンク

### むき出しのリンク

URLが独立した行にある場合にのみ変換されます。

```md:むき出しのリンク
https://siwl.dev/blog/articles/renewal-note

<!--or-->

<https://siwl.dev/blog/articles/renewal-note>
```

https://siwl.dev/blog/articles/renewal-note

### インラインリンク

```md:インラインリンク
[リニューアルノート](https://siwl.dev/blog/articles/renewal-note) はインラインリンクです。

https://siwl.dev/blog/articles/renewal-note はインラインリンクです。

[相対パスによるリンク](/blog/articles/renewal-note) は内部リンクです。
```

[リニューアルノート](https://siwl.dev/blog/articles/renewal-note) はインラインリンクです。

https://siwl.dev/blog/articles/renewal-note はインラインリンクです。

[相対パスによるリンク](/blog/articles/renewal-note) は内部リンクです。

## 画像

画像ファイルは `./images/` に格納することを推奨します。キャプションをつける場合は1行空けます。

```md:画像
![プロフィール画像](./images/profile-image.jpg)

*[!image] 画像の例*
```

![プロフィール画像](./images/profile-image.jpg)

*[!image] 画像の例*

## 表

キャプションをつける場合は1行空けます。

```md:表
*[!table] テーブルの例*

| a     | b     |     c |   d   |
| ----- | :---- | ----: | :---: |
| aaaaa | bbbbb | ccccc | ddddd |
| aaaa  | bbbb  |  cccc | dddd  |
| aaa   | bbb   |   ccc |  ddd  |
```

*[!table] テーブルの例*

| a     | b     |     c |   d   |
| ----- | :---- | ----: | :---: |
| aaaaa | bbbbb | ccccc | ddddd |
| aaaa  | bbbb  |  cccc | dddd  |
| aaa   | bbb   |   ccc |  ddd  |

## コード

シンタックスハイライトには Shiki を使用しています。

https://shiki.matsu.io/languages

### インラインコード

```md:インラインコード
`inline code`
```

`inline code`

### タイトル付きコードブロック

タイトルは必須です。

````md:タイトル付きコードブロック
```ts:TypeScriptによる例
const text: string = "Hello, world!";

const displayTextType = (text: string) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```
````

```ts:TypeScriptによる例
const text: string = "Hello, world!";

const displayTextType = (text: string) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```

## 引用

### 通常の引用

```md:通常の引用
> 通常の引用
```

> 通常の引用

### コールアウト

title は省略可能です。

```md:コールアウト
> [!type] title
>
> text text text
```

*[!table] 利用可能な type*

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

<br />

> [!quote]
> 
> text text text

> [!note]
> 
> text text text

> [!info]
> 
> text text text

> [!important]
> 
> text text text

> [!warn]
> 
> text text text

> [!alert]
> 
> text text text

> [!tip]
> 
> text text text

> [!math]
> 
> text text text

## 数式

$ \KaTeX $ を使用しています。

https://katex.org/docs/supported

https://katex.org/docs/support_table

### インライン数式

```md:インライン
$ f(x) = e^x $ はインライン数式です。
```

$ f(x) = e^x $ はインライン数式です。

### 別行立て数式

```tex:別行立て数式
$$
f(t) = \sum_{n = 0}^\infty \frac{t^n}{n!} \left. \frac{d^{n}f(t)}{dt^n}\right|_{t = 0}
$$
```

$$
f(t) = \sum_{n = 0}^\infty \frac{t^n}{n!} \left. \frac{d^{n}f(t)}{dt^n}\right|_{t = 0}
$$

## 埋め込み

URLが独立した行にある場合、かつURLの形式が以下に示す例の通りである場合に変換されます。

### YouTube

```md:記法
<!--https://www.youtube.com/watch?v=<query>-->
https://www.youtube.com/watch?v=sTxY93pA1zI
```

https://www.youtube.com/watch?v=sTxY93pA1zI

### Twitter (X)

```md:記法
<!--https://x.com/<user>/status/<query>-->
https://x.com/astrodotbuild/status/1844403385375862824

<!-- or -->

<!--https://twitter.com/<user>/status/<query>-->
https://twitter.com/astrodotbuild/status/1844403385375862824
```

https://x.com/astrodotbuild/status/1844403385375862824

### GitHub Gist

```md:記法
<!--https://gist.github.com/<user>/<query>-->
https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899
```

https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899

### Speaker Deck

```md:記法
<!--https://speakerdeck.com/<user>/<query>-->
https://speakerdeck.com/panda_program/tips-for-indie-hackers-5e33891f-2054-4044-87da-623799f8d8bd
```

https://speakerdeck.com/panda_program/tips-for-indie-hackers-5e33891f-2054-4044-87da-623799f8d8bd

## ZennのMarkdown記法

https://zenn.dev/zenn/articles/markdown-guide