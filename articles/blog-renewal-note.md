---
title: "Astro, SolidJS で個人ブログを制作しました"
emoji: "🖊️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["typescript", "astro", "solidjs", "tailwindcss"]
published: true
---

**S.Inoue** と申します。非情報系の大学生ながら個人的に Web 制作に取り組んでおり、大学卒業という節目を迎えるにあたって何か新しく作りたいと思っていました。

特に、精力的に取り組んできた（と思っている）Web フロントエンドの分野でいくつか触ってみたい技術があり、また、以前作ったブログのリプレイスを行うも不満が残る部分が多かったため、いっそ新しく作り直そうということで Astro と SolidJS を使ったブログを制作 ~~しました~~ **しております** ので、紹介させていただきます。

**作っているもの：**
https://siwl.dev

## 採用した技術

### フレームワーク

#### Astro

https://astro.build/

静的サイトであるので、SSG に適した **Astro** を採用しました。パフォーマンスに優れるうえ、シンプルで非常に扱いやすいと感じます。

#### SolidJS

https://www.solidjs.com/

UI フレームワークとして **SolidJS** を用いました。
JSX を用いるため React によく似ていますが、仮想 DOM を用いないことやフックの記述などに細かな違いがあり、React よりシンプルであるという意見もみられます。React のエコシステムが必要ないのであれば十分に選択肢に入ると思います。

### コンテンツ

#### Content Collections

以前は API ベースの Headless CMS を使っていましたが、手元にコンテンツを置いておきたい気持ちがあったので Astro の **Content Collections** を用い、ローカルで記事を管理することにしました。

https://docs.astro.build/en/guides/content-collections/

#### GitHub Flavored Markdown

今回は Markdown で入稿できるようにしました。 **GitHub Flavored Markdown** は Markdown の規格の1つで、Astro で Markdown を扱う場合にはデフォルトとなります。

https://github.github.com/gfm/

:::message
**MDX について**

Astro ではインテグレーションを追加するだけで **[MDX](https://mdxjs.com/)** を簡単に取り入れることができます。
MDX は Markdown 中で JSX を使用することができ、インタラクティブな要素（ボタンなど）を埋め込む場合に有用と思いますが、単なる装飾であれば後述する remark/rehype を利用することで Markdown でも豊富な表現が可能です。したがって、（Markdown と比べて）互換性に乏しい MDX の採用は見送りました。
:::

### 全体のスタイリングとデザイン

#### Tailwind CSS

https://tailwindcss.com/

流行りものです。Astro や Vue のシングルファイルコンポーネントでは CSS あるいは SASS を採用していましたが、SolidJS でこれらを用いる場合 CSS Modules を扱うことになるため、スタイルが分離することを嫌ったかたちです。

ダークモード対応しやすい点が結構お気に入りです。

:::message
**CSS-in-JS について**

CSS-in-JS は SolidJS でも使うことができますが、選択肢の少なさや、そもそもスタイルとテンプレートを同一ファイルで管理することが目的であれば Tailwind CSS のほうが使いやすく感じたため、見送りました。
:::

#### Solid Icons

React Icons の SolidJS 版にあたるライブラリです。おそらくサードパーティ製ですが、[SolidJS のエコシステム](https://www.solidjs.com/ecosystem) として公式に認められています。

https://github.com/x64Bits/solid-icons

#### Web フォント

Noto sans JP, Montserrat および Source Code Pro を用いています。これらは [Google Fonts](https://fonts.google.com/) から CDN で読み込むこともできますが、**Fontsource** を利用して `npm` パッケージとして扱っています。

https://github.com/fontsource/fontsource

### 記事のスタイリングとデザイン

#### remark/rehype

記事ページのスタイリングには **remark/rehype** という処理系を利用しています。
これらは **Unified** という Markdown - HTML 間の構文解析を取り扱う枠組みの一環として存在します。

https://unifiedjs.com/

プラグインは既存のものが多く存在する（[remark](https://github.com/remarkjs/remark/blob/main/doc/plugins.md), [rehype](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)）ほか、自前で実装することも可能です。例えば、このブログのパラグラフトップレベルの `<h2>` タグは以下のような rehype プラグインを用意してスタイリングしています。

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

そのほか、YouTube や Twitter (X) などの埋め込みも URL を記載するだけで実現できるような remark プラグインを実装しています。
埋め込みは **oEmbed** に対応しているサイトであればAPIで関連するデータを引っ張ってくることができます。

https://oembed.com/

### 記事の検索

全文検索の実装であれば [Algolia](https://www.algolia.com/) などのサービスを用いることが多そうですが、今回は Markdown のメタデータのみを検索対象に含めた簡易なクライアントサイド検索を自前で実装しました。

#### Intl.Segmenter

JavaScript 標準の国際化 API である **Intl** に含まれる `Segmenter` を用いて日本語の単語分割を実装しました。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter

#### Fuse.js

ファジー検索を手軽に実装できる API を提供するライブラリです。

https://www.fusejs.io/

### OG 画像生成

#### satori

Vercel が開発する、JSX から SVG を生成するライブラリです。内部的に React に依存しているのかわかりませんが、JSX がうまく使えなかったのでオブジェクトで記述しています。

https://github.com/vercel/satori

#### Resvg

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

### ホスティング

#### Cloudflare

独自ドメインの管理を Cloudflare で行っている都合上、ホスティングも Cloudflare で行うことにしました。以前は Vercel を使っていましたが、難なく乗り換えることができました。

https://www.cloudflare.com/ja-jp/

### CLI

Astro の Content Collections ではローカルの Markdown や JSON, YAML を扱うことになるため、一連のファイル操作をコマンド1つで行うことができると非常に便利です。せっかくなので作ってみることにしました。

#### Commander.js

Node.js のコマンドライン引数を扱うライブラリです。メソッドチェインを駆使して簡単に CLI を構築することができます。

https://github.com/tj/commander.js

Node.js 標準のファイル操作モジュール (`fs`) による実装を Commander.js で CLI 化し、`tsx` で直接実行しています。

https://github.com/privatenumber/tsx

#### Chalk

Node.js で実装したコマンドラインに文字色や背景色をつけることができます。[こちらの記事](https://qiita.com/n0bisuke/items/60241944d7c9fb656af5) によれば、Node.js v21.7.0 以降ではビルトインの機能で同様のことができるようですが、まだ LTS でないのでこのライブラリを使いました。

https://github.com/chalk/chalk

#### Shellscript

CLI は npm スクリプトとして実行できるようにしてありますが、もう少し簡便に使えるように Shellscript から制御できるようにしてあります。
加えて、Git など定型的な操作をコマンド1つで行えるようにもしました。

## 工夫点

### 読了時間の追加

[Astro の公式](https://docs.astro.build/en/recipes/reading-time/)に実装例がありますが、当サイトでは Content Collections を用いているため以下の記事の実装を用いました。

https://jahir.dev/blog/astro-reading-time

### グローバルステート

[こちら](https://zenn.dev/nakasyou/articles/20231020_solidjs#state%E3%81%8C%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E5%A4%96%E3%81%A7%E3%82%82%E4%BD%BF%E3%81%88%E3%82%8B%EF%BC%81) で述べられているように、SolidJS の大きな特徴として **state がコンポーネント外でも宣言できる**というものがあります。よって、状態管理ライブラリを必要とせずとも state を `.ts` ファイルに隔離し、複数のコンポーネントから参照・更新をすることができます。
\
このブログにおいては、記事検索のための `input` 要素を含むUIをデバイスのサイズに応じて出しわけているのですが、バインドするキーワードをグローバルステートにしています。

## 今後の展望

個人で1年半ほど学習・活動してきましたが、実際にモノをつくってみて、Web 制作は非常に奥が深いと感じています。便利なフレームワークや、先人の知恵が詰まったコードスニペットで下駄を履かせてもらったとしても、まだまだ分からない部分は多いです。

せっかく自分の Web サイトを持てたので、これからはコツコツ記事を書いて知見をためていきたいと思っています。

**同じ記事を個人ブログにも掲載しております。ぜひご覧ください↓**
https://siwl.dev/blog/articles/renewal-note

## 参考記事

https://zenn.dev/ricora/articles/5a170c17933c3f

採用技術を参考にさせていただきました。

https://zenn.dev/deer/articles/d3b104ac97711d

Tailwind CSS でカスタムカラーを用いたダークモード対応を設定する方法が紹介されています。

https://zenn.dev/chot/articles/7885c407aab52d

Remark/Rehype プラグインを作成する際に参考にさせていただきました。
