import { allCategories } from "../../utils/store/collections";
import { IoDesktopOutline, IoBulbOutline } from "solid-icons/io";
import Panel from "./Panel";

interface Props {
	currentPath?: string;
}

const CategoriesPanel = ({ currentPath = "" }: Props) => {
	return (
		<Panel
			title="Categories"
			href="/blog/categories"
			Content={
				<>
					<svg width="0" height="0">
						<linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
							<stop stop-color="rgba(var(--accent-sub-base), var(--opacity))" offset="0%" />
							<stop stop-color="rgba(var(--accent-base), var(--opacity))" offset="100%" />
						</linearGradient>
					</svg>
					<ul class="pt-2 flex flex-row-reverse justify-center items-center gap-4">
						{allCategories.map(({ id, data }) => (
							<li class="w-full">
								<a
									href={`/blog/categories/${id}/1`}
									class={`${
										new RegExp(`^/blog/categories/${id}/`).test(currentPath)
											? `${id === "tech" ? "bg-accent-sub-base" : "bg-accent-base"}`
											: `${id === "tech" ? "text-accent-sub-base" : "text-accent-base"}`
									} cursor-pointer ${
										data.colors.bgHover
									} w-full hover:text-foreground transition inline-flex items-center gap-1 lg:gap-[0.375rem] rounded-lg px-1`}
								>
									<div class="relative w-full h-[96px] sm:h-[128px]">
										{
											<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex sm:flex-col items-center gap-4 lg:gap-2">
												<span class="text-4xl lg:text-4xl">
													{id === "tech" ? <IoDesktopOutline /> : <IoBulbOutline />}
												</span>
												<span class="text-3xl lg:text-2xl font-semibold whitespace-nowrap">
													{data.name}
												</span>
											</div>
										}
									</div>
								</a>
							</li>
						))}
					</ul>
				</>
			}
		/>
	);
};

export default CategoriesPanel;
