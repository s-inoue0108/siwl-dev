import { AllowedRoutes } from "../../route";

interface Props {
	currentPath: string;
}

const Footer = ({ currentPath }: Props) => {
	const routes = new AllowedRoutes(currentPath);
	const metas = routes.getRootPageMetaAll(["Home", "About", "Bookmarks", "Blog", "Readme"]);
	return (
		<footer class="mt-8 w-full sticky top-[100dvh] h-8 lg:h-12 border-t border-muted-background text-muted-foreground">
			<nav>
				<p class="text-sm lg:text-md absolute top-1/2 left-2 lg:left-1/2 lg:-translate-x-1/2 -translate-y-1/2">
					&copy; {`${new Date().getFullYear()} ${import.meta.env.APP_OWNER}`}
				</p>
				<ul class="text-xs lg:text-sm flex items-center gap-4 lg:gap-8 absolute top-1/2 right-2 lg:right-8 -translate-y-1/2">
					{metas.map(({ name, rootpath }) => (
						<li>
							<a href={rootpath} class="hover:text-foreground transition-colors duration-150">
								{name}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</footer>
	);
};

export default Footer;
