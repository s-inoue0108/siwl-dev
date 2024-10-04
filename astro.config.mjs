// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import solid from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";

// Remark/Rehype Plugins
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import remarkCodeTitles from "remark-flexible-code-titles";
import rehypeKatex from "rehype-katex";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3000,
	},

	site: import.meta.env.APP_URL,
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
		mdx({
			syntaxHighlight: "shiki",
			shikiConfig: { theme: "dracula" },
			remarkPlugins: [remarkMath, remarkToc, remarkCodeTitles],
			rehypePlugins: [rehypeKatex],
			remarkRehype: {
				footnoteLabelTagName: "h1",
				footnoteLabel: "Footnotes",
				footnoteBackLabel: "Return to content",
			},
			gfm: true,
		}),
		tailwind(),
	],
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
