import { createSignal, createMemo, For, Show, onCleanup } from "solid-js";
import { IoSearchOutline, IoClose } from "solid-icons/io";
import { allArticles } from "../../utils/store/collections";
import { SearchClient } from "../../utils/api/fuse";
import { setIsOpenSearchModal } from "../../utils/store/isOpenSearchModal";
import { TransitionGroup } from "solid-transition-group";
import "./SearchInput.css";
import { Portal } from "solid-js/web";

const searchClient = new SearchClient(allArticles);
const fuse = await searchClient.createClient();

interface Props {
	mount: "below" | "header";
}

const SearchInput = ({ mount }: Props) => {
	const [keyword, setKeyword] = createSignal("");

	const hits = createMemo(() => {
		const hits = fuse.search(keyword());
		return searchClient.getData(hits);
	});

	const bind = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		setKeyword(value);
	};

	const getNode = (mount: Props["mount"]) => {
		if (mount === "below") {
			return document.getElementById("search-modal-mobile") as Node;
		}
		return document.getElementById("search-modal-header") as Node;
	};

	onCleanup(() => {
		setKeyword("");
		setIsOpenSearchModal(false);
	});

	return (
		<>
			<div class="flex items-center bg-muted-background rounded-lg">
				<label class="relative w-12 h-12">
					<button
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground text-lg"
						onClick={() => setKeyword("")}
					>
						{keyword() === "" ? <IoSearchOutline /> : <IoClose />}
					</button>
				</label>
				<input
					type="text"
					class="placeholder:text-muted-foreground h-12 py-1 pr-2 text-lg focus:outline-none"
					value={keyword()}
					placeholder="Search..."
					onInput={(e) => bind(e)}
				/>
			</div>
			<Portal mount={getNode(mount)}>
				<ul class="flex flex-col gap-2">
					<TransitionGroup name="search-modal">
						<For each={hits()}>
							{(article) => (
								<li class="w-full flex">
									<a
										href={`/blog/articles/${article.slug}`}
										class={`${
											article.data.category.id === "tech"
												? "bg-accent-sub-base/70"
												: "bg-accent-base/70"
										} w-full p-2 rounded-lg`}
									>
										<span class="inline-flex flex-col gap-1">
											<span class="text-lg font-bold">{article.data.title}</span>
											<span class="text-sm text-muted-foreground">
												{article.data.description ?? ""}
											</span>
										</span>
									</a>
								</li>
							)}
						</For>
					</TransitionGroup>
				</ul>
			</Portal>
		</>
	);
};

export default SearchInput;
