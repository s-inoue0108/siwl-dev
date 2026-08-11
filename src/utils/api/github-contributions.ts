export async function getGithubContributions() {
    const today = new Date();

    const to = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
    ).toISOString();

    const fromDate = new Date(today);
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate.setDate(fromDate.getDate() + 2);
    fromDate.setHours(0, 0, 0, 0);

    const from = fromDate.toISOString();

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.GITHUB_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            query: `
				query($user: String!, $from: DateTime!, $to: DateTime!) {
					user(login: $user) {
						contributionsCollection(from: $from, to: $to) {
							contributionCalendar {
								totalContributions
								weeks {
									contributionDays {
										contributionCount
										date
									}
								}
							}
						}
					}
				}
			`,
            variables: {
                user: import.meta.env.GITHUB_USERNAME,
                from,
                to,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
    }

    const gitHubContributions = await response.json();

    return gitHubContributions.data.user.contributionsCollection
        .contributionCalendar;
}