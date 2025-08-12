import { type Page } from "astro";
import type { CollectionEntry } from "astro:content";
import { IoChevronBack, IoChevronForward } from "solid-icons/io";
import { BsThreeDots } from "solid-icons/bs";
import { getSerialNumbers } from "../../utils/common/utilfuncs";

interface Props {
	page: Page<CollectionEntry<"article" | "bookmark">>;
}

const Pager = ({ page }: Props) => {
	const { currentPage, lastPage, url } = page;
	return (
		<section class="mx-auto w-fit h-fit rounded-xl">
			{page.data.length > 0 && (
				<ul class="mx-auto flex items-center w-fit border border-muted-background bg-muted-background/30 rounded-xl text-muted-foreground font-medium text-sm sm:text-base lg:text-lg">
					<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
						<a
							href={url.prev}
							class={`w-full h-full relative ${
								url.prev
									? "hover:text-foreground transition-colors duration-150"
									: "opacity-30 pointer-events-none"
							}`}
						>
							<span class="inline-flex justify-center items-center w-full h-full">
								<IoChevronBack />
							</span>
						</a>
					</li>
					{lastPage < 8 ? (
						<>
							{getSerialNumbers(1, lastPage).map((n) => (
								<li
									class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${
										currentPage === n
											? "font-bold text-foreground bg-gradient-to-r from-accent-sub-base to-accent-base rounded-lg"
											: ""
									}`}
								>
									<a
										href={url.current.replace(`/${currentPage}`, `/${n}`)}
										class="hover:text-foreground transition-colors duration-150"
									>
										<span class="inline-flex justify-center items-center w-full h-full">{n}</span>
									</a>
								</li>
							))}
						</>
					) : (
						<>
							{() => {
								if (currentPage < 4 || currentPage > lastPage - 3) {
									return (
										<>
											{getSerialNumbers(1, 2).map((n) => (
												<li
													class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${
														currentPage === n
															? "font-bold text-foreground bg-gradient-to-r from-accent-sub-base to-accent-base rounded-lg"
															: ""
													}`}
												>
													<a
														href={url.current.replace(`/${currentPage}`, `/${n}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{n}
														</span>
													</a>
												</li>
											))}
											{(currentPage === 2 || currentPage === 3) && (
												<li
													class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${
														currentPage === 3
															? "font-bold text-foreground bg-gradient-to-r from-accent-sub-base to-accent-base rounded-lg"
															: ""
													}`}
												>
													<a
														href={url.current.replace(`/${currentPage}`, `/${3}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{3}
														</span>
													</a>
												</li>
											)}
											{currentPage === 3 && (
												<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
													<a
														href={url.current.replace(`/${currentPage}`, `/${4}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{4}
														</span>
													</a>
												</li>
											)}
											<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
												<span class="inline-flex justify-center items-center w-full h-full">
													<BsThreeDots />
												</span>
											</li>
											{currentPage === lastPage - 2 && (
												<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
													<a
														href={url.current.replace(`/${currentPage}`, `/${lastPage - 3}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{lastPage - 3}
														</span>
													</a>
												</li>
											)}
											{(currentPage === lastPage - 1 || currentPage === lastPage - 2) && (
												<li
													class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${
														currentPage === lastPage - 2
															? "font-bold text-foreground bg-gradient-to-r from-accent-sub-base to-accent-base rounded-lg"
															: ""
													}`}
												>
													<a
														href={url.current.replace(`/${currentPage}`, `/${lastPage - 2}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{lastPage - 2}
														</span>
													</a>
												</li>
											)}
											{getSerialNumbers(lastPage - 1, lastPage).map((n) => (
												<li
													class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${
														currentPage === n
															? "font-bold text-foreground bg-gradient-to-r from-accent-sub-base to-accent-base rounded-lg"
															: ""
													}`}
												>
													<a
														href={url.current.replace(`/${currentPage}`, `/${n}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{n}
														</span>
													</a>
												</li>
											))}
										</>
									);
								} else {
									return (
										<>
											<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
												<a
													href={url.current.replace(`/${currentPage}`, `/${1}`)}
													class="hover:text-foreground transition-colors duration-150"
												>
													<span class="inline-flex justify-center items-center w-full h-full">
														{1}
													</span>
												</a>
											</li>
											<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
												<span class="inline-flex justify-center items-center w-full h-full">
													<BsThreeDots />
												</span>
											</li>
											{getSerialNumbers(currentPage - 1, currentPage + 1).map((n) => (
												<li
													class={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${
														currentPage === n
															? "font-bold text-foreground bg-gradient-to-r from-accent-sub-base to-accent-base rounded-lg"
															: ""
													}`}
												>
													<a
														href={url.current.replace(`/${currentPage}`, `/${n}`)}
														class="hover:text-foreground transition-colors duration-150"
													>
														<span class="inline-flex justify-center items-center w-full h-full">
															{n}
														</span>
													</a>
												</li>
											))}
											<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
												<span class="inline-flex justify-center items-center w-full h-full">
													<BsThreeDots />
												</span>
											</li>
											<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
												<a
													href={url.current.replace(`/${currentPage}`, `/${lastPage}`)}
													class="hover:text-foreground transition-colors duration-150"
												>
													<span class="inline-flex justify-center items-center w-full h-full">
														{lastPage}
													</span>
												</a>
											</li>
										</>
									);
								}
							}}
						</>
					)}
					<li class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
						<a
							href={url.next}
							class={`w-full h-full relative ${
								url.next
									? "hover:text-foreground transition-colors duration-150"
									: "opacity-30 pointer-events-none"
							}`}
						>
							<span class="inline-flex justify-center items-center w-full h-full">
								<IoChevronForward />
							</span>
						</a>
					</li>
				</ul>
			)}
		</section>
	);
};

export default Pager;
