import { createEffect, createSignal } from "solid-js";
import { IoNewspaper, IoPricetags } from "solid-icons/io";
import type { CollectionEntry } from "astro:content";

interface Props {
	slug: CollectionEntry<"article">["slug"];
}

const ArticleCardLayerButton = ({ slug }: Props) => {
	const [isOpen, setIsOpen] = createSignal(false);

	createEffect(() => {
		const tagsDom = document.getElementById(`article-card-${slug}-tags`)!;
		const descriptionDom = document.getElementById(`article-card-${slug}-description`)!;
		if (isOpen()) {
			tagsDom.style.zIndex = "10";
			descriptionDom.style.zIndex = "0";
		} else {
			tagsDom.style.zIndex = "0";
			descriptionDom.style.zIndex = "10";
		}
	});

	return (
		<ul class="flex items-center">
			<li>
				<button
					type="button"
					class={`relative ${
						isOpen() ? "bg-accent-foreground" : "bg-transparent"
					} border-[1.5px] border-accent-foreground hover:opacity-90 transition-colors duration-150 rounded-tl-lg w-8 h-8`}
					onClick={() => setIsOpen(true)}
				>
					<div
						class={`transition absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
							isOpen() ? "text-muted-foreground" : "text-accent-foreground"
						}`}
					>
						<IoPricetags size={"1rem"} />
					</div>
				</button>
			</li>
			<li>
				<button
					type="button"
					class={`relative ${
						!isOpen() ? "bg-accent-foreground" : "bg-transparent"
					} border-[1.5px] border-accent-foreground hover:opacity-90 transition-colors duration-150 rounded-br-[calc(0.5rem-1px)] w-8 h-8`}
					onClick={() => setIsOpen(false)}
				>
					<div
						class={`transition absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
							!isOpen() ? "text-muted-foreground" : "text-accent-foreground"
						}`}
					>
						<IoNewspaper size={"1rem"} />
					</div>
				</button>
			</li>
		</ul>
	);
};

export default ArticleCardLayerButton;
