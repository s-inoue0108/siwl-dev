import { For } from "solid-js";
import { SiGithub } from "solid-icons/si";
import GitHubContributionsHoverButton from "../button/GitHubContributionsHoverButton";

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
		<div class="w-full xl:w-1/2 flex flex-col gap-4 2xl:gap-8 pb-4">
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
				<div class="text-xs lg:text-base 2xl:text-lg text-muted-foreground flex justify-between lg:justify-start lg:flex-col gap-1">
					<div class="font-bold">{calendar.totalContributions} contributions</div>
					<ul class="tracking-tight flex items-center gap-1">
						<li>Less</li>
						<li class="w-[0.875rem] h-[0.875rem] border border-muted-background rounded-sm bg-background" />
						<li class="w-[0.875rem] h-[0.875rem] border border-muted-background rounded-sm bg-accent-sub-base" />
						<li class="w-[0.875rem] h-[0.875rem] border border-muted-background rounded-sm bg-[#7499EC] dark:bg-[#3C4CC1]" />
						<li class="w-[0.875rem] h-[0.875rem] border border-muted-background rounded-sm bg-[#9599ED] dark:bg-[#5A4ECF]" />
						<li class="w-[0.875rem] h-[0.875rem] border border-muted-background rounded-sm bg-accent-base" />
						<li>More</li>
					</ul>
				</div>
			</div>
			<div class="w-full h-fit scrollbar overflow-x-auto">
				<div class="w-fit h-fit flex gap-[2px] mb-2">
					<For each={modifiedWeeks}>
						{({ contributionDays }, weekPos) => (
							<ul class="flex flex-col gap-[2px]">
								<For each={contributionDays}>
									{({ contributionCount, date }, pos) => (
										<li class="relative">
											<GitHubContributionsHoverButton
												contributionCount={contributionCount}
												date={date}
												weekPos={weekPos()}
												numOfWeeks={weeks.length}
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
	);
};

export default GitHubContributionsCard;
