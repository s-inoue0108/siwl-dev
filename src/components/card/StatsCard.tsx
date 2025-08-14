import MacintoshInterfaceCard from "./MacintoshInterfaceCard";
import { getReadingTime } from "../../utils/common/reading-time";
import { allArticles } from "../../utils/store/collections";
import { allTags } from "../../utils/store/collections";
import { ImPen } from "solid-icons/im";
import { IoPricetags, IoTimer } from "solid-icons/io";
import { VsWordWrap } from "solid-icons/vs";

const getTotalReadingTime = () => {
	let totalReadingTime = 0;
	let totalWordCount = 0;
	allArticles
		.filter(({ data }) => !data.isDraft)
		.forEach(({ body, data }) => {
			if (data.isDraft) return;
			const { minutes, wc } = getReadingTime(body);
			totalReadingTime += minutes;
			totalWordCount += wc;
		});
	return {
		totalReadingTime,
		totalWordCount,
	};
};

const { totalReadingTime, totalWordCount } = getTotalReadingTime();

const numberOfArticles = allArticles.filter(({ data }) => !data.isDraft).length;
const numberOfTags = allTags.filter(({ data }) => !data.isDraft).length;

const stats = [
	{ title: "Number of Articles", icon: ImPen, value: numberOfArticles, unit: "articles" },
	{ title: "Number of Tags", icon: IoPricetags, value: numberOfTags, unit: "tags" },
	{ title: "Word Count", icon: VsWordWrap, value: totalWordCount, unit: "words" },
	{ title: "Reading Time", icon: IoTimer, value: totalReadingTime, unit: "min" },
];

const StatsCard = () => {
	return (
		<MacintoshInterfaceCard title="$ stats archives.dat">
			<ul class="flex flex-col xl:flex-row xl:justify-around gap-8 pt-4">
				{stats.map(({ title, icon, value, unit }) => (
					<li class="flex flex-col gap-4 pb-2">
						<div class="text-muted-foreground w-full flex items-center gap-2 justify-center text-lg xl:text-base 2xl:text-lg">
							<span>{icon({ size: "1.2rem" })}</span>
							<span>{title}</span>
						</div>
						<div class="w-full text-center font-bold">
							<span class="text-5xl xl:text-4xl 2xl:text-5xl tracking-wide">{value}</span>
							<span class="text-2xl xl:text-xl 2xl:text-2xl"> {unit}</span>
						</div>
					</li>
				))}
			</ul>
		</MacintoshInterfaceCard>
	);
};

export default StatsCard;
