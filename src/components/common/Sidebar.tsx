import Hamburger from "../button/Hamburger";
import SwitchTheme from "../button/SwitchTheme";
import { isOpenSidebar } from "../../utils/store/isOpenSidebar";
import { AllowedRoutes } from "../../utils/common/route";

interface Props {
	appName: string;
	currentPath: string;
}

const Sidebar = ({ appName, currentPath }: Props) => {
	const routes = new AllowedRoutes(currentPath);
	const metas = routes.getRootPageMetaAll(["Home", "Privacy Policy"]);

	return (
		<aside
			class={`fixed top-0 left-0 pt-4 px-4 lg:px-8 w-3/4 sm:w-[360px] transition duration-300 ${
				!isOpenSidebar() && "-translate-x-full lg:translate-x-[calc(-360px+3.95rem)]"
			} bg-muted-background min-h-dvh z-[100]`}
		>
			<header>
				<nav class="pt-6">
					<a href="/" class="text-4xl lg:text-5xl font-extrabold" data-astro-reload>
						{appName}
					</a>
					<ul class="absolute top-4 right-[0.7rem] flex flex-col items-center gap-4">
						<li>
							{/* width: 1.8 + 0.75rem = 2.55rem */}
							<Hamburger size="1.8rem" isBorder={true} />
						</li>
						<li>
							{/* width: 1.8 + 0.75rem = 2.55rem */}
							<SwitchTheme size="1.8rem" isBorder={true} />
						</li>
					</ul>
				</nav>
			</header>
			<hr class="w-full border-[0.5px] border-muted-foreground mt-16" />
			<ul class="flex flex-col items-start gap-4 pt-4">
				{metas.map(({ name, rootpath, subsets }) => (
					<li>
						<div class="flex items-center gap-2">
							<div class="bg-gradient-to-b from-accent-sub-base to-accent-base rounded-full w-[0.4rem] h-[1.1rem]"></div>
							<a href={rootpath} class="text-2xl font-semibold hover:opacity-70" data-astro-reload>
								{name}
							</a>
						</div>
						{subsets.length > 0 && (
							<ul class="flex flex-col items-start gap-2 pt-4 pl-4">
								{subsets
									.filter((subset) => subset.name !== "Articles")
									.map((subset) => (
										<li>
											<div class="flex items-center gap-2">
												<div class="bg-gradient-to-b from-accent-sub-base to-accent-base w-[6px] h-[6px] rounded-full"></div>
												<a
													href={subset.rootpath}
													class="text-lg hover:opacity-70"
													data-astro-reload
												>
													{subset.name}
												</a>
											</div>
										</li>
									))}
							</ul>
						)}
					</li>
				))}
			</ul>
			<hr class="w-full border-[0.5px] border-muted-foreground mt-4" />
		</aside>
	);
};

export default Sidebar;
