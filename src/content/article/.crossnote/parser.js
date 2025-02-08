({
	// Please visit the URL below for more information:
	// https://shd101wyy.github.io/markdown-preview-enhanced/#/extend-parser

	onWillParseMarkdown: async function (markdown) {
		const calloutTypes = [
			"quote",
			"note",
			"remark",
			"info",
			"todo",
			"important",
			"example",
			"tip",
			"break",
			"warn",
			"question",
			"alert",
			"attention",
		];

		const hRe = /(?<hashes>#+)\s?(?<title>.+)?/;
		markdown = markdown.replace(new RegExp(hRe, "g"), (h) => {
			const match = h.match(hRe);
			if (!match || !match.groups) return h;
			const { hashes, title } = match.groups;
			return `<h${hashes.length}>
								<span class="hashes">${"#".repeat(hashes.length)}</span> 
								<span>${title}</span>
							</h${hashes.length}>`;
		});

		// const tipRe = />\s*\[!tip(?:\:fold)?\]\s?(?<title>.+)?/g;
		// markdown = markdown.replace(new RegExp(tipRe, "g"), (callout) => {
		// 	const match = callout.match(tipRe);

		// 	if (!match) return callout;
		// 	const title = match.groups ? match.groups.title ?? "Tip" : "Tip";

		// 	callout = `<blockquote class="callout callout-tip">${match}\n`;

		// 	return callout;
		// });

		return markdown;
	},

	onDidParseMarkdown: async function (html) {
		// const getCalloutApplyedHTML = async (html, calloutType) => {
		// 	const re = new RegExp(`>\s*\[!${calloutType}(?:\:fold)?\]\s?(?<title>.*)`);
		// 	const newHtml = html.replace(new RegExp(re, "g"), (callout) => {
		// 		const match = callout.match(re);
		// 		if (!match) return callout;
		// 		const title = match.groups ? match.groups.title ?? "Important" : "Important";
		// 		callout = `<blockquote class="callout callout-important">${title}\n`;
		// 		return callout;
		// 	});
		// 	return newHtml;
		// };
		// html = await getCalloutApplyedHTML(html, "important");
		// html = await getCalloutApplyedHTML(html, "info");
		// const importantRe = />\s?\[!important(?:\:fold)?\]\s?(?<title>.*)/g;
		// html = html.replace(new RegExp(importantRe, "g"), (callout) => {
		// 	const match = callout.match(importantRe);
		// 	if (!match) return callout;
		// 	const title = match.groups ? match.groups.title ?? "Important" : "Important";
		// 	callout = `<blockquote class="callout callout-important">${title}\n`;
		// 	return callout;
		// });
		// const tipRe = />\s?\[!tip(?:\:fold)?\]\s?.+/gm;
		// html = html.replace(new RegExp(tipRe, "g"), (callout) => {
		// 	const match = callout.match(tipRe);
		// 	if (!match) return callout;
		// 	const title = match.groups ? match.groups.title ?? "Tip" : "Tip";
		// 	callout = `<blockquote class="callout callout-tip">${match}`;
		// 	return callout;
		// });

		return html;
	},

	onWillTransformMarkdown: async function (markdown) {
		return markdown;
	},

	onDidTransformMarkdown: async function (markdown) {
		return markdown;
	},
});
