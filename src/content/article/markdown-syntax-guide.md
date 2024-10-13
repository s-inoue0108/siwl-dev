---
isDraft: true
title: Markdown記法の一覧
category: tech
tags: []
description: このブログで利用可能なMarkdown記法をまとめています。
publishDate: 2024-09-25
updateDate: 2024-10-12
relatedArticles: []
---

## フロントマター

```yaml:フロントマターの例
isDraft: false   # true or false
title: Markdown記法の一覧
category: tech   # tech or idea
tags: [html, css, js]   # "$ siwl -m tag ls"
description: このブログで利用可能なMarkdown記法をまとめています。 # optional
publishDate: yyyy-mm-dd
updateDate: yyyy-mm-dd
relatedArticles: [renewal-note]   # "$ siwl ls"
```

## 見出し

```md:見出し
## レベル1
### レベル2
#### レベル3
```

> [!warn] 利用できる見出しについて
> `<h1>` , `<h5>` , `<h6>` は通常使用できません。

## リスト

### 列挙

```md:列挙
- li-1
- li-2
  - li-2-1
  - li-2-2
```

### 番号付き

```md:番号付き
1. oi-1
2. oi-2
  1. oi-2-1
  2. oi-2-2
```

## テキストのスタイル

### 強調

```md:強調
**強調** されます。
```

**強調** されます。

### 取り消し線

```md:取り消し線
~1本~ または ~~2本~~ で囲みます。
```

~1本~ または ~~2本~~ で囲みます。

### イタリック

```md:イタリック
*イタリック* になります。
```

*イタリック* になります。

## 文末脚注

```md:脚注
これは脚注です[^1]。

...

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

```md:むき出しのリンク
https://siwl.dev/blog/articles/renewal-note

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

```md:画像
![プロフィール画像](./images/profile-image.jpg)
*プロフィール画像*
```

![プロフィール画像](./images/profile-image.jpg)
*プロフィール画像*

## 表

```md:表
| a   | b    |    c |   d   |
| --- | :--- | ---: | :---: |
```

## コードブロック

### インラインコード

```md:インラインコード
`inline code`
```

`inline code`

### タイトル付きコードブロック

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

```md:コールアウト
> [!type]
> text text text

> [!type] title
> text text text
```

> [!quote]
> text text text

> [!note]
> text text text

> [!info]
> text text text

> [!important]
> text text text

> [!warn]
> text text text

> [!alert]
> text text text

> [!tip]
> text text text

> [!math]
> text text text

## 数式

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

## ToDo

```md:ToDo
- [ ] to do
- [x] done
```

## 埋め込み

### YouTube

### GitHub

### Spotify