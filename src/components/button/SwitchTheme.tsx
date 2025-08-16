import { IoSunny, IoMoon } from "solid-icons/io";
import { BiRegularLoaderAlt } from "solid-icons/bi";
import { createSignal, Match, onMount, Switch } from "solid-js";

interface Props {
	size?: string | number;
	isBorder?: boolean;
}

const SwitchTheme = ({ size = "1.4rem", isBorder = false }: Props) => {
	const [isDark, setIsDark] = createSignal<boolean | null>(null);

	const toggleTheme = () => {
		setIsDark(!isDark());
		const rootClass = document.documentElement.classList;
		const storage = window.localStorage;
		if (isDark()) {
			rootClass.add("dark");
			rootClass.remove("light");
			storage.removeItem("theme");
			storage.setItem("theme", "dark");
		} else {
			rootClass.add("light");
			rootClass.remove("dark");
			storage.removeItem("theme");
			storage.setItem("theme", "light");
		}
	};

	onMount(() => {
		const theme = window.localStorage.getItem("theme");
		if (theme && typeof theme === "string") {
			setIsDark(theme === "dark" ? true : false);
		} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setIsDark(true);
		} else {
			setIsDark(false);
		}
	});

	return (
		<button
			type="button"
			title={isDark() ? "Light theme" : "Dark theme"}
			onClick={toggleTheme}
			class={`${
				isBorder &&
				"p-[0.375rem] border border-muted-foreground rounded-md transition-colors duration-200 hover:bg-foreground hover:border-foreground hover:text-muted-background"
			} relative`}
		>
			<Switch fallback={<BiRegularLoaderAlt size={size} class="animate-spin" />}>
				<Match when={isDark() === true}>
					<IoMoon size={size} />
				</Match>
				<Match when={isDark() === false}>
					<IoSunny size={size} />
				</Match>
			</Switch>
		</button>
	);
};

export default SwitchTheme;
