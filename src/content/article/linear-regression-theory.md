---
isDraft: false
isLimited: false
title: 線形回帰モデルの理論と実装
category: idea
tags: [ml, python, sklearn]
description: "重回帰モデルをはじめとした線形回帰モデルの理論について解説します。さらに、Scikit-learn と RDKit を用い、定量的構造-活性相関（QSAR）を例に、モデルの実装を行います。"
publishDate: 2025-05-17T22:10:46+09:00
updateDate: 2025-06-01T15:24:01+09:00
relatedArticles: []
---

## 重回帰モデル

### 定義

説明変数の組 $\bm{x} = [x_1, x_2, \ldots, x_p]^\top$ を用いて目的変数 $y$ を予測する次の1次式モデル：

$$
y = \beta_0 + \beta_1 x_1 + \cdots \beta_p x_p + \varepsilon
$$

を用いる場合、モデルは**重回帰モデル**とよばれ、線形回帰の基本的な形式です。ここで $\bm{\beta} = [\beta_0, \beta_1, \beta_2, \ldots, \beta_p]^\top$ は各説明変数の重みで、これを回帰係数といいます。

また、$\varepsilon$ は誤差項で、たいていは正規分布にしたがう場合 ($\varepsilon \sim N(0, \sigma^2)$) を仮定します（Gauss-Markov モデル）。

### 最小二乗法

$\bm{\beta}$ の推定量 $\hat{\bm{\beta}} = [\hat{\beta_0}, \hat{\beta_1}, \hat{\beta_2}, \ldots, \hat{\beta_p}]^\top$ を、データを使用して求めることを考えます。いま、サイズ $n$ のデータセット：

$$
\bm{X} = \begin{bmatrix} 1 & x_{11} & x_{12} & \cdots & x_{1p} \\ 1 & x_{21} & x_{22} & \cdots & x_{2p} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_{n1} & x_{n2} & \cdots & x_{np} \end{bmatrix}, \quad \bm{y} = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix}
$$

が得られているとき、重回帰モデルは

$$
\bm{y} = \bm{X}\bm{\beta} + \bm{\varepsilon}
$$

となります（$\bm{\varepsilon} = [\varepsilon_1, \varepsilon_2, \ldots, \varepsilon_n]^\top \sim N(\bm{0}, \Sigma^2)$）。最小二乗法は、目的関数として平均二乗誤差（MSE）：

$$
\operatorname{MSE} = \frac{1}{n}\sum_{i = 1}^n {\varepsilon_i}^2 = \frac{1}{n} || \bm{y} - \bm{X}\bm{\beta} ||^2
$$

を採用し、これを最小化するような $\bm{\beta}$ として推定量 $\hat{\bm{\beta}}$ を求める手法です。すなわち、

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

最尤法は、パラメータ $\bm{\theta}$ についての対数尤度関数：

$$
\log L(\bm{\theta}) = \sum_{i=1}^n \log f(y_i | \bm{\theta})
$$

を最大化することで、パラメータの推定量 $\hat{\bm{\theta}}$ を得る手法として知られています。

ただし、$f(y_i | \bm{\theta})$ はデータ $y_i$ をサンプリングした確率分布の確率密度関数です。Gauss-Markov 重回帰モデルにおいては、$y_i$ を与える確率変数 $Y_i$ について $Y_i \sim N(\bm{x}_i\bm{\beta}, \sigma^2)$ ですから、$f(y_i | \bm{\theta})$ は正規分布の確率密度関数になります：

$$
f(y_i | \bm{x}_i\bm{\beta}, \sigma^2) = \frac{1}{\sqrt{2\pi \sigma^2}} \exp \left[ -\frac{(y_i - \bm{x}_i \bm{\beta})^2}{2\sigma^2} \right]
$$

したがって、対数尤度関数は

$$
\log L(\bm{\beta}) =  -\frac{1}{2\sigma^2} ||\bm{y} - \bm{X}\bm{\beta}||^2 - \frac{n}{2} \log 2\pi\sigma^2
$$

となります。これを $\bm{\beta}$ の変化に対して最大化することを考えると、$\bm{\beta}$ に依存する部分は第一項 $||\bm{y} - \bm{X}\bm{\beta}||^2$ のみですから、

$$
\frac{\partial \log L(\bm{\beta})}{\partial \bm{\beta}} = \bm{0} \Longleftrightarrow \frac{\partial}{\partial \bm{\beta}} || \bm{y} - \bm{X}\bm{\beta} ||^2 = \bm{0} \Longleftrightarrow \hat{\bm{\beta}} = (\bm{X}^\top \bm{X})^{-1} \bm{X}^\top \bm{y}
$$

となって、**最小二乗推定量と最尤推定量は一致する**ことがわかります。

### 決定係数

目的変数の予測値を $\hat{\bm{y}}= {\bm{X}}^\top \hat{\bm{\beta}}$ とします。また、目的変数の平均 $\bar{y} = (1 / n) \sum_{i=1}^n y_i$ を定義するとき、**決定係数** $R^2$ は次のように書くことができます。

$$
R^2 = 1 - \frac{|| \bm{y} - \hat{\bm{y}} ||^2}{|| \bm{y} - \bar{y} \bm{1} ||^2}, \quad \bm{1} := [1, 1, \ldots, 1]^\top \in \mathbb{R}^n
$$

決定係数は $0 < R^2 \le 1$ の値をとり、その値が大きいほどモデルの予測精度が高いことを示します。

決定係数は説明変数の数に依存して大きくなる傾向があるため、説明変数の数が多いモデルの精度評価においては、変数自由度を調整した決定係数：

$$
R^2_{\mathrm{adj}} = 1 - \frac{|| \bm{y} - \hat{\bm{y}} ||^2 / (n - d - 1)}{|| \bm{y} - \bar{y} \bm{1} ||^2 / (n - 1)}
$$

を用いる場合もあります。

### 変数選択

よい重回帰モデルを構築するためには、説明力のある説明変数を適切に選択する必要があります。$F$ 統計量による仮説検定では、モデルの回帰係数 $\beta_j ~ (j = 1, \ldots, d, ~ d \le p)$ が非ゼロであるかどうか（説明変数として有効かどうか）を検証できます。

帰無仮説 $H_0: \beta_1 = \beta_2 = \cdots = \beta_d = 0$ のもとでの $F$ 統計量は、

$$
F = \frac{|| \hat{\bm{y}} - \bar{y}\bm{1} ||^2 / d}{|| \bm{y} - \hat{\bm{y}} ||^2 / (n - d - 1)} \sim F(d, n - d -1)
$$

となります。この結果を変数選択の判断に活用することができます。

また、赤池情報量基準（AIC）：

$$
\operatorname{AIC}(d) = n \left(\log \sum_{i = 1}^d {\varepsilon_i}^2 + \log \frac{2\pi}{n} + 1 \right) + 2(p + 2)
$$

の値を計算し、これができるだけ小さくなるような変数選択も有効です。

## 正則化線形回帰モデル

### 多重共線性

上で示したように、$\hat{\bm{\beta}}$ の計算では逆行列 $(\bm{X}^\top \bm{X})^{-1}$ を求める必要があります。Cramer の公式により、この逆行列は $1 / \det (\bm{X}^\top \bm{X})$ に比例しますが、近い値（説明力）をもった説明変数の列が複数あるとき、行列式がゼロに近い値をとり、対応する $\hat{\beta}$ が発散してしまいます。
\
このような現象を**多重共線性**といい、これを回避するための方法として、重回帰モデルの目的関数である MSE に**正則化項**と呼ばれる項を加えたものを損失関数として最小化する手法が知られています。

### 過学習

機械学習モデルのトレーニングにおいて、モデルがトレーニングに使用したデータセットに過剰適合し、他のデータセットに対する予測精度が低下する現象を**過学習**といいます。正則化項は回帰係数の大きさを抑え、過学習を抑制します。

### Ridge 回帰

**Rigde 回帰モデル**では、MSE に加えて $L_2$-ノルムを用いた正則化項を導入した目的関数：

$$
E(\bm{\beta}) = \frac{1}{2n} || \bm{y} - \bm{X}\bm{\beta} ||^2 + \frac{\alpha}{2} \sum_{j = 1}^p {\beta_j}^2
$$

を最小化します。ここで $\alpha > 0$ は正則化項の重みで、ユーザーが恣意的に決定する**ハイパーパラメータ**です。係数 $1/2$ は微分の都合上導入しています。

Ridge 回帰の推定量は解析的に求めることができ、

$$
\hat{\bm{\beta}} = (\bm{X}^\top \bm{X} + \alpha \bm{I})^{-1} \bm{X}^\top \bm{y}
$$

となります（$\bm{I}$ は $p + 1$ 次の単位行列）。行列 $\bm{X}^\top \bm{X} + \alpha \bm{I}$ は必ず正則であるため、多重共線性に対してロバストになります。

> [!tip:fold] 行列 $\bm{X}^\top \bm{X} + \alpha \bm{I}$ の正則性
>
> ゼロベクトルでないような任意のベクトル $\bm{t} \in \mathbb{R}^{p + 1}$ をとり、$\bm{X}^\top \bm{X} + \alpha \bm{I}$ の二次形式を求めると、
>
> $$
> \bm{t}^\top(\bm{X}^\top \bm{X} + \alpha \bm{I})\bm{t} = \bm{t}^\top \bm{X}^\top \bm{X} \bm{t} + \alpha \bm{t}^\top \bm{t}
> $$
>
> となります。ここで、$\alpha > 0$ であることから
>
> $$
> \bm{t}^\top \bm{X}^\top \bm{X} \bm{t} + \alpha \bm{t}^\top \bm{t} = || \bm{X}\bm{t} ||^2 + \alpha || \bm{t} ||^2 > 0
> $$
>
> となるため、行列 $\bm{X}^\top \bm{X} + \alpha \bm{I}$ は正定値であり、ゆえに正則となります。

### Lasso 回帰

**Lasso 回帰モデル**では MSE に加えて $L_1$-ノルムを用いた正則化項を導入した目的関数：

$$
E(\bm{\beta}) = \frac{1}{2n} || \bm{y} - \bm{X}\bm{\beta} ||^2 + \lambda \sum_{j = 1}^p |\beta_j|
$$

を最小化します。$\lambda > 0$ は正則化項の重みで、ユーザーが恣意的に決定するハイパーパラメータです。$L_1$-ノルムは不連続点を持つため推定量を解析的に求めることはできず、数値計算で求めます。
\
Lasso 回帰のメリットは、変数選択性をもつことです。Ridge 回帰モデルにおける正則化は回帰係数の大きさを縮小するのみですが、Lasso 回帰モデルは$L_1$-ノルムに微分不能点があることから、回帰係数をゼロに誘導する効果があります。これを**スパース**といいます。

### ElasticNet 回帰

**ElasticNet 回帰モデル** は Lasso 回帰と Ridge 回帰の混合モデルです。目的関数は、

$$
E(\bm{\beta}) = \frac{1}{2n} || \bm{y} - \bm{X}\bm{\beta} ||^2 + \alpha \left( \rho \sum_{j = 1}^p |\beta_j| + \frac{1 - \rho}{2} \sum_{j = 1}^p {\beta_j}^2 \right)
$$

となります。ハイパーパラメータは正則化項全体の重みを決める $\alpha$ と、$L_1$ 正則化の比率を決める $\rho$ の二つになります。
\
Lasso 回帰モデルは、多重共線性のある説明変数間のスパースが不安定になるデメリットを持ちます。これを回避するため、ElasticNet 回帰モデルでは Ridge 回帰モデルのもつ多重共線性へのロバスト性を導入し、安定した変数選択を可能にします。

### スパースモデリング

データセットのサイズよりも特徴量の数が大きい場合、そのまま重回帰分析を行ってしまうと多重共線性や過学習の影響が大きくなってしまいます。そこで、モデルが一部の特徴量のみで説明できると仮定し（スパース性の仮定）、変数選択効果のあるアルゴリズムを組み込み、少ない変量数で問題を解く手法が多く提案されています。
\
これを**スパースモデリング**といいます。Lasso や ElasticNet はスパースモデリングでよく用いられる回帰モデルです。

## Python による重回帰モデルの実装

ここでは、有機化合物の [SMILES](https://ja.wikipedia.org/wiki/SMILES記法) から物理化学データを予測する重回帰モデルを Scikit-learn で実装してみましょう。

データセットは、金子 弘昌先生の[『化学のための Python によるデータ解析・機械学習入門』](https://www.amazon.co.jp/%E5%8C%96%E5%AD%A6%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AE-Python%E3%81%AB%E3%82%88%E3%82%8B%E3%83%87%E3%83%BC%E3%82%BF%E8%A7%A3%E6%9E%90%E3%83%BB%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E5%85%A5%E9%96%80-%E9%87%91%E5%AD%90-%E5%BC%98%E6%98%8C/dp/4274224414) における有機化合物の水溶解度 $(\log S)$ データセットを利用させていただきます。

https://github.com/hkaneko1985/python_data_analysis_ohmsha/blob/master/sample_data/molecules_with_logS.csv

また、Python ライブラリは以下のものを使用しました。

- NumPy `1.26.4`
- Pandas `2.2.2`
- Scikit-learn `1.5.0`
- RDKit `2023.9.6`

### 特徴量の構築

分子の水溶解度は、水素結合する $\mathrm{OH}$ 基の数などのパラメータとの相関があると推測できます。そこで、`RDkit` の `Chem.Lipinski` モジュールを用い、分子の Lipinski パラメータ[^1]で説明変数を作成します。

[^1]: Lipinski パラメータについては、https://www.chem-station.com/blog/2015/02/sp3.html などを参照してください。

> [!info:fold] コード
> 
> ```py
> import numpy as np
> import pandas as pd
> from rdkit import Chem
> from rdkit.Chem import Lipinski
> 
> # データの URL
> url = "https://raw.githubusercontent.com/hkaneko1985/python_data_analysis_ohmsha/refs/heads/master/sample_data/molecules_with_logS.csv"
> 
> # データフレームとして読み込む
> df = pd.read_csv(url, index_col=0)
> 
> # SMILES を MOL オブジェクトへ変換
> mols = [Chem.MolFromSmiles(smiles) for smiles in df["SMILES"]]
> 
> # Lipinski パラメータで説明変数を作る
> features = pd.DataFrame(
>     [
>         {
>             "FractionCSP3": Lipinski.FractionCSP3(mol),
>             "NHOHCount": Lipinski.NHOHCount(mol),
>             "NOCount": Lipinski.NOCount(mol),
>             "NumAliphaticCarbocycles": Lipinski.NumAliphaticCarbocycles(mol),
>             "NumAliphaticHeterocycles": Lipinski.NumAliphaticHeterocycles(mol),
>             "NumAliphaticRings": Lipinski.NumAliphaticRings(mol),
>             "NumAromaticCarbocycles": Lipinski.NumAromaticCarbocycles(mol),
>             "NumAromaticHeterocycles": Lipinski.NumAromaticHeterocycles(mol),
>             "NumAromaticRings": Lipinski.NumAromaticRings(mol),
>             "NumRotatableBonds": Lipinski.NumRotatableBonds(mol),
>             "NumSaturatedCarbocycles": Lipinski.NumSaturatedCarbocycles(mol),
>             "NumSaturatedHeterocycles": Lipinski.NumSaturatedHeterocycles(mol),
>             "NumSaturatedRings": Lipinski.NumSaturatedRings(mol),
>             "NumHAcceptors": Lipinski.NumHAcceptors(mol),
>             "NumHDonors": Lipinski.NumHDonors(mol),
>         }
>         for mol in mols
>     ],
>     index=df.index,
> )
> 
> # 目的変数と説明変数を結合
> dataset = pd.concat([df["logS"], features], axis=1)
> ```

### 前処理

データセットを $7:3$ の比率でトレーニングデータとテストデータへ分割し、正規化を行います。ここでは、Min-Max スケーリング：

$$
x_{j, \mathrm{scaled}} = \frac{x_j - x_{j, \mathrm{min}}}{x_{j, \mathrm{max}} - x_{j, \mathrm{min}}}, \quad x_j \in [x_1, x_2, \ldots, x_p]^\top
$$

を用います。

> [!info:fold] コード
> 
> ```py
> # 前処理
> from sklearn.model_selection import train_test_split
> from sklearn.preprocessing import MinMaxScaler
> 
> # データの分割
> train, test = train_test_split(dataset, test_size=0.3, random_state=42)
> 
> # 説明変数と目的変数を分離
> X_train, y_train = train.drop("logS", axis=1), train["logS"].to_numpy()
> X_test, y_test = test.drop("logS", axis=1), test["logS"].to_numpy()
> 
> # 正規化
> scaler = MinMaxScaler()
> X_train = scaler.fit_transform(X_train)
> X_test = scaler.transform(X_test)
> ```

### 学習と予測

前処理したトレーニングデータセットでモデルを構築し、テストデータセットで予測を行います。

> [!info:fold] コード
>
> ```py
> from sklearn.linear_model import LinearRegression
> from sklearn.metrics import r2_score
> 
> # 学習
> model = LinearRegression()
> model.fit(X_train, y_train)
> 
> # 予測と決定係数の計算
> y_pred = model.predict(X_test)
> score = r2_score(y_test, y_pred)
> ```

テストデータによる予測では $R^2 = 0.568$ となりました。

### 性能評価

モデルがどのくらいの予測精度となったかを、散布図で確認してみます。

> [!info:fold] コード
>
> ```py
> import matplotlib.pyplot as plt
> 
> fig = plt.figure(figsize=(6, 6))
> ax = fig.add_subplot(1, 1, 1)
> 
> ax.set_title("Actual vs Predict plot", size=18, weight="semibold")
> ax.set_xlabel(r"Actual $y$", size=16)
> ax.set_ylabel(r"Predicted $\hat{y}$", size=16)
> 
> # 散布図
> ax.scatter(y_test, y_pred, color="cyan", edgecolors="blue")
> 
> # 回帰直線
> x = np.linspace(y_test.min(), y_test.max())
> y = x
> ax.plot(x, y, color="red")
> 
> plt.tight_layout()
> plt.savefig("actual_pred.png")
> plt.show()
> ```

![散布図](./images/linear-regression-theory/actual_pred.png)

*[!image] 予測精度の可視化*

おおむね悪くはなさそうですが、図の左側に大きく予測が外れたエントリーがあることがわかります。こういったデータを精査して得た情報は、より優れたモデルを構築するためにフィードバックできます。

## 参考

- 一般社団法人 日本統計学会『統計学実践ワークブック』第1版 (学術図書出版社, 2020)
- 金子 弘昌『化学のための Python によるデータ解析・機械学習入門』第1版 (オーム社, 2019)
- [スパースモデリング（基本編）| ごちきか](https://gochikika.ntt.com/Modeling/regularization.html)