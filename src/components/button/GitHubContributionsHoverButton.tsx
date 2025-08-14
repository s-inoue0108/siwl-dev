import { createSignal, Show } from "solid-js";

interface Props {
	contributionCount: number;
	date: string;
	weekPos: number;
	numOfWeeks: number;
	pos: number;
}

const getContribIntensity = (count: number) => {
	if (count < 0) {
		return "bg-muted-background";
	} else if (count === 0) {
		return "bg-background";
	} else if (count < 3) {
		return "bg-accent-sub-base";
	} else if (count < 5) {
		return "bg-[#7499EC] dark:bg-[#3C4CC1]";
	} else if (count < 10) {
		return "bg-[#9599ED] dark:bg-[#5A4ECF]";
	}
	return "bg-accent-base";
};

const getContribIntensityBorder = (count: number) => {
	if (count <= 0) {
		return "border-muted-background";
	} else if (count < 3) {
		return "border-accent-sub-base";
	} else if (count < 5) {
		return "border-[#7499EC] dark:border-[#3C4CC1]";
	} else if (count < 10) {
		return "border-[#9599ED] dark:border-[#5A4ECF]";
	}
	return "border-accent-base";
};

const GitHubContributionsHoverButton = ({
	contributionCount,
	date,
	weekPos,
	numOfWeeks,
	pos,
}: Props) => {
	const [isHover, setIsHover] = createSignal(false);

	return (
		<>
			<button
				type="button"
				class={`relative w-6 h-6 border border-muted-background rounded-md hover:opacity-70 transition-opacity duration-150 ${getContribIntensity(
					contributionCount
				)}`}
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				<span class="font-semibold whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px]">
					{new Date(date).getDate() === 1 ? new Date(date).getMonth() + 1 : ""}
				</span>
			</button>
			<Show when={isHover() && contributionCount >= 0}>
				<div
					class={`z-[1000] absolute ${numOfWeeks - weekPos < 13 ? "right-7" : "left-7"} ${
						pos < 3 ? "top-0" : "bottom-0"
					}`}
					onMouseEnter={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
				>
					<div
						class={`block shadow-2xl font-semibold text-xs text-center w-[256px] border ${getContribIntensityBorder(
							contributionCount
						)} bg-muted-transparent rounded-lg p-1`}
					>
						{contributionCount == 0
							? "No contributions"
							: contributionCount == 1
							? "1 contribution"
							: `${contributionCount} contributions`}{" "}
						on {new Date(date).toDateString()}.
					</div>
				</div>
			</Show>
		</>
	);
};

export default GitHubContributionsHoverButton;
