import { IoChevronUp } from "solid-icons/io";
import { createSignal } from "solid-js";

const CategoriesPanel = () => {
	const [isOpen, setIsOpen] = createSignal(true);
	return (
		<section class="lg:sticky lg:top-0 px-4 py-2 bg-muted-background w-screen -mx-4 sm:w-full sm:mx-0 sm:rounded-xl flex flex-col gap-2 lg:gap-4 shadow-lg">
			<div class="w-full flex justify-between items-center">
				<div class="flex items-center gap-3 lg:gap-4">
					<hr class="border-4 border-accent-base rounded-full h-[1rem] lg:h-[1.25rem]" />
					<h1 class="text-2xl lg:text-3xl font-extrabold tracking-wide">Categories</h1>
				</div>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen())}
					class="text-3xl text-muted-foreground hover:text-accent-base transition-colors duration-150"
				>
					<IoChevronUp class={isOpen() ? "rotate-180" : ""} />
				</button>
			</div>
		</section>
	);
};

export default CategoriesPanel;
