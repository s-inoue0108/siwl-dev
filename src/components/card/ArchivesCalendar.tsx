import { createMemo, createSignal, For, Index } from "solid-js";
import { IoGitCommitOutline } from "solid-icons/io";
import { getMonths } from "../../utils/common/utilfuncs";
import { allArticles } from "../../utils/store/collections";

const ArchivesCalendar = () => {
	const [selectedYear, setSelectedYear] = createSignal<number>(new Date().getFullYear());

	const handleChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = +target.value;
		if (typeof value !== "number") return;
		setSelectedYear(value);
	};

	const months = getMonths();

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

	const getAvailableYears = (start: number, end: number): number[] => {
		const arr = [];
		for (let n = start; n <= end; n++) {
			arr.push(n);
		}
		return arr;
	};

	const availableYears = getAvailableYears(2024, new Date().getFullYear());

	return (
		<div class="flex justify-center">
			<ul class="flex flex-col">
				<select
					id="select-year"
					name="select-year"
					onChange={(e) => handleChange(e)}
					class="mb-8 border-muted-background bg-muted-background/30 text-center text-lg xl:text-2xl font-semibold rounded-lg"
				>
					<Index each={availableYears}>
						{(year) => (
							<option value={year()} selected={year() === selectedYear()}>
								{year()}
							</option>
						)}
					</Index>
				</select>
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
												: "hover:opacity-70"
										} tracking-wide font-bold text-xl lg:text-2xl xl:text-3xl transition-opacity duration-150`}
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
