---
isDraft: false
isLimited: false
title: 機械学習実装ノート
category: tech
tags: [ml, python, pandas, numpy, sklearn]
description: "Kaggle などのコンペでも使える機械学習モデルの実装についてまとめていきます。"
publishDate: 2025-05-05T14:04:11+09:00
updateDate: 2025-05-10T14:19:59+09:00
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

Count Encoder を除く Encoder 各種は Scikit-learn に実装されていますが、自前での実装も可能です。
\
**Label Encoder**:

https://gist.github.com/s-inoue0108/62dd4fe322dee02e0e06034a7f5f0d7e

**Count Encoder**:

https://gist.github.com/s-inoue0108/74b58fc969ac70c266a2b69097c6bb36

## クロスバリデーション (CV)

@{wiki}(交差検証)

機械学習においては、トレーニングデータの一部をバリデーションデータとして分割し、モデルの汎化性能を評価する手法です。モデルに LightGBM を用いた、データ `(X, y)` の k-Fold 交差検証は以下のように実装できます。

```py:k-fold.py
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
}

model = lgb.LGBMRegressor(**params)

# 交差検証
fold_num = 5
kf = KFold(n_splits=fold_num, shuffle=True, random_state=1)
folds = []

for (train_index, true_index) in kf.split(X, y):

    # バリデーションデータを分割
    X_train, X_true = X.iloc[train_index], X.iloc[true_index]
    y_train, y_true = y.iloc[train_index], y.iloc[true_index]

    # モデルの訓練
    model.fit(
        X_train,
        y_train,
        eval_set=[(X_true, y_true)],
        callbacks=[
            lgb.early_stopping(stopping_rounds=100, verbose=False),
        ],
    )

    # 予測
    y_pred = model.predict(X_true)

    # MSE の評価
    score = mean_squared_error(y_true, y_pred)

    # 結果を格納
    folds.append({
      "model": model,
      "score": score,
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

## LightGBM の実装関連

### 評価指標を自前で実装する

LightGBM にビルトインされていない評価指標を自前で実装し、 `model.fit()` の引数 `eval_metric` に渡すこともできます。

https://lightgbm.readthedocs.io/en/latest/pythonapi/lightgbm.LGBMRegressor.html

例えば、

$$
\operatorname{RMSLE} = \sqrt{\frac{1}{N}\sum_{i=1}^N (\log (1 + \hat{y}_i) - \log (1 + y_i))}
$$

であれば、

```py
from sklearn.metrics import root_mean_squared_log_error

def rmsle_metrics(y_true, y_pred):
  y_pred = np.maximum(0, y_pred)   # 予測値が負になる場合があるので、折り返す
  rmsle = root_mean_squared_log_error(y_true, y_pred)
  return "RMSLE", rmsle, False
```

を用いて、

```py:k-fold.py
import lightgbm as lgb

params = {
  "metric": "none", # ビルトインの評価指標を使わない
}

model = lgb.LGBMRegressor(**params)

model.fit(
    X_train,
    y_train,
    eval_metrics=rmsle_metrics
    callbacks=[
        lgb.early_stopping(stopping_rounds=100, verbose=False),
    ],
)
```

のようにすることができます。