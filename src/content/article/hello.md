---
isDraft: true
title: "Markdownのテスト"
category: tech
tags: [js, ts, astro, solid, sass]
description: 利用可能なMarkdown記法をまとめています。
publishDate: 2024-09-25
updateDate: 2024-09-27
---

# Link

## Bare links

Bare links are converted to link cards.

http://example.com/

<br />

https://www.npmjs.com/package/remark-link-card

<br />

https://zenn.dev/kusuke/articles/05bc1590966cb4

<br />

<https://si-library.net/>

<br />

<https://www.npmjs.com/package/remark-link-card>

## Inline links

Inline links are **not** converted to link cards.

[example](http://example.com/) is inline link

[remark-link-card](https://www.npmjs.com/package/remark-link-card) is inline link

## Multiple links in one line

If there are multiple links in one line, they will **not** be converted to link cards.

http://example.com/ http://example.com/ http://example.com/

# Footnote

A note[^1]

[^1]: Big note.

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
