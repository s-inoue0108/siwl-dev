---
isDraft: false
isLimited: false
title: 機械学習実装ノート
category: tech
tags: [ml, python, pandas, numpy, sklearn]
description: "Kaggle などのコンペでも使える機械学習モデルの実装についてまとめていきます。"
publishDate: 2025-05-05T14:04:11+09:00
updateDate: 2025-05-17T22:05:50+09:00
relatedArticles: []
---

## カテゴリ変数のエンコード

特徴量について、前処理を含む何かしらの加工を施すことは**特徴量エンジニアリング**などと呼ばれているようです。

https://zenn.dev/colum2131/articles/fffac4654e7c7c

特徴量エンジニアリングの一環として、文字列で表されるカテゴリカルな特徴量を、モデルが学習可能な数値データに変換する **エンコード** という操作が挙げられます。

- Label Encoding
  - カテゴリに対して一意な整数を割り振ります。カテゴリ変数が順序関係をもつかどうかを判断せねばなりません（[順序尺度と名義尺度](https://bellcurve.jp/statistics/course/1562.html?srsltid=AfmBOoreU89Umoo4c8S1M2POjhGlbKAokjx9Y-E9e56nOqfW7ojp4rhq)）。
- One-Hot Encoding
  - カテゴリの存在を T/F で表現する新しいカラムを作成します。特徴量の次元が増大します。
- Count Encoding
  - カテゴリの出現回数に変換します。不均衡なデータであっても、重みを表現しやすいです。
- Target Encoding
  - 目的変数の値を使用したエンコーディング方式です。

Count Encoder を除く Encoder 各種は Scikit-learn や category_encoders に実装されていますが、自前での実装も可能です。
\
**Label Encoder**:

https://gist.github.com/s-inoue0108/62dd4fe322dee02e0e06034a7f5f0d7e

**Count Encoder**:

https://gist.github.com/s-inoue0108/74b58fc969ac70c266a2b69097c6bb36

## クロスバリデーション

@{wiki}(交差検証)

機械学習においては、トレーニングデータの一部をバリデーションデータとして分割し、モデルの汎化性能を評価する手法です。

### K-Fold

モデルに LightGBM を用いた、データ `(X, y)` の k-Fold 交差検証は以下のように実装できます。

```py
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import KFold

# LightGBM のモデル初期化
params = {
    "boosting_type": "gbdt",    # 勾配ブースティング決定木
    "objective": "regression",  # 回帰
    "metric": "mse",            # 評価指標は MSE
    "random_state": 42          # seed を固定
}

model = lgb.LGBMRegressor(**params)

# 交差検証
kf = KFold(n_splits=5, shuffle=True, random_state=42)
folds = []

for (train_index, true_index) in kf.split(X, y):

    # バリデーションデータを分割
    X_train, X_true = X.iloc[train_index], X.iloc[true_index]
    y_train, y_true = y.iloc[train_index], y.iloc[true_index]

    # モデルの訓練
    model.fit(
        X_train,
        y_train,
        eval_set=(X_true, y_true),
        callbacks=[
            lgb.early_stopping(stopping_rounds=100, verbose=False),
        ],
    )

    # 予測
    y_pred = model.predict(X_true)

    # Accuracy の評価
    accuracy = model.score(y_true, y_pred)

    # MSE の評価
    mse = mean_squared_error(y_true, y_pred)

    # 結果を格納
    folds.append({
        "model": model,
        "accuracy": accuracy,
        "mse": mse,
        "true": y_true,
        "pred": y_pred
    })

# 予測
preds = []

for fold in folds:
    model = fold["model"]
    y_pred = model.predict(X)
    preds.append(y_pred)
```

### Stratified K-Fold

トレーニングデータの分布に偏りがある場合、ターゲットにラベル付けすることで分布を保ちながら交差検証を行うことができます。これを Stratified K-Fold といいます。回帰タスクでターゲットが連続値の場合、適当にビニングする必要があります。

```py
# ターゲットを4つのビンに分割
y_label = pd.cut(y, cols=[10, 20, 30], label=["a", "b", "c"])
```

```py:stratified-k-fold.py
from sklearn.model_selection import StratifiedKFold

# 交差検証
fold_num = 5
skf = StratifiedKFold(n_splits=fold_num, shuffle=True, random_state=42)
folds = []

for (train_index, true_index) in skf.split(X, y_label):

    # バリデーションデータを分割
    X_train, X_true = X.iloc[train_index], X.iloc[true_index]
    y_train, y_true = y.iloc[train_index], y.iloc[true_index]
```

## LightGBM の実装

### 独自の評価指標を使う

LightGBM にビルトインされていない評価指標を自前で実装し、 `model.fit()` の引数 `eval_metric` に渡すことができます。

https://lightgbm.readthedocs.io/en/latest/pythonapi/lightgbm.LGBMRegressor.html

例えば、

$$
\operatorname{RMSLE} = \sqrt{\frac{1}{N}\sum_{i=1}^N (\log (1 + \hat{y}_i) - \log (1 + y_i))}
$$

であれば、

```py
from sklearn.metrics import root_mean_squared_log_error

def rmsle(y_true, y_pred):
    # 予測値が負になる場合があるので、折り返す
    y_pred = np.maximum(0, y_pred)
    rmsle = root_mean_squared_log_error(y_true, y_pred)
    return "RMSLE", rmsle, False
```

を用いて、

```py
import lightgbm as lgb

params = {
    "metric": "none", # ビルトインの評価指標を使わない
}

model = lgb.LGBMRegressor(**params)

model.fit(
    X_train,
    y_train,
    eval_metric=rmsle,
    callbacks=[
        lgb.early_stopping(stopping_rounds=100, verbose=False),
    ],
)
```

のようにすることができます。

## ハイパーパラメータ最適化

### Optuna の使用

https://zenn.dev/robes/articles/d53ff6d665650f

```py
import numpy as np
import pandas as pd
import lightgbm as lgb
from sklearn.metrics import root_mean_squared_error
from sklearn.model_selection import KFold
import optuna

# 交差検証
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# 事前学習
def objective(trial):
    settings = {
        "boosting_type": "gbdt",
        "objective": "regression",
        "metric": "rmse",
        "random_state": 42,
    }

    search_params = {
        "reg_alpha": trial.suggest_loguniform("reg_alpha", 1e-8, 10.0),
        "reg_lambda": trial.suggest_loguniform("reg_lambda", 1e-8, 10.0),
        "num_leaves": trial.suggest_int("num_leaves": 2, 256),
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.4, 1.0),
        "subsample": trial.suggest_float("subsample", 0.4, 1.0),
        "subsample_freq": trial.suggest_int("subsample_freq", 1, 7),
        "min_child_samples": trial.suggest_int("min_child_samples", 5, 100)
    }

    params = dict(**settings, **search_params)
    model = lgb.LGBMRegressor(**params)

    rmse_list = []

    for (train_index, true_index) in kf.split(X, y):

        # バリデーションデータを分割
        X_train, X_true = X.iloc[train_index], X.iloc[true_index]
        y_train, y_true = y.iloc[train_index], y.iloc[true_index]

        # モデルの訓練
        model.fit(
            X_train,
            y_train,
            eval_set=(X_true, y_true),
            callbacks=[
                lgb.early_stopping(stopping_rounds=100, verbose=False),
            ],
        )

        # 予測
        y_pred = model.predict(X_true)

        # RMSE の評価
        rmse = root_mean_squared_error(y_true, y_pred)
        rmse_list.append(rmse)
    
    return np.mean(rmse_list)

study = optuna.create_study(direction="minimize")
best_params = study.best_params
```