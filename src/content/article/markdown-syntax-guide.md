---
isDraft: false
isLimited: false
title: Markdown 記法の一覧
category: tech
tags: [markdown]
description: このブログで利用可能な Markdown 記法をまとめています。
publishDate: 2024-09-25T00:00:00+09:00
updateDate: 2025-08-17T15:25:07+09:00
relatedArticles: [renewal-note]
---

## フロントマター

記事のメタデータを管理します。Markdown のトップに必ず記載する必要があります。

```yaml:フロントマターの例
---
isDraft: false                         # required (boolean)
isLimited: false                       # required (boolean)
title: hoge                            # required (string)
category: tech                         # required ("tech"|"idea")
tags: [html, css, js]                  # optional (string[])
description: fuga                      # required (string[])
publishDate: yyyy-MM-ddTHH:mm:ss+09:00 # required (Date)
updateDate: yyyy-MM-ddTHH:mm:ss+09:00  # optional (Date)
relatedArticles: [one, two, three]     # optional (string[])
---
```

> [!tip] CLIについて
> 
> CLI を使用したコンテンツ管理を利用できます。
>
> ```bash:CLI
> yarn siwl <action> -option <arg>
> ```
>
> 詳しくは[こちら](https://github.com/s-inoue0108/siwl-dev)

## 見出し

```md:見出し
## レベル1
### レベル2
#### レベル3
```

> [!important] 見出しのレベルについて
> 
> 見出しは `<h2>` から始めます。
> `<h1>` , `<h5>` , `<h6>` はスタイルを定義してありますが、使用は非推奨です。

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

## 脚注

```md:脚注
これは脚注です[^1]。

<!--脚注はレベル3の見出しになります-->
[^1]: ここに脚注がきます。
```

これは脚注です[^1]。

[^1]: ここに脚注がきます。

## 区切り線

```md:区切り線
-----
```

-----

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
[この URL](https://siwl.dev/blog/articles/renewal-note) はインラインリンクです。

https://siwl.dev/blog/articles/renewal-note はインラインリンクです。

[相対パスによるリンク](/blog/articles/renewal-note) は内部リンクです。
```

[この URL](https://siwl.dev/blog/articles/renewal-note) はインラインリンクです。

https://siwl.dev/blog/articles/renewal-note はインラインリンクです。

[相対パスによるリンク](/blog/articles/renewal-note) は内部リンクです。

## 画像

画像ファイルは `./images/[slug]/` に格納することを推奨します。キャプションをつける場合は1行空けます。

```md:画像
![プロフィール画像](./images/markdown-syntax-guide/profile-image.jpg)

*[!image] 画像の例*
```

![プロフィール画像](./images/markdown-syntax-guide/profile-image.jpg)

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
`inline code` はインラインコードです。
```

`inline code` はインラインコードです。

### コードブロック

タイトルは任意です。

````md:コードブロック
```js
const text = "Hello, world!";

const displayTextType = (text) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```

```ts:TypeScriptによる例
const text: string = "Hello, world!";

const displayTextType = (text: string) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```
````

```js
const text = "Hello, world!";

const displayTextType = (text) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```

```ts:TypeScriptによる例
const text: string = "Hello, world!";

const displayTextType = (text: string) => {
  if (typeof text !== "string") return;
  console.log("text type is string");
}
```

## 引用

### 引用

```md:引用
> ここは引用ブロックです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。
```

> ここは引用ブロックです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

### コールアウト

`title` は省略可能です。ヘッダと文章部の間は1行空けます。`:fold` を指定するとデフォルトで折りたたまれて表示されます。

```md:コールアウト
> [!type:fold] title
>
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。
```

`type` は以下から選択できます。

*[!table] 利用可能な type*

| type        | description | color   |
| :---------- | :---------- | :------ |
| `quote`     | 引用        | default |
| `note`      | 覚書        | default |
| `remark`    | 備考        | default |
| `info`      | 情報        | blue    |
| `todo`      | 手順        | blue    |
| `important` | 重要事項    | violet  |
| `example`   | 例          | violet  |
| `warn`      | 警告        | amber   |
| `question`  | 疑問        | amber   |
| `alert`     | 強い警告    | red     |
| `attention` | 注意事項    | red     |
| `tip`       | 小ネタ      | green   |
| `break`     | 閑話休題    | green   |

> [!quote:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!note:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!remark:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!info:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!todo:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!important:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!example:fold] 
>
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!warn:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!question:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!alert:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!attention:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!tip:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

> [!break:fold] 
> 
> これはコールアウトです。
> 
> ```python:Python
> x = 1
> y = 2
>
> def add(x, y):
>   return x + y
> 
> print(add(x, y))
> ```
> 
> `inline code` や $inline math$ も使えます。

## 数式

$\KaTeX$ を使用しています。

https://katex.org/docs/supported

https://katex.org/docs/support_table

### インライン数式

```md:インライン数式
$f(x) = e^x$ はインライン数式です。
```

$f(x) = e^x$ はインライン数式です。

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

以下の Web サービスのリンクを書き込むと、リンクカードの代わりにサービスの埋め込みを生成します。

*[!table] 対応済みの Web サービス*

| サービス名   | サービス形態     | ベース URL                 |
| :----------- | :--------------- | :------------------------- |
| GitHub Gist  | ソースコード共有 | `https://gist.github.com`  |
| CodePen      | ソースコード共有 | `https://codepen.io`       |
| Speaker Deck | スライド共有     | `https://speakerdeck.com`  |
| Docswell     | スライド共有     | `https://docswell.com`     |
| Spotify      | 音楽配信         | `https://open.spotify.com` |
| SoundCloud   | 音楽配信         | `https://soundcloud.com`   |
| Bandcamp     | 音楽配信         | `https://bandcamp.com`     |
| YouTube      | 動画配信         | `https://youtube.com`      |
| Twitter (X)  | SNS              | `https://x.com`            |
| Misskey      | SNS              | `https://misskey.io`       |
| Wikipedia    | 百科事典         | `https://ja.wikipedia.org` |
| note         | ブログ           | `https://note.com`         |
| Hatena Blog  | ブログ           | `https://hatenablog.blog`  |


### GitHub Gist

```md
<!--https://gist.github.com/<user>/<query>-->
https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899
```

https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899

### CodePen

```md
<!--https://codepen.io/<user>/pen/<query>-->
https://codepen.io/s-inoue0108/pen/PwYJOyv
```

https://codepen.io/s-inoue0108/pen/PwYJOyv

### Speaker Deck

```md
<!--https://speakerdeck.com/<user>/<query>-->
https://speakerdeck.com/panda_program/tips-for-indie-hackers-5e33891f-2054-4044-87da-623799f8d8bd
```

https://speakerdeck.com/panda_program/tips-for-indie-hackers-5e33891f-2054-4044-87da-623799f8d8bd

### Docswell

```md
<!--https://docswell.com/s/<user>/<query>-->
https://docswell.com/s/ku-suke/LK7J5V-hello-docswell
```

https://docswell.com/s/ku-suke/LK7J5V-hello-docswell

### Spotify

```md
<!--https://open.spotify.com/<locale?>/<category>/<query>-->
https://open.spotify.com/intl-ja/track/6Ug3vnQRk30sUrOvDWstgI
https://open.spotify.com/artist/5CxWZpW3bKbMiOC6jJ5r7i
```

https://open.spotify.com/intl-ja/track/6Ug3vnQRk30sUrOvDWstgI

https://open.spotify.com/artist/5CxWZpW3bKbMiOC6jJ5r7i

### SoundCloud

```md
<!--https://soundcloud.com/<user>/<query>-->
https://soundcloud.com/porter-robinson/porter-robinson-madeon-shelter-5
```

https://soundcloud.com/porter-robinson/porter-robinson-madeon-shelter-5

### Bandcamp

```md
<!--https://hoge.bandcamp.com/<album|track>/<title>-->
https://synthion.bandcamp.com/album/cyanotype
```

https://synthion.bandcamp.com/album/cyanotype


### YouTube

```md
<!--https://www.youtube.com/watch?v=<query>-->
https://www.youtube.com/watch?v=sTxY93pA1zI
```

https://www.youtube.com/watch?v=sTxY93pA1zI

### Twitter (X)

```md
<!--https://[x|twitter].com/<user>/status/<query>-->
https://x.com/astrodotbuild/status/1844403385375862824
https://twitter.com/astrodotbuild/status/1844403385375862824
```

https://x.com/astrodotbuild/status/1844403385375862824

### Misskey

```md
<!--@{misskey}(id)-->
@{misskey:host}(a2r05zxp6u)

<!--":host" で参照するサーバーを設定できます（省略可）-->
<!--デフォルトは sushi.ski (https://sushi.ski) です-->
```

@{misskey}(a2r05zxp6u)

### Wikipedia

```md
<!--@{wiki|wikimedia|wikipedia}(単語)-->
@{wiki:lang}(プログラミング)

<!--":lang" をつけるとそのロケールで検索します（省略可）-->
<!--デフォルトは ja（https://ja.wikipedia.org）です-->
```

@{wiki}(プログラミング)

### note

```md
<!--https://note.com/<user>/n/<query>-->
https://note.com/notemag/n/na07e3bae0d15
```

https://note.com/notemag/n/na07e3bae0d15

### Hatena Blog

```md
<!--https://<user>.hatenablog.com/entry/<yyyy>/<mm>/<dd>/<query>-->
https://staff.hatenablog.com/entry/2014/09/03/153938
```

https://staff.hatenablog.com/entry/2014/09/03/153938
