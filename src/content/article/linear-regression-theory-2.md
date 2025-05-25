---
isDraft: false
isLimited: false
title: 線形回帰モデルの理論 (2)
category: idea
tags: [ml, python, sklearn]
description: "線形回帰モデルの理論について、Scikit-learn と RDKit を用いた QSAR ロジスティック回帰モデルの実装を交えながらまとめていきます。"
publishDate: 2025-05-26T03:04:11+09:00
updateDate: 2025-05-26T03:53:13+09:00
relatedArticles: [linear-regression-theory]
---

## ロジスティック回帰モデル

## 定義

目的変数 $y$ が二値データ $(y \in \{0, 1\})$ である場合、説明変数の組 $\bm{x} = [x_1, x_2, \ldots, x_p]^\top$ を用いた次の線形モデル：

$$
\log \frac{P}{1 - P} = \beta_0 + \beta_1 x_1 + \cdots \beta_p x_p
$$

を**ロジスティック回帰モデル**といいます。ここで $\bm{\beta} = [\beta_0, \beta_1, \beta_2, \ldots, \beta_p]^\top$ は回帰係数で、$P$ は観測値 $y$ を与える確率変数 $Y$ が従う Bernoulli 分布の生起確率です：

$$
Y \sim Bin(1, P)
$$

すなわち、$P$ は $Y \in \{0, 1\}$ が $1$ をとる確率です。$P$ に対し、上式左辺 $\log (P/(1 - P))$ を**ロジット (対数オッズ)** といいます。目的変数が二値しかとらない離散変数であっても、ロジットは $(-\infty, \infty)$ の範囲で連続値をとるため、回帰モデルによる予測が可能となります。

## 最尤法

$\bm{\beta}$ の推定量 $\hat{\bm{\beta}} = [\hat{\beta_0}, \hat{\beta_1}, \hat{\beta_2}, \ldots, \hat{\beta_p}]^\top$ を求めるため、サイズ $n$ のデータセット：

$$
\bm{X} = \begin{bmatrix} 1 & x_{11} & x_{12} & \cdots & x_{1p} \\ 1 & x_{21} & x_{22} & \cdots & x_{2p} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_{n1} & x_{n2} & \cdots & x_{np} \end{bmatrix}, \quad \bm{y} = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix} \in \{0, 1\}^n
$$

をモデルにあてはめると、

$$
\log \frac{\bm{P}}{\bm{1} - \bm{P}} = \bm{X}\bm{\beta}, \quad \bm{P} = [P_1, \ldots, P_n]^\top, ~ \bm{Y} \sim \otimes_{j=1}^n Bin(1, P_j)
$$

となります。Bernoulli 分布 $Bin(1, P_i)$ の確率質量関数は、

$$
f(y_i = 1 | P_i) = {P_i}^{y_i} (1 - P_i)^{1 - y_i}
$$

ですから、対数尤度関数は

$$
\log L(\bm{\beta}) = \sum_{i = 1}^n \log [{P_i}^{y_i} (1 - P_i)^{1 - y_i}]
$$

となります。これを計算すると、

$$
\log L(\bm{\beta}) = \bm{y}^\top \bm{X} \bm{\beta} - \sum_{i = 1}^n \log(1 + e^{{\bm{x}_i}^\top \bm{\beta}})
$$

となって、数値計算により $\partial \log L(\bm{\beta}) / \partial \bm{\beta} = \bm{0}$ を解くことで $\hat{\bm{\beta}}$ を求めることができます。

## 正則化ロジスティック回帰モデル

## Python によるロジスティック回帰モデルの実装