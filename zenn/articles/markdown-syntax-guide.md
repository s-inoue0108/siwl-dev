---
published: false
title: Markdown 記法の一覧
type: tech
topics: []
emoji: ""
---

## フロントマター

記事のメタデータを管理します。Markdown のトップに必ず記載する必要があります。

```yaml:フロントマターの例
---
isDraft: false   # require [true or false]
title: Markdown 記法の一覧   # require
category: tech   # require [tech or idea]
tags: [html, css, js]   # optional
description: このブログで利用可能な Markdown 記法をまとめています。 # optional
publishDate: yyyy-MM-ddTHH:mm:ss+09:00   # require
updateDate: yyyy-MM-ddTHH:mm:ss+09:00   # optional
relatedArticles: [renewal-note]   # optional
---
```

> 
> CLIを使用すると、`isDraft`, `publishDate` および `updateDate` の内容を変更することができます。
>
> ```bash:記事の追加
> # Markdownを生成し、isDraft, publishDate, updateDate を初期化します
> $ yarn run siwl add -f <filename>
> ```
>
> ```bash:記事の公開
> # isDraft = false, updateDate を更新します
> $ yarn run siwl pub -f <filename>
> ```
>
> ```bash:記事を下書きに戻す
> # isDraft = true
> $ yarn run siwl dft -f <filename>
> ```

## 見出し

```md:見出し
## レベル1
### レベル2
#### レベル3
```

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
-----
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

> 
> text text text

> 
> text text text

> 
> text text text

> 
> text text text

> 
> text text text

> 
> text text text

> 
> text text text

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

いくつかの Web サービスは oEmbed API を利用した特殊な埋め込みに対応しています。


| サービス名   | サービス形態     | URL                        |
| :----------- | :--------------- | :------------------------- |
| GitHub Gist  | ソースコード共有 | `https://gist.github.com`  |
| CodePen      | ソースコード共有 | `https://codepen.io`       |
| Speaker Deck | スライド共有     | `https://speakerdeck.com`  |
| Docswell     | スライド共有     | `https://docswell.com`     |
| Spotify      | 音楽配信         | `https://open.spotify.com` |
| SoundCloud   | 音楽配信         | `https://soundcloud.com`   |
| YouTube      | 動画配信         | `https://youtube.com`      |
| Twitter (X)  | SNS              | `https://x.com`            |


### GitHub Gist

```md:記法
<!--https://gist.github.com/<user>/<query>-->
https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899
```

@[gist](https://gist.github.com/s-inoue0108/6716e31de586f9f48fce1dbd0ea33899)

### CodePen

```md:記法
<!--https://codepen.io/<user>/pen/<query>-->
https://codepen.io/s-inoue0108/pen/PwYJOyv
```

https://codepen.io/s-inoue0108/pen/PwYJOyv

### Speaker Deck

```md:記法
<!--https://speakerdeck.com/<user>/<query>-->
https://speakerdeck.com/panda_program/tips-for-indie-hackers-5e33891f-2054-4044-87da-623799f8d8bd
```

https://speakerdeck.com/panda_program/tips-for-indie-hackers-5e33891f-2054-4044-87da-623799f8d8bd

### Docswell

```md:記法
<!--https://docswell.com/s/<user>/<query>-->
https://docswell.com/s/ku-suke/LK7J5V-hello-docswell
```

https://docswell.com/s/ku-suke/LK7J5V-hello-docswell

### Spotify

```md:記法
<!--https://open.spotify.com/<locale?>/<category>/<query>-->
https://open.spotify.com/intl-ja/track/6Ug3vnQRk30sUrOvDWstgI
https://open.spotify.com/artist/5CxWZpW3bKbMiOC6jJ5r7i
```

https://open.spotify.com/intl-ja/track/6Ug3vnQRk30sUrOvDWstgI

https://open.spotify.com/artist/5CxWZpW3bKbMiOC6jJ5r7i

### SoundCloud

```md:記法
<!--https://soundcloud.com/<user>/<query>-->
https://soundcloud.com/porter-robinson/porter-robinson-madeon-shelter-5
```

https://soundcloud.com/porter-robinson/porter-robinson-madeon-shelter-5

### YouTube

```md:記法
<!--https://www.youtube.com/watch?v=<query>-->
https://www.youtube.com/watch?v=sTxY93pA1zI
```

https://www.youtube.com/watch?v=sTxY93pA1zI

### Twitter (X)

```md:記法
<!--https://[x|twitter].com/<user>/status/<query>-->
https://x.com/astrodotbuild/status/1844403385375862824
https://twitter.com/astrodotbuild/status/1844403385375862824
```

https://x.com/astrodotbuild/status/1844403385375862824

## [参考] ZennのMarkdown記法

https://zenn.dev/zenn/articles/markdown-guide
