import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const res = await fetch('https://api.codingninjas.com/api/v3/public_section/profile/user_details?uuid=panditbth', { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch Code360 profile, status: ${res.status}`);
    }
    const data = await res.json();
    
    const solved = data?.data?.dsa_domain_data?.problem_count_data?.total_count || 
                   data?.data?.user_details?.practice_problems_count || 0;
    const levelName = data?.data?.user_level_name || 'Scholar';
    
    return NextResponse.json({
      solved: solved.toString(),
      rating: levelName,
    });
  } catch (error) {
    console.error('Code360 API error:', error);
    return NextResponse.json({ solved: '350+', rating: 'Level 4' }, { status: 500 });
  }
}
