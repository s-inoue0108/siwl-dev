---
isDraft: false
isLimited: false
title: Python / PEP 8 をまとめる
category: tech
tags: [python]
description: "Python コードの標準的なコーディング規約である PEP 8 についての備忘録です。"
publishDate: 2025-02-25T10:53:59+09:00
updateDate: 2025-02-25T11:49:00+09:00
relatedArticles: []
---

## 参考

https://pep8-ja.readthedocs.io/ja/latest/

## 式・文中の空白文字

ブラケットやブレース：

```py
# 悪い例
arr[ 1 ], { prop: 2 }

# よい例
arr[1], {prop: 2}
```

リストの参照や関数呼び出し：

```py
# 悪い例
arr [1], func (x)

# よい例
arr[1], func(x)
```

関数のキーワード引数：

```py
# 悪い例
func(x = "default", y)

# よい例
func(x="default", y)
```

## 命名規約

- `class` の名称は PascalCase を使う
- 変数や関数命名には小文字のみを使う、すなわち snake_case を使う
- インスタンスメソッドの初めの引数は `self` を使う
- Private なメソッドや変数の先頭には `_` をつける
- 定数には SNAKE_CASE を使う

## 推奨事項

`None`、Bool 値のようなシングルトンとの比較では `is / is not` を使う：

```py
# 悪い例
if x != None:
    print(x)

# よい例
if x is not None:
    print(x)
```

> *また、 本当は `if x is not None` と書いているつもりで、 `if x` と書いている場合は注意してください - たとえば、デフォルトの値が `None` になる変数や引数に、何かしら別の値が設定されているかどうかをテストする場合です。この「別の値」は、ブール型のコンテクストでは `False` と評価される(コンテナのような)型かもしれませんよ！*

ラムダ式は関数代入せず、そのような場合は `def` 文を使う：

```py
# 悪い例
f = lambda x: 2*x

# よい例
def double(x): return 2*x
```

式を返す `return` 文に式を返さない `return` を混ぜる場合、`return None` と明示する：

```py
# 悪い例
def sq(x):
    if x < 0:
        return
    return math.sqrt(x)

# よい例
def sq(x):
    if x < 0:
        return None
    return math.sqrt(x)
```

prefix や suffix の検証には、`startsWith()` または `endsWith()` メソッドを使う：

```py
# 悪い例
if text[2] = "bar":
    print(text)

# よい例
if text.startswith("bar"):
    print(text)
```

Sequence（文字列、リスト、タプル）の検証では、空の Sequence が `False` として評価されることを利用する：

```py
# 正しい:
if not seq:
    print(seq[0])

# 間違い:
if not len(seq):
    print(seq[0])
```

例外処理（`try-finally` 節）中で制御文（`return, continue, break`）を使うべきでない：

```py
# 悪い例
def foo():
    try:
        1 / 0
    finally:
        return 42
```
