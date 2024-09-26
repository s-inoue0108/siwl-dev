import { type CollectionEntry } from "astro:content";
import type { Page } from "astro";
import { lazy, Suspense } from "solid-js";
import { ImSpinner3 } from "solid-icons/im";

const LazyArticleCard = lazy(() => import("../card/ArticleCard"));

interface Props {
	articles: CollectionEntry<"article">[] | Page["data"];
}

const ArticleCardsPanel = ({ articles }: Props) => {
	return (
		<ul class="flex flex-col lg:flex-row lg:flex-wrap gap-8 lg:px-8">
			{articles.map((article) => (
				<li class="lg:w-[calc(33.33%-1.333rem)]">
					<Suspense fallback={<ImSpinner3 size={"4rem"} color="var(--muted-foreground)" />}>
						<LazyArticleCard article={article} />
					</Suspense>
				</li>
			))}
		</ul>
	);
};

export default ArticleCardsPanel;
