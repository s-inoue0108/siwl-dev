import { createMemo, createSignal, For, Index } from "solid-js";
import { IoChevronForward, IoDesktopOutline, IoBulbOutline } from "solid-icons/io";
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

	console.log(allArticles);

	return (
		<div class="w-full md:w-fit flex justify-center p-4 bg-muted-background/30 border border-muted-background rounded-xl">
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
							<li class="border-b border-muted-background">
								<ul class="flex justify-between items-center gap-8 py-4">
									<li>
										<ul class="flex font-code text-2xl lg:text-3xl xl:text-4xl gap-4">
											<li class="flex items-center gap-1 text-accent-sub-base">
												<IoDesktopOutline />
												<span>{numberOf.tech.toString().padStart(2, "0")}</span>
											</li>
											<li class="flex items-center gap-1 text-accent-base">
												<IoBulbOutline />
												<span>{numberOf.idea.toString().padStart(2, "0")}</span>
											</li>
										</ul>
									</li>
									<li>
										<a
											href={`/blog/archives/${selectedYear()}-${value}`}
											class={`${
												numberOf.tech + numberOf.idea === 0
													? "select-none pointer-events-none opacity-30"
													: "hover:opacity-70"
											} font-code tracking-wide font-bold text-3xl lg:text-4xl xl:text-5xl transition-opacity duration-150 flex items-center`}
										>
											<span>{name.slice(0, 3)}</span>
											<IoChevronForward />
										</a>
									</li>
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
