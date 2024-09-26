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
			} w-fit h-fit inline-flex items-center gap-1 border-[1px] border-muted-foreground text-muted-foreground rounded-sm px-1`}
		>
			<figure class="h-3">
				{tag.data.icon ? (
					<img src={tag.data.icon.src} alt={tag.data.icon.alt} class="h-full object-contain" />
				) : (
					<IoPricetag size={"0.75rem"} color="var(--muted-foreground)" />
				)}
			</figure>
			<label class={`${isLink ? "cursor-pointer" : "pointer-events-none"} text-sm font-medium`}>
				{tag.data.name}
			</label>
		</a>
	);
};

export default TagCard;
