---
isDraft: false
isLimited: false
title: 密度汎関数理論（DFT）の物理
category: idea
tags: [comp-science]
description: "密度汎関数理論の導入についてまとめます。"
publishDate: 2025-01-30T22:36:20+09:00
updateDate: 2025-02-14T17:44:08+09:00
relatedArticles: []
---

## Hohenberg-Kohn の定理

### 第1定理

> [!tip] Hohenberg-Kohn の第1定理
>
> 外部ポテンシャル $V(\bm{r})$ 中に置かれた相互作用する $N$ 電子系は、基底状態の電子密度 $\rho_0(\bm{r})$ によって一意に決まる。

> [!info:fold] 証明
>
> 外部ポテンシャル $V_1(\bm{r}) \neq V_2(\bm{r})$ は、同じ基底状態の電子密度 $\rho_0(\bm{r})$ に対応していると仮定する。ここで、$V_i(\bm{r}) ~ (i=1,2)$ が生むハミルトニアン $\hat{H}_i$ とその固有状態 $\ket{\varPsi_i}$ 、固有エネルギー $E_i$ について、変分原理から
>
> $$
> E_1 = \bra{\varPsi_1}\hat{H}_1\ket{\varPsi_1} < \bra{\varPsi_2}\hat{H}_1\ket{\varPsi_2}
> $$
>
> である。ここで、右辺は
>
> $$
> \bra{\varPsi_2}\hat{H}_1\ket{\varPsi_2} = \bra{\varPsi_2}\hat{H}_2\ket{\varPsi_2} + \bra{\varPsi_2}(\hat{H}_1 - \hat{H}_2)\ket{\varPsi_2}
> $$
>
> であり、1電子密度 $\rho_0(\bm{r})$ について
>
> $$
> \bra{\varPsi_2}(\hat{H}_1 - \hat{H}_2)\ket{\varPsi_2} = \int d\bm{r} ~ [V_1(\bm{r}) - V_2(\bm{r})]\rho_0(\bm{r})
> $$
>
> が成り立つことから、
>
> $$
> \bra{\varPsi_2}\hat{H}_1\ket{\varPsi_2} = E_2 + \int d\bm{r} ~ [V_1(\bm{r}) - V_2(\bm{r})]\rho_0(\bm{r})
> $$
>
> である。よって、
>
> $$
> E_1 < E_2 + \int d\bm{r} ~ [V_1(\bm{r}) - V_2(\bm{r})]\rho_0(\bm{r})
> $$
>
> かつ、添字の対称性から
>
> $$
> E_2 < E_1 + \int d\bm{r} ~ [V_2(\bm{r}) - V_1(\bm{r})]\rho_0(\bm{r})
> $$
>
> である。これら2式を足し合わせると、
>
> $$
> E_1 + E_2 < E_2 + E_1
> $$
>
> となって矛盾が起きるから、基底状態の電子密度 $\rho_0(\bm{r})$ に対応する外部ポテンシャルは唯一つである。

多電子系のハミルトニアン $\hat{H}$ は次のように書くことができる：

$$
\hat{H} = \hat{H}_0 + \sum_{i} V(\bm{r}_i)
$$

ここで $\hat{H}_0$ は運動エネルギー項とクーロン相互作用項の和で、

$$
\hat{H}_0 = -\frac{1}{2}\sum_{i} {\nabla_i}^2 + \sum_{i}\sum_{j\neq i} \frac{1}{|\bm{r}_i - \bm{r}_j|}
$$

である。

電子密度 $\rho_0(\bm{r})$ が外部ポテンシャルと1対1対応することから、外部ポテンシャルは電子密度の汎関数 $V[\rho_0]$ として書くことができ、$V$ が定まることで $\hat{H}$ も定まる。Schrodinger 方程式から、

$$
\hat{H} \varPsi_k = E_k \varPsi_k
$$

であるので、**状態 $k$ の固有エネルギー $E_k$ および固有関数 $\varPsi_k$ もまた $\rho_0$ の汎関数である。**

> [!tip] Hohenberg-Kohn の第1定理（別表現）
>
> $N$ 電子系において、状態 $k$ について $E_k = E_k[\rho_0]$、$\varPsi_k = \varPsi_k[\rho_0]$ である。

### 第2定理

> [!tip] Hohenberg-Kohn の第2定理
>
> ある電子密度 $\rho$ によって決まるエネルギーを $E[\rho]$ とする。すなわち、
> 
> $$
> E[\rho] = \bra{\varPsi[\rho]}\hat{H}[\rho]\ket{\varPsi[\rho]}
> $$
>
> であるとき、$\rho = \rho_0$ で $E[\rho]$ は最小であり、基底状態のエネルギー $E_0$ に等しい（**エネルギー汎関数の変分原理**）。

> [!info:fold] 証明
>
> 電子密度 $\rho$ に対応する外部ポテンシャル $V$ が与える波動関数を $\varPsi_V$ とするとき、変分原理から
>
> $$
> E[\rho] = \bra{\varPsi_V}\hat{H}\ket{\varPsi_V} \ge \bra{\varPsi_0}\hat{H}\ket{\varPsi_0} = E[\rho_0] = E_0
> $$
>
> がしたがう。等号は $\rho = \rho_0$ のとき成立する。

これらの前提をもとに、電子密度 $\rho$ を変化させながらエネルギー $E[\rho]$ を計算し、これが最小と思われる結果を返したとき $\rho = \rho_0$（基底状態）であるとする。

### V-表現可能性

Hohenberg-Kohn の定理は、任意の電子密度 $\rho$ に対応して、それを基底状態とする外部ポテンシャル $V$ がいつでも存在することは保証しない。$\rho$ を基底状態電子密度としてもつような外部ポテンシャル $V$ が存在するとき、そのような $\rho$ を **$V$-表現可能**であるという。

## Kohn-Sham 理論

DFT を現実の系に適用する際の困難は、エネルギー汎関数 $E[\rho]$ の真の表現が知られていない点にある。$E[\rho]$ を各構成要素に分解すると、

$$
E[\rho] = T[\rho] + V_\mathrm{ex}[\rho] + V_\mathrm{h}[\rho] + E_\mathrm{xc}[\rho]
$$

となる。ここで、

- 運動エネルギー $T[\rho]$
- 外部ポテンシャルによるエネルギー $\displaystyle V_\mathrm{ex}[\rho] = \int d\bm{r} ~ V(\bm{r})\rho(\bm{r})$
- クーロン相互作用によるエネルギー $\displaystyle V_\mathrm{h}[\rho] = \int d\bm{r}d\bm{r}' ~ \frac{\rho(\bm{r})\rho(\bm{r}')}{|\bm{r} - \bm{r}'|}$
- 交換・相関エネルギー $E_\mathrm{xc}[\rho]$

である。**Kohn-Sham 理論**とは、$E_\mathrm{xc}[\rho]$ を除く3つの項のエネルギー汎関数を相互作用しない系を仮定して近似的に求めるアイデアである。

### Kohn-Sham 方程式

Kohn-Sham 理論では、実際の系の電子密度 $\rho$ と同等であるような補助系の電子密度を仮定し、次のように求める：

$$
\rho(\bm{r}) = \sum_i |\phi_i(\bm{r})|^2
$$

ここで $\phi_i(\bm{r})$ は相互作用しない $N$-電子系の1電子軌道（Kohn-Sham 軌道）である。これらを用いて、

$$
T^\mathrm{KS}[\rho] = -\frac{1}{2}\sum_i \int d\bm{r} ~ {\phi_i}^\ast(\bm{r}) {\nabla_i}^2 \phi_i(\bm{r})
$$

$$
V^\mathrm{KS}_\mathrm{ex}[\rho] = \int d\bm{r} ~ V(\bm{r})\rho(\bm{r})
$$

$$
V^\mathrm{KS}_\mathrm{h}[\rho] = \int d\bm{r}d\bm{r}' ~ \frac{\rho(\bm{r})\rho(\bm{r}')}{|\bm{r} - \bm{r}'|}
$$

から、Kohn-Sham エネルギー汎関数 $E^\mathrm{KS}$ は次のように求められる：

$$
E^\mathrm{KS}[\rho] = T_\mathrm{s}[\rho] + V_\mathrm{ex}[\rho] + V_\mathrm{h}[\rho] + E_\mathrm{xc}[\rho]
$$

Kohn-Sham 軌道が規格直交であるという制約条件の下で、$E^\mathrm{KS}$ を ${\phi_i}^\ast$ で変分したものがゼロであるという条件から、

$$
\frac{\delta E^\mathrm{KS}}{\delta {\phi_i}^\ast} - \sum_{i}\sum_{j} \varepsilon_{ij} \frac{\delta}{\delta {\phi_i}^\ast}\left( \int d\bm{r} ~ {\phi_i}^\ast \phi_j - \delta_{ij} \right) = 0
$$

が成り立つことと同値な式として、**Kohn-Sham 方程式**：

> [!tip] Kohn-Sham 方程式
>
> $$
> \left( -\frac{1}{2}{\nabla_i}^2 + V(\bm{r}) + \int d\bm{r} \frac{\rho(\bm{r})}{|\bm{r} - \bm{r}'|} + \frac{\delta E_\mathrm{xc}}{\delta \rho} \right)\phi_i = \varepsilon_i\phi_i
> $$

を得る。

> [!warn] 
>
> ここで連鎖律：
>
> $$
> \frac{\delta f[\rho]}{\delta {\phi_i}^\ast} = \frac{\delta f[\rho]}{\delta \rho}\frac{\delta \rho}{\delta {\phi_i}^\ast} = \frac{\delta f[\rho]}{\delta \rho} \phi_i
> $$
>
> を用いた。

Kohn-Sham 方程式は、適当な試行電子密度 $\rho$ を与えてやることで Fock 演算子 $\hat{F}^\mathrm{KS}$ が決まり、その固有状態である Kohn-Sham 軌道 $\phi_i$ を求めることで電子密度 $\rho$ へフィードバックできるから、セルフコンシステントに解くことができる。

### Roothaan 方程式

計算機での解法においては、Kohn-Sham 軌道 $\phi_i$ を所与の基底関数[^1]の組 $\{\chi_\mu\}$ で線形結合展開して表現する：

[^1]: 一般には原子軌道で、Slater 軌道 $e^{-\zeta r}$ よりも縮約 Gauss 軌道 $\sum_k e^{-\alpha_k r^2}$ が用いられる。これらは一般に規格直交でなく、重なり積分 $S_\{\mu \nu} = \braket{\chi_\mu|\chi_\nu}$ を考慮せねばならない。

$$
\phi_i(\bm{r}) = \sum_{\mu}C_{\mu i} \chi_\mu(\bm{r})
$$

ここで $C_{i\mu}$ などは展開係数であり、これを $(\mu, i)$ 成分にもつ行列を $\bm{C} = (C_{\mu i})$ とする。また、

$$
F^\mathrm{KS}_{\nu \mu} = \int d\bm{r} ~ {\chi_\nu}^\ast(\bm{r}) \hat{F}^\mathrm{KS} \chi_\mu(\bm{r})
$$

$$
S_{\nu \mu} = \int d\bm{r} ~ {\chi_\nu}^\ast(\bm{r}) \chi_\mu(\bm{r})
$$

を要素にもつ行列をそれぞれ $\bm{F}^\mathrm{KS}, ~\bm{S}$ と定め、Kohn-Sham 軌道エネルギー $\varepsilon_i$ を並べた対角行列を $\bm{\varepsilon}$ と定めると、**Roothaan 方程式**：

> [!tip] Roothaan 方程式
> 
> $$
> \bm{F}^\mathrm{KS} \bm{C} = \bm{S} \bm{C} \bm{\varepsilon}
> $$

を得る。Roothaan 方程式は行列計算により展開係数行列 $\bm{C}$ をもとめる方程式であるが、Fock 行列 $\bm{F}^\mathrm{KS}$ 自身に $\bm{C}$ の要素を含む（クーロン相互作用ポテンシャルおよび交換・相関汎関数）から、やはりセルフコンシステントに解く必要がある。

### 交換・相関汎関数

Kohn-Sham 軌道を用いた厳密解が唯一得られないのは交換・相関汎関数 $E_\mathrm{xc}[\rho]$ の項であり、いわゆる「汎関数」として多くの近似手法が提案されている。

#### 局所密度近似（LDA）

**局所密度近似（LDA）** は、空間中の各点 $\bm{r}$ ごとに電子の交換・相関エネルギー（電子密度 $\rho(\bm{r})$ によって決まる）を定める。$\varepsilon_\mathrm{xc}$ を点 $\bm{r}$ での電子の交換・相関エネルギー密度とするとき、

$$
E_\mathrm{xc}^\mathrm{LDA}[\rho] = \int d\bm{r} ~ \rho(\bm{r}) \varepsilon_\mathrm{xc}(\rho(\bm{r}))
$$

となる。この汎関数は電子密度 $\rho$ によってのみ決まる。

#### 一般化勾配近似（GGA）

**一般化勾配近似（GGA）** は、LDA に密度勾配の情報を取り入れ補正を試みたモデルである。

$$
E_\mathrm{xc}^\mathrm{GGA}[\rho] = \int d\bm{r} ~ \rho(\bm{r}) \varepsilon_\mathrm{xc}(\rho(\bm{r}), \nabla \rho(\bm{r}))
$$

#### メタ一般化勾配近似（meta-GGA）

**メタ一般化勾配近似（meta-GGA）** は、GGA に加えて電子の運動エネルギー密度（$\tau$）を加えたモデルであり、密度の二次勾配 $\nabla^2 \rho$ の情報を含む。

$$
E_\mathrm{xc}^\mathrm{metaGGA}[\rho] = \int d\bm{r} ~ \rho(\bm{r}) \varepsilon_\mathrm{xc}(\rho(\bm{r}), \nabla \rho(\bm{r}), \tau)
$$

#### 混成汎関数

**混成汎関数** は、Hartree-Fock 理論の交換相互作用 $E_\mathrm{x}^\mathrm{HF}$：

$$
E_\mathrm{x}^\mathrm{HF} = -\frac{1}{2} \sum_{i,j} \int d\bm{r}_1 d\bm{r}_2 ~ {\phi_i}^\ast(\bm{r}_1){\phi_j}^\ast(\bm{r}_1)\frac{1}{|\bm{r}_1 - \bm{r}_2|}{\phi_i}(\bm{r}_2){\phi_j}(\bm{r}_2)
$$

に対し、既知の交換・相関汎関数をパラメータで重みづけして混成したモデルである。
\
特に、Becke の 3-parameters 混成（**B3LYP**）が有名である。これは、交換汎関数に HF と Becke 88 交換汎関数、相関汎関数に Lee-Yang-Parr 相関汎関数を用い、これらを3つの経験的パラメータで混成したものである。