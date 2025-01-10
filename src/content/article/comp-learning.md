---
isDraft: false
isLimited: true
title: 数値計算を勉強する
category: idea
tags: [comp-science]
description: 種々の数値計算手法についてまとめ、Python による実装をしてみます。
publishDate: 2025-01-10T13:49:23+09:00
updateDate: 2025-01-10T13:49:23+09:00
relatedArticles: []
---

## 速度 Verlet 法

時刻 $t$ における粒子の位置を $\bm{r}(t)$、速度を $\bm{v}(t)$、力場を $\bm{F}(t)$ とし、十分小さい時間ステップ $\Delta t > 0$ をとると、
$$
\bm{r}(t + \Delta t) = \bm{r}(t) + \Delta t \bm{v}(t) + \frac{(\Delta t)^2}{2}\frac{\bm{F}(t)}{m}
$$

$$
\bm{v}(t + \Delta t) = \bm{v}(t) + \frac{\Delta t}{2}\left( \frac{\bm{F}(t)}{m} + \frac{\bm{F}(t + \Delta t)}{m} \right)
$$

という更新式を得ます。
