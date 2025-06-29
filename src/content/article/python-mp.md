---
isDraft: false
isLimited: false
title: Python で並列処理
category: tech
tags: [python, ml]
description: "Python の multiprocessing モジュールを使用した並列処理のコード例です。"
publishDate: 2025-06-29T22:28:10+09:00
updateDate: 2025-06-29T23:04:44+09:00
relatedArticles: []
---

## 並列処理の実装

乱数の系列 $x_i$ から系列 $y_i = ax_i$ を並列計算させるコードを書いてみます。

```py
import multiprocessing as mp
from functools import partial
from tqdm import tqdm
import random

x = random.choices(range(1, 1e+6), k=1e+5)

def square(x, a):
    return a * x ** 2

worker = partial(square, a=2)

with mp.Pool(processes=mp.cpu_count()) as p:
    y = list(tqdm(p.imap_unordered(worker, x), total=len(x)))
```

- `multiprocessing.Pool()` は `processes` の数だけの並列化を行うインスタンスです。このインスタンスに生える `map` や `imap` といったメソッドに、ループごとの処理を行うワーカー関数を渡すことで、ループの並列実行が可能になります。
- `functools.partial` を使うことで、固定値のパラメータを受け取るワーカー関数を定義できます（部分適用）。
- `tqdm` でラップすることでプログレスバーを表示できます。
