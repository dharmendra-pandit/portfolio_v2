import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getCachedData() {
  try {
    const cachePath = path.join(process.cwd(), 'src/data/stats-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return data.gfg;
    }
  } catch (err) {
    console.error('Error reading GFG cache:', err);
  }
  return null;
}

export async function GET() {
  const username = process.env.GFG_USERNAME || 'iampanditbth';
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://www.geeksforgeeks.org/profile/${username}/`, {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(id);
    if (!res.ok) {
      throw new Error(`Failed to fetch GFG profile, status: ${res.status}`);
    }
    
    const html = await res.text();
    
    const solvedMatch = html.match(/\\?"total_problems_solved\\?":(\d+)/) || html.match(/"total_problems_solved":(\d+)/);
    const scoreMatch = html.match(/\\?"score\\?":(\d+)/) || html.match(/"score":(\d+)/);
    const rankMatch = html.match(/\\?"pod_global_rank\\?":(\d+)/) || html.match(/"pod_global_rank":(\d+)/);
    
    let solved = '52';
    let rating = 'Top 5%';
    
    if (solvedMatch) {
      solved = solvedMatch[1];
    }
    if (rankMatch && rankMatch[1] !== '0') {
      rating = `Rank ${rankMatch[1]}`;
    } else if (scoreMatch) {
      rating = `Score ${scoreMatch[1]}`;
    }
    
    return NextResponse.json({
      solved,
      rating,
      link: `https://www.geeksforgeeks.org/profile/${username}/`,
    });
  } catch (error) {
    console.error('GFG API error, trying cache fallback:', error);
    const cached = getCachedData();
    if (cached) {
      return NextResponse.json({
        solved: cached.solved,
        rating: cached.rating,
        link: `https://www.geeksforgeeks.org/profile/${username}/`,
      });
    }
    return NextResponse.json({
      solved: '52',
      rating: 'Top 5%',
      link: `https://www.geeksforgeeks.org/profile/${username}/`,
    });
  }
}
