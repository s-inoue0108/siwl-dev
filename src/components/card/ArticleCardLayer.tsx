import { type CollectionEntry, getEntries } from "astro:content";
import { createSignal, createResource } from "solid-js";
import TagCard from "./TagCard";
import { IoTimeOutline, IoText, IoPricetags } from "solid-icons/io";

interface Props {
	article: CollectionEntry<"article">;
}

const getTags = async (tagIds: CollectionEntry<"tag">["id"][]) => {
	const tags = await getEntries(
		tagIds.map((id) => {
			return { collection: "tag" as "tag", id };
		})
	);
	return tags;
};

const ArticleCardLayer = ({ article }: Props) => {
	const [isOpen, setIsOpen] = createSignal(false);
	const [tagIds] = createSignal(article.data.tags ? article.data.tags.map((tag) => tag.id) : []);
	const [tags] = createResource(tagIds, getTags);
	return (
		<>
			<div class="h-36">
				{isOpen() ? (
					<ul class="flex flex-wrap gap-2 p-2">
						{tags()?.map((tag) => (
							<li>
								<TagCard tag={tag} />
							</li>
						))}
					</ul>
				) : (
					<p class="font-medium text-muted-foreground p-2">{article.data.description}</p>
				)}
			</div>
			<div class="absolute bottom-1 left-2 inline-flex items-center gap-1">
				<IoTimeOutline size={"0.8rem"} color="var(--muted-foreground)" />
				<time
					datetime={article.data.publishDate.toISOString()}
					class="text-xs text-muted-foreground tracking-wider"
				>
					{article.data.publishDate.toLocaleDateString("ja-JP", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					})}
				</time>
			</div>
			<button
				type="button"
				class="absolute bottom-0 right-0 bg-accent-foreground hover:bg-accent-background transition rounded-tl-lg rounded-br-[calc(0.5rem-1px)] w-8 h-8"
				onClick={() => setIsOpen(!isOpen())}
			>
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					{isOpen() ? (
						<IoPricetags size={"1.2rem"} color="var(--muted)" />
					) : (
						<IoText size={"1.2rem"} color="var(--muted)" />
					)}
				</div>
			</button>
		</>
	);
};

export default ArticleCardLayer;
