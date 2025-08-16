import { createEffect } from "solid-js";
import { IoSearchOutline, IoClose } from "solid-icons/io";
import { keyword, setKeyword } from "../../utils/store/search";

const SearchInput = () => {
	const bind = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		setKeyword(value);
	};

	createEffect(() => {
		const input = document.getElementById("search") as HTMLInputElement;
		window.addEventListener("keydown", (e) => {
			if (e.shiftKey && e.key === "Backspace") {
				e.preventDefault();
				setKeyword("");
			}
			if (e.altKey && e.key.toLowerCase() === "k") {
				e.preventDefault();
				input.focus();
			}
			if (e.key === "Escape") {
				e.preventDefault();
				input.blur();
			}
		});
	});

	return (
		<div class="relative rounded-xl flex items-center border border-muted-background xl:w-[16.4rem]">
			<label class="rounded-l-xl relative w-12 h-12 bg-muted-background" for="search">
				<button
					type="button"
					title={keyword() === "" ? "Search" : "Clear"}
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground text-lg hover:text-foreground transition-colors duration-150"
					onClick={() => setKeyword("")}
				>
					{keyword() === "" ? <IoSearchOutline /> : <IoClose />}
				</button>
			</label>
			<input
				type="text"
				id="search"
				name="search"
				class="truncate border-none bg-muted-transparent placeholder:text-muted-foreground w-full h-12 py-1 pr-12 text-lg focus:outline-none focus:ring-0"
				value={keyword()}
				placeholder="Search"
				onInput={(e) => bind(e)}
			/>
			<span class="absolute top-1/2 -translate-y-[calc(50%-1px)] right-2 text-muted-foreground">
				⌥ K
			</span>
		</div>
	);
};

export default SearchInput;
