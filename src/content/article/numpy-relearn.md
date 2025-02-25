---
isDraft: false
isLimited: false
title: もう一度学ぶ Python / NumPy (1)
category: tech
tags: [python, numpy]
description: "NumPy を使用した簡単な数値計算のコードについての学びなおしです。本稿では、基本的な配列宣言とメソッドをまとめます。"
publishDate: 2025-02-25T12:56:17+09:00
updateDate: 2025-02-25T16:18:14+09:00
relatedArticles: []
---

```py
import numpy as np
```

## Array Creations

https://numpy.org/doc/2.1/reference/routines.array-creation.html

配列は `List` または `Tuple` から宣言できる。

```py
# 1次元
arr = np.array([1, 2, 3], dtype=np.int32)
arr = np.array((1, 2, 3), dtype=np.int32)

# 2次元
matrix = np.array([[1, 2], [3, 4]])
```

### Convertion between Vector and Matrix

`reshape` は配列を $(n, m)$ 行列に、`revel` はベクトルに変換する。

```py
matrix = arr.reshape(2, 3)
arr = matrix.ravel()
```

### Static properties

```py
matrix = np.array([
  [1, 2],
  [3, 4],
  [5, 6]
])
```

```py
matrix.shape   # (3, 2)
matrix.ndim    # len(3, 2) -> 3
matrix.size    # (3 * 2) -> 6
matrix.flat    # [1, 2, 3, 4, 5, 6]
matrix.T       # Transposed matrix
```

### arange

`(start, end)` の間で公差 `step` の等差数列を生成する。

```py
np.arange(start, end, step)
```

### linspace

`(start, end)` の間を `num_of_divide` 個に均等分割した配列を生成する。

```py
np.linspace(start, end, num_of_divide)
```

### zeros / ones

`shape`（タプル）を引数にとり、0 または 1 埋めされた配列を生成する。

```py
np.zeros(shape)
np.ones(shape)
```

### random.rand

`shape`（タプル）を引数にとり、0 以上 1 未満の一様乱数からなる配列を生成する。

```py
np.random.rand(shape)
```

乱数をサンプリングするための確率分布がいくつか用意されている。

| Method                      | Distribution  |
| :-------------------------- | :------------ |
| `np.random.randn(shape)`    | Normal Dist   |
| `np.random.binomial(shape)` | Binomial Dist |
| `np.random.poisson(shape)`  | Poisson Dist  |

## Indice and Slices

```py
arr = np.arange(0, 5, 1)  # [0 1 2 3 4]
```

```py
arr[1:4]   # [1 2 3]
arr[2::]   # [2 3 4]
arr[:-2]   # [0 1 2]
arr[::2]   # [0 2 4]
arr[::-1]  # [4 3 2 1 0]
```

## Operation

### With Scalar

配列とスカラーとの二項演算は、配列の各要素に対する演算となる。

```py
arr = np.array([1, 2, 3, 4])
```

```py
arr + 1   # [2 3 4 5]
arr - 1   # [0 1 2 3]
arr * 2   # [2 4 6 8]
arr / 2   # [0.5 1 1.5 2]
arr // 2  # [0 1 1 2]
arr % 2   # [1 0 1 0]
arr ** 2  # [1 4 9 16]
```

### Array-to-Array

配列どうしの二項演算は、その要素どうしの演算となる。とくに、乗除は Hadamard 演算となる。

```py
a = np.array([1, 2, 3, 4])
b = 2 * a
```

```py
a + b   # [3 6 9 12]
a - b   # [-1 -2 -3 -4]
a * b   # [2 8 18 32]
a / b   # [0.5 0.5 0.5 0.5]
```

### Universal Functions



https://numpy.org/doc/2.1/reference/routines.statistics.html

```py
# Math Operations
np.sqrt()
np.log()
np.log2()
np.log10()
np.exp()

# Trigonometric Functions
np.sin()
np.cos()
np.tan()
np.arcsin()
np.arccos()
np.arctan()
np.sinh()
np.cosh()
np.tanh()

# Statistics Functions
np.median()
np.average()
np.mean()
np.var()
np.std()
np.cov()

# Others
np.sort()
np.floor()
np.ceil()
np.round()
np.sum()
np.prod()
np.max()
np.min()
np.gradient()
```

## Save and Restore

配列の要素を外部ファイル（`txt`, `csv`）にエクスポートしたり、インポートすることが可能である。

```py
# Save
np.savetxt("filename", arr)

# Restore
np.loadtxt("filename", arr, delimiter=",")
```

> [!remark] Pandas の利用
>
> Pandas の `read_csv` 関数を利用することで同様の実装が可能である。

## Linear Algebra

https://numpy.org/doc/2.1/reference/routines.linalg.html

特に固有値問題にかかわるメソッドは、`np.linalg` 名前空間にある。

```py
np.vdot()           # Dot Product
np.matmul()         # Matrix Product
np.linalg.cross()   # Cross Product (3-Vectors)
np.linalg.eig()     # Eigvalues and Right-Eigvecs
np.linalg.norm()    # Norm
np.linalg.det()     # Determinant
np.trace()          # Trace
```



