---
isDraft: false
isLimited: false
title: SMILES 文字列から分子の 3D 化学構造を生成する
category: tech
tags: [comp-science, python, gaussian, gromacs]
description: "ケモインフォマティクスでは、分子構造式の文字列表現である SMILES がよく用いられます。今回は、SMILES をもとに3次元化学構造を生成するプログラムを書いてみます。"
publishDate: 2025-11-02T17:50:50+09:00
updateDate: 2025-11-02T19:15:04+09:00
relatedArticles: []
---

## SMILES 記法

化学構造をコンピュータで表現するには、例えば ChemDraw のようなソフトウェアを用いることができます。ただ、プログラムから扱うためには、もっとシンプルなデータ構造をもつ表現のほうが適するでしょう。**SMILES** は化学構造を英数字のみからなる文字列リテラルの形式で表現します。
\
Wikipedia では以下のように説明されています。

@{wiki}(SMILES記法)

## 分子構造生成の実装

以下では、ケモインフォマティクスの Python ライブラリとして著名な **RDKit** を用いた、SMILES 文字列をソースとする分子構造生成を実装します（コードはエッセンス部分だけ載せます）。

### SMILES の読み込み

RDKit の `MolFromSmiles` メソッドを使うと、SMILES を RDKit の `MOL` オブジェクトに変換できます。

```py:main.py
from rdkit import Chem

smiles = "CCO"   # ethanol
mol = Chem.MolFromSmiles(smiles)
```

### 立体構造生成

SMILES から作成した `MOL` オブジェクトは立体構造情報を含まないので、これを付加してやる必要があります。
\
RDKit では **ETKDG 法** [^1] を使用した3次元構造生成を行うことができます。これを用いて複数の構造をサンプリングし、**分子力学法** [^2] による構造最適化を行った際のエネルギーがもっとも安定になるものを正解構造として採用します。

[^1]: ディスタンスジオメトリ法による構造生成アルゴリズムに、多重結合などの化学的な構造制約と CCDC の経験的な二面角分布の効果を加えた方法 ([S. Riniker, G. A. Landrum, *J. Chem. Inf. Model.* (2015).](https://pubs.acs.org/doi/10.1021/acs.jcim.5b00654))。 例えば、経験的に「いす型」構造をとることが知られているシクロヘキサンなんかもうまく生成してくれます。

[^2]: 分子を振動子とみなし、原子間の相互作用や分子振動の効果を表現するポテンシャルエネルギー関数（分子力場）を計算して構造安定性を評価する手法。RDKit では Merck 社が開発した **MMFF** という分子力場を使用できます ([T. A. Halgren, *J. Comp. Chem.* (1996)](https://doi.org/10.1002/(SICI)1096-987X(199604)17:5/6<490::AID-JCC1>3.0.CO;2-P))。

```py
from rdkit import Chem
from rdkit.Chem import AllChem

def generate3Dmol(rdmol, nconfs=100, seed=1):
    # ETKDG-v3 で複数の立体配座を生成
    params = AllChem.ETKDGv3()
    params.randomSeed = seed
    confs = AllChem.EmbedMultipleConfs(rdmol, numConfs=nconfs, params=params)

    # 分子力学法 (MMFF) で最適化
    for cid in confs:
        AllChem.MMFFOptimizeMolecule(rdmol, confId=cid)

    # 最適化を実行、エネルギーを計算
    props = []
    for cid in confs:
        mmff = AllChem.MMFFGetMoleculeForceField(rdmol, AllChem.MMFFGetMoleculeProperties(rdmol), confId=cid)
        props.append((cid, mmff.CalcEnergy()))
      
    # 最適化後のエネルギーが低い順にソート
    props.sort(key=lambda x: x[1])

    # 最もエネルギーの低い構造の conformer id を取り出す
    best_cid = props[0][0]
    
    # MOL オブジェクトを生成
    mol_cid = Chem.Mol(rdmol)
    best_conf = rdmol.GetConformer(best_cid)
    mol_cid.RemoveAllConformers()
    mol_cid.AddConformer(best_conf, assignId=True)
    return mol_cid
```

```py:main.py
from rdkit import Chem

smiles = "CCO"   # ethanol
mol = Chem.MolFromSmiles(smiles)

# 1000 構造を生成して最適な構造を取り出す
best_mol = generate3Dmol(mol, nconfs=1000)
```

### 3次元座標の付加

```py
import numpy as np

def get_coords(rdmol):
    coords = []
    conf = rdmol.GetConformer()
    for atom in rdmol.GetAtoms():
        idx = atom.GetIdx()
        symbol = atom.GetSymbol()
        pos = conf.GetAtomPosition(idx)
        coords.append([symbol, pos.x, pos.y, pos.z])
    return coords
```

```py:main.py
from rdkit import Chem

smiles = "CCO"   # ethanol
mol = Chem.MolFromSmiles(smiles)

# 1000 構造を生成して最適な構造を取り出す
best_mol = generate3Dmol(mol, nconfs=1000)

# 座標を取得
coords = get_coords(best_mol)
```

### xyz ファイルとしてエクスポート

`xyz` は化学構造フォーマットの一つで、各原子の元素記号と3次元座標の情報のみを含むシンプルなフォーマットです。

```py
def export_xyz(coords, mol_name):
    # 各原子のシンボルと座標
    rows = ["\t".join([c[0], f"{c[1]:.6f}", f"{c[2]:.6f}", f"{c[3]:.6f}"]) for c in coords]

    # 原子数
    natoms = f"{len(coords)}"

    # ブロックを結合
    content = "\n".join([natoms, mol_name] + rows)

    # エクスポート
    with open(f"{mol_name}.xyz", "w") as f:
        f.writelines(content)
```

```py
from rdkit import Chem

smiles = "CCO"   # ethanol
mol = Chem.MolFromSmiles(smiles)

# 1000 構造を生成して最適な構造を取り出す
best_mol = generate3Dmol(mol, nconfs=1000)

# 座標を取得
coords = get_coords(best_mol)

# xyz ファイルをエクスポート
export_xyz(coords, "ethanol")
```

## おわりに

RDKit を利用した構造生成は分子力学法に基づくため、ほとんどの分子で量子化学計算を使った構造最適化のほうがよい結果を示すはずです（量子化学計算では分子力学法とは異なって、電子をあらわに考慮するからです）。
\
この手法は量子化学計算のための初期構造生成に用いるのがよいかと思います（初期構造作成のために、GaussView のような GUI ソフトウェアを経由する手間は省けるかもしれません）。
\
また、錯体や無機分子のような重原子を含む分子や、タンパク質のような巨大分子には適用しにくく、あくまで有機小分子に限ります。

## ソースコード

本記事で作成したプログラムは、CLI ツールとして実装しました。PyPI にも公開してありますので、以下でインストールが可能です。

```bash:インストール
pip install smiles2mol
```

ソースコードは以下に配置してあります。

https://github.com/s-inoue0108/smiles2mol
