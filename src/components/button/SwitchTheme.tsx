import { IoSunny, IoMoon } from "solid-icons/io";
import { isDark, setIsDark } from "../../utils/store/isDark";
import { onMount } from "solid-js";

interface Props {
	size?: string | number;
	isBorder?: boolean;
}

const SwitchTheme = ({ size = "1.2rem", isBorder = false }: Props) => {
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
		setIsDark(theme && theme === "dark" ? true : false);
	});

	return (
		<button
			type="button"
			onClick={switchTheme}
			class={`${
				isBorder &&
				"p-[0.375rem] border-[1px] border-muted-foreground rounded-md transition hover:bg-accent-foreground hover:border-accent-foreground"
			}`}
		>
			{isDark() ? <IoMoon size={size} /> : <IoSunny size={size} />}
		</button>
	);
};

export default SwitchTheme;