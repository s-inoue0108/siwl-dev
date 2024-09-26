import { type CollectionEntry } from "astro:content";
import { IoPricetag } from "solid-icons/io";

interface Props {
	tag: CollectionEntry<"tag">;
	isLink?: boolean;
}

const TagCard = ({ tag, isLink = true }: Props) => {
	return (
		<a
			href={`/blog/tag/${tag.id}/1`}
			class={`${
				isLink
					? "cursor-pointer hover:bg-accent-foreground hover:text-accent-background transition"
					: "pointer-events-none"
			} w-fit h-fit inline-flex items-center gap-1 text-muted-foreground rounded-md px-1`}
		>
			<figure class="h-3">
				<IoPricetag size={"0.75rem"} />
			</figure>
			<label class={`${isLink ? "cursor-pointer" : "pointer-events-none"} text-sm font-semibold`}>
				{tag.data.name}
			</label>
		</a>
	);
};

export default TagCard;
