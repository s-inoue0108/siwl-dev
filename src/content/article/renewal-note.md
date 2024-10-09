---
isDraft: false
title: Astro, SolidJS でブログをリニューアルしました
category: tech
tags: [astro, solid, ts, tailwindcss]
description: Astro + SolidJSでブログをリニューアルしましたので、その覚え書きです。利用した技術や、気になった点をまとめます。
publishDate: 2024-10-06
updateDate: 2024-10-06
---

# フレームワーク

## Astro

https://astro.build/

静的サイトであるので、SSG に適した **Astro** を採用しました。パフォーマンスに優れるうえ、非常に扱いやすいです。

## SolidJS

https://www.solidjs.com/

UI フレームワークとして**SolidJS** を用いました。
JSX を用いるため React によく似ていますが、仮想 DOM を用いないことや、フックの記述などに React に勝るシンプルさがあると思いました。React のエコシステムが必要ないのであれば十分に選択肢に入ると思います。

# スタイリング

## Tailwind CSS

https://tailwindcss.com/

流行りものです。Astro や Vue のシングルファイルコンポーネントでは CSS あるいは SASS を採用していましたが、SolidJS でこれらを用いる場合 CSS Modules を扱うことになるため、スタイルシートが分離することを嫌ったかたちです。

<br />

ダークモード対応しやすい点が結構お気に入りです。

## Solid Icons

React Icons の SolidJS 版にあたるライブラリです。おそらくサードパーティ製ですが、[SolidJS のエコシステム](https://github.com/x64Bits/solid-icons)に含まれています。

https://github.com/x64Bits/solid-icons

# コンテンツ管理

以前は Headless CMS を使っていましたが、自由度が低いため Astro の [**Content Collections**](https://docs.astro.build/en/guides/content-collections/) を用いることにしました。

> MDX を採用しなかった理由

# ホスティング・CI/CD

## GitHub Pages

https://docs.astro.build/ja/guides/deploy/github/

# 参考にした記事たち

https://zenn.dev/ricora/articles/5a170c17933c3f

採用技術を参考にさせていただきました。

https://zenn.dev/deer/articles/d3b104ac97711d

Tailwind CSS でカスタムカラーを用いたダークモード対応を設定する方法が紹介されています。

https://zenn.dev/chot/articles/7885c407aab52d

https://pote-chil.com/posts/astro-rehype-plugin

Remark/Rehype プラグインを作成する際に参考にさせていただきました。
