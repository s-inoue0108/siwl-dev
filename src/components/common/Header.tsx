import SwitchTheme from "../button/SwitchTheme";
import Hamburger from "../button/Hamburger";
import OpenSearchInput from "../button/OpenSearchInput";
import NavigationLink from "../button/NavigationLink";
import LinkButton from "../button/LinkButton";
import { IoLogoRss } from "solid-icons/io";
import SearchInput from "../form/SearchInput";
import SearchResult from "../form/SearchResult";
import { Show } from "solid-js";
import { keyword } from "../../utils/store/search";

interface Props {
	appName: string;
	currentPath: string;
}

const Header = ({ appName, currentPath }: Props) => {
	return (
		<header class="sticky top-0 lg:left-[3.95rem] w-full lg:w-[calc(100%-3.95rem)] h-9 sm:h-12 lg:h-16 bg-background border-b-[0.5px] border-muted-foreground z-50">
			<nav class="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-between px-2 sm:px-4 lg:px-[1.975rem] xl:px-[3.95rem] 2xl:pr-[5.925rem]">
				<a href="/">
					<h1 class="sm:text-lg md:text-2xl lg:text-4xl font-extrabold">{appName}</h1>
				</a>
				<ul class="lg:hidden flex items-center gap-4">
					<li>
						<OpenSearchInput />
					</li>
					<li>
						<SwitchTheme />
					</li>
					<li>
						<Hamburger />
					</li>
				</ul>
				<ul class="hidden lg:flex items-center gap-4 2xl:gap-8">
					<li>
						<NavigationLink name="Blog" href="/blog/1" isCurrent={/^\/blog\//.test(currentPath)} />
					</li>
					<li>
						<NavigationLink name="About" href="/about" isCurrent={/^\/about/.test(currentPath)} />
					</li>
					<li>
						<NavigationLink name="Works" href="/works" isCurrent={/^\/works/.test(currentPath)} />
					</li>
					<li>
						<NavigationLink
							name="Contact"
							href="/contact"
							isCurrent={/^\/contact/.test(currentPath)}
						/>
					</li>
					<li>
						<LinkButton Icon={<IoLogoRss size="1.6rem" />} href="/rss.xml" isExternal={true} />
					</li>
				</ul>
				<div class="hidden lg:block">
					<SearchInput />
				</div>
				<Show when={keyword() !== ""}>
					<div class="hidden lg:block bg-gradient-to-r from-accent-sub-base to-accent-base p-2 shadow-2xl rounded-lg absolute top-16 right-[3.95rem]">
						<div class="w-96 max-h-[50dvh] p-2 rounded-md bg-muted-background/50 overflow-y-auto">
							<SearchResult />
						</div>
					</div>
				</Show>
			</nav>
		</header>
	);
};

export default Header;
