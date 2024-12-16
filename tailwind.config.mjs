/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				body: ["Montserrat", "Noto Sans JP", "sans-serif"],
				code: ["Source Code Pro", "monospace"],
			},
			colors: {
				background: "rgba(var(--background), var(--opacity))",
				foreground: "rgba(var(--foreground), var(--opacity))",
				muted: {
					background: "rgba(var(--muted), var(--opacity))",
					foreground: "rgba(var(--muted-foreground), var(--opacity))",
				},
				accent: {
					vivid: "rgba(var(--accent-vivid), var(--opacity))",
					base: "rgba(var(--accent-base), var(--opacity))",
					"sub-base": "rgba(var(--accent-sub-base), var(--opacity))",
				},
				tranparent: "transparent",
				sky: "#38bdf8",
				purple: "#a855f7",
			},
			objectPosition: {
				middle: "50% 75%",
			},
			animation: {
				"fade-in": "fade-in 1s ease-in-out",
				"fade-in-fast": "fade-in 0.2s ease-in-out",
				inversion: "inversion 1s linear",
			},
			keyframes: {
				"fade-in": {
					"0%": {
						opacity: "0",
					},
					"100%": {
						opacity: "1",
					},
				},
				inversion: {
					"0%": {
						transform: "rotate(0deg)",
					},
					"100%": {
						transform: "rotate(180deg)",
					},
				},
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
	darkMode: "class",
};
