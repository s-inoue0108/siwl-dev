// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

// Remark/Rehype Plugins from third-party
import remarkMath from "remark-math";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkBreaks from "remark-breaks";
// @ts-ignore
import rlc from "remark-link-card";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
// @ts-ignore
import rehypeWrapAll from "rehype-wrap-all";

// Remark/Rehype Plugins from made
import remarkCallout from "./src/plugins/remark/remark-callout";
import remarkFigureCaption from "./src/plugins/remark/remark-figure-caption";
import remarkTwitterEmbed from "./src/plugins/remark/remark-twitter-embed";
import remarkMisskeyEmbed from "./src/plugins/remark/remark-misskey-embed";
import remarkYoutubeEmbed from "./src/plugins/remark/remark-youtube-embed";
import remarkGistEmbed from "./src/plugins/remark/remark-gist-embed";
import remarkCodepenEmbed from "./src/plugins/remark/remark-codepen-embed";
import remarkSpeakerDeckEmbed from "./src/plugins/remark/remark-speakerdeck-embed";
import remarkDocswellEmbed from "./src/plugins/remark/remark-docswell-embed";
import remarkSpotifyEmbed from "./src/plugins/remark/remark-spotify-embed";
import remarkSoundCloudEmbed from "./src/plugins/remark/remark-soundcloud-embed";
import remarkWikimediaEmbed from "./src/plugins/remark/remark-wikimedia-embed";
import remarkNoteEmbed from "./src/plugins/remark/remark-note-embed";
import remarkHatenablogEmbed from "./src/plugins/remark/remark-hatenablog-embed";
import rehypeHeadings from "./src/plugins/rehype/rehype-headings";
import rehypeInlineAnchor from "./src/plugins/rehype/rehype-inline-anchor";
import rehypeCodeCopyButton from "./src/plugins/rehype/rehype-code-copy-button";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 8000,
	},

	site: "https://siwl.dev",

	output: "hybrid",
	adapter: cloudflare(),

	integrations: [
		solid(),
		tailwind(),
		sitemap({
			i18n: {
				defaultLocale: "ja",
				locales: {
					ja: "ja-JP",
				},
			},
		}),
		partytown({
			// Adds dataLayer.push as a forwarding-event.
			config: {
				forward: ["dataLayer.push"],
			},
		}),
	],

	markdown: {
		syntaxHighlight: "shiki",
		shikiConfig: {
			themes: {
				light: "github-light",
				dark: "ayu-dark",
			},
		},
		remarkPlugins: [
			remarkBreaks,
			remarkTwitterEmbed,
			remarkYoutubeEmbed,
			remarkGistEmbed,
			remarkCodepenEmbed,
			remarkSpeakerDeckEmbed,
			remarkDocswellEmbed,
			remarkSpotifyEmbed,
			remarkSoundCloudEmbed,
			remarkWikimediaEmbed,
			remarkMisskeyEmbed,
			remarkNoteEmbed,
			remarkHatenablogEmbed,
			remarkFigureCaption,
			remarkCallout,
			remarkMath,
			remarkCodeTitles,
			[rlc, { shortenUrl: true }],
		],
		rehypePlugins: [
			rehypeRaw,
			[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
			rehypeInlineAnchor,
			rehypeHeadings,
			rehypeKatex,
			[
				rehypeWrapAll,
				{
					selector: "pre",
					wrapper: "div.code-block",
				},
			],
			rehypeCodeCopyButton,
		],
		remarkRehype: {
			footnoteLabelTagName: "h4",
			footnoteLabel: "脚注",
			footnoteBackLabel: "Return to content",
		},
		gfm: true,
	},

	vite: {
		ssr: {
			external: ["@resvg/resvg-js"],
		},
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});
