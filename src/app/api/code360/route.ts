import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const uuid = process.env.CODE360_UUID || 'panditbth';
  try {
    const res = await fetch(`https://api.codingninjas.com/api/v3/public_section/profile/user_details?uuid=${uuid}`, {
      next: { revalidate: 3600 }
    });
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
      link: `https://www.naukri.com/code360/profile/${uuid}`,
    });
  } catch (error) {
    console.error('Code360 API error:', error);
    return NextResponse.json({
      solved: '19',
      rating: 'Scholar',
      link: `https://www.naukri.com/code360/profile/${uuid}`,
    });
  }
}
