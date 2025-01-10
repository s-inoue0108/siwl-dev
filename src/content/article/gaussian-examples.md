---
isDraft: false
isLimited: false
title: Gaussian インプットファイルの例
category: tech
tags: [gaussian, comp-science]
description: Gaussian のインプットファイルの例をまとめます。
publishDate: 2024-11-26T13:58:00+09:00
updateDate: 2024-11-28T12:14:17+09:00
relatedArticles: []
---

## LanL2DZ を使用する

`/genecp` を指定し、座標の後に使用する基底関数系を指定します。以下の例では Pd に LanL2DZ を、それ以外には 6-31G(d) を適用します。
最後の2行は ECP に LanL2DZ を適用することを指定しています。

```txt:lanl2dz.gjf
# opt b3lyp/genecp pseudo=read

Title

0 1
 Pd   *.****    *.****    *.****
 C    *.****    *.****    *.****
 N    *.****    *.****    *.****
 H    *.****    *.****    *.****
 .    ......    ......    ......
 .    ......    ......    ......
 .    ......    ......    ......

Pd 0
lanl2dz
****
C H N 0
6-31g(d)
****

Pd 0
lanl2dz
```

## TD-DFT 計算を実行する

`td=(nstat=N)` を使用します。

```txt:td-dft.gjf
# td=(nstat=8) b3lyp/6-31g(d)

Title

0 1
 C    *.****    *.****    *.****
 H    *.****    *.****    *.****
 H    *.****    *.****    *.****
 .    ......    ......    ......
 .    ......    ......    ......
 .    ......    ......    ......
```

## 二面角を変化させながらスキャンする

`opt=modredundant` オプションを利用し、座標のあとに以下の1行を追加します。

```txt:opt=modredundant
[Type] N1 [N2 [N3 [N4]]] [[+=]value] S nsteps stepsize [[min] max]]
```

```txt:dihedral.gjf
# opt=modredundant b3lyp/6-31g(d)

Title

0 1
 C    *.****    *.****    *.****
 H    *.****    *.****    *.****
 H    *.****    *.****    *.****
 .    ......    ......    ......
 .    ......    ......    ......
 .    ......    ......    ......

D 1 2 3 4 S 10 15.0000
```

## 参考

### HPC によるマニュアル

https://www.hpc.co.jp/chem/software/gaussian/help/keywords/opt/

### その他の記事

Python による Scan 計算結果の後処理例が記載されています。

https://yamnor.me/2024-11-08-1904/

## アウトプットファイルの解析

### 計算が正常終了したか確認する

```bash:計算が正常終了したか確認する
$ tail filename.out
# > Normal termination of...
```

### 振動数計算の結果を表示する

```bash:振動数計算の結果を表示する
$ grep "Frequencies" filename.out
```


## GaussView を使う