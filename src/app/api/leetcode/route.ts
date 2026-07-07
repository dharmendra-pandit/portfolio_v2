import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

const FALLBACK_PROFILE = {
  totalSolved: 58,
  ranking: 2391521,
};

export async function GET() {
  const username = process.env.LEETCODE_USERNAME || 'dpbth';

  const fetchWithTimeout = async (url: string, timeoutMs = 4000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 3600 }
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  };

  try {
    const profilePromise = fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${username}/profile`);
    const calendarPromise = fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);

    const [profileRes, calendarRes] = await Promise.all([profilePromise, calendarPromise]);

    if (!profileRes.ok || !calendarRes.ok) {
      throw new Error('Failed to fetch from LeetCode API');
    }

    const profileData = await profileRes.json();
    const calendarData = await calendarRes.json();

    const totalSolved = profileData.totalSolved || FALLBACK_PROFILE.totalSolved;
    const ranking = profileData.ranking || FALLBACK_PROFILE.ranking;

    // Process calendar
    const calendar = calendarData.submissionCalendar ? JSON.parse(calendarData.submissionCalendar) : {};
    const now = new Date();
    const months: { name: string; year: number; month: number; solved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        solved: 0,
      });
    }

    Object.entries(calendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      const m = months.find((m) => m.year === date.getFullYear() && m.month === date.getMonth());
      if (m) {
        m.solved += Number(count);
      }
    });

    const activityData = months.map((m) => ({ name: m.name, solved: m.solved }));

    return NextResponse.json({
      totalSolved: totalSolved.toString(),
      ranking: ranking ? `Rank ${ranking}` : 'Unranked',
      activityData,
      link: `https://leetcode.com/${username}/`,
    });
  } catch (error) {
    console.error('LeetCode API proxy error, returning fallback:', error);

    // Generate fallback activity data (0 solved for last 7 months)
    const now = new Date();
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      activityData.push({
        name: d.toLocaleString('default', { month: 'short' }),
        solved: 0,
      });
    }

    return NextResponse.json({
      totalSolved: FALLBACK_PROFILE.totalSolved.toString(),
      ranking: `Rank ${FALLBACK_PROFILE.ranking}`,
      activityData,
      link: `https://leetcode.com/${username}/`,
    });
  }
}
