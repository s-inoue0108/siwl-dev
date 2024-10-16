import { For } from "solid-js";
import { createMemo } from "solid-js";
import { SearchClient } from "../../utils/api/fuse";
import { allArticles } from "../../utils/store/collections";
import { keyword } from "../../utils/store/search";
import { IoSearchOutline } from "solid-icons/io";

const searchClient = new SearchClient(allArticles);
const fuse = await searchClient.createClient();

const SearchResult = () => {
	const result = createMemo(() => {
		const hits = fuse.search(keyword());
		return searchClient.getData(hits);
	});

	const viewKeyword = createMemo(() => {
		const k = keyword();
		return k === "" ? "キーワード" : k;
	});

	const viewResultLength = createMemo(() => {
		const l = result().length;
		return l > 0 ? `${l} 件の結果` : "記事がありません";
	});

	return (
		<ul class="flex flex-col gap-4">
			<div class="text-muted-foreground w-full flex items-center justify-between">
				<div class="flex items-center gap-1">
					<span>
						<IoSearchOutline />
					</span>
					<span class="max-w-[12rem] whitespace-nowrap overflow-x-clip">{viewKeyword()}</span>
				</div>
				<span>{viewResultLength()}</span>
			</div>
			<For each={result()}>
				{({ slug, data }) => (
					<li class="w-full flex">
						<a
							href={`/blog/articles/${slug}`}
							class="border-b-[0.5px] border-muted-foreground w-full py-2 hover:opacity-70 transition-hover duration-150"
						>
							<span class="inline-flex flex-col gap-1">
								<span class="font-bold lg:text-lg inline-flex items-center gap-1">
									{data.title}
								</span>
								<span class="text-xs lg:text-sm text-muted-foreground">
									{data.description ?? ""}
								</span>
							</span>
						</a>
					</li>
				)}
			</For>
		</ul>
	);
};

export default SearchResult;
