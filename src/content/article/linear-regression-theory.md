---
isDraft: false
isLimited: false
title: 線形回帰モデルの理論
category: idea
tags: [ml, python, sklearn]
description: "線形回帰モデルの理論について、重回帰、Lasso, Ridge, ElasticNet の実装を交えながらまとめていきます。"
publishDate: 2025-05-17T22:10:46+09:00
updateDate: 2025-05-24T18:13:03+09:00
relatedArticles: []
---

## 線形回帰モデル

### 定義

説明変数の組 $\bm{x} = [x_1, x_2, \ldots, x_p]^\top$ を用いて目的変数 $y$ を予測する次の1次式モデル：

$$
y = \beta_0 + \beta_1 x_1 + \cdots \beta_p x_p + \varepsilon
$$

を用いる場合、モデルは**重回帰モデル**とよばれ、線形回帰の基本的な形式です。ここで $\bm{\beta} = [\beta_0, \beta_1, \beta_2, \ldots, \beta_p]^\top$ は各説明変数の重みで、これを回帰係数といいます。

また、$\varepsilon$ は誤差項で、たいていは正規分布にしたがう場合 ($\varepsilon \sim N(0, \sigma^2)$) を仮定します（Gauss-Markov モデル）。

### 最小二乗法

重回帰モデルでは、$\bm{\beta}$ の推定量 $\hat{\bm{\beta}} = [\hat{\beta_0}, \hat{\beta_1}, \hat{\beta_2}, \ldots, \hat{\beta_p}]^\top$ をデータを使用して求めることを行います。いま、サイズ $n$ のデータセット：

$$
\bm{X} = \begin{bmatrix} 1 & x_{11} & x_{12} & \cdots & x_{1p} \\ 1 & x_{21} & x_{22} & \cdots & x_{2p} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_{n1} & x_{n2} & \cdots & x_{np} \end{bmatrix}, \quad \bm{y} = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix}
$$

を重回帰モデルにあてはめると、

$$
\bm{y} = \bm{X}\bm{\beta} + \bm{\varepsilon}
$$

となります（$\bm{\varepsilon} = [\varepsilon_1, \varepsilon_2, \ldots, \varepsilon_n]^\top \sim N(\bm{0}, \Sigma^2)$）。いま、回帰の程度を評価する指標（損失関数 $L$）として、平均二乗誤差（MSE）：

$$
\operatorname{MSE} = \frac{1}{n}\sum_{i = 1}^n {\varepsilon_i}^2 = \frac{1}{n} || \bm{y} - \bm{X}\bm{\beta} ||^2
$$

を考えます。最小二乗法は、MSE を最小化するような $\bm{\beta}$ として推定量 $\hat{\bm{\beta}}$ を求める手法です。すなわち、

$$
\hat{\bm{\beta}} = \argmin_{\bm{\beta} \in \mathbb{R}^{p + 1}} \operatorname{MSE}(\bm{\beta}) \Longleftrightarrow \frac{\partial}{\partial \bm{\beta}} \operatorname{MSE}(\bm{\beta}) = \bm{0} \Longleftrightarrow \frac{\partial}{\partial \bm{\beta}} || \bm{y} - \bm{X}\bm{\beta} ||^2 = \bm{0}
$$

が $\hat{\bm{\beta}}$ を求めるための条件となります。これを計算すると、

$$
\hat{\bm{\beta}} = (\bm{X}^\top \bm{X})^{-1} \bm{X}^\top \bm{y}
$$

を得ます。

> [!tip:fold] 導出
>
> $$
> || \bm{y} - \bm{X}\bm{\beta} ||^2 = \bm{y}^\top \bm{y} - 2\bm{y}^\top \bm{X} \bm{\beta} + \bm{\beta}^\top \bm{X}^\top \bm{X} \bm{\beta}
> $$
>
> の各項の微分を考えると、
>
> $$
> \frac{\partial}{\partial \bm{\beta}} \bm{y}^\top \bm{y} = \bm{0}
> $$
>
> $$
> \frac{\partial}{\partial \bm{\beta}} 2\bm{y}^\top \bm{X} \bm{\beta} = (2 \bm{y}^\top \bm{X})^\top = 2\bm{X}^\top \bm{y}
> $$
>
> $$
> \frac{\partial}{\partial \bm{\beta}} \bm{\beta}^\top \bm{X}^\top \bm{X} \bm{\beta} = \frac{\partial \bm{X \beta}}{\partial \bm{\beta}} \frac{\partial}{\partial \bm{X \beta}}(\bm{X} \bm{\beta})^\top \bm{X} \bm{\beta} = \bm{X}^\top (2 \bm{X} \bm{\beta}) = 2 \bm{X}^\top \bm{X} \bm{\beta}
> $$
>
> であるから、
>
> $$
> \frac{\partial}{\partial \bm{\beta}} || \bm{y} - \bm{X}\bm{\beta} ||^2 = -2\bm{X}^\top \bm{y} + 2 \bm{X}^\top \bm{X} \bm{\beta} = \bm{0}
> $$
>
> $$
> \therefore \hat{\bm{\beta}} = (\bm{X}^\top \bm{X})^{-1} \bm{X}^\top \bm{y}
> $$
>
> ※ベクトルの微分については[このページ](https://manabitimes.jp/math/2719)などを参照

### 最尤法

最尤法は、パラメータ $\bm{\theta}$ による対数尤度関数：

$$
\log L(\bm{\theta}) = \sum_{i=1}^n \log f(y_i | \bm{\theta})
$$

を最大化することで $\hat{\bm{\beta}}$ を推定する手法です。

ただし、$f(y_i | \bm{\theta})$ はデータ $y_i$ をサンプリングした確率分布の確率密度関数です。Gauss-Markov 重回帰モデルでは、$y_i$ に対応する確率変数 $Y_i$ について $Y_i \sim N(\bm{x}_i\bm{\beta}, \sigma^2)$ ですから、$f(y_i | \bm{\theta})$ は正規分布の確率密度関数になります：

$$
f(y_i | \bm{x}_i\bm{\beta}, \sigma^2) = \frac{1}{\sqrt{2\pi \sigma^2}} \exp \left[ -\frac{(y_i - \bm{x}_i \bm{\beta})^2}{2\sigma^2} \right]
$$

したがって、対数尤度関数は

$$
\log L(\bm{\beta}) =  -\frac{1}{2\sigma^2} ||\bm{y} - \bm{X}\bm{\beta}||^2 - \frac{n}{2} \log 2\pi\sigma^2
$$

となります。これを $\bm{\beta}$ の変化に対して最大化することを考えると、$\bm{\beta}$ に依存する部分は第一項の $||\bm{y} - \bm{X}\bm{\beta}||^2$ ですから、

$$
\frac{\partial \log L(\bm{\beta})}{\partial \bm{\beta}} = \bm{0} \Longleftrightarrow \frac{\partial}{\partial \bm{\beta}} || \bm{y} - \bm{X}\bm{\beta} ||^2 = \bm{0} \Longleftrightarrow \hat{\bm{\beta}} = (\bm{X}^\top \bm{X})^{-1} \bm{X}^\top \bm{y}
$$

となって、**最小二乗推定量と最尤推定量は一致する**ことがわかります。

### 決定係数

目的変数の予測値を $\hat{\bm{y}}= {\bm{X}}^\top \hat{\bm{\beta}}$ とします。また、目的変数の平均 $\bar{y} = (1 / n) \sum_{i=1}^n y_i$ を定義するとき、**決定係数** $R^2$ は次のように書くことができます。

$$
R^2 = 1 - \frac{|| \bm{y} - \hat{\bm{y}} ||^2}{|| \bm{y} - \bar{y} \bm{1} ||^2}, \quad \bm{1} := [1, 1, \ldots, 1]^\top \in \mathbb{R}^n
$$

### Python による実装

ここでは、重回帰モデルを NumPy, Pandas で実装してみましょう。`LinearRegression` クラスを実装し、そのメソッドとして以下を定義します。

*[!table] LinearRegression クラス*

| メソッド           | 説明                                                                                               |
| :----------------- | :------------------------------------------------------------------------------------------------- |
| `fit(X, y)`        | トレーニングデータセット $(\bm{X}, \bm{y})$ から最小二乗推定量 $\hat{\bm{\beta}}$ を計算します。   |
| `transform(X)`     | テストデータ $\bm{X}$ から目的変数の推定量 $\hat{\bm{y}} = \bm{X} \hat{\bm{\beta}}$ を計算します。 |
| `score(y, y_pred)` | 回帰の決定係数 $R^2$ を計算します。                                                                |

データセットは、[『化学のための Python によるデータ解析・機械学習入門 第1版』](https://www.amazon.co.jp/%E5%8C%96%E5%AD%A6%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AE-Python%E3%81%AB%E3%82%88%E3%82%8B%E3%83%87%E3%83%BC%E3%82%BF%E8%A7%A3%E6%9E%90%E3%83%BB%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E5%85%A5%E9%96%80-%E9%87%91%E5%AD%90-%E5%BC%98%E6%98%8C/dp/4274224414) における「有機化合物の水溶解度データセット」を利用させていただきます。

https://github.com/hkaneko1985/python_data_analysis_ohmsha/blob/master/sample_data/molecules_with_logS.csv

特徴量として、SMILES を RDKit で MACCSKeys フィンガープリントに展開したものを用います。

```py:fingerprint.py
import numpy as np
import pandas as pd
from rdkit import Chem
from rdkit.Chem import AllChem

df = pd.read_csv(
    "https://github.com/hkaneko1985/python_data_analysis_ohmsha/blob/master/sample_data/molecules_with_logS.csv", 
    index_col=0
)

mols = [Chem.MolFromSmiles(smiles) for smiles in df["SMILES"]]
fps = [AllChem.GetMACCSKeysFingerprint(mol) for mol in mols]
```

```py:linear_regression.py
class LinearRegresssion:
    def __init__(self):
        self.X = None
        self.y = None
        self.beta = None
      
    def fit(self, X, y):
        self.X = X
        self.y = y
        self.beta = np.linalg.inv(self.X.T @ self.X) @ self.X.T @ self.y
    
    def predict(self, X):
        return X.T @ self.beta
    
    def score(self, y, y_pred):
        return 1 - (np.norm(y - y_pred) ** 2 / np.norm(y - np.mean(y) * np.ones(y.shape)) ** 2)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
r2_score = model.score(y_train, y_pred)
```

## Lasso 回帰

説明変数が多い場合、線形回帰モデルが**過学習 (Overfitting)** を起こしてしまう場合があります。これを抑えるため、**Lasso 回帰モデル**では MSE に加えて $L_1$-ノルムを用いた正則化項を導入した損失関数を最小化します。

$$
\hat{\bm{\beta}}_\mathrm{Lasso} = \argmin_{\bm{\beta} \in \mathbb{R}^{p + 1}} \left( \operatorname{MSE}(\bm{\beta}) + \lambda \sum_{j = 1}^p |\beta_j| \right)
$$

$\lambda$ は正則化項の重みで、ユーザーが恣意的に決定するハイパーパラメータです。

## Ridge 回帰

**Rigde 回帰モデル**では MSE に加えて $L_2$-ノルムを用いた正則化項を導入した損失関数を最小化します。

$$
\hat{\bm{\beta}}_\mathrm{Ridge} = \argmin_{\bm{\beta} \in \mathbb{R}^{p + 1}} \left( \operatorname{MSE}(\bm{\beta}) + \frac{\alpha}{2} \sum_{j = 1}^p {\beta_j}^2 \right)
$$

同様に $\alpha$ は正則化項の重みで、ユーザーが恣意的に決定するハイパーパラメータです。係数 $1/2$ は微分の都合上導入しています。

## ElasticNet 回帰

**ElasticNet 回帰モデル** は Lasso 回帰と Ridge 回帰の混合モデルです。

$$
\hat{\bm{\beta}}_\mathrm{ElasticNet} = \argmin_{\bm{\beta} \in \mathbb{R}^{p + 1}} \left( \operatorname{MSE}(\bm{\beta}) + \alpha \left( \rho \sum_{j = 1}^p |\beta_j| + \frac{1 - \rho}{2} \sum_{j = 1}^p {\beta_j}^2 \right) \right)
$$

ハイパーパラメータは正則化項全体の重みを決める $\alpha$ と、$L_1$ 正則化の比率を決める $\rho$ の二つになります。

### Python による実装

ここでは、`sklearn.linear_model` を用いて簡単に実装してみたいと思います。