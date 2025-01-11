import calculateReadingTime from "reading-time";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

// 読了時間
export const getReadingTime = (text: string): string => {
  if (!text || !text.length) return `0 min`;
  try {
    const { minutes } = calculateReadingTime(toString(fromMarkdown(text)));
    if (minutes && minutes > 0) {
      return `${Math.ceil(minutes)} min`;
    }
    return `0 min`;
  } catch (e) {
    return `0 min`;
  }
};