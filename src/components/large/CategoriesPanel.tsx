import { IoChevronUp } from "solid-icons/io";
import { createSignal } from "solid-js";
import { allCategories } from "../../utils/store/collections";
import { IoDesktopOutline, IoBulbOutline } from "solid-icons/io";

interface Props {
	currentPath?: string;
}

const CategoriesPanel = ({ currentPath = "" }: Props) => {
	const [isOpen, setIsOpen] = createSignal(true);
	return (
		<section class="px-4 py-2 bg-muted-background w-screen -mx-4 sm:w-full sm:mx-0 sm:rounded-xl flex flex-col gap-2 lg:gap-4 shadow-lg">
			<div class="w-full flex justify-between items-center">
				<a href="/blog/categories" class="flex items-center gap-3 lg:gap-4">
					<div class="w-2 h-[1.5rem] lg:h-[1.8rem] bg-gradient-to-b from-accent-sub-base to-accent-base rounded-full" />
					<h1 class="text-2xl lg:text-3xl font-extrabold tracking-wide">Categories</h1>
				</a>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen())}
					class="text-3xl text-muted-foreground hover:text-foreground transition-colors duration-150"
				>
					<IoChevronUp class={isOpen() ? "rotate-180" : ""} />
				</button>
			</div>
			{isOpen() && (
				<ul class="pt-2 flex justify-center items-center gap-4">
					{allCategories.map(({ id, data }) => (
						<li class="w-full">
							<a
								href={`/blog/categories/${id}/1`}
								class={`${
									new RegExp(`^/blog/categories/${id}/`).test(currentPath)
										? `${
												id === "tech"
													? "bg-accent-base border-accent-base text-foreground"
													: "bg-accent-sub-base border-accent-sub-base text-foreground"
										  }`
										: `${id === "tech" ? "text-accent-base" : "text-accent-sub-base"}`
								} cursor-pointer ${
									id === "tech"
										? "hover:bg-accent-base border-accent-base"
										: "hover:bg-accent-sub-base border-accent-sub-base"
								} border w-full hover:text-foreground transition inline-flex items-center gap-1 lg:gap-[0.375rem] rounded-lg px-1`}
							>
								<div class="relative w-full h-[96px] sm:h-[128px]">
									{
										<div class="opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex sm:flex-col items-center gap-4 lg:gap-2">
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
			)}
		</section>
	);
};

export default CategoriesPanel;
