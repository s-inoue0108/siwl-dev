---
isDraft: false
isLimited: false
title: Markdown + RDKit.js で化学構造式レンダラーを作る
category: tech
tags: [markdown]
description: "ケモインフォマティクスソフトウェアの RDKit.js を使って化学構造式を Markdown 上で描画できるようにしてみました。"
publishDate: 2026-02-23T13:54:49+09:00
updateDate: 2026-02-23T15:18:12+09:00
relatedArticles: []
---

## RDKit.js

Markdown で理工系の書き物をしていると、化学構造式を簡単に描画できたらいいなと思うことがままあります。PC で化学構造式を描画できるソフトウェアとして ChemDraw がありますが、これは有償で個人では手の出ない代物です。
\
何かいい感じの代替はないかな〜...と探し回っていたところ、Python ライブラリで有名なあの [RDKit](https://www.rdkit.org/) が JavaScript でも API を提供していることを知りました。

https://github.com/rdkit/rdkit-js

これを使えば SMILES[^1] から構造式をレンダリングしてそのまま HTML に埋め込めるじゃん、ということで実装してみました。

[^1]: 化学構造式を文字列で表現する方法です。https://ja.wikipedia.org/wiki/SMILES%E8%A8%98%E6%B3%95 を参照。

## 実装

とりあえずインストール。

```bash
npm i @rdkit/rdkit
```

### SMILES を構造式に変換する

`get_mol()` API を使用して SMILES から MOL オブジェクトのインスタンスを生成できます (Python の RDKit でいう `Chem.MolFromSmiles()` に相当するやつでしょう)。

MOL オブジェクトのもつ `get_svg()` メソッドを使用して、構造式の svg タグ (`<svg>...</svg>`) を生成できます。

```js:JavaScript
import * as RDKit from "@rdkit/rdkit";

const smiles = "CCO"   // ethanol

const rdkit = await RDKit.default();
const mol = rdkit.get_mol(smiles);

const svg = mol.get_svg();
mol.delete();

console.log(svg)
```

このままでもいいんですが、サイズや色を変えたくなります。試行錯誤の末、生成した svg タグのプロパティを後天的に書き換えることで対処することにしました（もっといい方法がありそうですが）。

ついでに以下のような関数にまとめます。

```js:JavaScript
const buildChemicalStructure = async (smiles) => {
  const rdkit = await RDKit.default();
  const mol = rdkit.get_mol(smiles);

  let svg = mol.get_svg();

  // fix width, height
  svg = svg.replace(
    /(width|height)='(\d+(?:\.\d+)?)px'/g,
    (_, attr) => `${attr}='100%'`
  );

  // remove bg color
  svg = svg.replace(
    /(style=['"][^'"]*\bfill\s*:\s*)#([0-9a-fA-F]{6})/g,
    "$1none"
  );

  const color = "#a1a1aa"

  // replace bond color
  svg = svg.replace(
    /(style=['"][^'"]*\bstroke\s*:\s*)#([0-9a-fA-F]{6})/g,
    `$1${color}`
  );

  // replace atom color
  svg = svg.replace(
    /(<path\b[^>]*class=['"]atom-[^'"]+['"][^>]*\bfill\s*=\s*['"])#[0-9a-fA-F]{6}(['"][^>]*>)/g,
    `$1${color}$2`
  );

  mol.delete();

  // スタイリングに Tailwind CSS を使っています
  return "<div class='relative w-fit mx-auto'>" + svg + "</div>";
}
```

### Markdown からレンダリングできるようにする

[Remarkjs](https://github.com/remarkjs/remark) を使い、Markdown の特定の記法をキャプチャして `buildChemicalStructure` 関数が走るようなコードを書きました。実装は以下にあります。

https://github.com/s-inoue0108/siwl-dev/blob/main/src/plugins/remark/remark-smiles-embed.js

Markdown で以下のような構文を使用した場合、化学構造式に変換することができるようになりました。

```md:Markdown
<!--Draw ethanol-->
@{chem}(CCO)
```

## 実際に試してみる

実際の化合物をいくつか描画してみます。

### アセトン

有機溶媒として広く用いられるケトン化合物です。

```md:acetone
@{chem}(CC(=O)C)
```

@{chem}(CC(=O)C)

このくらいは序の口ですね。

### アゾベンゼン

2つのベンゼン環がアゾ基で結合した化合物で、幾何異性体どうしを光によって行き来することで有名です。

```md:azobenzene
<!--cis-->
@{chem}(N(=N/c1ccccc1)/c2ccccc2)

<!--trans-->
@{chem}(N(=N/c1ccccc1)\c2ccccc2)
```

@{chem}(N(=N/c1ccccc1)/c2ccccc2)

@{chem}(N(=N/c1ccccc1)\c2ccccc2)

余裕ですね。

### ヒスチジン

天然のタンパク質を構成する20種類のアミノ酸の一つで、必須アミノ酸です。イミダゾール環をもち塩基性を示します。不斉炭素原子を1つ持ちます。

```md:histidine
<!--(R)-->
@{chem}(O=C(\[C@@H\](CC1=CNC=N1)N)O)

<!--(S)-->
@{chem}(O=C(\[C@H\](CC1=CNC=N1)N)O)
```

@{chem}(O=C(\[C@@H\](CC1=CNC=N1)N)O)

@{chem}(O=C(\[C@H\](CC1=CNC=N1)N)O)

SVG の都合で楔形結合のデザインがなんかアレですが、許容しましょう。

### ルブレン

芳香族炭化水素で、有機エレクトロニクス材料として有用な化合物として知られています。

```md:rubrene
@{chem}(c5(c3c(c1ccccc1c(c2ccccc2)c3c(c4ccccc4)c6ccccc56)c7ccccc7)c8ccccc8)
```

@{chem}(c5(c3c(c1ccccc1c(c2ccccc2)c3c(c4ccccc4)c6ccccc56)c7ccccc7)c8ccccc8)

4つのフェニル基がくっついてしまいました。

### トリスオキサラト鉄(III)カリウム

化学式 $\mathrm{K_3[Fe(C_2O_4)_3]}$ で表される分子で、陰イオン部分はシュウ酸イオンが3つ鉄に配位したキレート錯体です。

```md:potassium-trisoxalatoferrate(III)
@{chem}(O=C(C(=O)\[O-\]1)\[O-\]\[Fe+3\]123(\[O-\]C(C(=O)\[O-\]2)=O)\[O-\]C(C(=O)\[O-\]3)=O.\[K+\].\[K+\].\[K+\])
```

@{chem}(O=C(C(=O)\[O-\]1)\[O-\]\[Fe+3\]123(\[O-\]C(C(=O)\[O-\]2)=O)\[O-\]C(C(=O)\[O-\]3)=O.\[K+\].\[K+\].\[K+\])

やや面倒な立体構造をもつ錯体は厳しそうですね。

### アダマンタン

10個の炭素がダイヤモンドの結晶格子と同じように配置された炭化水素化合物です。その対称性から安定で融点が高く、嵩高さを活かして置換基によく用いられます。

```md:adamantan
@{chem}(C1C3CC2CC(CC1C2)C3)
```

@{chem}(C1C3CC2CC(CC1C2)C3)

立体構造が崩れていますね...

### クラウンエーテル

中央に空孔をもち、金属イオンを包接することができる環状化合物です。以下では $\mathrm{K}^+$ を包接可能な 18-crown-6 を描画してみます。

```md:18-crown-6
@{chem}(C1COCCOCCOCCOCCOCCO1)
```

@{chem}(C1COCCOCCOCCOCCOCCO1)

C-C-O の結合角がおかしくなってしまいました。

### フラーレン

炭素原子が球状につながった分子で、特にサッカーボール状の $\mathrm{C_{60}}$ が有名です。

```md:fullerene
@{chem}(c12c3c4c5c1c6c7c8c2c9c%10c3c%11c%12c4c%13c%14c5c%15c6c%16c7c%17c%18c8c9c%19c%20c%10c%11c%21c%22c%12c%13c%23c%24c%14c%15c%25c%16c%26c%17c%27c%18c%19c%28c%20c%21c%29c%22c%23c%30c%24c%25c%26c%31c%27c%28c%29c%30%31)
```

@{chem}(c12c3c4c5c1c6c7c8c2c9c%10c3c%11c%12c4c%13c%14c5c%15c6c%16c7c%17c%18c8c9c%19c%20c%10c%11c%21c%22c%12c%13c%23c%24c%14c%15c%25c%16c%26c%17c%27c%18c%19c%28c%20c%21c%29c%22c%23c%30c%24c%25c%26c%31c%27c%28c%29c%30%31)

？？？？？

### ポルフィリン

```md:porphyrin
@{chem}(C1=C/C/2=C/c3ccc(/C=C\4/C=CC(=N4)/C=c\4/cc/c(=C/C1=N2)/\[nH\]4)\[nH\]3)
```

@{chem}(C1=C/C/2=C/c3ccc(/C=C\4/C=CC(=N4)/C=c\4/cc/c(=C/C1=N2)/\[nH\]4)\[nH\]3)

やっぱり結合角が微妙ですね。

### パリトキシン

強い毒性を持つ海産の天然化合物で、非常に巨大な構造式をもちます。

```md:palytoxin
@{chem}(NC\[C@@H\]1C\[C@H\](\[C@H\](O1)CC\[C@H\]1O\[C@@H\]2C\[C@H\](O\[C@H\]1C2)C\[C@H\](\[C@@H\](\C=C/\[C@@H\]2\[C@H\](\[C@@H\](\[C@H\](\[C@H\](O2)C\[C@H\](\[C@H\](\[C@@H\](\[C@H\](CCC(\C=C/C\[C@H\](\[C@H\](\[C@@H\](C/C=C/C=C\\[C@H\](C\[C@H\]2\[C@@H\](\[C@H\](\[C@@H\](\[C@H\](O2)C\[C@H\](\[C@@H\](C\[C@@H\]2\[C@H\](\[C@@H\](C\[C@H\](O2)\[C@@H\](\[C@@H\](CC\[C@@H\](/C=C/\[C@@H\](\[C@H\](C\[C@\]2(\[C@@H\](\[C@@H\](\[C@H\](\[C@H\](O2)C\[C@H\](CCCCCCC\[C@\]21C\[C@H\](C\[C@\](\[C@H\](O2)C\[C@H\](CCCCC\[C@H\](\[C@@H\](\[C@@H\](\[C@H\](\[C@H\](O)\[C@@H\]2\[C@H\](\[C@@H\](\[C@H\](\[C@H\](O2)C\[C@@H\](\[C@@H\](/C(=C/\[C@@H\](C\[C@H\](\[C@@H\](C(O)=N\C=C\C(=NCCCO)O)O)C)O)/C)O)O)O)O)O)O)O)O)O)C)(O1)C)C)O)O)O)O)O)O)C)O)O)O)O)O)O)O)O)O)O)O)O)O)O)=C)O)O)O)C)O)O)O)O)O)O)
```

@{chem}(NC\[C@@H\]1C\[C@H\](\[C@H\](O1)CC\[C@H\]1O\[C@@H\]2C\[C@H\](O\[C@H\]1C2)C\[C@H\](\[C@@H\](\C=C/\[C@@H\]2\[C@H\](\[C@@H\](\[C@H\](\[C@H\](O2)C\[C@H\](\[C@H\](\[C@@H\](\[C@H\](CCC(\C=C/C\[C@H\](\[C@H\](\[C@@H\](C/C=C/C=C\\[C@H\](C\[C@H\]2\[C@@H\](\[C@H\](\[C@@H\](\[C@H\](O2)C\[C@H\](\[C@@H\](C\[C@@H\]2\[C@H\](\[C@@H\](C\[C@H\](O2)\[C@@H\](\[C@@H\](CC\[C@@H\](/C=C/\[C@@H\](\[C@H\](C\[C@\]2(\[C@@H\](\[C@@H\](\[C@H\](\[C@H\](O2)C\[C@H\](CCCCCCC\[C@\]21C\[C@H\](C\[C@\](\[C@H\](O2)C\[C@H\](CCCCC\[C@H\](\[C@@H\](\[C@@H\](\[C@H\](\[C@H\](O)\[C@@H\]2\[C@H\](\[C@@H\](\[C@H\](\[C@H\](O2)C\[C@@H\](\[C@@H\](/C(=C/\[C@@H\](C\[C@H\](\[C@@H\](C(O)=N\C=C\C(=NCCCO)O)O)C)O)/C)O)O)O)O)O)O)O)O)O)C)(O1)C)C)O)O)O)O)O)O)C)O)O)O)O)O)O)O)O)O)O)O)O)O)O)=C)O)O)O)C)O)O)O)O)O)O)

~~小さすぎる~~

## まとめ

ちょっとチャレンジングな実装でしたが、簡単なπ共役系や低分子化合物であればいい感じに描画できるようになりました。ひとまずは満足です。
