import SwitchTheme from "../button/SwitchTheme";
import Hamburger from "../button/Hamburger";
import SearchModal from "../button/SearchModal";
import NavigationLink from "../button/NavigationLink";
import LinkButton from "../button/LinkButton";
import { IoLogoRss } from "solid-icons/io";
import SearchInput from "../form/SearchInput";
import SearchResult from "../form/SearchResult";
import { createSignal, Show, createEffect } from "solid-js";
import { keyword } from "../../utils/store/search";
import { AllowedRoutes } from "../../utils/common/route";

interface Props {
	appName: string;
	currentPath: string;
}

const Header = ({ appName, currentPath }: Props) => {
	const routes = new AllowedRoutes(currentPath);
	const metas = routes.getRootPageMetaAll(["Home", "Bookmarks", "Privacy policy"]);

	const [direction, setDirection] = createSignal<"up" | "down">("up");
	let beforePosition = 0,
		nowPosition = 0;

	// スクロール方向を検知する処理
	const handleScroll = () => {
		nowPosition = document.documentElement.scrollTop;

		if (beforePosition === nowPosition) return;
		if (beforePosition < nowPosition) {
			setDirection("down");
		} else {
			setDirection("up");
		}

		beforePosition = nowPosition;
	};

	createEffect(() => {
		window.addEventListener("scroll", handleScroll);
	});

	return (
		<header
			id="header"
			class={`sticky top-0 ${
				direction() === "up" ? "translate-y-0" : "-translate-y-full"
			} transition duration-300 lg:relative lg:translate-y-0 lg:left-[3.95rem] w-screen lg:w-[calc(100%-3.95rem)] h-12 sm:h-14 lg:h-16 bg-background border-b border-muted-background z-50`}
		>
			<nav class="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between px-2 sm:px-4 lg:px-[1.975rem] xl:px-[3.95rem] 2xl:pr-[5.925rem]">
				<a href="/">
					<h1 class="text-lg sm:text-xl md:text-2xl lg:text-4xl font-extrabold">{appName}</h1>
				</a>
				<ul class="lg:hidden flex items-center gap-4">
					<li>
						<SearchModal />
					</li>
					<li>
						<SwitchTheme />
					</li>
					<li>
						<Hamburger />
					</li>
				</ul>
				<ul class="hidden lg:flex items-center gap-4 2xl:gap-8">
					{metas.map(({ name, rootpath, matchers }) => (
						<li>
							<NavigationLink
								name={name}
								href={rootpath}
								isCurrent={matchers[0].test(currentPath)}
							/>
						</li>
					))}
					<li>
						<LinkButton Icon={<IoLogoRss size="1.6rem" />} href="/rss.xml" isExternal={true} />
					</li>
				</ul>
				<div class="hidden lg:block">
					<SearchInput />
				</div>
				<Show when={keyword() !== ""}>
					<div class="hidden lg:block bg-gradient-to-r from-accent-sub-base to-accent-base p-2 shadow-2xl rounded-lg absolute top-16 right-[3.95rem]">
						<div class="w-96 max-h-[50dvh] p-2 rounded-md bg-muted-background/50 overflow-y-auto hidden-scrollbar">
							<SearchResult />
						</div>
					</div>
				</Show>
			</nav>
		</header>
	);
};

export default Header;
