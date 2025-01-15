import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { type APIContext } from "astro";
import { AllowedRoutes } from "../route";

const routes = new AllowedRoutes("/");
const { meta } = routes.getRootPageMeta();

export async function GET(context: APIContext) {
	const articles = await getCollection("article", ({ data }) => {
		return import.meta.env.PROD ? !data.isDraft && !data.isLimited : true;
	});

	return rss({
		title: import.meta.env.APP_NAME,
		description: meta.description,
		site: context.site ?? import.meta.env.APP_URL,
		items: articles.map(({ slug, data }) => ({
			title: data.title,
			pubDate: data.publishDate,
			description: data.description ?? "",
			link: `/blog/articles/${slug}`,
		})),
	});
}
