---
isDraft: true
isLimited: false
title: Post Hartree-Fock 法
category: tech
tags: [comp-science]
description: ""
publishDate: 2025-02-10T17:42:48+09:00
updateDate: 2025-02-10T21:55:29+09:00
relatedArticles: []
---

## Hartree-Fock 法とスピン

### RHF 法

**Restricted Hartree-Fock (RHF) 法**は**閉殻系**に適用する HF 法である。
\
この方法では、全波動関数 $\varPhi_\mathrm{HF}$ を、HF 軌道 $\phi_i(\cdot)$ とスピン軌道 $\alpha(\cdot), ~ \beta(\cdot)$ の積からなる $2N$ 次元の Slater 行列式で表す：

$$
\varPhi_\mathrm{RHF}(\bm{x}_1,\ldots,\bm{x}_{2N}) = \frac{1}{\sqrt{(2N)!}} \begin{vmatrix} \phi_1(\bm{r}_1)\alpha(\sigma_1) & \phi_1(\bm{r}_1)\beta(\sigma_1) & \cdots & \phi_1(\bm{r}_{2N})\alpha(\sigma_{2N}) & \phi_1(\bm{r}_{2N})\beta(\sigma_{2N}) \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ \phi_N(\bm{r}_1)\alpha(\sigma_1) & \phi_N(\bm{r}_1)\beta(\sigma_1) & \cdots & \phi_N(\bm{r}_{2N})\alpha(\sigma_{2N}) & \phi_N(\bm{r}_{2N})\beta(\sigma_{2N}) \end{vmatrix}
$$

ここで $\bm{x}_i := (\bm{r}_i, \sigma_i)$ は電子 $i$ の空間座標とスピン座標の組である。
\
閉殻系ではすべての電子が $(\alpha, \beta)$ の対を作るため、各スピン軌道は同数を用意する。

### UHF 法

**Unrestricted Hartree-Fock (RHF) 法**は**開殻系**に適用する HF 法である。
\
この方法では、$N$ 組の $\alpha(\cdot)$ と $N-1$ 組の $\beta(\cdot)$ を用意し、それぞれ異なる軌道関数 $\phi_i(\cdot)$ と $\psi_i(\cdot)$ と掛け合わせる。
同じ $i$ に対する $\phi_i$ と $\psi_i$ は縮退しておらず、軌道エネルギーはわずかに異なる。

## 配置間相互作用（CI）法

HF 波動関数 $\varPhi_\mathrm{HF}$ に対して、励起配置の Slater 行列式を加えた近似を**配置間相互作用（CI）法**という。
\
電子 $i$ が $a$ へ励起した配置を $\varPhi_i^a$、電子 $i,j$ が $a,b$ へ励起した配置を $\varPhi_{i,j}^{a,b} \cdots$ とするとき、その配置関数 $\varPhi_\mathrm{CI}$ は、

$$
\varPhi_\mathrm{CI} = C_0\varPhi_\mathrm{HF} + \sum_i \sum_a C_1 \varPhi_i^a + \sum_{i > j} \sum_{a, b} C_2 \varPhi_{i,j}^{a,b} + \cdots
$$

となる。ここで $C_k$ は配置の重み（CI 係数）であり、これを変分法によって定める：

$$
\mathrm{minimize} \quad E[C_0, C_1, \ldots] = \bra{\varPhi_\mathrm{CI}} \hat{H} \ket{\varPhi_\mathrm{CI}}
$$

配置間相互作用法は多くの Slater 行列式を必要とするため、一般に計算コストが高い。

### CISD 法

**CISD 法**は、HF 配置のほかに2電子励起配置までを考慮した配置間相互作用法である。
\
電子 $i$ が $a$ へ励起した配置を $\varPhi_i^a$、電子 $i,j$ が $a,b$ へ励起した配置を $\varPhi_{i,j}^{a,b}$ とするとき、その配置関数 $\varPhi_\mathrm{CISD}$ は、

$$
\varPhi_\mathrm{CISD} = C_\mathrm{HF}\varPhi_\mathrm{HF} + \sum_i \sum_a C_i^a \varPhi_i^a + \sum_{i > j} \sum_{a, b} C_{i,j}^{a,b} \varPhi_{i,j}^{a,b}
$$

となる。

### CID 法

**CID 法**は、HF 配置のほかに2電子励起配置のみを考慮した配置間相互作用法である。

$$
\varPhi_\mathrm{CID} = C_\mathrm{HF}\varPhi_\mathrm{HF} + \sum_{i > j} \sum_{a, b} C_{i,j}^{a,b} \varPhi_{i,j}^{a,b}
$$

### Full-CI 法

**Full-CI 法**はすべての励起配置を考慮した配置間相互作用法である。非常に計算コストが高く、十分小さな系でないと適用できない。

## Møller-Plesset 摂動（MP）法

## クラスター展開（CC）法