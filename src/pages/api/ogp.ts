export const prerender = false;

import type { APIContext, APIRoute } from "astro";
import ogs from "open-graph-scraper";

export const GET: APIRoute = async ({ request }: APIContext) => {
  const req = new URL(request.url);
  const url = req.searchParams.get("url") ?? "";

  try {
    const { result } = await ogs({ url });
    return new Response(JSON.stringify(result));
  } catch (e) {
    return new Response(JSON.stringify({ error: e }));
  }
}
