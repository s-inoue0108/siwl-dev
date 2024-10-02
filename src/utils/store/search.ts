import { createSignal } from "solid-js";
import { type CollectionEntry } from "astro:content";

export const [isOpenSearchModal, setIsOpenSearchModal] = createSignal(false);
export const [keyword, setKeyword] = createSignal("");