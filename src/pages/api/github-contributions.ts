import type { APIRoute } from "astro";
import { getGithubContributions } from "../../utils/api/github-contributions";

export const GET: APIRoute = async () => {
    try {
        const gitHubCalendar = await getGithubContributions();

        return Response.json(gitHubCalendar);
    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({
                error: "GitHub API request failed",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
};