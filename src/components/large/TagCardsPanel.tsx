import { createSignal } from "solid-js";
import { IoClose, IoPricetag } from "solid-icons/io";
import { BsThreeDots } from "solid-icons/bs";
import { allTags } from "../../utils/store/collections";
import Panel from "./Panel";

interface Props {
	currentPath?: string;
	limit?: number;
}

const TagCardsPanel = ({ currentPath = "", limit = 10 }: Props) => {
	const [isMore, setIsMore] = createSignal(false);
	return (
		<Panel
			title="Tags"
			href="/blog/tags"
			Content={
				<>
					<ul class="pt-4 flex flex-wrap gap-2">
						{allTags &&
							allTags.slice(0, limit).map(({ id, data }) => (
								<li>
									<a
										href={`/blog/tags/${id}/1`}
										class={`${
											new RegExp(`^/blog/tags/${id}/`).test(currentPath)
												? `${
														data.belong.id === "tech" ? "bg-accent-sub-base" : "bg-accent-base"
												  } text-foreground`
												: "text-muted-foreground"
										} cursor-pointer ${
											data.belong.id === "tech"
												? "hover:bg-accent-sub-base"
												: "hover:bg-accent-base"
										} hover:text-foreground transition inline-flex items-center gap-1 lg:gap-[0.375rem] rounded-md px-1`}
									>
										<div class="w-3 h-3 text-sm lg:w-[1.125rem] lg:h-[1.125rem] lg:text-lg">
											{data.icon ? (
												<img
													src={data.icon.src}
													width={data.icon.width}
													height={data.icon.height}
													alt={data.name}
													class="w-full h-full object-contain"
												/>
											) : (
												<IoPricetag />
											)}
										</div>
										<span class="cursor-pointer text-sm lg:text-lg font-semibold">{data.name}</span>
									</a>
								</li>
							))}
						{allTags &&
							allTags.slice(limit).map(({ id, data }) => (
								<li class={`${isMore() ? "" : "hidden"}`}>
									<a
										href={`/blog/tags/${id}/1`}
										class={`${
											new RegExp(`^/blog/tags/${id}/`).test(currentPath)
												? `${
														data.belong.id === "tech" ? "bg-accent-sub-base" : "bg-accent-base"
												  } text-foreground`
												: "text-muted-foreground"
										} cursor-pointer ${
											data.belong.id === "tech"
												? "hover:bg-accent-sub-base"
												: "hover:bg-accent-base"
										} hover:text-foreground transition inline-flex items-center gap-1 lg:gap-[0.375rem] rounded-md px-1`}
									>
										<div class="w-3 h-3 text-sm lg:w-[1.125rem] lg:h-[1.125rem] lg:text-lg">
											{data.icon ? (
												<img
													src={data.icon.src}
													width={data.icon.width}
													height={data.icon.height}
													alt={data.name}
													class="w-full h-full object-contain"
												/>
											) : (
												<IoPricetag />
											)}
										</div>
										<span class="cursor-pointer text-sm lg:text-lg font-semibold">{data.name}</span>
									</a>
								</li>
							))}
					</ul>
					{allTags.length > limit && (
						<div class="w-full flex justify-center">
							<button
								type="button"
								onClick={() => setIsMore(!isMore())}
								class="bg-background px-3 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors duration-150"
							>
								<span class="inline-flex flex-row items-center gap-2">
									<span class="font-extrabold text-xl">{isMore() ? "fold" : "more"}</span>
									<span class="text-2xl">{isMore() ? <IoClose /> : <BsThreeDots />}</span>
								</span>
							</button>
						</div>
					)}
				</>
			}
		/>
	);
};

export default TagCardsPanel;
