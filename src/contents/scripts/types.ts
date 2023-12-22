export type JsonData = {
  filename: string
  data: object
}

export type Repo = {
  url: string
  owner: string
  repoName: string
}

export type RepoWithStats = Repo & {
  stats: {
    lastCommitDate: string
    commits: number
  }
}

export interface BaseRequirement {
  description: string
  number: string
  correct: boolean
  message: string
  okayMessage: string
  notOkayMessage: string
}

export type SubRequirement = BaseRequirement & {}

export type Requirement = {
  data: BaseRequirement
  subRequirements: SubRequirement[]
}

export type Section = {
  name: string
  requirements: Requirement[]
}

export type Json = {
  type: string
  data: {
    sections: Section[]
  }
}
