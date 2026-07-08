import { NextResponse } from 'next/server'
import { GraphQLClient, gql } from 'graphql-request'
import fs from 'fs'
import path from 'path'

const GITHUB_API_URL = 'https://api.github.com/graphql'
 
export const dynamic = 'force-dynamic';

function getCachedData() {
  try {
    const cachePath = path.join(process.cwd(), 'src/data/stats-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return data.github?.projects;
    }
  } catch (err) {
    console.error('Error reading GitHub projects cache:', err);
  }
  return null;
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN
    const username = process.env.GITHUB_USERNAME

    if (!token || !username) {
      const cachedProjects = getCachedData()
      if (cachedProjects) {
        return NextResponse.json({ projects: cachedProjects })
      }
      return NextResponse.json(
        { error: 'GitHub credentials not configured in environment variables' },
        { status: 500 }
      )
    }

    const client = new GraphQLClient(GITHUB_API_URL, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const query = gql`
      query getPinnedRepos($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                homepageUrl
                stargazerCount
                forkCount
                updatedAt
                primaryLanguage {
                  name
                  color
                }
                languages(first: 3) {
                  nodes {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `

    const data: any = await client.request(query, { username })
    const projects = data.user.pinnedItems.nodes

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching GitHub data, trying cache fallback:', error)
    const cachedProjects = getCachedData()
    if (cachedProjects) {
      return NextResponse.json({ projects: cachedProjects })
    }
    return NextResponse.json(
      { error: 'Failed to fetch GitHub projects' },
      { status: 500 }
    )
  }
}
