// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import solid from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";

import remarkToc from "remark-toc";
import remarkMath from "remark-math";
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
			remarkPlugins: [remarkMath, remarkToc],
			rehypePlugins: [rehypeKatex],
			remarkRehype: { footnoteLabel: "Footnotes" },
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
