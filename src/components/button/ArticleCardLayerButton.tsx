import { createEffect, createSignal } from "solid-js";
import { IoPricetags } from "solid-icons/io";
import type { CollectionEntry } from "astro:content";

interface Props {
	slug: CollectionEntry<"article">["slug"];
}

const ArticleCardLayerButton = ({ slug }: Props) => {
	const [isOpen, setIsOpen] = createSignal(false);

	createEffect(() => {
		const tagsDom = document.getElementById(`article-card-${slug}-tags`)!;
		const descriptionDom = document.getElementById(`article-card-${slug}-description`)!;
		tagsDom.style.transition = "opacity 0.1s ease-in-out";
		descriptionDom.style.transition = "opacity 0.1s ease-in-out";
		if (isOpen()) {
			tagsDom.style.opacity = "1";
			tagsDom.style.pointerEvents = "auto";
			tagsDom.style.userSelect = "auto";

			descriptionDom.style.opacity = "0";
			descriptionDom.style.pointerEvents = "none";
			descriptionDom.style.userSelect = "none";
		} else {
			tagsDom.style.opacity = "0";
			tagsDom.style.pointerEvents = "none";
			tagsDom.style.userSelect = "none";

			descriptionDom.style.opacity = "1";
			descriptionDom.style.pointerEvents = "auto";
			descriptionDom.style.userSelect = "auto";
		}
	});

	return (
		<button
			type="button"
			class={`relative ${
				isOpen() ? "bg-accent-foreground" : "bg-muted-background"
			} hover:bg-accent-foreground transition-colors duration-150 rounded-t-md w-8 h-[calc(2rem-1px)]`}
			onClick={() => setIsOpen(!isOpen())}
		>
			<div
				class={`transition-colors duration-150 absolute top-[calc(50%+1px)] left-1/2 -translate-x-1/2 -translate-y-1/2 ${
					isOpen() ? "text-accent-background" : "text-muted-foreground"
				}`}
			>
				<IoPricetags size={"1rem"} />
			</div>
		</button>
	);
};

export default ArticleCardLayerButton;
