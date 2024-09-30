import { createEffect, createSignal } from "solid-js";
import { IoPricetags } from "solid-icons/io";
import type { CollectionEntry } from "astro:content";

interface Props {
	article: CollectionEntry<"article">;
}

const ArticleCardLayerButton = ({ article }: Props) => {
	const [isOpen, setIsOpen] = createSignal(false);

	createEffect(() => {
		const tagsDom = document.getElementById(`article-card-${article.slug}-tags`)!;
		const descriptionDom = document.getElementById(`article-card-${article.slug}-description`)!;
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
				isOpen()
					? `${article.data.category.id === "tech" ? "bg-accent-base" : "bg-accent-sub-base"}`
					: `bg-muted-background ${
							article.data.category.id === "tech"
								? "hover:bg-accent-base"
								: "hover:bg-accent-sub-base"
					  }`
			} transition-colors duration-150 rounded-t-lg w-16 h-8 translate-y-[2px]`}
			onClick={() => setIsOpen(!isOpen())}
		>
			<div
				class={`transition-colors duration-150 absolute top-[calc(50%+2px)] left-1/2 -translate-x-1/2 -translate-y-1/2 ${
					isOpen() ? "text-foreground" : "text-muted-foreground"
				}`}
			>
				<div class="flex items-center gap-2">
					<IoPricetags size={"0.7rem"} />
					<span class="text-sm font-bold whitespace-nowrap">Tag</span>
				</div>
			</div>
		</button>
	);
};

export default ArticleCardLayerButton;
