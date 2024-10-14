import { createEffect, createSignal } from "solid-js";
import { IoPricetags } from "solid-icons/io";
import type { CollectionEntry } from "astro:content";

interface Props {
	article: CollectionEntry<"article">;
	category: CollectionEntry<"category">;
}

const ArticleCardLayerButton = ({ article, category }: Props) => {
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
					? `${category.data.colors.bg} text-foreground`
					: `bg-muted-background ${category.data.colors.bgHover} text-muted-foreground hover:text-foreground`
			} transition-colors duration-150 rounded-t-lg w-16 h-8 translate-y-[2px]`}
			onClick={() => setIsOpen(!isOpen())}
		>
			<div class="absolute top-[calc(50%+2px)] left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div class="flex items-center gap-2">
					<IoPricetags size={"0.7rem"} />
					<span class="text-sm font-bold whitespace-nowrap">Tag</span>
				</div>
			</div>
		</button>
	);
};

export default ArticleCardLayerButton;
