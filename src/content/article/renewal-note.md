---
isDraft: false
title: Astro, SolidJS でブログをリニューアルしました
category: tech
tags: [astro, solid, ts, tailwindcss]
description: Astro + SolidJSでブログをリニューアルしましたので、その覚え書きです。利用した技術や、気になった点をまとめます。
publishDate: 2024-10-06
updateDate: 2024-10-11
---

# フレームワーク

## Astro

https://astro.build/

静的サイトであるので、SSG に適した **Astro** を採用しました。パフォーマンスに優れるうえ、非常に扱いやすいです。

## SolidJS

https://www.solidjs.com/

UI フレームワークとして **SolidJS** を用いました。
JSX を用いるため React によく似ていますが、仮想 DOM を用いないことや、フックの記述などに React に勝るシンプルさがあると思いました。React のエコシステムが必要ないのであれば十分に選択肢に入ると思います。

# コンテンツ管理

以前は Headless CMS を使っていましたが、手元にコンテンツを置いておきたい気持ちがあったので Astro の **Content Collections** を用いることにしました。

https://docs.astro.build/en/guides/content-collections/

# 全体のスタイリングとデザイン

## Tailwind CSS

https://tailwindcss.com/

流行りものです。Astro や Vue のシングルファイルコンポーネントでは CSS あるいは SASS を採用していましたが、SolidJS でこれらを用いる場合 CSS Modules を扱うことになるため、スタイルシートが分離することを嫌ったかたちです。

<br />

ダークモード対応しやすい点が結構お気に入りです。

## Solid Icons

React Icons の SolidJS 版にあたるライブラリです。おそらくサードパーティ製ですが、[SolidJS のエコシステム](https://github.com/x64Bits/solid-icons)に含まれています。

https://github.com/x64Bits/solid-icons

# 記事のスタイリングとデザイン

Astro は MDX を扱うことができますが、互換性の低さなどから従来通り Markdown を採用することにしました。

## remark/rehype

記事ページのスタイリングには **remark/rehype** という処理系を利用しています。
既存の多くのプラグインが存在しています（[remark](https://github.com/remarkjs/remark/blob/main/doc/plugins.md), [rehype](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)）。

<br />

これらは Unified という Markdown - HTML 間の構文解析を行う枠組みの一環として存在します。

https://unifiedjs.com/

プラグインは自前で実装することも可能です。例えば、このブログの `<h1>` タグは以下のような rehype プラグインを用意してスタイリングしています。

```ts:rehype.ts
import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeHeading() {
    return (tree: Root) => {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'h1') return;
            const { value } = node.children[0] as { type: "text", value: string };
            if (!value || typeof value !== 'string') return;

            const hashElm = {
            type: "element",
            tagName: "a",
            properties: {
                href: `#h1-${value}`,
                className: "heading bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
            },
            children: [{ type: "text", value: "#" }],
            } satisfies ElementContent;

            const titleElm = {
            type: "element",
            tagName: "span",
            properties: {},
            children: [{ type: "text", value }],
            } satisfies ElementContent;

            node.children = [hashElm, titleElm];
            node.properties.id = `h1-${value}`;
            node.properties.className = "mt-8 mb-4 lg:mt-16 lg:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 w-full pb-2 border-b border-muted-background";
        });
    }
}
```

# OG 画像生成

## satori

Vercel が開発する、JSX から SVG を生成するライブラリです。内部的に React に依存しているのかわかりませんが、JSX がうまく使えなかったのでオブジェクトで記述しています。

https://github.com/vercel/satori

## Resvg

SVG を PNG に変換してくれるライブラリです。Astro で用いる場合には[以下を記述しないとビルド時にエラー](https://github.com/yisibl/resvg-js/issues/175)が出ます。

```js:astro.config.mjs
export const defineConfig({
    vite: {
        ssr: {
            external: ["@resvg/resvg-js"],
        },
        optimizeDeps: {
            exclude: ["@resvg/resvg-js"],
        },
    },
});
```

https://github.com/yisibl/resvg-js

# ホスティング

## Cloudflare

独自ドメインの管理を Cloudflare で行っている都合上、ホスティングも Cloudflare で行うことにしました。以前は Vercel を使っていましたが、難なく乗り換えることができました。

https://www.cloudflare.com/ja-jp/

# CLI

Astro の Content Collections ではローカルの Markdown や JSON, YAML を扱うことになるため、一連のファイル操作をターミナルから行うことができると非常に便利です。せっかくなので作ってみることにしました。

## Commander.js

Node.js のコマンドライン引数を扱うライブラリです。メソッドチェインを駆使して簡単に CLI を構築することができます。

https://github.com/tj/commander.js

## Chalk

Node.js で実装したコマンドラインに文字色や背景色をつけることができます。[こちらの記事](https://qiita.com/n0bisuke/items/60241944d7c9fb656af5) によれば、Node.js v21.7.0 以降ではビルトインの機能で同様のことができるようですが、まだ LTS でないのでこのライブラリを使いました。

https://github.com/chalk/chalk

# 参考にした記事たち

https://zenn.dev/ricora/articles/5a170c17933c3f

採用技術を参考にさせていただきました。

https://zenn.dev/deer/articles/d3b104ac97711d

Tailwind CSS でカスタムカラーを用いたダークモード対応を設定する方法が紹介されています。

https://zenn.dev/chot/articles/7885c407aab52d

https://pote-chil.com/posts/astro-rehype-plugin

Remark/Rehype プラグインを作成する際に参考にさせていただきました。
