import { IoSunny, IoMoon } from "solid-icons/io";
import { BiRegularLoaderAlt } from "solid-icons/bi";
import { onMount, createSignal, Show } from "solid-js";

interface Props {
	size?: string | number;
	isBorder?: boolean;
}

const SwitchTheme = ({ size = "1.4rem", isBorder = false }: Props) => {
	const [isDark, setIsDark] = createSignal<boolean | null>(null);
	const switchTheme = () => {
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
		}
	});

	return (
		<button
			type="button"
			onClick={switchTheme}
			class={`${
				isBorder &&
				"p-[0.375rem] border border-muted-foreground rounded-md transition-colors duration-200 hover:bg-foreground hover:border-foreground hover:text-muted-background"
			}`}
		>
			<Show
				when={isDark() !== null}
				fallback={<BiRegularLoaderAlt size={size} class="animate-spin" />}
			>
				{isDark() ? <IoMoon size={size} /> : <IoSunny size={size} />}
			</Show>
		</button>
	);
};

export default SwitchTheme;
