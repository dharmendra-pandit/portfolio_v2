import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getCachedData() {
  try {
    const cachePath = path.join(process.cwd(), 'src/data/stats-cache.json');
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      return data.code360;
    }
  } catch (err) {
    console.error('Error reading Code360 cache:', err);
  }
  return null;
}

export async function GET() {
  const uuid = process.env.CODE360_UUID || 'panditbth';
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://api.codingninjas.com/api/v3/public_section/profile/user_details?uuid=${uuid}`, {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(id);
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
    console.error('Code360 API error, trying cache fallback:', error);
    const cached = getCachedData();
    if (cached) {
      return NextResponse.json({
        solved: cached.solved,
        rating: cached.rating,
        link: `https://www.naukri.com/code360/profile/${uuid}`,
      });
    }
    return NextResponse.json({
      solved: '19',
      rating: 'Scholar',
      link: `https://www.naukri.com/code360/profile/${uuid}`,
    });
  }
}
