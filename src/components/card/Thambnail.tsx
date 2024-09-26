import type { CollectionEntry } from "astro:content";

interface Props {
	slug: CollectionEntry<"article">["slug"];
}

const Thambnail = ({ slug }: Props) => {
	return <img src={`/thambnail/${slug}.png`} class="w-full h-full object-contain rounded-t-lg" />;
};
export default Thambnail;
