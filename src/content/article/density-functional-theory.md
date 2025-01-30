---
isDraft: true
title: 密度汎関数理論（DFT）について
category: idea
tags: [comp-science]
description: "密度汎関数理論の内容についてまとめます。"
publishDate: 2025-01-30T22:36:20+09:00
updateDate: 2025-01-30T22:36:20+09:00
relatedArticles: []
---

## Hohenberg-Kohn の定理

### 第1定理

> [!tip] Hohenberg-Kohn の第1定理
>
> 外部ポテンシャル $V(\bm{r})$ 中に置かれた相互作用する $N$ 電子系は、1電子密度 $\rho(\bm{r})$ によって一意に決まる。

> [!info:fold] 証明
>
> 外部ポテンシャル $V_1(\bm{r}) \neq V_2(\bm{r})$ は、同じ基底状態の電子密度 $\rho(\bm{r})$ に対応していると仮定する。ここで、$V_i(\bm{r}) ~ (i=1,2)$ が生むハミルトニアン $\hat{H}_i$ とその固有状態 $\ket{\varPsi_i}$ 、固有エネルギー $E_i$ について、変分原理から
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
> であり、1電子密度 $\rho(\bm{r})$ について
>
> $$
> \bra{\varPsi_2}(\hat{H}_1 - \hat{H}_2)\ket{\varPsi_2} = \int d\bm{r} ~ [V_1(\bm{r}) - V_2(\bm{r})]\rho(\bm{r})
> $$
>
> が成り立つことから、
>
> $$
> \bra{\varPsi_2}\hat{H}_1\ket{\varPsi_2} = E_2 + \int d\bm{r} ~ [V_1(\bm{r}) - V_2(\bm{r})]\rho(\bm{r})
> $$
>
> である。よって、
>
> $$
> E_1 < E_2 + \int d\bm{r} ~ [V_1(\bm{r}) - V_2(\bm{r})]\rho(\bm{r})
> $$
>
> かつ、添字の対称性から
>
> $$
> E_2 < E_1 + \int d\bm{r} ~ [V_2(\bm{r}) - V_1(\bm{r})]\rho(\bm{r})
> $$
>
> である。これら2式を足し合わせると、
>
> $$
> E_1 + E_2 < E_2 + E_1
> $$
>
> となって矛盾が起きるから、基底状態の電子密度 $\rho(\bm{r})$ に対応する外部ポテンシャルは唯一つである。

$N$ 電子系における1電子密度 $\rho(\bm{r})$ は以下のように表される：

$$
\rho(\bm{r}) = \int d\bm{x}~|\varPhi_0(\bm{x})|^2 \left( \sum_{i} \delta(\bm{r}_i - \bm{r}) \right)
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