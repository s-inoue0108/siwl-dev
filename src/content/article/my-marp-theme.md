---
isDraft: false
isLimited: false
title: 自分用の Marp テーマを作る
category: tech
tags: [css, markdown]
description: "Markdown で手軽にスライドを作ることができる OSS の Marp で、自分用のテーマを作成しました。"
publishDate: 2026-08-11T22:22:43+09:00
updateDate: 2026-08-11T22:58:27+09:00
relatedArticles: []
---

Marp は Markdown で手軽にスライドを作ることができる OSS で、VSCode から簡単に利用することができます。

https://marp.app/

今回、この Web サイトのダークテーマに寄せたカスタムテーマを作成したので、一部の実装を解説します。基本的なやり方は以下の記事を参考にしています。

https://zenn.dev/gae/articles/82f826270cb792s

## スタイルを当てる

### 見出し

ページタイトルとなる `h1` はスライドの左上に置きたかったので、`position: absolute;` で絶対配置します。

また地味ですが、`-webkit-text-stroke` プロパティで文字を黒く縁取りしています。

```css:dark.css
h1 {
    color: var(--fg);
    font-size: 40px;
    position: absolute;
    top: 16px;
    left: 32px;
    text-align: left;
    -webkit-text-stroke: 6px black;
    paint-order: stroke fill;
}
```

`section` タグに `linear-gradient` を当てて、ページタイトルの下にアクセントカラーのグラデーションで区切り線を引きました (Marp では、各ページのセレクタは `section` 以下にあります)。
\
また、`lead` クラスをつけることで、タイトルスライドだけ別で制御することができます。

```css:dark.css
section {
    color: var(--fg);
    background:
        linear-gradient(to right,
            var(--accent-bg),
            var(--accent-fg)) center 80px / 100% 8px no-repeat,
        var(--bg);
}

section.lead {
    background:
        radial-gradient(ellipse at top center,
            var(--bg),
            transparent 70%),
        radial-gradient(ellipse at left center,
            var(--accent-bg) 0%,
            transparent 70%),
        radial-gradient(ellipse at right center,
            var(--accent-fg) 0%,
            transparent 70%),
        var(--bg);
}
```

```md:sample.md
---
marp: true
theme: dark
paginate: true
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Sample slide

Shota Inoue
```

### シンタックスハイライト

Marp のコードブロックでは [Highlight.js](https://highlightjs.org/) によるシンタックスハイライトが効きます。よって、Highlight.js のセレクタ `.hljs-*` の色を変更することで、コードブロックのテーマを変えることができます。
\
今回は [Catppuccin Mocha](https://catppuccin.com/) のカラーパレットを使用しました。例えば、コメントアウトの色を以下のように当てることができます。

```css:dark.css
.hljs-comment {
    color: #6c7086;
}
```

## 表

縦の罫線を消すため、`!important` を駆使して~~なんとかゴリ押します~~。

```css:dark.css
table {
    border: none !important;
    border-collapse: collapse;
    background: transparent !important;
}

table thead,
table tbody,
table tr {
    border: none !important;
    background: none !important;
    box-shadow: none !important;
}

table td {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: 2px solid var(--muted-bg);
    background: none !important;
    box-shadow: none !important;
}

table th {
    border: none !important;
    background: var(--muted-bg) !important;
}
```

## できたもの

- サンプルスライド

https://speakerdeck.com/sinoue0108/my-marp-sample

- リポジトリ

https://github.com/s-inoue0108/marp-theme