import ogs from "open-graph-scraper";

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

// Get Months
export const getMonths = (nameLength: "long" | "short" = "long") => {
  const arr = [];
  for (let m = 1; m <= 12; m++) {
    arr.push({ value: m.toString().padStart(2, "0"), name: new Date(0, m - 1).toLocaleString('en', { month: nameLength }) });
  }
  return arr;
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

//　https://qiita.com/h53/items/05139982c6fd81212b08

export const toISOStringWithTimezone = (date: Date): string => {
  const pad = (str: string): string => {
    return ('0' + str).slice(-2);
  }

  const year = (date.getFullYear()).toString();
  const month = pad((date.getMonth() + 1).toString());
  const day = pad(date.getDate().toString());
  const hour = pad(date.getHours().toString());
  const min = pad(date.getMinutes().toString());
  const sec = pad(date.getSeconds().toString());
  const tz = -date.getTimezoneOffset();
  const sign = tz >= 0 ? '+' : '-';
  const tzHour = pad((tz / 60).toString());
  const tzMin = pad((tz % 60).toString());

  return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHour}:${tzMin}`;
}

type AnnualCalendar = {
  contributionDays: {
    date: string;
    inYear: boolean;
    [key: string]: any;
  }[];
}[];

export const getAnnualCalendar = (year: number): AnnualCalendar => {
  const startOfISOWeek = (d: Date) => {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = date.getDay();
    date.setDate(date.getDate() - day);
    return date;
  }

  const endOfISOWeek = (d: Date) => {
    const s = startOfISOWeek(d);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    return e;
  }

  const generateFullWeeks = () => {
    const jan1 = new Date(year, 0, 1);
    const dec31 = new Date(year, 11, 31);

    let cursor = startOfISOWeek(jan1);      // 2024年末になる可能性あり
    const last = endOfISOWeek(dec31);       // 2026年頭になる可能性あり

    const result = [];
    while (cursor <= last) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(cursor);
        d.setDate(cursor.getDate() + i);
        week.push({
          date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
          inYear: d.getFullYear() === year,
        });
      }
      result.push({ contributionDays: week });
      cursor.setDate(cursor.getDate() + 7);
    }
    return result;
  }

  const fullWeeks = generateFullWeeks();
  return fullWeeks;
}

// export interface OgpData {
//   url: string;
//   resUrl: string;
//   sitename: string;
//   title: string;
//   description: string;
//   image: string;
//   favicon: string;
// };

// const validateImageUrl = async (image: string) => {
//   if (!image || image === "") return "";

//   try {
//     const res = await fetch(image, { method: "GET" });
//     const contentType = res.headers.get("content-type");

//     if (res.ok && contentType?.startsWith("image/")) {

//       // base64 encode
//       if (image.length > 1000) {
//         const buffer = await res.arrayBuffer();
//         const base64 = Buffer.from(buffer).toString("base64");
//         return `data:${contentType};base64,${base64}`
//       }

//       return image;
//     } else {
//       return "";
//     }
//   } catch (err) {
//     return "";
//   }
// }

// const validateFaviconUrl = async (url: string, favicon: string) => {
//   if (!favicon || favicon === "") return "";

//   let reqUrl;

//   if (/^https?:\/\//.test(favicon)) {
//     reqUrl = favicon;
//   } else if (favicon.startsWith("/")) {
//     reqUrl = `${new URL(url).origin}${favicon}`;
//   } else {
//     reqUrl = `${new URL(url).origin}/${favicon}`;
//   }

//   try {
//     const res = await fetch(reqUrl, {
//       method: "GET",
//       headers: {
//         'User-Agent':
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
//       },
//     });

//     const contentType = res.headers.get("content-type");

//     if (res.ok && contentType?.startsWith("image/")) {
//       return res.url;
//     } else {
//       return "";
//     }
//   } catch (err) {
//     return "";
//   }
// };

// export const fetchOgp = async (url: string): Promise<OgpData> => {

//   const data = {
//     url: url,
//     resUrl: "",
//     sitename: "No title",
//     title: "No title",
//     description: "No description",
//     image: "",
//     favicon: "",
//   }

//   try {
//     const { result } = await ogs({ url });

//     const image = await validateImageUrl(result.ogImage?.[0]?.url ?? "");
//     const favicon = await validateFaviconUrl(url, result.favicon ?? "");

//     data.resUrl = result.ogUrl ?? "";
//     data.sitename = result.ogSiteName ?? "";
//     data.title = result.ogTitle ?? "";
//     data.description = result.ogDescription ?? "";
//     data.image = image;
//     data.favicon = favicon;

//     return data;
//   } catch (error) {
//     console.error(`[remark-bare-link] Error: ${error}`);
//     return data;
//   }
// };