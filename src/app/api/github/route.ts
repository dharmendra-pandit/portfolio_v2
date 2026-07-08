import { NextResponse } from 'next/server'
import { GraphQLClient, gql } from 'graphql-request'

const GITHUB_API_URL = 'https://api.github.com/graphql'
 
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN
    const username = process.env.GITHUB_USERNAME

    if (!token || !username) {
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
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub projects' },
      { status: 500 }
    )
  }
}
