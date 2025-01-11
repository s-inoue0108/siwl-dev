import Hamburger from "../button/Hamburger";
import SwitchTheme from "../button/SwitchTheme";
import { isOpenSidebar } from "../../utils/store/is-open-sidebar";
import { AllowedRoutes } from "../../route";
import { SiGithub, SiZenn, SiTwitter, SiQiita } from "solid-icons/si";
import { IoLogoRss } from "solid-icons/io";

interface Props {
	appName: string;
	currentPath: string;
	xUrl: string;
	zennUrl: string;
	qiitaUrl: string;
	githubUrl: string;
}

const Sidebar = ({ appName, currentPath, xUrl, zennUrl, qiitaUrl, githubUrl }: Props) => {
	const routes = new AllowedRoutes(currentPath);
	const metas = routes.getRootPageMetaAll(["Home", "Privacy Policy", "Readme"]);

	return (
		<aside
			class={`fixed top-0 left-0 pt-4 px-4 lg:px-8 w-3/4 sm:w-[360px] transition duration-300 ${
				!isOpenSidebar() && "-translate-x-full lg:translate-x-[calc(-360px+3.95rem)]"
			} bg-muted-background min-h-dvh z-[100] overflow-clip`}
		>
			<nav>
				<a href="/" class="text-4xl lg:text-5xl font-extrabold" data-astro-reload>
					{appName}
				</a>
				<ul class="flex absolute items-center gap-4 pt-8 xl:pt-6">
					<li>
						<a
							href={zennUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-xl xl:text-2xl text-muted-foreground hover:text-foreground transition-colors duration-150"
						>
							<SiZenn />
						</a>
					</li>
					<li>
						<a
							href={qiitaUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-xl xl:text-2xl text-muted-foreground hover:text-foreground transition-colors duration-150"
						>
							<SiQiita />
						</a>
					</li>
					<li>
						<a
							href={xUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-xl xl:text-2xl text-muted-foreground hover:text-foreground transition-colors duration-150"
						>
							<SiTwitter />
						</a>
					</li>
					<li>
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-xl xl:text-2xl text-muted-foreground hover:text-foreground transition-colors duration-150"
						>
							<SiGithub />
						</a>
					</li>
					<li>
						<a
							href="/rss.xml"
							target="_blank"
							rel="noopener noreferrer"
							class="text-xl xl:text-2xl text-muted-foreground hover:text-foreground transition-colors duration-150"
						>
							<IoLogoRss />
						</a>
					</li>
				</ul>
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
			<hr
				class={`w-full border-[0.5px] mt-24 ${isOpenSidebar() ? "border-foreground" : "opacity-0"}`}
			/>
			<ul class="flex flex-col items-start gap-4 lg:gap-6 pt-8">
				{metas.map(({ name, rootpath, subsets }) => (
					<li>
						<div class="flex items-center gap-3 xl:gap-4">
							<div class="bg-gradient-to-b from-accent-sub-base to-accent-base w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] lg:w-[8px] lg:h-[8px] rounded-full"></div>
							<a
								href={rootpath}
								class="tracking-wide text-2xl sm:text-3xl lg:text-4xl font-bold hover:opacity-70"
								data-astro-reload
							>
								{name}
							</a>
						</div>
						{subsets.length > 0 && (
							<ul class="flex flex-col items-start gap-2 lg:gap-3 pt-4 lg:pt-6 pl-4 lg:pl-6">
								{subsets
									.filter((subset) => subset.name !== "Articles")
									.map((subset) => (
										<li>
											<div class="flex items-center gap-3 xl:gap-4">
												<div class="bg-gradient-to-b from-accent-sub-base to-accent-base w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] lg:w-[8px] lg:h-[8px] rounded-full"></div>
												<a
													href={subset.rootpath}
													class="tracking-wide font-medium text-lg sm:text-xl lg:text-2xl hover:opacity-70"
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
		</aside>
	);
};

export default Sidebar;
