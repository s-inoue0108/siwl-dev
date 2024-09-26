import { createSignal } from "solid-js";

const SearchInput = () => {
	const [keyword, setKeyword] = createSignal("");
	const change = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		setKeyword(value);
	};
	return (
		<div>
			<input type="text" value={keyword()} onChange={(e) => change(e)} />
		</div>
	);
};

export default SearchInput;
