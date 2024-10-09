// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import solid from "@astrojs/solid-js";

// Remark/Rehype Plugins from third-party
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkCodeTitles from "remark-flexible-code-titles";
// @ts-ignore
import rlc from "remark-link-card";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";

// from made
import rehypeHeadings from "./src/plugins/rehype/rehype-headings";
import rehypeInlineAnchor from "./src/plugins/rehype/rehype-inline-anchor";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3000,
	},

	site: "https://siwl.dev",

	integrations: [
		solid(),
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
		tailwind(),
	],

	markdown: {
		syntaxHighlight: "shiki",
		shikiConfig: {
			theme: "dracula-soft",
		},
		remarkPlugins: [[rlc, { shortenUrl: true }], remarkDirective, remarkMath, remarkCodeTitles],
		rehypePlugins: [
			rehypeRaw,
			[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
			rehypeInlineAnchor,
			rehypeHeadings,
			rehypeKatex,
		],
		remarkRehype: {
			footnoteLabelTagName: "h1",
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
	},

	output: "static",
});
