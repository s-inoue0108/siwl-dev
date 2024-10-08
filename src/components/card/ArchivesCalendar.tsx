import type { CollectionEntry } from "astro:content";
import { createMemo, createSignal, For } from "solid-js";
import { IoGitCommitOutline } from "solid-icons/io";
import { getMonths } from "../../utils/common/utilfuncs";
import { allArticles } from "../../utils/store/collections";

interface Props {
	articles: CollectionEntry<"article">[];
}

const ArchivesCalendar = ({ articles }: Props) => {
	const [selectedYear, setSelectedYear] = createSignal<number>(new Date().getFullYear());

	const months = getMonths();

	const numberOfArticleEachMonths = createMemo(() => {
		const currentYearArticles = allArticles.filter(({ data }) => {
			return data.publishDate.getFullYear() === selectedYear();
		});

		const numberOfArticlesEachMonths = months.map((m) => {
			return { ...m, numberOf: 0 };
		});

		currentYearArticles.forEach(({ data }) => {
			const idx = data.publishDate.getMonth();
			numberOfArticlesEachMonths[idx].numberOf++;
		});

		return numberOfArticlesEachMonths;
	});

	return (
		<div class="flex justify-center">
			<ul class="flex flex-col">
				<For each={numberOfArticleEachMonths()}>
					{({ name, value, numberOf }) => {
						return (
							<li class="w-full my-[-0.4rem] lg:my-[-0.5rem] 2xl:my-[-0.6rem]">
								<div class="flex items-center gap-1">
									<div class="font-code lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-muted-foreground">
										{numberOf.toString().padStart(2, "0")}
									</div>
									<div class="text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl">
										<IoGitCommitOutline class="rotate-90" />
									</div>
									<a
										href={`/blog/archives/${selectedYear()}-${value}`}
										class="font-semibold text-sm sm:text-base lg:text-lg xl:text-xl transition-colors duration-150"
									>
										{name}
									</a>
								</div>
							</li>
						);
					}}
				</For>
			</ul>
		</div>
	);
};

export default ArchivesCalendar;
