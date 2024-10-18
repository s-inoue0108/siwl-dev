---
isDraft: true
title: RDKit を使って Smiles から Gaussian Job File を生成する
category: tech
tags: [python]
description: "Python で化学式を扱うモジュールである RDKit を使ったアイデアです。"
publishDate: 2024-10-17T00:00:00+09:00
updateDate: 2024-10-17T00:00:00+09:00
relatedArticles: []
---

## パッケージ

**RDKit** を使います。配列を扱うために Pandas も用意します。

https://www.rdkit.org

```python:パッケージ
from rdkit import Chem
import pandas as pd
```