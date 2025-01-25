import calculateReadingTime from "reading-time";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

// 読了時間
export const getReadingTime = (text: string): { minutes: number, wc: number } => {
  if (!text || !text.length) return { minutes: 0, wc: 0 };
  try {
    const { minutes, words } = calculateReadingTime(toString(fromMarkdown(text)));
    if (minutes && minutes > 0) {
      return { minutes: Math.ceil(minutes), wc: words };
    }
    return { minutes: 0, wc: 0 };
  } catch (e) {
    return { minutes: 0, wc: 0 };
  }
};