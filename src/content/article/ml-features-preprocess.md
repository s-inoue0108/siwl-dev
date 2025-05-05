---
isDraft: false
isLimited: false
title: 機械学習における特徴量の前処理の実装
category: tech
tags: [ml, python, pandas, numpy, sklearn]
description: "機械学習モデルの構築では、教師データやテストデータの適切な前処理をする必要があります。このエントリでは、Python による実装例をまとめていきます。"
publishDate: 2025-05-05T14:04:11+09:00
updateDate: 2025-05-05T14:25:36+09:00
relatedArticles: []
---

## カテゴリ変数のエンコード

- Label Encoding
  - カテゴリに対して一意な整数を割り振ります。エンコード後の整数が量的変数としてみなされるようなモデルでは注意する必要があります。
- One-Hot Encoding
  - カテゴリの存在を T/F で表現する新しいカラムを作成します。特徴量の次元が増大します。
- Count Encoding
  - カテゴリの出現回数に変換します。不均衡なデータであっても、重みを表現しやすいです。

Count Encoder を除く Encoder 各種は Scikit-learn に実装されていますが、自前での実装も可能です。
\
Label Encoder:

https://gist.github.com/s-inoue0108/62dd4fe322dee02e0e06034a7f5f0d7e

Count Encoder:

https://gist.github.com/s-inoue0108/74b58fc969ac70c266a2b69097c6bb36