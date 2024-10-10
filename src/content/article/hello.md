---
isDraft: false
title: "Markdownのテスト"
category: tech
tags: [js, ts, astro, solid, sass]
description: 利用可能なMarkdown記法をまとめています。
publishDate: 2024-09-25
updateDate: 2024-10-10
relatedArticles: [renewal-note, ipa-fe-1]
---

# Link

## Bare links

https://www.npmjs.com/package/remark-link-card

<https://www.npmjs.com/package/remark-link-card>

## Inline links

[example](http://example.com/) はインラインリンクです。

http://example.com/ はインラインリンクです。

[相対パスによるリンク](/blog/articles/renewal-note) は内部インラインリンクです。

## Multiple links in one line

If there are multiple links in one line, they will **not** be converted to link cards.

# Footnote

A note[^1]

A second note[^2]

[^1]: Big note.
[^2]: small note.

# Strikethrough

~one~ or ~~two~~ tildes.

# Table

| a   | b   |   c |  d  |
| --- | :-- | --: | :-: |

# Tasklist

- [ ] to do
- [x] done

# Math

## Inline

これはインライン数式です $ f(x) = e^x $ は指数関数です。

## Display

$$
f(t) = \sum_{n = 0}^\infty \frac{1}{n!} \left. \frac{d^{n}f(t)}{dt^n}\right|_{t = 0}
$$

$$
\mathcal{L[f(t)](s)} = \int_0^\infty f(t)e^{-st} dt
$$

# Code

`inline code`

```ts:outline
const ts = "TypeScript";
console.log(ts);
```

# Quote

> [!NOTE]
> This
> is
> Quote.

## Callout

## Directive

Lorem:br
ipsum.

::hr{.red}

A :i[lovely] language know as :abbr[HTML]{title="HyperText Markup Language"}.
