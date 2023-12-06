import { RepoWithStats, getRepos, getStats } from "./github_helper"

export const showGithubStats = async () => {
  const evalForm = document.querySelector(".assignment-evaluation-form")
  console.log(evalForm)
  if (!evalForm) return

  const assignmentData = evalForm.querySelectorAll(
    ".row.form-group"
  )[1] as HTMLElement
  console.log(assignmentData)
  if (!assignmentData) return

  const github_container = document.createElement("div")
  github_container.className = "col-md-12"
  github_container.id = "github_stats"
  github_container.style.marginBlock = "10px"
  github_container.style.display = "flex"
  github_container.style.flexDirection = "column"
  github_container.style.gap = "10px"
  github_container.innerText = "Loadig data..."

  const content = assignmentData.innerText as string

  assignmentData.appendChild(github_container)

  const repos = getRepos(content)
  console.log(repos)
  let githubToken = localStorage.getItem("github_token") as string
  if (!githubToken) {
    const token = prompt("Enter your github token here")
    if (token) {
      localStorage.setItem("github_token", String(token))
      githubToken = token as string
    } else {
      return
    }
  }
  const stats = await getStats(repos, githubToken)
  console.log(stats)
  github_container.innerHTML = ""

  if (stats.error) {
    github_container.innerText = stats.error
  }

  const allData = stats.data as RepoWithStats[]
  for (const stat of allData) {
    const div = document.createElement("div")
    const repoName = document.createElement("h5")
    const lastCommit = document.createElement("p")
    const commitCount = document.createElement("p")
    
    div.style.paddingInline = "15px"
    lastCommit.style.margin = "0px"
    commitCount.style.margin = "0px"

    repoName.innerText = ">> " + stat.repoName
    lastCommit.innerHTML = `<b>last Commit:</b> ${stat.stats.lastCommitDate}`
    commitCount.innerHTML = `<b>Commit Count:</b> ${String(stat.stats.commits)}`

    div.appendChild(repoName)
    div.appendChild(lastCommit)
    div.appendChild(commitCount)

    github_container.appendChild(div)
  }
}
