import { createSignal } from "solid-js";
import type { BookInfo } from "../api/get-book-info";

export const [isOpenBookcard, setIsOpenBookcard] = createSignal(false);
export const [bookInfo, setBookInfo] = createSignal<BookInfo>();
export const [bookRating, setBookRating] = createSignal<number>(3);
export const [reviewBody, setReviewBody] = createSignal<string>("");