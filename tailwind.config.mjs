/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				muted: {
					background: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					background: "var(--accent)",
					foreground: "var(--accent-foreground)",
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
