---
isDraft: false
title: "Vueでスクロールに同期したプログレスバーを実装する"
category: tech
tags: [ts, vue]
description: Vue.jsとインラインSVGを使ってスクロールに同期した円形プログレスバーを実装しました。
publishDate: 2024-10-08
updateDate: 2024-10-08
relatedArticles: []
---

## 参考サイト

https://digipress.info/tech/circular-progress-bar-with-count-up/

## 方針

参考サイトのように SVG を使って実装します。
Vue を利用することで、SVg のプロパティである `stroke-dashoffset` をリアクティブに扱い、スクロールイベントに応じてその値を更新しようという考えです。

## 実装

`<circle>` の半径を $ r $ とするとき、その円周の長さ $ L $（`circumference`）は、

$$
L = 2 \pi r
$$

で計算されます。これに対し、 $ 100p ~ \% $ だけ進んだ時のプログレスバーの弧の長さ $ \ell $（`progress`）は、

$$
\ell = 2 \pi r (1 - p)
$$

で計算できます。$ p $ を `progressPercent` というステートとして宣言し、$ \ell $ は `computed` フックを用いることで $ p $ の値の更新を拾って勝手に再計算されるようにしています。
$ p $ は JS の Window API および Document API を使ってスクロール量および画面高さを取得[^1]して計算します。
[^1]: これらの API を使った処理はマウント後に行います。よって、処理の内容は `onMounted` フックのコールバックに含めます。

```vue:Vue
<script setup lang="ts">
import { onMounted, computed, ref } from "vue";

// Progress circle
const radius = 42;

const progressPercent = ref<number>(0);

const circumference = 2 * Math.PI * radius;

const progress = computed<number>(() => {
  const val = 2 * Math.PI * (1 - progressPercent.value) * radius;
  if (progressPercent.value > 1) {
    return 0;
  }
  return val;
});

onMounted(() => {
  progressPercent.value = window.scrollY / document.body.scrollHeight;
  const height = document.body.scrollHeight;
  window.addEventListener("scroll", () => {
    const scrollAmount = window.scrollY;
    progressPercent.value = scrollAmount / height;
  });
})
</script>

<template>
  <div class="progress-wrapper">
    <svg class="progress-bar" viewBox="0 0 100 100">
      <circle class="bar" cx="50" cy="50" :r="radius"></circle>
      <circle class="bg" cx="50" cy="50" :r="radius"></circle>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.progress-wrapper {
  width: 42px;
  height: 42px;

  .bg {
    stroke: #ffffff;
    fill: #ffffff;
  }

  .bar {
    stroke-linecap: butt;
    stroke-width: 16px;
    stroke: $rose;   // #fb7185
    stroke-dasharray: v-bind(circumference);
    stroke-dashoffset: v-bind(progress);
  }
}
</style>
```
