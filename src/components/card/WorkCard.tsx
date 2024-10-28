import { type CollectionEntry } from "astro:content";

interface Props {
	work: CollectionEntry<"work">;
}

const WorkCard = ({ work }: Props) => {
	return <div>{work.data.title}</div>;
};

export default WorkCard;
