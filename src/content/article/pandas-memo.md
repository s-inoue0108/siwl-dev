---
isDraft: false
title: Python/Pandas 備忘録
category: tech
tags: [python]
description: Python で2次元データを扱うライブラリである Pandas の備忘録です。
publishDate: 2024-11-24T10:52:31+09:00
updateDate: 2024-11-25T11:54:11+09:00
relatedArticles: []
---

```python:Pandasを読み込む
import pandas as pd
```

## DataFrame と Series の初期化

```python:初期化
# シリーズ
s = pd.Series(["A", "B", "C"])

# データフレーム：リストから初期化
df = pd.DataFrame({
  "name": ["Nick", "John"],
  "age": [24, 30],
  "role": ["member", "leader"],
})

# データフレーム：ファイルを読み込む
# sep:区切り文字
# names:ヘッダー
# skiprow:先頭行のスキップ
# skipfooter:後方行のスキップ
df = pd.read_csv("data.txt", sep="\t", header=None, names=["A", "B", "C"])
```

## インデックス・ヘッダー

```python:インデックス・ヘッダー
# インデックス
df.index
df.index = ["row_1", "row_2",...]   # インデックスを変更する

# ヘッダー
df.columns
df.columns = ["col_1", "col_2",...]   # ヘッダーを変更する
```

## 参照と加工

### スライスによる参照

```python:スライス
# 行の参照（スライス）
df[I]           # I行目
df[[I1, I2]]    # 任意のN行
df[start:end]   # 任意の範囲
df.head(I)      # 先頭I行

# 列の参照（スライス）
df[["col_1", "col_2",...]]   # 任意のJ列
df["col_1":"col_2"]          # 任意の範囲
```

### loc, iloc による加工

行について、`loc` プロパティはラベルを、`iloc` プロパティはインデックスを用います。

```python:loc,iloc
# 行の参照
df.loc[I]           # I行目
df.loc[start:end]   # 任意の範囲

# 行、列の参照
df.loc[I, "col_J"]   # ラベルによる参照
df.iloc[I, J]        # インデックスによる参照

# 範囲参照
df.loc[start:end, "col_1":"col_2"]         # 任意の範囲
df.loc[[I1, I2], ["col_1", "col_2",...]]   # 任意のN行M列
```

### merge, join による DataFrame の結合

## 統計関数

## ファイルへの書き出し