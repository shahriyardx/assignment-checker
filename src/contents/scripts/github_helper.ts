import { type Repo } from "./types"

export const getRepos = (content: string) => {
  const githubRepoPattern = /https?:\/\/github\.com\/([^\s/]+)\/([^\s/]+)/g
  const matches: Repo[] = []

  let match = githubRepoPattern.exec(content)
  while (match !== null) {
    matches.push({ owner: match[1], repoName: match[2], url: match[0] })
    match = githubRepoPattern.exec(content)
  }

  return matches
}

async function getGitHubRepoInfo(repo: Repo, token: string) {
  const apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.repoName}`

  const repoResponse = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const commitResponse = await fetch(`${apiUrl}/commits?per_page=1&page=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const link = commitResponse.headers.get("link") as string
  const pageRegex = /page=(\d+)>; rel="last"/
  const match = link.match(pageRegex)

  const repoData = await repoResponse.json()

  let lastCommitDate

  if (repoResponse.ok) {
    const commitDate = new Date(repoData.pushed_at)
    const hour = commitDate.getHours()
    let commitHour = hour
    let ampm = "PM"

    if (hour > 12) {
      commitHour = hour - 12
      ampm = "AM"
    }

    lastCommitDate = `${commitDate.getDate()} ${commitDate.toLocaleString(
      "default",
      { month: "short" },
    )}, ${commitDate.getFullYear()} - ${commitHour}:${commitDate.getMinutes()} ${ampm}`
  }

  return {
    lastCommitDate,
    commits: match ? Number(match[1]) : 0,
  }
}

export const getStats = async (repos: Repo[], token: string) => {
  const stats = []
  try {
    for (const repo of repos) {
      stats.push({
        ...repo,
        stats: await getGitHubRepoInfo(repo, token),
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, data: null }
    }
  }

  return { error: null, data: stats }
}
