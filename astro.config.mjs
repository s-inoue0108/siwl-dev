// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// Remark/Rehype Plugins from third-party
import remarkMath from "remark-math";
import remarkCodeTitles from "remark-flexible-code-titles";
import remarkBreaks from "remark-breaks";
// @ts-ignore
import rlc from "remark-link-card";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";

// Remark/Rehype Plugins from made
import remarkCallout from "./src/plugins/remark/remark-callout";
import remarkFigureCaption from "./src/plugins/remark/remark-figure-caption";
import remarkTwitterEmbed from "./src/plugins/remark/remark-twitter-embed";
import remarkYoutubeEmbed from "./src/plugins/remark/remark-youtube-embed";
import remarkGistEmbed from "./src/plugins/remark/remark-gist-embed";
import rehypeHeadings from "./src/plugins/rehype/rehype-headings";
import rehypeInlineAnchor from "./src/plugins/rehype/rehype-inline-anchor";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3000,
	},

	site: "https://siwl.dev",

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
				light: "snazzy-light",
				dark: "ayu-dark",
			},
		},
		remarkPlugins: [
			remarkBreaks,
			remarkTwitterEmbed,
			remarkYoutubeEmbed,
			remarkGistEmbed,
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
		],
		remarkRehype: {
			footnoteLabelTagName: "h4",
			footnoteLabel: "脚注",
			footnoteBackLabel: "Return to content",
		},
		gfm: true,
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "src/assets/scss/base.scss";`,
					silenceDeprecations: ["legacy-js-api"],
				},
			},
		},
		ssr: {
			external: ["@resvg/resvg-js"],
		},
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});
