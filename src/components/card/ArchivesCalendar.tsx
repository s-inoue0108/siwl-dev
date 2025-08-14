import { createMemo, createSignal, For, Index } from "solid-js";
import { getAnnualCalendar } from "../../utils/common/utilfuncs";
import { allArticles } from "../../utils/store/collections";
import MacintoshInterfaceCard from "./MacintoshInterfaceCard";
import ArchiveHoverButton from "../button/ArchiveHoverButton";

const ArchivesCalendar = () => {
	const [selectedYear, setSelectedYear] = createSignal<number>(new Date().getFullYear());

	const handleChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = +target.value;
		if (typeof value !== "number") return;
		setSelectedYear(value);
	};

	const getAnuualCalendarWithArticleInfo = (year: number) => {
		const annualCalendar = getAnnualCalendar(year);

		const articles = allArticles.map(({ slug, data }) => {
			const publishDateYMD = new Date(data.publishDate).toISOString().split("T")[0];
			return {
				slug,
				...data,
				publishDateYMD,
			};
		});

		const articlesPubDates = articles.map(({ publishDateYMD }) => {
			return publishDateYMD;
		});

		const total = articlesPubDates.filter((date) => {
			return new Date(date).getFullYear() === year;
		});

		for (let w = 0; w < annualCalendar.length; w++) {
			const week = annualCalendar[w].contributionDays;

			for (let d = 0; d < week.length; d++) {
				const day = week[d];
				if (articlesPubDates.includes(day.date) && day.inYear) {
					annualCalendar[w].contributionDays[d].articles = articles.filter(({ publishDateYMD }) => {
						return publishDateYMD === day.date;
					});
				}
			}
		}

		return { calender: annualCalendar, total: total.length };
	};

	const getAvailableYears = (start: number, end: number): number[] => {
		const arr = [];
		for (let n = start; n <= end; n++) {
			arr.push(n);
		}
		return arr;
	};

	const availableYears = getAvailableYears(2024, new Date().getFullYear());
	const annualCalendar = createMemo(() => getAnuualCalendarWithArticleInfo(selectedYear()));

	return (
		<MacintoshInterfaceCard title="$ ls archives/">
			<div class="w-full flex flex-col gap-4">
				<div class="w-full flex flex-col lg:flex-row lg:justify-between items-center gap-4">
					<div class="font-bold text-xl w-full">
						{annualCalendar().total} contributions in {selectedYear()}
					</div>
					<div class="w-full flex items-center justify-between lg:justify-start gap-4">
						<ul class="text-lg flex items-center gap-4">
							<ul class="flex items-center gap-1">
								<li class="w-4 h-4 border border-muted-background rounded-sm bg-accent-sub-base" />
								<li>Tech</li>
							</ul>
							<ul class="flex items-center gap-1">
								<li class="w-4 h-4 border border-muted-background rounded-sm bg-accent-base" />
								<li>Idea</li>
							</ul>
						</ul>
						<select
							id="select-year"
							name="select-year"
							onChange={(e) => handleChange(e)}
							class="py-2 w-fit border-none bg-muted-background font-semibold text-muted-foreground text-center text-sm rounded-xl"
						>
							<Index each={availableYears}>
								{(year) => (
									<option value={year()} selected={year() === selectedYear()}>
										{year()}
									</option>
								)}
							</Index>
						</select>
					</div>
				</div>
				<div class="w-full h-fit scrollbar overflow-x-auto mb-2">
					<div class="w-fit h-fit flex gap-[2px] mb-2">
						<For each={annualCalendar().calender}>
							{({ contributionDays }) => (
								<ul class="flex flex-col gap-[2px]">
									<For each={contributionDays}>
										{({ date, inYear, articles }, pos) => (
											<li class="relative">
												<ArchiveHoverButton
													articles={articles}
													inYear={inYear}
													date={date}
													pos={pos()}
												/>
											</li>
										)}
									</For>
								</ul>
							)}
						</For>
					</div>
				</div>
			</div>
		</MacintoshInterfaceCard>
	);
};

export default ArchivesCalendar;
