import { onCleanup, onMount } from "solid-js";
import { Portal, Show } from "solid-js/web";
import { isOpenToc, setIsOpenToc } from "../../utils/store/is-open-toc";
import { IoClose } from "solid-icons/io";
import { BiRegularTable } from "solid-icons/bi";
import Toc from "../large/Toc";
import { isOpenSearch, setIsOpenSearch } from "../../utils/store/is-open-search";
import type { MarkdownHeading } from "astro";

interface Props {
	headings?: MarkdownHeading[];
}

const TocModal = ({ headings }: Props) => {
	onMount(() => {
		window.addEventListener("resize", () => {
			const content = document.getElementById("content")!;
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
			setIsOpenToc(false);
		});
	});

	onCleanup(() => {
		setIsOpenToc(false);
	});

	const toggleOpen = () => {
		if (isOpenSearch()) {
			setIsOpenSearch(false);
		}

		const content = document.getElementById("content")!;
		if (isOpenToc()) {
			content.style.opacity = "1";
			content.style.pointerEvents = "auto";
			content.style.userSelect = "auto";
		} else {
			content.style.opacity = "0.05";
			content.style.pointerEvents = "none";
			content.style.userSelect = "none";
		}
		setIsOpenToc(!isOpenToc());
	};

	return (
		<>
			<button
				type="button"
				onClick={toggleOpen}
				class={`${
					isOpenToc() ? "text-foreground" : "text-muted-foreground"
				} text-sm flex items-center gap-1 font-semibold`}
			>
				{isOpenToc() ? <IoClose /> : <BiRegularTable />}
				Toc
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenToc()}>
					<div class="z-50 w-full h-full p-4 fixed top-12 sm:top-14 lg:top-16 left-0 overflow-y-auto">
						{headings && <Toc headings={headings} />}
					</div>
				</Show>
			</Portal>
		</>
	);
};

export default TocModal;
