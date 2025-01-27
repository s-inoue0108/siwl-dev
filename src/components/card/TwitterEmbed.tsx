import { createEffect, createSignal } from "solid-js";

interface TwitterEmbed {
	url: string;
	title: string;
	html: string;
	width: number | null;
	height: number | null;
	type: string;
	cache_age: string;
	provider_name: string;
	provider_url: string;
	version: string;
}

interface Props {
	url: string;
}

const TwitterEmbed = ({ url }: Props) => {
	const fetchEmbed = async (url: string): Promise<TwitterEmbed> => {
		const endpoint = "https://publish.twitter.com/oembed";
		const query = encodeURIComponent(url);
		const resp = await fetch(
			`${endpoint}?url=${query}&hide_thread=true&align=center&lang=ja&theme=dark`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return await resp.json();
	};

	const [dom, setDom] = createSignal("");

	createEffect(async () => {
		const content = await fetchEmbed(url);
		console.log(content);
		setDom(content.html);
	});

	return <>{dom()}</>;
};

export default TwitterEmbed;
