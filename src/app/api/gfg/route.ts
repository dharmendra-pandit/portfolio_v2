import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const username = process.env.GFG_USERNAME || 'iampanditbth';
  try {
    const res = await fetch(`https://www.geeksforgeeks.org/profile/${username}/`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch GFG profile, status: ${res.status}`);
    }
    
    const html = await res.text();
    
    const solvedMatch = html.match(/\\?"total_problems_solved\\?":(\d+)/);
    const scoreMatch = html.match(/\\?"score\\?":(\d+)/);
    const rankMatch = html.match(/\\?"pod_global_rank\\?":(\d+)/);
    
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
    console.error('GFG API error:', error);
    return NextResponse.json({
      solved: '52',
      rating: 'Top 5%',
      link: `https://www.geeksforgeeks.org/profile/${username}/`,
    });
  }
}
