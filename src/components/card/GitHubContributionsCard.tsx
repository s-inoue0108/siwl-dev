import { For } from "solid-js";
import { SiGithub } from "solid-icons/si";

interface Props {
	calendar: {
		totalContributions: number;
		weeks: {
			contributionDays: {
				contributionCount: number;
				date: string;
			}[];
		}[];
	};
	githubUsername: string;
	githubUrl: string;
}

const getContribIntensity = (count: number) => {
	if (count < 0) {
		return "bg-muted-background";
	} else if (count === 0) {
		return "bg-background";
	} else if (count < 3) {
		return "bg-accent-base";
	} else if (count < 5) {
		return "bg-[#9599ED] dark:bg-[#5A4ECF]";
	} else if (count < 10) {
		return "bg-[#7499EC] dark:bg-[#3C4CC1]";
	} else {
		return "bg-accent-sub-base";
	}
};

const GitHubContributionsCard = ({ calendar, githubUsername, githubUrl }: Props) => {
	const weeks = calendar.weeks;

	const fillBoundary = (pos: number) => {
		const week = weeks[pos];
		const days = week.contributionDays.map((day) => new Date(day.date).getDay());

		const boundary = [];

		for (let i = 0; i < 7; i++) {
			boundary.push({ contributionCount: -1, date: "" });
		}

		for (let i = 0; i < days.length; i++) {
			boundary[days[i]] = week.contributionDays[i];
		}

		return boundary;
	};

	const leftBoundary = fillBoundary(0);
	const rightBoundary = fillBoundary(weeks.length - 1);

	const modifiedWeeks = [
		{ contributionDays: leftBoundary },
		...weeks.slice(1, -1),
		{ contributionDays: rightBoundary },
	];

	return (
		<div class="w-full xl:w-1/2 flex flex-col gap-4 2xl:gap-8">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-2">
				<div class="flex items-center gap-2 lg:gap-3 2xl:gap-4">
					<SiGithub class="w-6 h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8" />
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="font-code font-bold text-lg lg:text-xl 2xl:text-2xl hover:opacity-70 transition duration-150"
					>
						github.com/{githubUsername}
					</a>
				</div>
				<div class="font-code text-xs lg:text-base 2xl:text-lg text-muted-foreground flex flex-col gap-1">
					<div class="font-bold">{calendar.totalContributions} Contributions</div>
					<ul class="tracking-tight flex items-center gap-1">
						<li>Less</li>
						{[0, 2, 4, 9, 11].map((count) => (
							<li
								class={`relative w-3 h-3 border border-muted-background rounded-sm ${getContribIntensity(
									count
								)}`}
							></li>
						))}
						<li>More</li>
					</ul>
				</div>
			</div>
			<div class="w-full h-fit scrollbar overflow-x-auto">
				<div class="w-fit h-fit flex gap-[2px] mb-2">
					<For each={modifiedWeeks}>
						{({ contributionDays }) => (
							<ul class="flex flex-col gap-[2px]">
								<For each={contributionDays}>
									{({ contributionCount, date }) => (
										<li
											class={`relative w-5 h-5 border border-muted-background rounded-md ${getContribIntensity(
												contributionCount
											)}`}
										>
											<span class="font-semibold whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px]">
												{new Date(date).getDate() === 1 ? new Date(date).getMonth() + 1 : ""}
											</span>
										</li>
									)}
								</For>
							</ul>
						)}
					</For>
				</div>
			</div>
		</div>
	);
};

export default GitHubContributionsCard;
