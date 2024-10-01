import Hamburger from "../button/Hamburger";
import SwitchTheme from "../button/SwitchTheme";
import SearchInput from "../form/SearchInput";
import { isOpenMenu } from "../../utils/store/isOpenMenu";

interface Props {
	appName: string;
}

const Sidebar = ({ appName }: Props) => {
	return (
		<aside
			class={`hidden lg:block fixed top-0 left-0 pt-4 px-8 w-[360px] transition duration-300 ${
				!isOpenMenu() && "translate-x-[calc(-360px+3.95rem)]"
			} bg-muted-background h-dvh z-50`}
		>
			<header>
				<nav class="pt-6">
					<a href="/" class="text-5xl font-bold" data-astro-reload>
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
			<ul class="flex flex-col gap-2 w-full mx-auto">
				<li class="flex items-center">
					<a href="/blog/1" data-astro-reload>
						Blog
					</a>
				</li>
				<li class="flex items-center">
					<a href="/blog/archives" data-astro-reload>
						Archives
					</a>
				</li>
				<li class="flex items-center">
					<a href="/about" data-astro-reload>
						About
					</a>
				</li>
				<li class="flex items-center">
					<a href="/works" data-astro-reload>
						Works
					</a>
				</li>
				<li class="flex items-center">
					<a href="/contact" data-astro-reload>
						Contact
					</a>
				</li>
			</ul>
			{/* <ProfileCard /> */}
		</aside>
	);
};

export default Sidebar;
