---
isDraft: false
isLimited: true
title: 分子動力学（MD）の理論
category: tech
tags: [comp-science]
description: ""
publishDate: 2025-02-24T10:37:40+09:00
updateDate: 2025-02-24T11:20:23+09:00
relatedArticles: [density-functional-theory]
---

## 温度制御（Thermostat）

### Velocity Rescaling

> [!info] Velocity Rescaling
>
> 系の現在の温度を $T'$、目標温度を $T$ とするとき、ステップごとに速度（運動量）にスケーリング定数 $s = \sqrt{T / T'}$ を乗じて系を補正する。

$N$ 個の粒子について、Velocity Verlet による粒子 $i$ の速度の時間発展を考える：

$$
{\bm{v}_i}' \left(t + \frac{\Delta t}{2}\right) = \bm{v}_i \left(t - \frac{\Delta t}{2}\right) + \frac{\bm{F}_i (t)}{m_i} \Delta t
$$

時刻 $t + \Delta t / 2$ において ${\bm{v}_i}'$ に対応する温度を $T'$ とするとき、運動エネルギーは

$$
\frac{1}{2}\sum_i m_i {\bm{v}_i}'^2\left(t + \frac{\Delta t}{2}\right) = \frac{3}{2} N k_\mathrm{B} T'
$$

の関係をもつ。この瞬間の系の目標温度を $T$、目標速度を $\bm{v}_i (t + \Delta t / 2)$ と定めるとき、系の速度 ${\bm{v}_i}'$ をスケーリング定数 $s$ を用いて次のように補正する：

$$
{\bm{v}_i} \left(t + \frac{\Delta t}{2}\right) = s {\bm{v}_i}' \left(t + \frac{\Delta t}{2}\right)
$$

この時刻において、運動エネルギーについて、

$$
\frac{1}{2}\sum_i m_i {\bm{v}_i}^2\left(t + \frac{\Delta t}{2}\right) = \frac{1}{2}s^2\sum_i m_i {\bm{v}_i}'^2\left(t + \frac{\Delta t}{2}\right)
$$

すなわち

$$
\frac{3}{2} N k_\mathrm{B} T = \frac{3}{2} s^2 N k_\mathrm{B} T'
$$

の関係が成り立つから、

$$
s = \sqrt{\frac{T}{T'}}
$$

として系を補正できることがわかる。

### Berendsen Thermostat

> [!info] Berendsen Thermostat
>
> 瞬間の温度 $T'$ が目標温度 $T$ に緩和する速度を、緩和時定数 $\tau$ をパラメータとして、
>
> $$
> \frac{dT'}{dt} = \frac{T - T'}{\tau}
> $$
>
> が成り立つように制御する。


### Nose-Hoover Thermostat