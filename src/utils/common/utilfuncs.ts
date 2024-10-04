// https://zenn.dev/zozotech/articles/a107520099d8be
export const getOmit = <
  T extends Record<string, unknown>,
  K extends [keyof T, ...(keyof T)[]]
>(
  obj: T,
  ...keys: K
): Omit<T, K[number]> => {
  const result = { ...obj };
  for (const key of keys) {
    if (key in result) delete result[key];
  }
  return result;
};

export const getPick = <
  T extends Record<string, unknown>,
  K extends [keyof T, ...(keyof T)[]]
>(
  obj: T,
  ...keys: K
): Pick<T, K[number]> => {
  const result = {} as Pick<T, K[number]>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
};

// https://qiita.com/suin/items/1b39ce57dd660f12f34b
export const getSerialNumbers = (start: number = 0, stop: number) => {
  const arr = [];
  for (let n = start; n <= stop; n++) {
    arr.push(n);
  }
  return arr;
}

// age, experienceYears
export const getAge = () => {
  const now = new Date();

  const birthYear = 2003;
  const currentYear = now.getFullYear();

  // GMT
  const currentBirthDay = new Date(`${currentYear}-01-08T04:08:00.000Z`);

  if (currentBirthDay.getTime() > now.getTime()) {
    return currentYear - birthYear - 1;
  }
  return currentYear - birthYear;
}

export const getExperienceYears = () => {
  const now = new Date();

  const startYear = 2025;
  const currentYear = now.getFullYear();

  // GMT
  const currentStartDay = new Date(`${currentYear}-03-31T15:00:00.000Z`);

  if (currentStartDay.getTime() > now.getTime()) {
    const diff = currentYear - startYear - 1;
    return diff < 0 ? 0 : diff;
  }
  const diff = currentYear - startYear;
  return diff < 0 ? 0 : diff;
}

// https://zenn.dev/tak_dcxi/articles/bbdb6cd9305ba4
// ドキュメントの書字方向を取得し、縦書きかどうかを判定
const isVerticalWritingMode = (): boolean => {
  const writingMode = window.getComputedStyle(document.documentElement).writingMode
  return writingMode.includes('vertical')
}

// スクロールバーの幅を計算する
const getScrollBarSize = (): number => {
  const scrollBarXSize = window.innerHeight - document.body.clientHeight
  const scrollBarYSize = window.innerWidth - document.body.clientWidth
  return isVerticalWritingMode() ? scrollBarXSize : scrollBarYSize
}

// スクロール位置を取得する
const getScrollPosition = (fixed: boolean): number => {
  if (fixed) {
    return isVerticalWritingMode()
      ? document.scrollingElement?.scrollLeft ?? 0
      : document.scrollingElement?.scrollTop ?? 0
  }
  return parseInt(document.body.style.insetBlockStart || '0', 10)
}

type AllowedStyles = 'blockSize' | 'insetInlineStart' | 'position' | 'insetBlockStart' | 'inlineSize'

// 背面固定のスタイルを適用する
const applyStyles = (scrollPosition: number, apply: boolean): void => {
  const styles: Partial<Record<AllowedStyles, string>> = {
    blockSize: '100dvb',
    insetInlineStart: '0',
    position: 'fixed',
    insetBlockStart: isVerticalWritingMode() ? `${scrollPosition}px` : `${scrollPosition * -1}px`,
    inlineSize: '100dvi',
  }
  Object.keys(styles).forEach((key) => {
    const styleKey = key as AllowedStyles
    document.body.style[styleKey] = apply ? styles[styleKey]! : ''
  })
}

// スクロール位置を元に戻す
const restorePosition = (scrollPosition: number): void => {
  const options: ScrollToOptions = {
    behavior: 'instant',
    [isVerticalWritingMode() ? 'left' : 'top']: isVerticalWritingMode() ? scrollPosition : scrollPosition * -1,
  }
  window.scrollTo(options)
}

// 背面を固定する
export const backfaceFixed = (fixed: boolean): void => {
  const scrollBarWidth = getScrollBarSize()
  const scrollPosition = getScrollPosition(fixed)
  document.body.style.paddingInlineEnd = fixed ? `${scrollBarWidth}px` : ''
  applyStyles(scrollPosition, fixed)
  if (!fixed) {
    restorePosition(scrollPosition)
  }
}