import type { CollectionEntry } from "astro:content";
import { createMemo, createSignal, For } from "solid-js";
import { IoGitCommitOutline } from "solid-icons/io";
import { BiSolidSortAlt } from "solid-icons/bi";
import { getMonths } from "../../utils/common/utilfuncs";
import { allArticles } from "../../utils/store/collections";

interface Props {
	articles: CollectionEntry<"article">[];
}

const ArchivesCalendar = ({ articles }: Props) => {
	const [selectedYear, setSelectedYear] = createSignal<number>(new Date().getFullYear());

	const handleChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = +target.value;
		if (typeof value !== "number") return;
		setSelectedYear(value);
	};

	const months = getMonths();

	const publishYears = articles.map(({ data }) => data.publishDate.getFullYear());

	const uniquePublishYears = Array.from(new Set(publishYears)).sort((a, b) => b - a);

	const numberOfArticleEachMonths = createMemo(() => {
		const currentYearArticles = allArticles.filter(({ data }) => {
			return data.publishDate.getFullYear() === selectedYear();
		});

		const numberOfArticlesEachMonths = months.map((m) => {
			return { ...m, numberOf: { tech: 0, idea: 0 } };
		});

		currentYearArticles.forEach(({ data }) => {
			const idx = data.publishDate.getMonth();
			if (data.category.id === "tech") {
				numberOfArticlesEachMonths[idx].numberOf.tech++;
			} else {
				numberOfArticlesEachMonths[idx].numberOf.idea++;
			}
		});

		return numberOfArticlesEachMonths;
	});

	return (
		<div class="flex justify-center">
			<ul class="flex flex-col">
				<li class="w-fit mx-auto px-4 py-1 flex justify-center items-center gap-1 mb-8 border border-muted-background bg-muted-background/50 rounded-full">
					<select
						id="select-year"
						name="select-year"
						onChange={(e) => handleChange(e)}
						class="bg-muted-background/50 text-lg xl:text-2xl font-semibold"
					>
						{uniquePublishYears.map((year) => {
							return <option value={year}>{year}</option>;
						})}
					</select>
					<label for="select-year" class="xl:text-xl">
						<BiSolidSortAlt />
					</label>
				</li>
				<For each={numberOfArticleEachMonths()}>
					{({ name, value, numberOf }) => {
						return (
							<li class="w-full my-[-0.4rem] lg:my-[-0.5rem] 2xl:my-[-0.6rem]">
								<ul class="flex items-center gap-1">
									<ul
										class={`${
											numberOf.tech + numberOf.idea === 0 ? "opacity-30 select-none" : ""
										} flex items-center gap-2 xl:gap-3 font-code text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold`}
									>
										<li>{(numberOf.tech + numberOf.idea).toString().padStart(2, "0")}</li>
										<li class="text-accent-sub-base">
											{numberOf.tech.toString().padStart(2, "0")}
										</li>
										<li class="text-accent-base">{numberOf.idea.toString().padStart(2, "0")}</li>
									</ul>
									<li class="text-6xl lg:text-7xl xl:text-8xl">
										<IoGitCommitOutline class="rotate-90" />
									</li>
									<a
										href={`/blog/archives/${selectedYear()}-${value}`}
										class={`${
											numberOf.tech + numberOf.idea === 0
												? "select-none pointer-events-none opacity-30"
												: ""
										} tracking-wide font-bold text-xl lg:text-2xl xl:text-3xl transition-colors duration-150`}
									>
										{name}
									</a>
								</ul>
							</li>
						);
					}}
				</For>
			</ul>
		</div>
	);
};

export default ArchivesCalendar;
