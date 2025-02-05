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

ここで、$\rho_0(\bm{r})$ は以下のように表される：

$$
\rho_0(\bm{r}) = \int d\bm{x}~|\varPhi_0(\bm{x})|^2 \left( \sum_{i} \delta(\bm{r}_i - \bm{r}) \right)
$$

ここで、電子 $i$ の座標を空間座標とスピン座標の組 $\bm{x}_i := (\bm{r}_i, \sigma_i)$ で表し、$\bm{x} := \{\bm{x}_1,\ldots,\bm{x}_N\}$ である。また、$\varPhi_0(\bm{x})$ は系の基底状態の（規格化された）波動関数である。
\
多電子系のハミルトニアン $\hat{H}$ は次のように書くことができる：

$$
\hat{H} = \hat{H}_0 + \sum_{i} V(\bm{r}_i)
$$

ここで $\hat{H}_0$ は運動エネルギー項とクーロン相互作用項の和で、

$$
\hat{H}_0 = -\frac{\hbar^2}{2m}\sum_{i} {\nabla_i}^2 + \frac{1}{4\pi\varepsilon_0} \sum_{i}\sum_{j\neq i} \frac{1}{|\bm{r}_i - \bm{r}_j|}
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

これらの前提をもとに、電子密度 $\rho$ を変化させながらエネルギー $E_[\rho]$ を計算し、これが最小と思われる結果を返したとき $\rho = \rho_0$（基底状態）であるとする。

### V-表現可能性

Hohenberg-Kohn の定理は、任意の電子密度 $\rho$ に対応して、それを基底状態とする外部ポテンシャル $V$ がいつでも存在することは保証しない。$\rho$ を基底状態電子密度としてもつような外部ポテンシャル $V$ が存在するとき、そのような $\rho$ を **$V$-表現可能**であるという。

## Kohn-Sham 方程式

### Kohn-Sham 補助系

