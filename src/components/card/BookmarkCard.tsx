import { type CollectionEntry } from "astro:content";
import { createSignal, onMount } from "solid-js";
import { BsCardImage } from "solid-icons/bs";

interface Props {
	bookmark: CollectionEntry<"bookmark">;
}

const BookmarkCard = ({ bookmark }: Props) => {
	const [ogp, setOgp] = createSignal<any>(undefined);

	const getOgpImage = async () => {
		const response = await fetch(`/api/ogp?url=${encodeURIComponent(bookmark.data.url)}`);
		const data = await response.json();

		if (response.ok) {
			setOgp(data);
		}
	};

	onMount(async () => {
		await getOgpImage();
	});

	return (
		<a
			href={bookmark.data.url}
			target="_blank"
			rel="noopener noreferrer"
			class="relative w-full lg:w-96 flex flex-col border border-muted-background bg-muted-background/30 rounded-xl hover:opacity-70 transition-opacity duration-200"
		>
			<span class="w-full h-40">
				{ogp() && ogp().ogImage && ogp().ogImage[0] && ogp().ogImage[0].url ? (
					<img
						src={ogp().ogImage[0].url}
						loading="lazy"
						class="rounded-t-xl object-cover w-full h-full"
					/>
				) : (
					<BsCardImage class="w-full h-full from-accent-sub-base to-accent-base bg-gradient-to-r rounded-t-xl" />
				)}
			</span>
			<span class="px-2 py-4 w-full border-t border-muted-background h-24">
				<span class="font-bold text-2xl tracking-wide">{bookmark.data.name}</span>
			</span>
		</a>
	);
};

export default BookmarkCard;
