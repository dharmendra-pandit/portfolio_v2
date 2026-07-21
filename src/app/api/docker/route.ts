import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function getCachedData() {
  try {
    const cachePath = path.join(process.cwd(), 'src/data/stats-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return data.docker;
    }
  } catch (err) {
    console.error('Error reading Docker cache:', err);
  }
  return null;
}

export async function GET() {
  const username = process.env.DOCKER_USERNAME || 'iampanditji'
  
  const fetchWithTimeout = async (url: string, timeoutMs = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  try {
    const res = await fetchWithTimeout(`https://hub.docker.com/v2/repositories/${username}/?page_size=100`)
    if (!res.ok) {
      throw new Error(`Docker Hub returned status: ${res.status}`)
    }
    const data = await res.json()
    let repositories: any[] = []
    let pullCount = 0;
    let starCount = 0;

    if (data && Array.isArray(data.results)) {
      repositories = data.results.map((repo: any) => {
        const date = new Date(repo.last_updated)
        const lastUpdated = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
        
        pullCount += repo.pull_count || 0
        starCount += repo.star_count || 0

        let tags = ['Docker', 'Image']
        if (repo.categories && Array.isArray(repo.categories)) {
          tags = repo.categories.map((c: any) => c.name)
        }
        if (tags.length === 0) tags = ['Docker', 'Image']

        return {
          title: repo.name,
          description: repo.description || 'Public Docker image hosted on Docker Hub.',
          url: `https://hub.docker.com/r/${username}/${repo.name}`,
          starCount: repo.star_count || 0,
          pullCount: repo.pull_count || 0,
          lastUpdated,
          tags,
          type: 'docker'
        }
      })
    }

    const profile = {
      pullCount,
      starCount,
      reposCount: repositories.length
    }

    return NextResponse.json({
      repositories,
      profile,
      username,
      link: `https://hub.docker.com/u/${username}`
    })
  } catch (error) {
    console.error('[Docker API] Error fetching Docker data, trying cache fallback:', error)
    const cached = getCachedData()
    if (cached) {
      return NextResponse.json({
        repositories: cached.repositories || [],
        profile: {
          pullCount: cached.pullCount || 0,
          starCount: cached.starCount || 0,
          reposCount: cached.reposCount || 0
        },
        username: cached.username || username,
        link: cached.link || `https://hub.docker.com/u/${username}`
      })
    }
    return NextResponse.json({
      repositories: [],
      profile: { pullCount: 0, starCount: 0, reposCount: 0 },
      username,
      link: `https://hub.docker.com/u/${username}`
    })
  }
}
