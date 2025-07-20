---
isDraft: true
isLimited: false
title: GNN を理解したい (1) 基本理論編
category: idea
tags: [ml, python, pytorch, nn, comp-science]
description: "GNN (Graph Neural Network) について、その理論から PyTorch Geometric による実装までを理解するシリーズです。"
publishDate: 2025-07-20T22:10:24+09:00
updateDate: 2025-07-20T22:10:24+09:00
relatedArticles: []
---

## 参考

以下の記事をベースに進めていきます。数式記号の定義も以下の記事に則っています。

https://qiita.com/shionhonda/items/d27b8f13f7e9232a4ae5

また、以下の記事も参考にさせていただきました。

https://zenn.dev/dena/articles/83c2daff760f5d

## グラフの行列表現

### 隣接行列

グラフ $G = (V, E)$ は重みのない無向グラフであるとします。このとき、2つのノード $i,j$ の接続情報を記した**隣接行列** $\bm{A} = (a_{ij})$ を以下のように定義できます。

$$
a_{ij} = 
\begin{cases}
  1 \quad& (i,j \in E, ~ i \neq j) \\
  0 \quad& (\textrm{otherwise})
\end{cases}
$$

### 次数行列

各ノードから伸びるエッジの数を表す**次数行列** $\bm{D} = (d_{ij})$ を次のように定義できます。

$$
d_{ij} = 
\begin{cases}
  \sum_{k=1}^N a_{ik} \quad& (i = j) \\
  0 \quad& (\textrm{otherwise})
\end{cases}
$$

### Laplacian 行列

これらを用いて、グラフの **Laplacian 行列** $\bm{L}$ は以下のように定義されます。

$$
\bm{L} := \bm{D} - \bm{A}
$$

また、$\bm{D}$ で正規化した Laplacian 行列 $\bm{\mathcal{L}}$ は、

$$
\bm{\mathcal{L}} = \bm{D}^{-1/2} \bm{L} \bm{D}^{-1/2}
$$

となります。$\bm{A}$ は対称行列、$\bm{D}$ は対角行列であることから、Laplacian 行列は対称行列となります。

## Spectral GNN

### Graph Fourier Transform

$G$ の各ノードに割り当てられた Feature Vector に対して Fourier 変換を施すことを **Graph Fourier Transform** といいます。