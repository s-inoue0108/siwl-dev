---
isDraft: false
isLimited: false
title: Astro, SolidJS で個人ブログを制作しました
category: tech
tags: [astro, solid, ts, tailwindcss]
description: Astro, SolidJS を使用してブログサイトをリニューアルしました。このエントリでは、使用した技術やライブラリについてまとめます。
publishDate: 2024-10-06T00:00:00+09:00
updateDate: 2025-08-16T11:57:02+09:00
---

**Shota Inoue** と申します。大学生（非情報系）ですが、個人的に Web 制作に取り組んでおり、大学卒業という節目を迎えるにあたって何か新しく作りたいと思っていました。
\
特に、精力的に取り組んできた（と思っている）Web フロントエンドの分野でいくつか触ってみたい技術があり、また、以前作ったブログのリプレイスを行うも不満が残る部分が多かったため、いっそ新しく作り直そうということで Astro と SolidJS を使ったブログを制作 ~~しました~~ **しております**[^1] ので、紹介させていただきます。

[^1]: 今でもコッソリと機能追加を行っています。

## 使用した技術

### フレームワーク

#### Astro

https://astro.build/

静的サイトであるので、SSG に適した **Astro** を採用しました。パフォーマンスに優れるうえ、シンプルで非常に扱いやすいと感じます。

#### SolidJS

https://www.solidjs.com/

UI フレームワークとして **SolidJS** を用いました。

JSX を用いるため React によく似ていますが、仮想 DOM を用いないことやフックの記述などに細かな違いがあります。React のエコシステムが必要ないのであれば選択肢になると思います。
\
個人的には Global state を用いるために状態管理ライブラリを必要としない点が好みです。

### コンテンツ

#### Content Collections

以前は外部サービスの Headless CMS を使っていましたが、テンプレートの表現力が不十分であると感じたことや、使っていたサービスがサ終 [^2] することを受け、Astro の **Content Collections** への乗り換えを行いました。

[^2]: Newt CMS という国産の Headless CMS を使っていました。

https://docs.astro.build/en/guides/content-collections/

#### GitHub Flavored Markdown

**GitHub Flavored Markdown** は Markdown の規格の1つで、Astro で Markdown を扱う場合にはデフォルトとなります。

https://github.github.com/gfm/

> [!note] MDX について
>
> Astro ではインテグレーションを追加するだけで **[MDX](https://mdxjs.com/)** を簡単に取り入れることができます。
> MDX は Markdown 中で JSX を使用することができ、インタラクティブな要素（ボタンなど）を埋め込む場合に有用と思いますが、後述する remark/rehype を利用することで Markdown でも豊富な表現が可能です。したがって、（Markdown と比べて）互換性に乏しい MDX の採用は見送りました。

### 全体のスタイリングとデザイン

#### Tailwind CSS

https://tailwindcss.com/

流行りものです。Astro や Vue のコンポーネントのスタイリングでは今まで CSS あるいは SASS を採用していましたが、SolidJS/JSX でそれらを用いる場合 CSS Modules を扱うことになるため、スタイルが分離することを嫌って採用しました。  
\
ダークモード対応しやすい点が結構お気に入りです。

> [!note] CSS-in-JS について
>
> CSS-in-JS は SolidJS でも使うことができますが、選択肢の少なさや、そもそもスタイルとテンプレートを同一ファイルで管理することが目的であれば Tailwind CSS のほうが使いやすく感じたため、見送りました。

#### Solid Icons

React Icons の SolidJS 版にあたるライブラリです。サードパーティ製（おそらく）ですが、[SolidJS のエコシステム](https://www.solidjs.com/ecosystem) として公式に認められています。

https://github.com/x64Bits/solid-icons

#### Web フォント

Noto sans JP, Montserrat および Source Code Pro を用いています。これらは [Google Fonts](https://fonts.google.com/) から CDN で読み込むこともできますが、**Fontsource** を利用してセルフホスティングしています。

https://github.com/fontsource/fontsource

### 記事のスタイリングとデザイン

#### remark/rehype

**remark/rehype** という処理系を利用し、Markdown の拡張プラグインを導入しています。

https://unifiedjs.com/

既製のプラグインが多く存在する（[remark](https://github.com/remarkjs/remark/blob/main/doc/plugins.md), [rehype](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)）ほか、自前で実装することも可能です。例えば、このブログのパラグラフトップレベルの `<h2>` タグは以下のような rehype プラグインを用意してスタイリングしています。

```ts:rehype.ts
import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeHeading() {
    return (tree: Root) => {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'h2') return;
            const { value } = node.children[0] as { type: "text", value: string };
            if (!value || typeof value !== 'string') return;

            const hashElm = {
                type: "element",
                tagName: "a",
                properties: {
                    href: `#h2-${value}`,
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
            node.properties.id = `h2-${value}`;
            node.properties.className = "mt-8 mb-4 lg:mt-16 lg:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 w-full pb-2 border-b border-muted-background";
        });
    }
}
```

リンクカードも URL から OGP を取得して HTML を返却する remark プラグインを実装しています。
\
また、YouTube や Twitter (X) をはじめとした Web サービスの埋め込みも、URL を記載するだけで実現できるような remark プラグインを実装しています。埋め込みは **oEmbed API** を公開しているサイトであれば実装が楽です。

https://oembed.com/

### 記事の検索

全文検索の実装であれば [Algolia](https://www.algolia.com/) などのサービスを用いることが多そうですが、今回は Markdown のメタデータ（フロントマター）のみを対象とし、トークンをブラウザにプールするクライアントサイド完結の検索機能を実装しました。

#### Intl.Segmenter

JavaScript 標準の国際化 API である `Intl` に含まれる `Segmenter` を用いて日本語の単語分割を実装しました。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter

#### Fuse.js

ファジー検索を手軽に実装できるライブラリです。

https://www.fusejs.io/

### OG 画像生成

#### satori

Vercel が開発した、JS(X) から SVG を生成するライブラリです[^3]。

[^3]: JSX がうまく使えなかったので素のオブジェクトで記述しています。内部的に React に依存しているのかわかりませんが、SolidJS/JSX だと使いづらい。

https://github.com/vercel/satori

#### Resvg

SVG を PNG に変換してくれるライブラリです。Astro で用いる場合には[この内容](https://github.com/yisibl/resvg-js/issues/175)を記述しないとビルド時にエラーが出るっぽいです。

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

### ホスティング

#### Cloudflare Pages

独自ドメインの管理を Cloudflare で行っている都合上、ホスティングは Cloudflare Pages で行うことにしました。

https://www.cloudflare.com/ja-jp/developer-platform/products/pages/

Pages は Workers に統合されたため、ホスティング環境の見直しも検討したいところです。

### CLI

Astro の Content Collections ではローカルの Markdown や JSON, YAML を扱うことになるため、一連のファイル操作をコマンドラインで行うことができると非常に便利です。せっかくなので作ってみることにしました。

#### Commander.js

Node.js のコマンドライン引数を扱うライブラリです。メソッドチェインを駆使して簡単に CLI を構築することができます。

https://github.com/tj/commander.js

Node.js 標準のファイル操作 API による処理を Commander.js で CLI 化し、`tsx` で実行できるようにしています。

https://github.com/privatenumber/tsx

#### Bash スクリプト

定型的な Git 操作を少ないコマンドで行えるように Bash スクリプトを別途組んであります。また、Commander.js で構築した CLI を経由して実行するスクリプトなども作成してあります。

## 工夫点

### 読了時間の追加

[Astro のレシピ](https://docs.astro.build/en/recipes/reading-time/)に実装例がありますが、当サイトでは Content Collections を用いているため以下の記事の実装を用いました。

https://jahir.dev/blog/astro-reading-time

### お問い合わせフォームの作成

以下の記事に実装をまとめています。

https://siwl.dev/blog/articles/gas-contact-form

### コメント欄の追加

以下の記事に実装をまとめています。

https://siwl.dev/blog/articles/astro-giscus-comments

### Zenn, Qiita への記事のエクスポート

以下の記事に実装をまとめています。

https://siwl.dev/blog/articles/article-export-cmd

### GitHub コントリビューションカレンダーの実装

以下の記事に実装をまとめています。

https://siwl.dev/blog/articles/github-contrib-calendar

## 今後の展望

個人で1年半ほど学習・活動してきましたが、実際にモノをつくってみて、Web 制作は非常に奥が深いと感じています。
便利なフレームワークや、先人の知恵が詰まったコードスニペットで下駄を履かせてもらったとしても、まだまだ分からない部分は多いです。  
\
せっかく自分の Web サイトを持てたので、これからはコツコツ記事を書いて知見をためていきたいと思っています。

## (おもな) 参考記事

https://zenn.dev/ricora/articles/5a170c17933c3f

採用技術を参考にさせていただきました。

https://zenn.dev/deer/articles/d3b104ac97711d

Tailwind CSS でカスタムカラーを用いたダークモード対応を設定する方法が紹介されています。

https://zenn.dev/chot/articles/7885c407aab52d

Remark/Rehype プラグインを作成する際に参考にさせていただきました。
