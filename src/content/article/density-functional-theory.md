---
isDraft: false
title: 密度汎関数理論（DFT）の物理
category: idea
tags: [comp-science]
description: "密度汎関数理論の導入についてまとめます。"
publishDate: 2025-01-30T22:36:20+09:00
updateDate: 2025-02-05T12:11:02+09:00
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

これらの前提をもとに、電子密度 $\rho$ を変化させながらエネルギー $E_[\rho]$ を計算し、これが最小と思われる結果を返したとき $\rho = \rho_0$（基底状態）であるとする。

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

これを $\phi_i$ で変分すると、

$$
V^\mathrm{KS}(\bm{r}) := \frac{\delta E^\mathrm{KS}}{\delta \phi_i} = V(\bm{r}) + \int d\bm{r} \frac{\rho(\bm{r})}{|\bm{r} - \bm{r}'|} + \frac{\delta E_\mathrm{xc}}{\delta \rho}
$$

を得る。この Kohn-Sham ポテンシャルを使ったハミルトニアンから、以下の **Kohn-Sham 方程式**を得る：

> [!tip] Kohn-Sham 方程式
>
> $$
> \left( -\frac{1}{2}{\nabla_i}^2 + V^\mathrm{KS}(\bm{r}) \right)\phi_i = \varepsilon_i\phi_i
> $$
>
> $$
> V^\mathrm{KS}(\bm{r}) = V(\bm{r}) + \int d\bm{r} \frac{\rho(\bm{r})}{|\bm{r} - \bm{r}'|} + \frac{\delta E_\mathrm{xc}}{\delta \rho}, \quad \rho = \sum_i |\phi_i|^2
> $$

Kohn-Sham 方程式は、適当な試行電子密度 $\rho$ を与えてやることでハミルトニアンが決まり、その固有状態である Kohn-Sham 軌道 $\phi_i$ を求めることで電子密度 $\rho$ へフィードバックできるから、セルフコンシステントに解くことができる。

### 交換・相関汎関数