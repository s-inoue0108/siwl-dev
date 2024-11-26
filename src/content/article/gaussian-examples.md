---
isDraft: false
title: Gaussian インプットファイルの例
category: tech
tags: [gaussian, comp-science]
description: Gaussian のインプットファイルの例をまとめます。
publishDate: 2024-11-26T13:58:00+09:00
updateDate: 2024-11-26T14:09:24+09:00
relatedArticles: []
---

## 二面角を変化させながらスキャンする

`opt=modredundant` オプションを利用し、座標のあとに以下の1行を追加します。

```txt:opt=modredundant
[Type] N1 [N2 [N3 [N4]]] [[+=]value] S nsteps stepsize [[min] max]]
```

```txt:dihedral.gjf
# opt=modredundant b3lyp/6-31g(d)

0 1
 C    *.****    *.****    *.****
 H    *.****    *.****    *.****
 ...
 ...
 ...

D 1 2 3 4 S 10 15.0000
```

### HPC によるマニュアル

https://www.hpc.co.jp/chem/software/gaussian/help/keywords/opt/

### 参考記事

Python による計算結果の後処理例が記載されています

https://yamnor.me/2024-11-08-1904/

