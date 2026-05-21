import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const res = await fetch('https://www.geeksforgeeks.org/profile/iampanditbth/', { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch GFG profile, status: ${res.status}`);
    }
    
    const html = await res.text();
    
    const solvedMatch = html.match(/\\?"total_problems_solved\\?":(\d+)/);
    const scoreMatch = html.match(/\\?"score\\?":(\d+)/);
    const rankMatch = html.match(/\\?"pod_global_rank\\?":(\d+)/);
    
    let solved = '250+';
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
    });
  } catch (error) {
    console.error('GFG API error:', error);
    return NextResponse.json({ solved: '250+', rating: 'Top 5%' }, { status: 500 });
  }
}
