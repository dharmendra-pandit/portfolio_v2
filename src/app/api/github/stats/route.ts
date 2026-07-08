import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getCachedData() {
  try {
    const cachePath = path.join(process.cwd(), 'src/data/stats-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return data.github;
    }
  } catch (err) {
    console.error('Error reading GitHub stats cache:', err);
  }
  return null;
}

export async function GET() {
  const username = process.env.GITHUB_USERNAME || 'dharmendra-pandit';
  try {
    const token = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Node-Next-App'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('[GitHub Stats API] GITHUB_TOKEN not found in environment variables. Making unauthenticated request.');
    }

    const fetchWithTimeout = async (url: string, options: any = {}, timeoutMs = 3000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
      } catch (err) {
        clearTimeout(id);
        throw err;
      }
    };

    // Fetch user profile stats
    const profilePromise = fetchWithTimeout(`https://api.github.com/users/${username}`, {
      headers,
      cache: 'no-store'
    });

    // Fetch repositories
    const reposPromise = fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers,
      cache: 'no-store'
    });

    const [profileRes, reposRes] = await Promise.all([profilePromise, reposPromise]);

    if (!profileRes.ok) {
      throw new Error(`Failed to fetch GitHub profile, status: ${profileRes.status}`);
    }
    if (!reposRes.ok) {
      throw new Error(`Failed to fetch GitHub repos, status: ${reposRes.status}`);
    }

    const profileData = await profileRes.json();
    const reposData = await reposRes.json();

    const publicRepos = profileData.public_repos || 0;

    // Process repositories quarterly basis
    const quarterMap = new Map();
    if (Array.isArray(reposData)) {
      reposData.forEach((repo: any) => {
        if (repo.created_at && !repo.fork) {
          const date = new Date(repo.created_at);
          const year = date.getFullYear();
          const q = Math.floor(date.getMonth() / 3) + 1;
          const key = `Q${q} '${year.toString().slice(2)}`;

          if (!quarterMap.has(key)) {
            quarterMap.set(key, { year, q, name: key, projects: 0 });
          }
          const entry = quarterMap.get(key);
          entry.projects += 1;
        }
      });
    }

    const sortedQuarters = Array.from(quarterMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.q - b.q;
      })
      .map((q) => ({ name: q.name, projects: q.projects }));

    // Fallback if no quarters compiled
    const projectActivityData = sortedQuarters.length > 0 ? sortedQuarters : [
      { name: 'Q1', projects: 0 },
      { name: 'Q2', projects: 0 },
      { name: 'Q3', projects: 0 },
      { name: 'Q4', projects: 0 },
    ];

    return NextResponse.json({
      publicRepos: publicRepos.toString(),
      projectActivityData,
      username,
      link: `https://github.com/${username}`,
    });
  } catch (error: any) {
    console.error('GitHub Stats API error, trying cache fallback:', error);
    const cached = getCachedData();
    if (cached) {
      return NextResponse.json({
        publicRepos: cached.publicRepos,
        projectActivityData: cached.projectActivityData,
        username,
        link: `https://github.com/${username}`
      });
    }
    const usernameVal = process.env.GITHUB_USERNAME || 'dharmendra-pandit';
    return NextResponse.json(
      {
        error: 'Failed to fetch GitHub stats',
        publicRepos: '0',
        projectActivityData: [
          { name: 'Q1', projects: 0 },
          { name: 'Q2', projects: 0 },
          { name: 'Q3', projects: 0 },
          { name: 'Q4', projects: 0 },
        ],
        username: usernameVal,
        link: `https://github.com/${usernameVal}`,
      },
      { status: 500 }
    );
  }
}
