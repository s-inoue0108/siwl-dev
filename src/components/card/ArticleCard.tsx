import { getEntries, type CollectionEntry } from "astro:content";
import { IoTimeOutline, IoPricetags, IoText } from "solid-icons/io";
import { ImSpinner3 } from "solid-icons/im";
import { createResource, createSignal, lazy, Suspense } from "solid-js";
import TagCard from "./TagCard";

const LazyThambnail = lazy(() => import("./Thambnail"));

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

const ArticleCard = ({ article }: Props) => {
	const [isOpen, setIsOpen] = createSignal(false);
	const [tagIds] = createSignal(article.data.tags ? article.data.tags.map((tag) => tag.id) : []);
	const [tags] = createResource(tagIds, getTags);
	return (
		<div class="relative bg-muted-background rounded-lg shadow-md">
			<div class="flex flex-col">
				<a href={`/article/${article.slug}`} class="hover:opacity-70 transition rounded-t-lg">
					<Suspense fallback={<ImSpinner3 size={"4rem"} color="var(--muted-foreground)" />}>
						<LazyThambnail slug={article.slug} />
					</Suspense>
				</a>
				{isOpen() ? (
					<ul class="h-24 flex flex-wrap gap-2 p-2">
						{tags()?.map((tag) => (
							<li>
								<TagCard tag={tag} />
							</li>
						))}
					</ul>
				) : (
					<p class="h-24 text-muted-foreground p-2">{article.data.description}</p>
				)}
			</div>
			<div class="absolute bottom-0 left-0 inline-flex items-center gap-1">
				<IoTimeOutline size={"0.8rem"} color="var(--muted-foreground)" />
				<time
					datetime={article.data.publishDate.toISOString()}
					class="font-extralight text-xs text-muted-foreground tracking-wider"
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
						<IoText size={"1.2rem"} color="#7749C3" />
					) : (
						<IoPricetags size={"1.2rem"} color="#7749C3" />
					)}
				</div>
			</button>
		</div>
	);
};

export default ArticleCard;
