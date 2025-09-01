---
isDraft: false
isLimited: false
title: PySCF で量子化学計算
category: tech
tags: [python, comp-science]
description: Python API を利用して量子化学計算を行うことができるライブラリ「PySCF」の実装例を示します。
publishDate: 2025-08-30T15:24:30+09:00
updateDate: 2025-09-02T07:07:30+09:00
relatedArticles: []
---
- 公式サイト

https://pyscf.org/

- ユーザーガイド

https://pyscf.org/user/index.html

## PySCF の設計

PySCF はモジュールベースであり、量子化学計算のプロセスを Python スクリプト上に宣言的に構築することができます。Gaussian などで DFT になじみがあれば、以下のモジュールをよく使うかもしれません：

- `gto` モジュール：分子のロードと基底関数の定義
- `scf` モジュール：自己無撞着場法を用いる計算法 (Hartree-Fock 法など) を扱う
- `dft` モジュール：`scf` モジュールのサブモジュールで、Kohn-Sham DFT を扱う

PySCF はオープンソースながら、DFT 以外のより高度な量子化学手法にも対応している点が大きな魅力です。

- `mp` モジュール：Møller-Plesset 法
- `cc` モジュール：結合クラスター法
- `mcscf` モジュール：多配置自己無撞着場法 (CASSCF など)
- `tdscf` モジュール：時間依存自己無撞着場法 (TD-DFT など)
## DFT 計算の実装

Kohn-Sham DFT を行うには、`pyscf.dft.RKS` を用います。以下は[公式ドキュメントの最小構成](https://pyscf.org/user/dft.html) で、$\mathrm{HF}$ 分子を LDA/cc-pVDZ レベルで一点計算しています。

```py
from pyscf import gto, dft

# define molecule and basis set
mol_hf = gto.M(atom = 'H 0 0 0; F 0 0 1.1', basis = 'ccpvdz', symmetry = True)

# initalize dft solver
mf_hf = dft.RKS(mol_hf)

# set functional
mf_hf.xc = 'lda,vwn'

# scf algorithm
mf_hf = mf_hf.newton()

# compute energy
mf_hf.kernel()
```

### 交換相関汎関数

デフォルトでは、交換相関汎関数は Libxc をライブラリとして使用しているようです。

https://libxc.gitlab.io/functionals/

### 構造最適化

https://pyscf.org/user/geomopt.html

PySCF では、`geomeTRIC` または `PyBerny` を構造最適化のバックエンドに用いるため、いずれかをあらかじめインストールしておく必要があります。ここでは `geomeTRIC` を用います。対応するソルバーは `pyscf.geomopt.geometric_solver.optimize` です。

```bash:インストール
pip install geometric
```

また、PySCF では入出力フォーマットとして `xyz` ファイルを使用することができます。

```py
from pyscf import gto, dft
from pyscf.geomopt.geometric_solver import optimize

# define molecule and basis set (load xyz file)
mol = gto.M(atom="input.xyz", basis="ccpvdz")

# initalize dft solver
mf = dft.RKS(mol)

# set functional
mf.xc = "b3lyp"

# scf algorithm
mf = mf.newton()

# compute energy
mf.kernel()

# geometry optimization
mol_opt = optimize(mf, maxsteps=1000)
mol_opt.tofile("output.xyz", format="xyz")
```

### 各種物性の計算

拡張ライブラリの `pyscf/properties` を用いることで様々な電子物性を計算できます。

```bash:インストール
pip install git+https://github.com/pyscf/properties
```

以下の例では分極率（テンソル）を計算しています。

```
from pyscf import gto, dft
from pyscf.prop.polarizability.rks import Polarizability

# define molecule and basis set (load xyz file)
mol = gto.M(atom="input.xyz", basis="ccpvdz")

# initalize dft solver
mf = dft.RKS(mol)

# set functional
mf.xc = "b3lyp"

# scf algorithm
mf = mf.newton()

# compute energy
mf.kernel()

# compute polarizability
polar = mf.Polarizability().polarizability()
```

### mpi の使用

https://github.com/pyscf/mpi4pyscf

`mpi4pyscf` モジュールを用いることで並列計算を行うことができます。

```bash:インストール
pip install mpi4pyscf
```

以下は、MPI で CCSD を行うサンプルです。

```py
from pyscf import gto, scf
from mpi4pyscf import cc as mpi_cc

# define molecule and basis set (load xyz file)
mol = gto.M(atom="input.xyz", basis="ccpvdz")

# initialize solver
mf = scf.RHF(mol).run()

# compute ccsd energy
cc = mpi_cc.RCCSD(mf)
cc.kernel()
```

### GPU の使用

https://pyscf.org/user/gpu.html

`gpu4pyscf` モジュールを用いることで、一部の計算プロセスを GPU 上で行うことができます。

```bash:インストール
pip install gpu4pyscf-cuda12x
```

API もシンプルで、ソルバーのインスタンスを `to_gpu` または `to_cpu` メソッドで適宜変換することで、容易にデバイスの切り替えが可能となっています。
\
以下は、GPU で DFT による構造最適化を行うサンプルです。

```py
from pyscf import gto
from gpu4pyscf import dft as gpu_dft
from pyscf.geomopt.geometric_solver import optimize

# define molecule and basis set (load xyz file)
mol = gto.M(atom="input.xyz", basis="ccpvdz")

# initalize dft solver and set functional
mf = gpu_dft.RKS(mol, xc="b3lyp").to_gpu()

# scf algorithm
mf = mf.newton()

# compute energy
mf.kernel()

# geometry optimization
mol_opt = optimize(mf, maxsteps=1000)
mol_opt.tofile("output.xyz", format="xyz")
```
