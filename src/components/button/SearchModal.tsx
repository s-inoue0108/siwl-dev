import { onMount, onCleanup } from "solid-js";
import { setIsOpenSearch, isOpenSearch } from "../../utils/store/is-open-search";
import { IoClose, IoSearch } from "solid-icons/io";
import SearchInput from "../form/SearchInput";
import { Portal, Show } from "solid-js/web";
import SearchResult from "../form/SearchResult";
import { isOpenToc, setIsOpenToc } from "../../utils/store/is-open-toc";
import { setKeyword } from "../../utils/store/search";

const SearchModal = () => {
	onMount(() => {
		window.addEventListener("resize", () => {
			const content = document.getElementById("content")!;
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
			setIsOpenSearch(false);
		});
	});

	onCleanup(() => {
		setKeyword("");
		setIsOpenSearch(false);
	});

	const toggleOpen = () => {
		if (isOpenToc()) {
			setIsOpenToc(false);
		}

		const content = document.getElementById("content")!;
		if (isOpenSearch()) {
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
		} else {
			content.style.opacity = "0.05";
			content.style.pointerEvents = "none";
			content.style.userSelect = "none";
		}
		setIsOpenSearch(!isOpenSearch());
	};

	return (
		<>
			<button
				type="button"
				onClick={toggleOpen}
				class={`${
					isOpenSearch() ? "text-foreground" : "text-muted-foreground"
				} text-sm flex items-center gap-1 font-semibold`}
			>
				{isOpenSearch() ? <IoClose /> : <IoSearch />}
				Search
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenSearch()}>
					<div class="z-50 w-full h-full p-4 fixed top-12 sm:top-14 lg:top-16 left-0 overflow-y-auto">
						<SearchInput />
						<div class="pt-4 pb-8">
							<SearchResult />
						</div>
					</div>
				</Show>
			</Portal>
		</>
	);
};

export default SearchModal;
