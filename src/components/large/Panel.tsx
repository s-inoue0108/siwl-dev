import { IoChevronUp } from "solid-icons/io";
import { createSignal, Show, type JSXElement } from "solid-js";

interface Props {
	Content: JSXElement;
	title: string;
	href?: string;
	isShowToggleButton?: boolean;
}

const Panel = ({ Content, title, href, isShowToggleButton = true }: Props) => {
	const [isOpen, setIsOpen] = createSignal(true);
	return (
		<section class="px-4 py-2 border border-muted-background bg-muted-transparent mb-8 md:mb-0 w-full rounded-xl flex flex-col gap-2 lg:gap-4 shadow-lg">
			<div class="w-full flex justify-between items-center">
				<a
					href={href}
					class={`${
						href
							? "cursor-pointer hover:opacity-70 transition-opacity duration-150"
							: "pointer-events-none"
					} flex items-center gap-3 lg:gap-4`}
				>
					<div class="w-2 h-[1.5rem] lg:h-[1.8rem] bg-gradient-to-b from-accent-sub-base to-accent-base" />
					<h2 class="text-2xl lg:text-3xl font-bold tracking-wide">{title}</h2>
				</a>
				{isShowToggleButton && (
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen())}
						class="text-3xl text-muted-foreground hover:text-foreground transition-colors duration-150"
					>
						<IoChevronUp class={isOpen() ? "rotate-180" : ""} />
					</button>
				)}
			</div>
			<Show when={isOpen()}>{Content}</Show>
		</section>
	);
};

export default Panel;
