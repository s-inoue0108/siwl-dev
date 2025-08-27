---
isDraft: false
isLimited: true
title: Lasso でスパースモデリング
category: tech
tags: [ml, python, pandas, numpy, sklearn]
description: L1正則化による変数選択をともなう機械学習の基本手法と実装についてまとめます。
publishDate: 2025-08-10T12:35:32+09:00
updateDate: 2025-08-11T22:55:17+09:00
relatedArticles: [linear-regression-theory, ml-note]
---

## Lasso

Lasso モデルはサイズ $(n, p)$ のデザイン行列 $\bm{X}$ について、各変数 (デザイン行列のカラム方向) ごとの回帰係数の推定値 $\hat{\beta}$ を以下の目的関数の最小化問題として推定します：

$$
E(\bm{\beta}) = \frac{1}{2n} || \bm{y} - \bm{X}\bm{\beta} ||^2 + \alpha \sum_{j=1}^p |\beta_j|
$$

ここで $\alpha$ は正則化の強さ（ハイパーパラメータ）です。

Lasso の大きな特徴は、有効でない変数の回帰係数をゼロに縮退させる変数削減効果をもつことです。高次元データ ($p > n$ なデザイン行列) で有効な線形回帰手法の一つとされます。

### 実装

カリフォルニアの住宅価格データセットを Lasso で予測してみます。

scikit-learn を用いることで簡単に実装ができます。`LassoCV` を用いると、交差検証によって適当な正則化係数の値を抽出してくれます。

```py
import random
import os
import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LassoCV

# seed 固定
def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)
  
seed = 42
set_seed(seed)

# データセットの作成
california = fetch_california_housing()
X = pd.DataFrame(california.data, columns=california.feature_names)
y = pd.Series(california.target, columns=california.target_names[0])

# トレーニングデータとテストデータに分割
X_train, X_test = train_test_split(X, train_size=0.8, random_state=seed)
y_train, y_test = train_test_split(y, train_size=0.8, random_state=seed)

# Lasso モデルの初期化と学習
model = LassoCV(random_state=seed)
model.fit(X_train, y_train)
```

テストデータを使って予測精度を見てみます。

```py
from sklearn.metrics import mean_squared_error, r2_score

y_pred = model.predict(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)

print(f" R2: {r2:.04f}\nMSE: {mse:.04f}")
```

```
 R2: 0.5760
MSE: 0.5556
```

### Optuna による正則化係数のチューニング

Optuna を使用して、交差検証誤差ができるだけ小さくなるような正則化係数をベイズ最適化で探索することもできます。

```py
import optuna
from optuna import TPESampler
from sklearn.model_selection import KFold
from sklearn.linear_model import Lasso

kf = KFold(n_splits=5, shuffle=True, random_state=seed)

def objective(trial):
    params = {
        "alpha": trial.suggest_float("alpha", 1e-6, 1, log=True)
    }

    scores = []

    for (train_index, test_index) in kf.split(X, y):
        X_train, X_test = X.iloc[train_index], X.iloc[test_index]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        model = Lasso(**params, random_state=seed)
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        scores.append(mean_squared_error(y_test, y_pred))

    return np.mean(scores)

study = optuna.create_study(direction="minimize", sampler=TPESampler(seed=seed))
study.optimize(objective, n_trials=100)

best_params = optuna.best_params
```

## Stability Selection

Lasso は[変数選択の結果と推定量の一致性（**オラクル性**）が統計的に満たされないという欠点を持ちます](https://gochikika.ntt.com/Modeling/regularization_advanced.html)。この性質を改善するための方法の一つとして、ブートストラップリサンプリングを組み合わせた [**Stability Selection**]([https://doi.org/10.1111/j.1467-9868.2010.00740.x](https://doi.org/10.1111/j.1467-9868.2010.00740.x)) という手法が提案されています。
\
考え方は至って単純です。ブートストラップ法で得られたサンプルごとに Lasso モデルを組み、変数ごとに選択確率を算出することで、より安定した変数選択が行えるようになります。
