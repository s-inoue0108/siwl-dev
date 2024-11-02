import { type CollectionEntry } from "astro:content";
import { Portal, Show } from "solid-js/web";
import { createSignal } from "solid-js";

interface Props {
	work: CollectionEntry<"work">;
}

const WorkCard = ({ work }: Props) => {
	const [isOpenCard, setIsOpenCard] = createSignal(false);

	return (
		<>
			<button
				type="button"
				class="w-48 h-64 flex flex-col border border-muted-background rounded-xl"
				onClick={() => setIsOpenCard(!isOpenCard())}
			>
				<span class="w-full h-40"></span>
				<span class="w-full border-t-[1px] border-muted-background h-24">
					<span>{work.data.title}</span>
				</span>
			</button>
			<Portal mount={document.body}>
				<Show when={isOpenCard()}>
					<div class="bg-muted-background z-[100] p-4 fixed top-12 sm:top-14 lg:top-16 left-0 overflow-y-auto">
						Portal
					</div>
				</Show>
			</Portal>
		</>
	);
};

export default WorkCard;
