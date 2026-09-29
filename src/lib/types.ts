export type Project = {
  name: string
  description: string
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  updatedAt: string
  primaryLanguage: { name: string; color: string } | null
  languages: { nodes: { name: string; color: string }[] }
}

export interface KaggleNotebook {
  title: string
  description: string
  datasetName: string
  tags: string[]
  lastUpdated: string
  notebookUrl: string
  kaggleUrl: string
  type?: 'notebook' | 'dataset'
}

export interface DockerRepository {
  title: string
  description: string
  url: string
  starCount: number
  pullCount: number
  lastUpdated: string
  tags: string[]
  type?: 'docker'
}
