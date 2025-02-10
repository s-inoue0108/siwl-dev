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

		const hRe = /(?<hashes>#{2,4})\s?(?<title>.+)?/;
		markdown = markdown.replace(new RegExp(hRe, "g"), (h) => {
			const match = h.match(hRe);
			if (!match || !match.groups) return h;
			const { hashes, title } = match.groups;
			return `<h${hashes.length}>
								<span class="hashes">${"#".repeat(hashes.length)}</span> 
								<span>${title}</span>
							</h${hashes.length}>`;
		});

		const capRe = /\*\[!(?<type>table|image)\]\s(?<title>[^\*]+)\*/;
		markdown = markdown.replace(new RegExp(capRe, "g"), (cap) => {
			const match = cap.match(capRe);
			if (!match || !match.groups) return cap;
			const { type, title } = match.groups;
			const head = type === "table" ? "Table" : "Figure";
			return `<figcaption class="caption caption-${type}">${head}. ${title}</figcaption>`;
		});

		const quoteRe = />\s?\[!quote(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(quoteRe, "g"), (callout) => {
			const match = callout.match(quoteRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Quote";

			callout = `<callout class="callout callout-quote">${title}</callout>`;

			return callout;
		});

		const noteRe = />\s*\[!note(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(noteRe, "g"), (callout) => {
			const match = callout.match(noteRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Note";

			callout = `<callout class="callout callout-note">${title}</callout>`;

			return callout;
		});

		const remarkRe = />\s*\[!remark(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(remarkRe, "g"), (callout) => {
			const match = callout.match(remarkRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Remark";

			callout = `<callout class="callout callout-remark">${title}</callout>`;

			return callout;
		});

		const infoRe = />\s*\[!info(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(infoRe, "g"), (callout) => {
			const match = callout.match(infoRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Info";

			callout = `<callout class="callout callout-info">${title}</callout>`;

			return callout;
		});

		const todoRe = />\s*\[!todo(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(todoRe, "g"), (callout) => {
			const match = callout.match(todoRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Todo";

			callout = `<callout class="callout callout-todo">${title}</callout>`;

			return callout;
		});

		const importantRe = />\s*\[!important(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(importantRe, "g"), (callout) => {
			const match = callout.match(importantRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Important";

			callout = `<callout class="callout callout-important">${title}</callout>`;

			return callout;
		});

		const exampleRe = />\s*\[!example(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(exampleRe, "g"), (callout) => {
			const match = callout.match(exampleRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Example";

			callout = `<callout class="callout callout-example">${title}</callout>`;

			return callout;
		});

		const tipRe = />\s*\[!tip(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(tipRe, "g"), (callout) => {
			const match = callout.match(tipRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Tip";

			callout = `<callout class="callout callout-tip">${title}</callout>`;

			return callout;
		});

		const breakRe = />\s*\[!break(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(breakRe, "g"), (callout) => {
			const match = callout.match(breakRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Break";

			callout = `<callout class="callout callout-break">${title}</callout>`;

			return callout;
		});

		const warnRe = />\s*\[!warn(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(warnRe, "g"), (callout) => {
			const match = callout.match(warnRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Warn";

			callout = `<callout class="callout callout-warn">${title}</callout>`;

			return callout;
		});

		const questionRe = />\s*\[!question(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(questionRe, "g"), (callout) => {
			const match = callout.match(questionRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Question";

			callout = `<callout class="callout callout-question">${title}</callout>`;

			return callout;
		});

		const alertRe = />\s*\[!alert(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(alertRe, "g"), (callout) => {
			const match = callout.match(alertRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Alert";

			callout = `<callout class="callout callout-alert">${title}</callout>`;

			return callout;
		});

		const attentionRe = />\s*\[!attention(?:\:fold)?\]\s(?<title>[^\n>]+)?/;
		markdown = markdown.replace(new RegExp(attentionRe, "g"), (callout) => {
			const match = callout.match(attentionRe);

			if (!match) return callout;
			const title =
				match.groups && match.groups.title && match.groups.title.trim()
					? match.groups.title
					: "Attention";

			callout = `<callout class="callout callout-attention">${title}</callout>`;

			return callout;
		});

		return markdown;
	},

	onDidParseMarkdown: async function (html) {
		return html;
	},

	onWillTransformMarkdown: async function (markdown) {
		return markdown;
	},

	onDidTransformMarkdown: async function (markdown) {
		return markdown;
	},
});
