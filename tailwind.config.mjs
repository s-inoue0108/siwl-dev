/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
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
			},
			animation: {
				"fade-in": "fade-in 1s ease-in-out",
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
		colors: {
			sky: "#38bdf8",
			emerald: "#76d5b4",
			lime: "#bef264",
		},
	},
	plugins: [],
	darkMode: "class",
};
