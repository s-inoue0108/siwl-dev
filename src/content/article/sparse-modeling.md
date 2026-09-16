---
isDraft:         false
isLimited:       false
title:           スパースモデリング
category:        idea
tags:            [python, ai, ml]
description:     "このエントリでは、機械学習手法のひとつであるスパースモデリングに関して、特に線形モデルを用いた内容についての説明を行います。"
publishDate:     2026-09-16T09:42:38+09:00
updateDate:      2026-09-16T14:16:04+09:00
relatedArticles: []
---

> [!warn]
>
> 表現が正確でない場合があります。

## スパースモデリングとは

AI 技術に関する最近の潮流として、モデルがどんな根拠をもとにして予測を行っているかを明らかにしようとする「**説明可能な AI (*eXplanable AI, XAI*)**」があります。これは、特に事象の再現性が厳しく求められるサイエンスの諸問題に対して AI ソリューションを適用する場合に重要な概念となります。

XAI に関連する考え方のひとつに、「**事象の説明のために、不必要に多くの仮定をおいてはならない**」というものがあります (**オッカムの剃刀**といいます)。この概念によれば、ある事象を説明するための機械学習モデルは**できるだけ少ない特徴量から構成されるべき**であるとされます。

そのような指針に基づく機械学習の手法を総称して **スパースモデリング (*sparse modeling*)** といいます（sparse は「疎な」「スカスカな」の意）。
\
スパースモデリングに基づく機械学習モデルは、以下のようなメリットを持ちます：

- **高いモデル解釈性** - モデルに含まれる特徴量が少なくなる傾向があるため、予測根拠を明らかにしやすい
- **サイズの小さいデータセット** - モデリングがシンプルになる傾向があるため、少ないデータからでも学習が成立しやすい

特に化学データの機械学習では以下のような要求があるため、上記のメリットが大いに役立ちます。

- **高いモデル解釈性** - モデルの予測が現実の化学理論や現象に整合するかどうか検証することが求められる
- **サイズの小さいデータセット** - 化学データはコストの高い実験や計算化学に基づいて収集されることが多く、データサイズが小さくなりやすい

そのような理由から、化学データの機械学習を扱う上でスパースモデリングは非常に重要な手法となります。スパースモデリングに関するより詳細な Overview としては、[この資料](https://monozukuri.ism.ac.jp/wp/wp-content/uploads/2021/05/20210510_MISeminar_SparsModeling.pdf)などがあります。

### 線形回帰モデルにおける例

例として、シンプルな線形回帰モデル：

$$
y = \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p
$$

についてスパースモデリングの必要性を考えてみます。

このモデルは $p$ 個の特徴量 $x_1, x_2, \ldots, x_p$ からなり、$p$ が大きいほど多くの変数を含む表現力の高いモデルとなります。しかし、$p$ が過剰に大きなモデルは以下のシチュエーションで不利となります：

- **過学習のリスク**：未知の入力に対する予測性能が低下しやすい
- **多重共線性のリスク**：互いに相関関係にある特徴量の割合が増えやすい
- **学習が不安定になる**：訓練データが少なく、データサイズ $N$ に対して $p \gg N$ である場合に回帰係数の推定が不安定になる

よって、優れた線形回帰モデルを組むための指針のひとつとして、「**$p$ ができるだけ小さくなるような線形回帰モデルを構築する**」という考え方が重要になります。

## スパースモデリングの手法

スパースモデリングの手法は多岐にわたっており、例えば以下のような方法が挙げられます。

### 相関係数に基づく特徴量のフィルタリング

モデル学習の前に特徴量 $x_i$ と $x_j$ の間の相関係数 $r_{ij}$ を計算し、その大きさ $|r_{ij}|$ があらかじめ決めた閾値を超える場合に一方を除く方法です。一般的な機械学習パイプラインにおける前処理として使われます。

- メリット：わかりやすい、実装が容易
- デメリット：原始的かつ単純であり、他の手法との併用が求められる

### モデル探索

特徴量の組 $\{ x_1, x_2, \ldots, x_p \}$ について部分集合 (最大で空集合を除く $2^p-1$ 通り) を求め、それらについて回帰モデルを構築し、適当な評価指標でランク付けすることで優れたモデルを探索します。

- メリット：*model-agnostic* で汎用性が高い
- デメリット：アルゴリズムを工夫しないと特徴量数に対して計算量が指数オーダーで増加するため、高次元問題への適用が難しい

化学データに対する適用例としては、[Y. Haraguchi, Y. Igarashi, H. Imai and Y. Oaki, *Digit. Discov.* (2022).](https://doi.org/10.1039/d1dd00010a) などがあります。

### LASSO とその関連手法

- [R. Tibshirani, *J. R. Stat. Soc. B* (1996).](https://doi.org/10.1111/j.2517-6161.1996.tb02080.x)

**Least Absolute Shrinkage and Selection Operator (LASSO)** は $L_1$-正則化項を導入した線形回帰モデルで、一部の回帰係数をゼロに縮小することができます。

$$
y = \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p + \alpha \sum_{j=1}^p |\beta_j|, \quad \alpha > 0
$$

- メリット：理論的基盤が強固、化学データにおける先行研究も多い
- デメリット：非線形性の考慮が難しい

### ベイズ機械学習

モデルパラメータに対して**ベイズの定理**を適用し、パラメータの確率分布を考えることでスパース性をより統計学的に議論することができます。統計的機械学習の一分野であり、非常に多くの手法があります。例えば、

- **Bayesian LASSO** ([T. Park and G. Casella, *J. Am. Stat. Assoc.* (2008).](https://doi.org/10.1198/016214508000000337))
- **自動関連度決定 (*Automatic Relevance Determination, ARD*)**と**関連ベクトルマシン (*Relevance Vector Machine, RVM*)** ([M. E. Tipping, *J. Mach. Learn. Res.* (2001).](https://www.jmlr.org/papers/v1/tipping01a.html) など)

などが挙げられます。

- メリット：高い柔軟性と適用可能性（線形モデルに限らず、SVM, GPR といった強力な非線形モデルへのスパース性導入）、非常に強固な理論的基盤 (ベイズ統計学に基づく)
- デメリット：モデリングが難しい、化学データにおける先行研究の少なさなど

## LASSO ベースのスパースモデリング

前述したようにスパースモデリングには多くの手法が存在しますが、中でも **LASSO** に基づく手法は中心的な役割を果たしています。

### LASSO の欠点と限界

LASSO の特徴量選択は強力ですが、以下のような欠点が存在します。

- データサイズについて、特徴量選択の結果と回帰係数の推定値の統計的一致性 (オラクル性) が担保されない
- 真に残すべき特徴量まで過剰に縮小してしまう
- 多重共線関係にある特徴量では、どちらが選択されるかが不安定

**データセットのもつ性質によって LASSO の特徴量選択はブレる可能性があります**。

### LASSO の発展手法

LASSO の特徴量選択に関する性質を改善・改良するために、多くの派生手法が提案されています。

#### Elastic Net

- [H. Zou and T. Hastie, *J. R. Stat. Soc. B* (2005).](https://doi.org/10.1111/j.1467-9868.2005.00503.x)

$L_1$-正則化項と$L_2$-正則化項を比率 $\rho$ でブレンドすることで、多重共線性への耐性を高めたモデルです。

$$
y = \beta_1x_1 + \beta_2x_2 + \cdots + \beta_px_p + \alpha \left[ \rho \sum_{j=1}^p |\beta_j| + (1-\rho) \sum_{j=1}^p \beta_j^2 \right], \quad \alpha > 0, \quad 0 < \rho < 1
$$

#### Adaptive LASSO

- [H. Zou, *J. Am. Stat. Assoc.* (2006).](https://doi.org/10.1198/016214506000000735)

$L_1$-正則化項を重み $w_j$ でスケールし、係数縮小の程度を特徴量 $j$ ごとに変化させます。$w_j$ の値はモデルの学習を経て適応的に決定されます。データサイズについての漸近的性質 (オラクル性) が LASSO と比べて改善されています。

$$
y = \beta_1x_1 + \beta_2x_2 + \cdots + \beta_px_p + \alpha \sum_{j=1}^p \frac{|\beta_j|}{w_j}, \quad \alpha > 0, \quad w_j > 0
$$

#### SCAD, MCP

- SCAD ([J. Fan and R. Li, *J. Am. Stat. Assoc.* (2001).](https://doi.org/10.1198/016214501753382273))
- MCP ([C-. H. Zhang, *Ann. Stat.* (2010).](https://doi.org/10.1214/09-AOS729))

従来の $L_1$-正則化ではなく、$|\beta|$ の大きさに応じて特徴量ごとに係数縮小の強さが変わる正則化項 $R(\beta; \alpha, \gamma)$ を用いる改良です。LASSO の真に残すべき特徴量まで縮小してしまう問題の改善を図っています。

$$
\begin{aligned}
y &= \beta_1x_1 + \beta_2x_2 + \cdots + \beta_px_p + \sum_{j=1}^p R(\beta_j; \alpha, \gamma) \\
\\
R_\mathrm{SCAD}(\beta; \alpha, \gamma) &=
\begin{cases}
\alpha |\beta| &(|\beta| \le \alpha) \\
-\dfrac{|\beta|^2 - 2\alpha\gamma |\beta| + \alpha^2}{2(\gamma - 1)} &(\alpha < |\beta| \le \alpha\gamma) \\
\dfrac{(\gamma + 1)\gamma^2}{2} &(|\beta| > \alpha\gamma)
\end{cases} \\
R_\mathrm{MCP}(\beta; \alpha, \gamma) &=
\begin{cases}
\alpha |\beta| - \dfrac{\beta^2}{2\gamma} &(|\beta| \le \alpha\gamma) \\
\dfrac{\alpha^2\gamma}{2} &(|\beta| > \alpha\gamma)
\end{cases}
\end{aligned}
$$

#### Stability Selection

- [N. Meinshausen and P. Bühlmann, *J. R. Stat. Soc. B* (2010).](https://doi.org/10.1111/j.1467-9868.2010.00740.x)

LASSO とデータセットのサブサンプリングを組み合わせ、選択される特徴量を頻度論的に決定します。このとき、LASSO は予測モデルとしてではなく、特徴量選択のためだけに使用されます。

## モデル探索法に基づくスパースモデリング

同じデータセットを使って複数のモデルを学習させ、何かしらの基準によって優れたモデルを選び取ることを**モデル探索, モデル選択**といいます。これは、特徴量の組み合わせについての文脈でスパースモデリングの一種といえます。

よく用いられる手法として**情報量規準**に基づくものがあり、これは理論上 *model-agnostic* ですが、学習が軽い線形モデルでは特に有効な方法となります。

### 情報量規準

**情報量規準 (*Information Criterion, IC*)** はモデルの性能を表す指標で、一般的には以下の形式で定義されます。

$$
\mathrm{IC} = f(\log L) + g(k)
$$

ここで $\log L$ はモデルの対数尤度 (=データの当てはまりのよさ)、$k$ は特徴量の数 (=複雑さ) です。$f(\cdot), g(\cdot)$ は何らかの関数であることを表しています。

モデル選択において、情報量規準が (単純に予測精度を測る場合と比べて) 優れている部分は、予測精度とトレードオフの関係にある複雑さの指標が含まれている点です。つまり、「予測精度と複雑さのバランスがいいモデル」を優れたモデルとします。

線形回帰モデルにおける情報量規準を考えてみましょう。一般的な線形回帰モデルにおいて、尤度の最大化は MSE の最小化と同義になります。線形回帰モデルでは

$$
\mathrm{IC} = N \log (\mathrm{MSE}) + g(k), \quad \mathrm{MSE} = \frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_i)^2
$$

とすることができます。

#### 赤池情報量規準 (AIC)

- [H. Akaike, *IEEE Trans. Autom. Control* (1974).](https://doi.org/10.1109/TAC.1974.1100705)

**赤池情報量規準 (*Akaike's Information Criterion, AIC*)** は優れた統計モデルを評価するための指標として最初に提唱されたものの一つです。

特徴量数 $k$ をもつ重線形回帰モデルで、AIC は以下の式で表されます。

$$
\mathrm{AIC} = N \log \left( \mathrm{MSE} \right) + 2k
$$

#### ベイズ情報量規準 (BIC)

- [G. Schwarz, *Ann. Statist.* (1978).](https://doi.org/10.1214/aos/1176344136)

**ベイズ情報量規準 (*Bayesian Information Criterion, BIC*)** は、特徴量数によるペナルティをデータサイズ依存にすることで、特にデータサイズの大きい場合に特徴量の少ないモデルを重視します。

特徴量数 $k$ をもつ重線形回帰モデルで、BIC は以下の式で表されます。

$$
\mathrm{BIC} = N \log \left( \mathrm{MSE} \right) + k \log N
$$

#### Mallows Cp 規準

- [C. L. Mallows, *Technometrics* (1973).](https://doi.org/10.1080/00401706.1973.10489103)

**Mallows *C<sub>p</sub>* 規準**は、線形モデルの選択において MSE の推定を補正するための指標です。特徴量数 $k$ をもつ重線形回帰モデルの $C_p$ は、全ての特徴量 (= $p$ 個) を含むフルモデルによる予測値を $\hat{y}_i$、特徴量数 $k$ のモデルによる予測値を $\hat{y}_i^{(k)}$ とすると、

$$
C_p = \frac{1}{\hat{S}^2} \sum_{i=1}^N (y_i - \hat{y}_i^{(k)})^2 - N + 2k, \quad \hat{S}^2 = \frac{1}{N - p} \sum_{i=1}^N (y_i - \hat{y}_i)^2
$$

と書くことができます。

### 全探索

モデル選択のアルゴリズムについて考えてみましょう。特徴量数 $p$ から生成できる組み合わせの数は、どの特徴量も含まないパターンを除いて $2^p - 1$ 通りあります。

計算量は $p$ の増加に応じて指数スケールで急激に増加していきますが、$p = 20$ 程度までであれば、全ての組み合わせについてモデルを学習・評価することが現実的になります。このような方法は、一般に**しらみつぶし探索, 全探索 (*Exhaustive search*)** と呼ばれるアルゴリズムです。

一方で、$p > 20$ あたりから全探索は非現実的な計算量になってきます。そのような高次元のケースでは他のスパースモデリング手法を使うか、**モンテカルロ法**などのサンプリング・アルゴリズムを組み合わせた効率的なモデル探索法の使用が求められます。

## スパースモデリングの実装

実践レベルのスパースモデリング手法の実装を容易にするため、`spmkit` というライブラリを作成しました。

https://github.com/s-inoue0108/spmkit

```bash:Installation
pip install spmkit-learn
```

このライブラリを用いると、以下の2つのスパースモデリング手法を scikit-learn ライクな API で実装することができます。

- Stability Selection による特徴量選択
- 全探索法に基づく線形重回帰モデルの選択

この章からは、OpenML (https://openml.org) に収録されている [Wine Quality データセット](https://www.openml.org/search?type=data&status=active&id=43257)を例に、実践的なスパースモデリング手法の実装について説明します。Wine Quality データセットは、ワインの成分データと、品質のスコア (6段階) からなります。

OpenML に収録されているデータセットは、sklearn の `fetch_openml` 関数を使って pandas.dataframe の形式でダウンロードすることができます。

```python
# Wine Quality データセットをダウンロードする
from sklearn.datasets import fetch_openml

# データフェッチ
dataset = fetch_openml(data_id=43257, as_frame=True)

# 不要な列を削除し、X, y に分割
X = dataset.data.drop(["quality", "id"], axis=1)
y = dataset.data["quality"]
```

### Stability Selection による特徴量選択

`spmkit.models.StabilitySelection` は、N. Meinshausen と P. Bühlmann によって提唱された Stability Selection の mpi 実装です。

この手法では、正則化係数 $\alpha$ を固定したままデータセットのサブサンプリング (重複なし) を $S$ 回実行し、サブサンプル $s$ ごとに LASSO を適用して特徴量集合 $\mathcal{J}^{(s)}$ を求めます。

ある $\alpha$ の値において、サブサンプル方向を集約して得られる特徴量 $j$ ごとの選択確率 $\pi_j(\alpha)$ は以下のようになります。

$$
\pi_j(\alpha) = \frac{1}{S} \sum_{s=1}^S
\begin{cases}
1 & (j \in \mathcal{J}^{(s)}) \\
0 & (j \notin \mathcal{J}^{(s)})
\end{cases}
$$

以下のコードでは、サブサンプリング回数 $S = 1,000$ とし、さらに $\alpha \in [10^{-6}, 1]$ の範囲で上式を $100$ 回求めます (しめて $100,000$ 回 LASSO を学習します)。


```python
import pandas as pd
from spmkit.models import StabilitySelection

# StabilitySelection モデルを定義
model = StabilitySelection(
    subsample_iter=1000,
    n_alphas=100,
    min_alpha=1e-6,
    max_alpha=1.0,
    random_state=42,
)

# 特徴量選択を実行
model.fit(X, y)

# alpha ごとの選択確率を算出
selection_path = pd.DataFrame(model.selection_path_, index=X.columns)
```

正則化パスを可視化してみましょう。`spmkit.plots.selection_path_plot` は、$\alpha$ を変化させた時の特徴量選択確率を可視化するヘルパー関数です。

```python
# 特徴量ごとの選択率を alpha に沿って表示
import matplotlib.pyplot as plt
from spmkit.plots import selection_path_plot

fig, ax = plt.subplots(figsize=(10, 6))
selection_path_plot(
    ax=ax,  # matplotlib の axis
    selection_path=model.selection_path_,  # selection_path
    alphas=model.alphas_,  # alphas
    feature_names=X.columns,  # 特徴量の名称
)
plt.show()
```

図から、一部の特徴量で $\alpha = 10^{-4}$ から $10^{-1}$ にかけて選択される頻度が緩やかに減少していくことがわかります。中でも `fixedacidity` は面白い挙動で、$10^{-2}$ から $10^{-1}$ の範囲では $ \pi(\alpha) = 0.5$ 程度の値で *plateau* になっていることがわかります。

この結果を踏まえ、$\alpha \in [10^{-4}, 10^{-1}]$ の範囲について、特徴量ごとの選択確率を $\alpha$ 方向に集約しましょう。

`StabilitySelection.get_ave_selection_probs` は、モデル学習後に、指定した $\alpha$ の範囲 $\mathcal{A}$ における平均選択確率を (ave, std) の形で返します。それぞれ、数式では以下のように表現できます ($|\mathcal{A}|$ は集合 $\mathcal{A}$ の要素数です)。

$$
\pi_j^\mathrm{ave} = \frac{1}{|\mathcal{A}|} \sum_{\alpha \in \mathcal{A}} \pi_j(\alpha)
$$

$$
\pi_j^\mathrm{std} = \sqrt{\frac{1}{|\mathcal{A}|} \sum_{\alpha \in \mathcal{A}} (\pi_j(\alpha) - \pi_j^\mathrm{ave})^2}
$$

```python
# 平均選択率を 1e-4 から 1e-1 の範囲で取得
selection_probs = model.get_ave_selection_probs(
    lower_alpha=1e-4,
    upper_alpha=1e-1,
)

# pandas dataframe にキャスト
selection_probs = pd.DataFrame(
    selection_probs,
    index=X.columns,
    columns=["mean", "std"],
)
```

この結果を可視化するには、`spmkit.plots.ave_selection_probs_bar_plot` が使えます。閾値 $\pi_\mathrm{th} = 0.8$ の位置に線を引いてあります。

```python
import matplotlib.pyplot as plt
from spmkit.plots import ave_selection_probs_bar_plot

# 棒グラフをプロット
fig, ax = plt.subplots(figsize=(6, 6))
ave_selection_probs_bar_plot(
    ax=ax,  # matplotlib の axis
    selection_probs=selection_probs,  # selection_probs
    selection_th=0.8,   # 閾値
    feature_names=X.columns,  # 特徴量の名称
)
plt.show()
```

最後に、$\pi_j^\mathrm{ave} \ge 0.8$ を満たす特徴量のみを抽出してみましょう。

```python
import pandas as pd

# th = 0.8 で特徴量を絞り込む
# 不要な特徴量がゼロ埋めされたスパースなデザイン行列が返る
X_sparse = model.transform(
    X,
    lower_alpha=1e-4,
    upper_alpha=1e-1,
    selection_th=0.8,
)

# pandas dataframe にキャスト
X_sparse = pd.DataFrame(X_sparse, columns=X.columns)

# ゼロ埋めされた列を落としたデザイン行列
X_sparse_droped = X_sparse.loc[:, (X_sparse != 0).any(axis=0)]
```

今回は6つの特徴量に絞り込むことができました。

得られた正則化パスから最終的に絞り込む特徴量を決定するにはいろいろなやり方があるため、後続の処理の兼ね合いなどから都度考える必要があります。

### 線形重回帰モデルの全探索

データセットから特徴量の組み合わせ (特徴量総数 $p$ に対して $2^p-1$ 通り) を全て生成し、最適な線形重回帰モデルを探索します。

`spmkit.models.ExhaustiveSearch` は、各特徴量の組み合わせについて線形回帰モデルを学習し、予測精度やモデルの複雑さ (=特徴量数 $k (\le p)$) のバランスに基づいてランク付けを行います。

実装例では、$11$ 個の特徴量から $2^{11}-1 = 2,047$ 通りの線形モデルを学習します。その全てについて予測精度と複雑性を AIC によって評価し、その値が小さくなる順番に結果がソートされます。ランクが小さいほど優れたモデルとなります。

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from spmkit.models import ExhaustiveSearch

# train / test = 8 : 2 に分割
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# データを標準化
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ExhaustiveSearch クライアントを定義
client = ExhaustiveSearch(
    sort_criteria="aic",
    random_state=42,
)

# 学習を実行
client.fit(X_train_scaled, y_train, n_jobs=-1)

# 全てのモデルの回帰係数
weights = client.get_weights()
```

`spmkit.plots.weight_diagram` で、全探索の結果から得られた回帰係数 $\beta$ をヒートマップの形式で全てプロットすることができます。この解析によって、よく効く/効かない特徴量を視覚的に判別することが可能になります。

```python
import matplotlib.pyplot as plt
from spmkit.plots import weight_diagram

# 全てのモデルの回帰係数をヒートマップで表示
fig, ax = plt.subplots(figsize=(8, 6))
im = weight_diagram(
    ax=ax,
    weights=weights,
    feature_names=X.columns,
    xscale="log2",
)
fig.colorbar(im, ax=ax, label="Standardized coefficient")
plt.show()
```

ヒートマップから、`alcohol`, `sulphates`, `volatileacidity` のバンドの色が濃く、全体的によく効く特徴量であることがわかります。また、ほとんど効かない特徴量が多く含まれることもわかると思います。なお、いずれのバンドにおいても灰色の領域があるのは、各特徴量は組み合わせ論的に約半数のモデルで含まれないためです。

これを元に、特徴量重要度を算出してみましょう。特徴量 $j$ の重要度 $I_j$ を以下の式で定義します。

$$
I_j = \frac{1}{2^{p}-1} \sum_{r=0}^{2^{p}-1} |\beta_j^{(r)}|
$$

ただし、$\beta_j^{(r)}$ はランク $r$ モデルにおける特徴量 $j$ についての標準化回帰係数です。これは `ExhaustiveSearch.get_ave_importances` API で計算することができます。

```python
import matplotlib.pyplot as plt
from spmkit.plots import ave_importances_bar_plot

# 特徴量重要度を計算
importances = client.get_ave_importances()

# 表示
fig, ax = plt.subplots(figsize=(6, 6))
ave_importances_bar_plot(
    ax=ax,
    importances=importances,
    feature_names=X.columns,
)
plt.show()
```

以下のコードで、AIC が低く出た上位モデルについてより詳細に解析しましょう。`ExhaustiveSearch.predict` は、指定したランクの学習済みモデルを使って予測を行うことができるメソッドです。

```python
import matplotlib.pyplot as plt
from sklearn.metrics import r2_score
from spmkit.plots import coefs_waterfall_plot

# 上位 3 モデル
max_rank = 3

# 上位モデルでテストデータによる予測を行う
y_preds = [client.predict(X_test_scaled, rank=rank) for rank in range(max_rank)]

# 上位モデルで選択された特徴量を取得
features = client.get_features()

# 結果を表示する
for rank, y_pred in enumerate(y_preds):
    # R-squared
    print(f"R2 = {r2_score(y_test, y_pred):.3f}")

    # ウォーターフォールプロット
    fig, ax = plt.subplots(figsize=(6, 6))
    coefs_waterfall_plot(ax=ax, weights=weights, rank=rank, feature_names=X.columns)
    plt.show()

    # パリティプロット
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.scatter(y_test, y_pred, color="dodgerblue", edgecolor="black", alpha=0.7)
    ax.plot([3, 9], [3, 9], color="red", linestyle="dashed", linewidth=2.0)
    ax.set_xlabel("True quality", fontsize=16)
    ax.set_ylabel("Predicted quality", fontsize=16)
    ax.set_title(f"Rank {rank + 1}", fontsize=18)
    plt.show()
```

## まとめ

このエントリでは、機械学習手法の一つであるスパースモデリングについて説明しました。