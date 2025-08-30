---
isDraft: false
isLimited: false
title: Lasso でスパースモデリング
category: tech
tags: [ml, python, pandas, numpy, sklearn]
description: L1正則化による変数選択をともなう機械学習の基本手法と実装についてまとめます。
publishDate: 2025-08-27T21:21:30+09:00
updateDate: 2025-08-30T10:53:30+09:00
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

Lasso は[変数選択の結果と推定量の一致性（**オラクル性**）が統計的に満たされないという欠点を持ちます](https://gochikika.ntt.com/Modeling/regularization_advanced.html)。この性質を改善するための方法の一つとして、ブートストラップリサンプリングを組み合わせた [**Stability Selection**](https://doi.org/10.1111/j.1467-9868.2010.00740.x) という手法が提案されています。
\
考え方は至って単純です。ブートストラップ法で得られたサンプルごとに Lasso モデルを組み、変数ごとに選択確率を算出することで、より安定した変数選択が行えるようになります。
\
以下は Lasso による Stability Selection を並列で行うためのコード例です。

```py
import numpy as np
import pandas as pd
import multiprocessing as mp

from sklearn.linear_model import Lasso
from sklearn.model_selection import KFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error

import optuna
from optuna.samplers import TPESampler
from functools import partial

# ワーカー関数
def worker(subsample_idx, X, y, seed):
    
    # サブサンプリング
    X_sub, y_sub = X.iloc[subsample_idx], y.iloc[subsample_idx]
    
    # K-Fold クロスバリデータ
    kf = KFold(n_splits=n_fold, shuffle=True, random_state=seed)
    kf_split = list(kf.split(X_sub, y_sub))
    
    # 損失関数の定義
    def objective(trial):
        settings = {
            "random_state": seed,
            "max_iter": 100000,
            "fit_intercept": True,
        }

        search_params = {
            "alpha": trial.suggest_float("alpha", 1e-6, 1, log=True)
        }

        params = dict(**settings, **search_params)
        model = Lasso(**params)
        
        scores = []
        
        for fold, (train_index, true_index) in enumerate(kf_split):
        
            # データセットの分割
            X_train, X_true = X_sub.iloc[train_index], X_sub.iloc[true_index]
            y_train, y_true = y_sub.iloc[train_index], y_sub.iloc[true_index]
            
            # X の標準化
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_true_scaled = scaler.transform(X_true)
            
            # DataFrameに戻す
            X_train_scaled = pd.DataFrame(X_train_scaled, columns=X_sub.columns)
            X_true_scaled = pd.DataFrame(X_true_scaled, columns=X_sub.columns)
            
            # 列ごとに一様分布からランダムな重みをかける
            W_train = np.random.uniform(0.5, 1.0, size=X_train_scaled.shape[1])
            X_train_weight = X_train_scaled * W_train
        
            model.fit(X_train_weight, y_train)
        
            y_pred = model.predict(X_true_scaled)
            y_pred = np.maximum(0, y_pred)
            y_pred = np.minimum(90, y_pred)
            
            # CVE を計算
            score = mean_squared_error(y_true, y_pred)
            scores.append(score)
            
        return np.mean(scores)
    
    # Optuna によるハイパーパラメータ最適化
    study = optuna.create_study(direction="minimize", sampler=TPESampler(seed=seed))
    study.optimize(objective, n_trials=1100)
    
    # burn-in を考慮しながらパラメータを回収
    optuna_params = [t.params for t in study.trials if t.number > 100]
    
    # 特徴量選択の実行
    settings = {
        "random_state": seed,
        "max_iter": 10000,
        "fit_intercept": True
    }
    
    # 全てのパラメタについてモデルを作成
    params = [dict(**settings, **op) for op in optuna_params]
    models = [Lasso(**p) for p in params]
    
    counts = []
    
    # 標準化
    scaler = StandardScaler()
    X_sub_scaled = scaler.fit_transform(X_sub)
    
    # モデルごとに特徴量選択
    for model in models:
        model.fit(X_sub_scaled, y_sub)
        
        # 選択された特徴量
        selected = np.abs(model.coef_) > 1e-6
        counts.append(selected.astype(int))
        
    return np.array(counts), np.mean(optuna_cves)

class StabilitySelectionLasso:
    def __init__(self, seed, n_bootstrap, n_vars, subsample_fraction):
        self.seed = seed
        self.n_bootstrap = n_bootstrap
        self.n_vars = n_vars
        self.subsample_fraction = subsample_fraction
        
        self.selection_probabilities_ = None
        self.selected_features_ = None
        
    def fit(self, X, y):
        n_samples, n_features = X.shape
        n_subsample = int(n_samples * self.subsample_fraction)
        n_params = self.optuna_n_trials - self.optuna_n_burnin
        
        # サブサンプリング用の indice を生成
        # 重複する indice がある場合は再サンプリングする
        subsample_indices = []
        seen = set()
        subsample_count = 0
        subsample_max_iter = int(self.n_bootstrap * 10)
        
        while len(subsample_indices) < self.n_bootstrap:
            if subsample_count > subsample_max_iter:
                break
                
            subsample_count += 1
            
            indice = np.random.choice(n_samples, n_subsample, replace=False)
            key = tuple(sorted(indice))
            
            if key not in seen:
                subsample_indices.append(indice)
                seen.add(key)
        
        # サブサンプルごとの並列処理
        processor = partial(worker, X=X, y=y, seed=self.seed)
        
        with mp.Pool(processes=mp.cpu_count()) as pool:
            processed = list(pool.imap_unordered(processor, subsample_indices))
        
        # 選択回数
        selection_counts = np.sum([count for count, _ in processed], axis=0)
        
        # 選択確率
        selection_probs = selection_counts / self.n_bootstrap
        
        # パラメタごとの平均選択確率を各特徴量の安定性スコアとする
        self.selection_probabilities_ = np.mean(selection_probs, axis=0)
        
        # sort
        selection_probabilities_sorted = np.sort(self.selection_probabilities_)[::-1]
        selection_probabilities_argsorted = np.argsort(self.selection_probabilities_)[::-1]
        
        # 上から n_vars 番目までの特徴量の index
        self.selected_features_ = selection_probabilities_argsorted[:self.n_vars]
        
        return self
        
    # transform
    def transform(self, X):
        return X.iloc[:, self.selected_features_]
```
