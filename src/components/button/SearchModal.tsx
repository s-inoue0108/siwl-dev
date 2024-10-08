import { onMount, onCleanup } from "solid-js";
import { IoClose, IoSearch } from "solid-icons/io";
import { isOpenModal, setIsOpenModal } from "../../utils/store/modal";
import SearchInput from "../form/SearchInput";
import { Portal, Show } from "solid-js/web";
import SearchResult from "../form/SearchResult";
import { setKeyword } from "../../utils/store/search";
import { backfaceFixed } from "../../utils/common/utilfuncs";

const SearchModal = () => {
	onMount(() => {
		window.addEventListener("resize", () => {
			const content = document.getElementById("content")!;
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
			setIsOpenModal(false);
		});
	});

	onCleanup(() => {
		setKeyword("");
		setIsOpenModal(false);
	});

	const toggleOpen = () => {
		const content = document.getElementById("content")!;
		if (isOpenModal()) {
			backfaceFixed(false);
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
		} else {
			backfaceFixed(true);
			content.style.opacity = "0.05";
			content.style.pointerEvents = "none";
			content.style.userSelect = "none";
		}
		setIsOpenModal(!isOpenModal());
	};

	return (
		<>
			<button type="button" onClick={toggleOpen}>
				{isOpenModal() ? <IoClose size="1.4rem" /> : <IoSearch size="1.4rem" />}
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenModal()}>
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
