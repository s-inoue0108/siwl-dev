---
isDraft: false
isLimited: false
title: VSCode + Markdown Preview Enhanced で Markdown の執筆環境を整える
category: tech
tags: [markdown]
description: "VSCode では、ctrl + shift + V (⌘ + shift + V) で Markdown ファイルのプレビューを行うことができます。リッチなプレビューを行うために、Markdown Preview Enhanced というプラグインを使用できます。"
publishDate: 2025-02-10T13:34:49+09:00
updateDate: 2025-02-10T16:14:38+09:00
relatedArticles: []
---

## ワークスペースを作る

VSCode のワークスペースは、複数のプロジェクトディレクトリを一元管理できる便利な仕組みです。例えば、`project/` が以下のように複数のプロジェクトの分割されていたとしましょう：

```
- projects
  projects.code-workspace
  - project1/
    - src
    - config
  - project2/
    - src
    - config
```

`*.code-workspace` というファイルは、ワークスペースの設定を記載するファイルです。JSON 形式で書きます。例えば、以下のように設定できます：

```json:project.code-workspace
{
  "folders": [
    {
      "name": "Project 1",
      "path": "./project1"
    },
    {
      "name": "Project 2",
      "path": "./project2"
    }
  ],
}
```

こうすることで、`projects` を `project1/` と `project2/` の2つのルートディレクトリ（ワークスペース）に分割することができます。Markdown ファイルを格納するフォルダのワークスペースを作っておくとよいと思います。

## Markdown Preview Enhanced

VSCode では、`ctrl + shift + V` (または `⌘ + shift + V`) で Markdown ファイルのプレビューを行うことができます。VSCode の標準プレビューは簡素なため、**Markdown Preview Enhanced** というプラグインでリッチなプレビュー環境を整えます。

https://shd101wyy.github.io/markdown-preview-enhanced/

https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced

### プレビューの見た目を整える

プラグインをインストールしたら、`ctrl + shift + P ` (または `⌘ + shift + P`) で設定バーを参照し、`Markdown Preview Enhanced: Customize CSS (Workspace)` を選択します。
\
ワークスペースの直下に `.crossnote/` ディレクトリが作成されます。

> [!info] 
>
> 設定には Global 設定と Workspace 設定があります。Global 設定は VSCode 全体での設定を書き換えますが、Workspace 設定は現在のプロジェクトにのみ設定を適用します。

`.crossnote/style.less` を開きます。Less 形式で CSS を記述できます。

```less:style.less
.markdown-preview.markdown-preview {
  // このブロックにスタイルを書く

  // e.g.
  p {
    font-size: 18px;
    line-height: 1.7;
  }

  a:hover {
    text-decoration: underline;
  }
}
```

参考：

https://shd101wyy.github.io/markdown-preview-enhanced/#/customize-css

### Markdown パーサを拡張する

`.crossnote/parser.js` で、Markdown のパース設定を変更できます。独自の構文のパース実装はこのファイルで行います。

```js:parser.js
({
	onWillParseMarkdown: async function (markdown) {
    return markdown;
  },

  onDidParseMarkdown: async function (html) {
		return html;
	},

	onWillTransformMarkdown: async function (markdown) {
		return markdown;
	},

	onDidTransformMarkdown: async function (markdown) {
		return markdown;
	},
});
```

たとえば、見出しのデザインに深さを示す `#` を付加する実装などが考えられるでしょう：

```js:parser.js
({
	onWillParseMarkdown: async function (markdown) {
    const re = /(?<hashes>#{2,4})\s?(?<title>.+)?/;

		markdown = markdown.replace(new RegExp(re, "g"), (h) => {
			const match = h.match(re);

			if (!match || !match.groups) return h;
			const { hashes, title } = match.groups;
			return `<h${hashes.length}>
						<span class="hashes">${"#".repeat(hashes.length)}</span> 
						<span>${title}</span>
					</h${hashes.length}>`;
		});

    return markdown;
  },
});
```

参考：

https://shd101wyy.github.io/markdown-preview-enhanced/#/extend-parser