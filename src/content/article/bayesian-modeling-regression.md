---
isDraft: false
isLimited: false
title: 線形回帰の正則化と Bayes モデリング
category: idea
tags: [ml]
description: "機械学習の文脈でよく用いられる線形回帰モデルとその正則化について、Bayes の定理を基礎とする統計モデリングによって導出していきます。"
publishDate: 2026-06-07T21:49:47+09:00
updateDate: 2026-06-07T23:19:31+09:00
relatedArticles: []
---

> [!warn]
>
> 表現は正確でない場合があります。

## 道具立て

### Bayes の定理

確率分布 $P$ で表される統計モデルの未知パラメータを $\bm{\theta} \in \Theta$、$P$ からのデータを $X$ とする。これらについて、

> [!tip] Bayes の定理
>
> $$
> P(\bm{\theta}|X) = \frac{P(X|\bm{\theta})P(\bm{\theta})}{P(X)}
> $$

が成り立つ。ここで、

- $P(\bm{\theta})$：事前分布
- $P(\bm{\theta}|X)$：事後分布
- $P(X|\bm{\theta})$：尤度
- $P(X)$：周辺尤度

という。

### モデルパラメータ推定法

#### 最尤 (MLE) 推定

データ $X$ に対して、パラメータが与えられたときデータ $X$ が得られる確率 (尤度) を最大化する方法。

> [!tip] MLE 推定量
>
> $$
> \hat{\bm{\theta}}_\mathrm{MLE} = \argmax_{\bm{\theta}} P(X|\bm{\theta})
> $$

#### 最大事後確率 (MAP) 推定

データ $X$ を得た後の、パラメータの分布 (事後分布) を最大化する方法。

> [!tip] MAP 推定量
>
> $$
> \hat{\bm{\theta}}_\mathrm{MAP} = \argmax_{\bm{\theta}} P(X|\bm{\theta})P(\bm{\theta})
> $$

ここで $P(X)$ は規格化定数と見做せる。この方法では、事前知識としてパラメータの分布 $P(\bm{\theta})$ を埋め込む事ができる。

## 線形重回帰モデルと Bayes モデリング

Gauss-Markov 型の線形回帰モデル (サンプルサイズ $N$)：

$$
\bm{y} = X\bm{\beta} + \bm{\varepsilon}, \quad \bm{\varepsilon} \sim N(\bm{0}, \sigma^2\bm{I}_N)
$$

を考え、モデルパラメータ (回帰係数) の推定量 $\hat{\bm{\beta}}$ を求める。

### MLE 推定

モデルの対数尤度は

$$
\ln P(X|\bm{\beta}) = -\frac{1}{2\sigma^2} || \bm{y} - X\bm{\beta} ||^2 - \frac{N}{2} \ln(2\pi \sigma^2)
$$

であるから、MLE 推定量 $\hat{\bm{\beta}}_\mathrm{MLE}$ は

> [!important]
>
> $$
> \hat{\bm{\beta}}_\mathrm{MLE} = \argmin_{\bm{\beta}} || \bm{y} - X\bm{\beta} ||^2
> $$
>
> これは**最小二乗 (OLS) 推定量**に等しい。

あるいは、一様分布を事前分布 ($P(\bm{\beta}) \propto \bm{1}$) とする場合の MAP 推定量 $\hat{\bm{\beta}}_\mathrm{MAP}$ とも解釈できる。

### MAP 推定 (正規分布を仮定)

回帰係数の事前分布として、平均ゼロ、分散 $\tau^2$ の i.i.d な正規分布：

$$
\bm{\beta} \sim N(\bm{0}, \tau^2 \bm{I}_N)
$$

を課す。規格化定数を除く確率密度は

$$
P(\bm{\beta}) \propto \exp\left(-\frac{|| \bm{\beta} ||^2}{2\tau^2}\right)
$$

である。Bayes の定理から、対数事後分布は

$$
\begin{aligned}
& \ln P(X|\bm{\beta}) \\
& \propto \ln P(\bm{\beta}|X) + \ln P(\bm{\beta}) \\
& = -\frac{1}{2\sigma^2} || \bm{y} - X\bm{\beta} ||^2 - \frac{N}{2} \ln(2\pi \sigma^2) -\frac{|| \bm{\beta} ||^2}{2\tau^2}
\end{aligned}
$$

の形をとることがわかる。よって、MAP 推定量 $\hat{\bm{\beta}}_\mathrm{MAP}$ は

> [!important]
>
> $$
> \hat{\bm{\beta}}_\mathrm{MAP} = \argmin_{\bm{\beta}} \left( || \bm{y} - X\bm{\beta} ||^2 + \lambda || \bm{\beta} ||^2 \right), \quad \lambda := \frac{\sigma^2}{\tau^2}
> $$
>
> これは **Ridge 回帰 ($L_2$-正則化)** に等しい。

### MAP 推定 (Laplace 分布を仮定)

以下の確率密度関数が与える分布を **Laplace 分布**という：

$$
f(x; \mu, b) = \frac{1}{2b} \exp\left(-\frac{|x - \mu|}{b}\right)
$$

$\bm{\beta}$ がパラメータ $b$ の i.i.d な Laplace 分布に従うとすると、

$$
P(\bm{\beta}) \propto \exp\left( -\frac{|| \bm{\beta} ||_1}{b} \right)
$$

よって、対数事後分布は

$$
\begin{aligned}
& \ln P(X|\bm{\beta}) \\
& \propto \ln P(\bm{\beta}|X) + \ln P(\bm{\beta}) \\
& = -\frac{1}{2\sigma^2} || \bm{y} - X\bm{\beta} ||^2 - \frac{N}{2} \ln(2\pi \sigma^2) -\frac{|| \bm{\beta} ||_1}{b}
\end{aligned}
$$

の形をとることがわかる。よって、MAP 推定量 $\hat{\bm{\beta}}_\mathrm{MAP}$ は

> [!important]
>
> $$
> \hat{\bm{\beta}}_\mathrm{MAP} = \argmin_{\bm{\beta}} \left( || \bm{y} - X\bm{\beta} ||^2 + \lambda || \bm{\beta} ||_1 \right), \quad \lambda := \frac{2\sigma^2}{b}
> $$
>
> これは **LASSO 回帰 ($L_1$-正則化)** に等しい。

## Group LASSO

$\bm{\beta}$ に関する事前知識として、説明変数のグループ $g \in G$ ごとの単位で回帰係数 $\bm{\beta}_g$ を定めたいとする。すなわち、

$$
P(\bm{\beta}) \propto \exp \left( -b \sum_{g \in G} || \bm{\beta}_g || \right)
$$

という事前分布を課すと、対数事後分布は

$$
\begin{aligned}
& \ln P(X|\bm{\beta}) \\
& \propto \ln P(\bm{\beta}|X) + \ln P(\bm{\beta}) \\
& = -\frac{1}{2\sigma^2} || \bm{y} - X\bm{\beta} ||^2 - \frac{N}{2} \ln(2\pi \sigma^2) -b \sum_{g \in G} || \bm{\beta}_g ||
\end{aligned}
$$

よって、

> [!important]
>
> $$
> \hat{\bm{\beta}}_\mathrm{MAP} = \argmin_{\bm{\beta}} \left( || \bm{y} - X\bm{\beta} ||^2 + \lambda \sum_{g \in G} || \bm{\beta}_g || \right), \quad \lambda := \frac{2\sigma^2}{b}
> $$
>
> これを **Group LASSO** という。

## まとめ

線形回帰における正則化は、Bayes モデリングの文脈において事前知識を組み込んだ尤度の最大化と見なす事ができます：

| 正則化 | 事前分布       | 事前分布の関数形                                                           |
| :---- | :---------- | :--------------------------------------------------------------------- |
| なし   | 一様分布      | $P(\bm{\beta}) \propto \bm{1}$                                         |
| $L_2$ | 正規分布      | $P(\bm{\beta}) \propto \exp\left(-\| \bm{\beta} \|^2 / 2\tau^2\right)$ |
| $L_1$ | Laplace 分布 | $P(\bm{\beta}) \propto \exp\left( -\| \bm{\beta} \|_1 / b \right)$     |

他の線形回帰モデル (ロジスティック回帰, Poisson 回帰など) への拡張等を含め、他にもいろいろあるみたいなので、気が向いたら勉強してみます。