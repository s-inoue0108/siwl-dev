# 開発ノート

## Swiper Element の型定義

> https://github.com/nolimits4web/swiper/issues/6466
> https://swiperjs.com/element#usage-with-solid

```ts
// src/types/swiper.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "swiper-container": any;
      "swiper-slide": any;
    }
  }
}
```
