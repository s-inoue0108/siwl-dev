import { createSignal, Show, Index } from "solid-js";

const getContribColor = (articles: any, inYear: boolean) => {
	if (!inYear) {
		return "bg-muted-background";
	} else if (!articles) {
		return "bg-background";
	} else if (articles[0].category.id == "tech") {
		return "bg-accent-sub-base";
	}
	return "bg-accent-base";
};

interface Props {
	articles: any;
	inYear: boolean;
	date: string;
	pos: number;
}

const ArchiveHoverButton = ({ articles, inYear, date, pos }: Props) => {
	const [isHover, setIsHover] = createSignal(false);

	return (
		<>
			<button
				type="button"
				class={`relative w-8 h-8 border border-muted-background rounded-lg hover:opacity-70 transition-opacity duration-150 ${getContribColor(
					articles,
					inYear
				)}`}
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				<span class="font-semibold whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base">
					{inYear && new Date(date).getDate() === 1 ? new Date(date).getMonth() + 1 : ""}
				</span>
			</button>
			<Show when={isHover() && articles && inYear}>
				<div
					class={`z-[1000] absolute ${
						new Date(articles[0].publishDateYMD).getMonth() == 11 ? "right-8" : "left-8"
					} ${pos < 3 ? "top-0" : "bottom-0"}`}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
				>
					<ul class="flex flex-col items-center gap-1">
						<Index each={articles}>
							{(article) => (
								<li
									class={`w-32 leading-3 border ${
										article().category.id == "tech"
											? "border-accent-sub-base"
											: "border-accent-base"
									} bg-background p-1 rounded-lg shadow-2xl`}
								>
									<a
										class="font-semibold text-xs hover:opacity-50 transition duration-150"
										href={`/blog/articles/${article().slug}`}
									>
										{article().title}
									</a>
								</li>
							)}
						</Index>
					</ul>
				</div>
			</Show>
		</>
	);
};

export default ArchiveHoverButton;
