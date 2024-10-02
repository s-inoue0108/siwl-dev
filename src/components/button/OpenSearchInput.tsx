import { IoClose, IoSearch } from "solid-icons/io";
import { isOpenSearchModal, setIsOpenSearchModal } from "../../utils/store/search";
import SearchInput from "../form/SearchInput";
import { Portal, Show } from "solid-js/web";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import SearchResult from "../form/SearchResult";

const OpenSearchInput = () => {
	const toggleOpen = () => {
		const content = document.getElementById("content")!;
		if (isOpenSearchModal()) {
			enableBodyScroll(content);
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
		} else {
			disableBodyScroll(content, { reserveScrollBarGap: true });
			content.style.opacity = "0.05";
			content.style.pointerEvents = "none";
			content.style.userSelect = "none";
		}
		setIsOpenSearchModal(!isOpenSearchModal());
	};

	return (
		<div class="relative">
			<button type="button" onClick={toggleOpen}>
				{isOpenSearchModal() ? <IoClose size="1.2rem" /> : <IoSearch size="1.2rem" />}
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenSearchModal()}>
					<div class="z-50 w-full h-full p-4 fixed top-9 sm:top-12 lg:top-16 left-0 overflow-y-auto">
						<SearchInput />
						<div class="pt-4 pb-8">
							<SearchResult />
						</div>
					</div>
				</Show>
			</Portal>
		</div>
	);
};

export default OpenSearchInput;
