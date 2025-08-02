import { IoArrowUp } from "solid-icons/io";

const PageTopButton = () => {
	return (
		<div class="w-32 h-full border border-muted-background bg-muted-background/30 rounded-xl shadow-lg">
			<button
				type="button"
				onClick={() => window.scrollTo({ top: 0 })}
				class="w-full h-full flex flex-col justify-center items-center text-muted-foreground hover:text-foreground transition-colors duration-150"
			>
				<span class="text-4xl">
					<IoArrowUp />
				</span>
				<span class="text-xs font-bold">PAGE TOP</span>
			</button>
		</div>
	);
};

export default PageTopButton;
