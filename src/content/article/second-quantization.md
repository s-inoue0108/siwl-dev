---
isDraft: false
isLimited: false
title: 量子化学と量子コンピューティングのためのフェルミオン第二量子化の速習
category: idea
tags: [comp-science]
description: "量子化学の問題を量子コンピューティングで解くために必要な物理について興味を持ったので、自分用に重要な関係式をまとめた速習ノートを作成しました。証明等は省いているほか、厳密でない箇所があると思うので、そこはご容赦ください。"
publishDate: 2026-05-05T14:34:16+09:00
updateDate: 2026-05-05T22:07:57+09:00
relatedArticles: []
---

## フェルミオン多体系の導入

### フェルミオンとスピン状態

スピン角運動量 $s$ が半整数 ($1/2, 3/2, \ldots$) ($\hbar$ 単位) である粒子をフェルミオンという。電子は $s = 1/2$ である。スピン状態の多重度は $2s + 1$ であるから、フェルミオン $i$ のスピン座標 $\sigma_i$ は Up spin と Down spin の $2$ 通りとなる ($\sigma_i \in \{ \uparrow, \downarrow \}$) 。

### フェルミオン多体系の満たすべき対称性

$N$ 個のフェルミオンからなる系の状態 $\varPsi$ は、フェルミオン $i$ の座標 (空間 + スピン) を $\bm{x}_i = (\bm{r}_i, \sigma_i)$ とするとき、

$$
\varPsi(\bm{x}_1, \ldots, \bm{x}_i, \ldots, \bm{x}_j, \ldots, \bm{x}_N) = -\varPsi(\bm{x}_1, \ldots, \bm{x}_j, \ldots, \bm{x}_i, \ldots, \bm{x}_N)
$$

という性質を満たす。すなわち、任意の2粒子の交換によって波動関数の符号が反転する。

### Slater 行列式

$N$ 個のフェルミオンからなる系に対して、1粒子状態 $\phi_i(\bm{x}_j)$ によって上式を満たす多体状態を構成する方法として、Slater 行列式がある：

$$
\varPhi_{\phi_1, \phi_2, \ldots, \phi_N}(\bm{x}_1, \bm{x}_2, \ldots, \bm{x}_N) = \frac{1}{\sqrt{N!}}
\begin{vmatrix}
\phi_1(\bm{x}_1) & \phi_1(\bm{x}_2) & \cdots & \phi_1(\bm{x}_N) \\
\phi_2(\bm{x}_1) & \phi_2(\bm{x}_2) & \cdots & \phi_2(\bm{x}_N) \\
\vdots      & \vdots      & \ddots & \vdots      \\
\phi_N(\bm{x}_1) & \phi_N(\bm{x}_2) & \cdots & \phi_N(\bm{x}_N) \\
\end{vmatrix}
$$

この行列式では、列の交換が2粒子の交換による波動関数の符号反転に対応する。また、同じ行または列が存在する場合には、同じラベルの粒子が同じ波動関数に対応することになるので、そのような場合は Pauli の排他原理によって $\varPhi = 0$ になることもわかる。

## 第二量子化

### 個数表示

以下では、Dirac の記法を使用して、1粒子状態を $\ket{\psi_1}, \ket{\psi_2}, \ldots, \ket{\psi_i}, \ldots$ で記す。それぞれの1粒子状態を占めるフェルミオンの個数を $n_1, n_2, \ldots, n_i, \ldots$ とするとき、$N$ 個のフェルミオンからなる系の状態 $\ket{\varPsi}$ を、

$$
\ket{\varPsi} = \ket{n_1, n_2, \ldots, n_i, \ldots}, \quad \sum_\nu n_\nu = N
$$

と書くことができ、これを個数表示という。ここで、モード $i$ を占めるフェルミオンの個数 $n_i \in \{0, 1\}$ を取り出す演算子 (個数演算子) を $\hat{n}_i$ と定義する：

$$
\hat{n}_i \ket{n_1, n_2, \ldots, n_i, \ldots} = n_i \ket{n_1, n_2, \ldots, n_i, \ldots}
$$

### 生成消滅演算子

フェルミオン多体系における状態の個数表示 $\ket{n_1, n_2, \ldots, n_i, \ldots}$ に対し、モード $i$ の状態から粒子が1つ減った状態を作る演算子 (消滅演算子) を $\hat{c}_i$ と定義する：

$$
\hat{c}_i \ket{n_1, n_2, \ldots, n_i, \ldots} = k_i \ket{n_1, n_2, \ldots, n_i-1, \ldots}
$$

ただし $k_i \in \mathbb{C}$ は定数である。ここで、真空状態 (フェルミオンが1つも存在しない状態) から粒子をさらに除くことはできないので、

$$
\hat{c}_i \ket{0, 0, \ldots, 0, \ldots} = 0
$$

である。この定義によって、Hermite 共役の関係にある $\hat{c}_i^\dagger$ は、$k_i$ の複素共役を $k_i^\ast$ として

$$
\hat{c}_i^\dagger \ket{n_1, n_2, \ldots, n_i, \ldots} = k_i^\ast \ket{n_1, n_2, \ldots, n_i+1, \ldots}
$$

を満たす生成演算子である。
\
これらの演算子は以下の性質を満たす：

> [!tip] フェルミオンの生成消滅演算子の性質
>
> 反交換関係：
>
> - $\{ \hat{c}_i, \hat{c}_j^\dagger \} = \delta_{ij}$
> - $\{ \hat{c}_i, \hat{c}_j \} = \{ \hat{c}_i^\dagger, \hat{c}_j^\dagger \} = 0$
>
> 個数演算子：
>
> - $\hat{n}_i \equiv \hat{c}_i^\dagger \hat{c}_i$ とするとき、これは Hermite 演算子かつ固有値 $n_i \in \{ 0, 1 \}$
> - $[\hat{n}_i, \hat{c}_i] = -\hat{c}_i$
> - $[\hat{n}_i, \hat{c}_i^\dagger] = \hat{c}_i^\dagger$

### 生成消滅演算子の作用順の入れ替え

反交換関係から、異なるモード $i, j$ に対して

$$
\hat{c}_i \hat{c}_j = -\hat{c}_j \hat{c}_i
$$

$$
\hat{c}_i^\dagger \hat{c}_j^\dagger = -\hat{c}_j^\dagger \hat{c}_i^\dagger
$$

であり、これは2粒子の交換に対する状態の符号反転を表すことがわかる。

### 第二量子化ハミルトニアン

天下り的だが、生成消滅演算子を用いて以下で与えられる。

> [!tip] フェルミオンの第二量子化ハミルトニアン
>
> $$
> \hat{H} = \sum_{i,j} h_{ij} \hat{c}_i^\dagger \hat{c}_j + \frac{1}{2} \sum_{i,j,k,l} h_{ijkl} \hat{c}_i^\dagger \hat{c}_j^\dagger \hat{c}_k \hat{c}_l
> $$
> ここで、
> $$
> h_{ij} \equiv \int d\bm{x} ~ {\phi_i}^\ast(\bm{x}) \left( -\frac{1}{2}\nabla^2 + \hat{V}(\bm{x}) \right) \phi_j(\bm{x})
> $$
>
> $$
> h_{ijkl} \equiv \int d\bm{x}_1 d\bm{x}_2 ~ {\phi_i}^\ast(\bm{x}_1) {\phi_j}^\ast(\bm{x}_2) \hat{V}(\bm{x}_1 - \bm{x}_2) \phi_k(\bm{x}_2) \phi_l(\bm{x}_1)
> $$

## スピンと Pauli 演算子

### N スピン状態

$N$ 個のフェルミオンからなる系のスピン状態 $\ket{\varPsi}$ は、フェルミオン $i$ のスピン座標を $\sigma_i \in \{ \uparrow, \downarrow \}$ とするとき、

$$
\varPsi = \ket{\sigma_1, \sigma_2, \ldots, \sigma_i, \ldots}
$$

### Pauli 演算子

1スピン状態に作用する Pauli 演算子として、以下のものが定義できる：

> [!tip] Pauli 演算子
>
> 反転：
>
> $$
> \hat{X} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}, \quad \hat{X} \ket{\downarrow} = \ket{\uparrow}, \quad \hat{X} \ket{\uparrow} = \ket{\downarrow}
> $$
>
> 反転 + 位相：
>
> $$
> \hat{Y} = \begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}, \quad \hat{Y} \ket{\downarrow} = i\ket{\uparrow}, \quad \hat{Y} \ket{\uparrow} = -i\ket{\downarrow}
> $$
>
> 位相：
>
> $$
> \hat{Z} = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}, \quad \hat{Z} \ket{\downarrow} = \ket{\downarrow}, \quad \hat{Z} \ket{\uparrow} = -\ket{\uparrow}
> $$

また、$N$ スピン系の状態に対しては、以下の例のように特定のモード $i$ にのみ作用する Pauli 演算子を恒等演算子 $\hat{I}$ とのテンソル積から構成できる：

$$
\hat{Z}_i \equiv \hat{I} \otimes \hat{I} \otimes \cdots \otimes \hat{Z} \otimes \cdots, \quad \hat{Z}_i \ket{\uparrow_1, \uparrow_2, \ldots, \uparrow_i, \ldots} = -\ket{\uparrow_1, \uparrow_2, \ldots, \uparrow_i, \ldots}
$$

### スピン昇降演算子

Pauli 演算子を以下のように結合することによって、スピン状態を変更する昇降演算子を構成できる：

> [!tip] スピン昇降演算子
>
> $$
> \hat{S}^+ \equiv \frac{\hat{X} + i\hat{Y}}{2} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, \quad \hat{S}^+ \ket{\downarrow} = \ket{\uparrow}, \quad \hat{S}^+ \ket{\uparrow} = 0
> $$
>
> $$
> \hat{S}^- \equiv \frac{\hat{X} - i\hat{Y}}{2} = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}, \quad \hat{S}^- \ket{\uparrow} = \ket{\downarrow}, \quad \hat{S}^- \ket{\downarrow} = 0

また、$N$ スピン系におけるモード $i,j$ に作用するスピン昇降演算子を構成すると、それらは以下の反交換関係についての性質をもつ：

$$
\{ \hat{S}_i^+, \hat{S}_j^- \} =
\begin{cases}
1                         & (i = j)    \\
2 \hat{S}_i^+ \hat{S}_j^- & (i \neq j)
\end{cases}
$$

$$
\{ \hat{S}_i^+, \hat{S}_j^+ \} =
\begin{cases}
0                         & (i = j)    \\
2 \hat{S}_i^+ \hat{S}_j^+ & (i \neq j)
\end{cases}
$$

$$
\{ \hat{S}_i^-, \hat{S}_j^- \} =
\begin{cases}
0                         & (i = j)    \\
2 \hat{S}_i^- \hat{S}_j^- & (i \neq j)
\end{cases}
$$

## Jordan-Wigner 変換

フェルミオンの生成消滅演算子と Pauli 演算子を、以下のように対応づけることができる。

> [!tip] Jordan-Wigner 変換
>
> $$
> \hat{c}_i \longleftrightarrow \left( \prod_{k=1}^{i-1} \hat{Z}_k \right) \frac{\hat{X}_i + i\hat{Y}_i}{2}
> $$
>
> $$
> \hat{c}_i^\dagger \longleftrightarrow \left( \prod_{k=1}^{i-1} \hat{Z}_k \right) \frac{\hat{X}_i - i\hat{Y}_i}{2}
> $$

Jordan-Wigner 変換によって、第二量子化ハミルトニアンを Pauli 演算子を基本構成要素として書き直すことができ、これを量子コンピューティングによって多電子ハミルトニアンを解きたい場合に利用できる。


## 参考にしたリソース

1. [第二量子化ハミルトニアンから量子回路への変換](https://speakerdeck.com/seiyasugo/di-er-liang-zi-hua-hamirutoniankaraliang-zi-hui-lu-hefalsebian-huan)

Jordan-Wigner 変換と第二量子化ハミルトニアンの書き換え、量子回路への応用までの展開が綺麗で、参考にさせていただきました。

2. [第二量子化入門](https://qiita.com/cometscome_phys/items/006117cb6449f2589ebd)

第二量子化ハミルトニアンを得るまでを参考にさせていただきました。波動関数表示と Bra-Ket 表示の間の行き来に行間が少ないです。

3. [Jordan-Wigner 変換の導出](https://whyitsso.net/physics/quantum_mechanics/Jordan_Wigner.html)

Jordan-Wigner 変換のわかりやすい導出があり、参考にさせていただきました。別の記事には、フェルミオンの生成消滅演算子が Slater 行列式と同等の対称性の規則を満たすかどうかについての計算も載っています。
