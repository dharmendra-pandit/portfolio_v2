const fs = require('fs');
const path = require('path');

// Manually load .env.local if it exists
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    console.log('[Sync] Loading variables from .env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const CACHE_FILE_PATH = path.join(__dirname, '../src/data/stats-cache.json');

// Load current cache
let cache = {};
if (fs.existsSync(CACHE_FILE_PATH)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf8'));
    console.log('[Sync] Existing cache loaded successfully.');
  } catch (err) {
    console.error('[Sync] Error parsing existing cache, starting fresh:', err.message);
  }
}

// Timeout helper for fetches
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
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
}

// 1. LeetCode Sync
async function syncLeetCode() {
  const username = process.env.LEETCODE_USERNAME || 'dpbth';
  console.log(`[Sync] Fetching LeetCode for ${username}...`);
  try {
    const profileRes = await fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${username}/profile`);
    const calendarRes = await fetchWithTimeout(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);

    if (!profileRes.ok || !calendarRes.ok) {
      throw new Error(`LeetCode API returned status: Profile (${profileRes.status}), Calendar (${calendarRes.status})`);
    }

    const profileData = await profileRes.json();
    const calendarData = await calendarRes.json();

    const totalSolved = (profileData.totalSolved || 58).toString();
    const ranking = profileData.ranking ? `Rank ${profileData.ranking}` : 'Unranked';

    // Process calendar
    const calendar = calendarData.submissionCalendar ? JSON.parse(calendarData.submissionCalendar) : {};
    const now = new Date();
    const months = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        solved: 0
      });
    }

    Object.entries(calendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      const m = months.find(m => m.year === date.getFullYear() && m.month === date.getMonth());
      if (m) {
        m.solved += Number(count);
      }
    });

    const activityData = months.map(m => ({ name: m.name, solved: m.solved }));

    cache.leetcode = {
      totalSolved,
      ranking,
      activityData
    };
    console.log('[Sync] LeetCode synced successfully!');
  } catch (err) {
    console.error('[Sync] LeetCode sync failed, keeping cache:', err.message);
  }
}

// 2. Code360 Sync
async function syncCode360() {
  const uuid = process.env.CODE360_UUID || 'panditbth';
  console.log(`[Sync] Fetching Code360 for ${uuid}...`);
  try {
    const res = await fetchWithTimeout(`https://api.codingninjas.com/api/v3/public_section/profile/user_details?uuid=${uuid}`);
    if (!res.ok) {
      throw new Error(`Code360 API returned status: ${res.status}`);
    }
    const data = await res.json();
    const solved = (data?.data?.dsa_domain_data?.problem_count_data?.total_count || 
                    data?.data?.user_details?.practice_problems_count || 19).toString();
    const rating = data?.data?.user_level_name || 'Scholar';

    cache.code360 = {
      solved,
      rating
    };
    console.log('[Sync] Code360 synced successfully!');
  } catch (err) {
    console.error('[Sync] Code360 sync failed, keeping cache:', err.message);
  }
}

// 3. GeeksforGeeks Sync
async function syncGFG() {
  const username = process.env.GFG_USERNAME || 'iampanditbth';
  console.log(`[Sync] Fetching GFG for ${username}...`);
  try {
    const res = await fetchWithTimeout(`https://www.geeksforgeeks.org/profile/${username}/`);
    if (!res.ok) {
      throw new Error(`GFG Profile returned status: ${res.status}`);
    }
    const html = await res.text();
    const solvedMatch = html.match(/\\?"total_problems_solved\\?":(\d+)/) || html.match(/"total_problems_solved":(\d+)/);
    const scoreMatch = html.match(/\\?"score\\?":(\d+)/) || html.match(/"score":(\d+)/);
    const rankMatch = html.match(/\\?"pod_global_rank\\?":(\d+)/) || html.match(/"pod_global_rank":(\d+)/);

    let solved = cache.gfg?.solved || '52';
    let rating = cache.gfg?.rating || 'Top 5%';

    if (solvedMatch) {
      solved = solvedMatch[1];
    }
    if (rankMatch && rankMatch[1] !== '0') {
      rating = `Rank ${rankMatch[1]}`;
    } else if (scoreMatch) {
      rating = `Score ${scoreMatch[1]}`;
    }

    cache.gfg = {
      solved,
      rating
    };
    console.log('[Sync] GFG synced successfully!');
  } catch (err) {
    console.error('[Sync] GFG sync failed, keeping cache:', err.message);
  }
}

// 4. GitHub Sync
async function syncGitHub() {
  const username = process.env.GITHUB_USERNAME || 'dharmendra-pandit';
  const token = process.env.GITHUB_TOKEN;
  console.log(`[Sync] Fetching GitHub for ${username}...`);
  try {
    const headers = { 'User-Agent': 'Node-Sync-Script' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Profile details
    const profileRes = await fetchWithTimeout(`https://api.github.com/users/${username}`, { headers });
    if (!profileRes.ok) {
      throw new Error(`GitHub Profile returned status: ${profileRes.status}`);
    }
    const profileData = await profileRes.json();
    const publicRepos = (profileData.public_repos || 0).toString();

    // Repos for activity
    const reposRes = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    let projectActivityData = [];
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      const quarterMap = new Map();
      if (Array.isArray(reposData)) {
        reposData.forEach(repo => {
          if (repo.created_at && !repo.fork) {
            const date = new Date(repo.created_at);
            const year = date.getFullYear();
            const q = Math.floor(date.getMonth() / 3) + 1;
            const key = `Q${q} '${year.toString().slice(2)}`;
            if (!quarterMap.has(key)) {
              quarterMap.set(key, { year, q, name: key, projects: 0 });
            }
            quarterMap.get(key).projects += 1;
          }
        });
      }
      projectActivityData = Array.from(quarterMap.values())
        .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.q - b.q))
        .map(q => ({ name: q.name, projects: q.projects }));
    }

    if (projectActivityData.length === 0) {
      projectActivityData = cache.github?.projectActivityData || [
        { name: 'Q1', projects: 0 },
        { name: 'Q2', projects: 0 },
        { name: 'Q3', projects: 0 },
        { name: 'Q4', projects: 0 }
      ];
    }

    // Fetch pinned repositories or fall back to standard sorted public repos
    let projects = [];
    if (token) {
      try {
        const query = JSON.stringify({
          query: `
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
          `,
          variables: { username }
        });
        const graphqlRes = await fetchWithTimeout('https://api.github.com/graphql', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: query
        });
        if (graphqlRes.ok) {
          const gqlData = await graphqlRes.json();
          projects = gqlData?.data?.user?.pinnedItems?.nodes || [];
        }
      } catch (gqlErr) {
        console.error('[Sync] GitHub GraphQL query failed:', gqlErr.message);
      }
    }

    // Fallback to fetching top repos if no token or no pinned repos found
    if (projects.length === 0) {
      console.log('[Sync] Fetching top public repositories as pinned projects fallback...');
      const fallbackReposRes = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers });
      if (fallbackReposRes.ok) {
        const fallbackReposData = await fallbackReposRes.json();
        if (Array.isArray(fallbackReposData)) {
          projects = fallbackReposData.map(repo => ({
            name: repo.name,
            description: repo.description || 'Public GitHub project repository.',
            url: repo.html_url,
            homepageUrl: repo.homepage || null,
            stargazerCount: repo.stargazers_count || 0,
            forkCount: repo.forks_count || 0,
            updatedAt: repo.updated_at,
            primaryLanguage: repo.language ? { name: repo.language, color: '#888888' } : null,
            languages: { nodes: repo.language ? [{ name: repo.language, color: '#888888' }] : [] }
          }));
        }
      }
    }

    cache.github = {
      username,
      publicRepos,
      projectActivityData,
      projects: projects.length > 0 ? projects : (cache.github?.projects || [])
    };
    console.log('[Sync] GitHub synced successfully!');
  } catch (err) {
    console.error('[Sync] GitHub sync failed, keeping cache:', err.message);
  }
}

// 5. Kaggle Sync
async function syncKaggle() {
  const username = process.env.KAGGLE_USERNAME || 'dharmendrapandit12';
  const apiKey = process.env.KAGGLE_KEY;
  console.log(`[Sync] Fetching Kaggle for ${username}...`);
  try {
    let rawDatasets = [];
    let datasetsFetched = false;
    const authHeaders = {};

    if (apiKey) {
      const auth = Buffer.from(`${username}:${apiKey}`).toString('base64');
      authHeaders['Authorization'] = `Basic ${auth}`;
    }

    // Fetch datasets
    try {
      const res = await fetchWithTimeout(`https://www.kaggle.com/api/v1/datasets/list?user=${username}`, {
        headers: { ...authHeaders, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        rawDatasets = await res.json();
        datasetsFetched = true;
      }
    } catch (err) {
      console.warn('[Sync] Authenticated Kaggle datasets fetch failed:', err.message);
    }

    // Try unauthenticated datasets fetch if authenticated failed
    if (!datasetsFetched) {
      try {
        const res = await fetchWithTimeout(`https://www.kaggle.com/api/v1/datasets/list?user=${username}`);
        if (res.ok) {
          rawDatasets = await res.json();
          datasetsFetched = true;
        }
      } catch (err) {
        console.warn('[Sync] Public Kaggle datasets fetch failed:', err.message);
      }
    }

    let datasets = [];
    if (datasetsFetched && Array.isArray(rawDatasets)) {
      datasets = rawDatasets.map(dataset => {
        const date = new Date(dataset.lastUpdated);
        const lastUpdated = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        });

        let description = dataset.subtitle || dataset.description || 'Data science dataset hosted on Kaggle.';
        let tags = ['Dataset', 'CSV'];

        if (dataset.ref.toLowerCase().includes('breast-cancer')) {
          description = 'Comprehensive CSV dataset containing clinical measurements and features optimized for breast cancer prediction and classification models.';
          tags = ['Classification', 'Healthcare', 'CSV', 'Tabular'];
        } else if (dataset.ref.toLowerCase().includes('battery')) {
          description = 'Synthetic dataset with realistic battery degradation patterns (voltage, temperature, cycle count) for predicting cell state-of-health.';
          tags = ['Battery Health', 'Data Generation', 'Time Series', 'Regression'];
        }

        return {
          title: dataset.title,
          description,
          datasetName: dataset.title,
          tags,
          lastUpdated,
          notebookUrl: dataset.url || `https://www.kaggle.com/datasets/${dataset.ref}`,
          kaggleUrl: dataset.url || `https://www.kaggle.com/datasets/${dataset.ref}`,
          type: 'dataset'
        };
      });
    }

    // Keep cached datasets if fetch failed
    if (datasets.length === 0) {
      datasets = cache.kaggle?.datasets || [];
    }

    // Dynamically list kernels if API key works
    let notebooks = cache.kaggle?.notebooks || [];
    if (apiKey) {
      try {
        const auth = Buffer.from(`${username}:${apiKey}`).toString('base64');
        const res = await fetchWithTimeout(`https://www.kaggle.com/api/v1/kernels/list?user=${username}&group=PROFILE`, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const rawKernels = await res.json();
          if (Array.isArray(rawKernels) && rawKernels.length > 0) {
            notebooks = rawKernels.map(k => {
              const date = new Date(k.lastRunTime);
              const lastUpdated = date.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              });
              return {
                title: k.title,
                description: k.title + ' notebook kernel on Kaggle.',
                datasetName: k.ref.split('/')[1] || 'Kaggle Notebook',
                tags: ['Python', 'Notebook', k.language || 'Code'],
                lastUpdated,
                notebookUrl: `https://www.kaggle.com/code/${k.ref}`,
                kaggleUrl: `https://www.kaggle.com/code/${k.ref}`,
                type: 'notebook'
              };
            });
            console.log('[Sync] Kernels fetched dynamically from Kaggle API!');
          }
        }
      } catch (err) {
        console.warn('[Sync] Kaggle kernels list failed (as expected):', err.message);
      }
    }

    // Resolve update dates for the notebooks from the dynamic datasets if notebooks are static
    const laptopDb = datasets.find(d => d.notebookUrl.includes('laptop-battery-health-dataset'));
    const cancerDb = datasets.find(d => d.notebookUrl.includes('breast-cancer-dataset'));

    notebooks = notebooks.map(nb => {
      let lastUpdated = nb.lastUpdated || 'Jul 2026';
      if (nb.notebookUrl.includes('laptop-battery-health') && laptopDb) {
        lastUpdated = laptopDb.lastUpdated;
      } else if (nb.notebookUrl.includes('breast-cancer') && cancerDb) {
        lastUpdated = cancerDb.lastUpdated;
      }
      return { ...nb, lastUpdated };
    });

    const profile = {
      tier: cache.kaggle?.profile?.tier || 'Novice',
      datasetCount: datasets.length,
      notebookCount: notebooks.length,
      followers: cache.kaggle?.profile?.followers || 0
    };

    cache.kaggle = {
      username,
      link: `https://www.kaggle.com/${username}/`,
      profile,
      datasets,
      notebooks
    };
    console.log('[Sync] Kaggle synced successfully!');
  } catch (err) {
    console.error('[Sync] Kaggle sync failed, keeping cache:', err.message);
  }
}

// Main execution flow
async function main() {
  console.log('[Sync] Starting dynamic statistics synchronization...');
  
  await syncLeetCode();
  await syncCode360();
  await syncGFG();
  await syncGitHub();
  await syncKaggle();

  // Ensure data folder exists
  const dir = path.dirname(CACHE_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write new cache
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`[Sync] Finished synchronizing stats cache! Saved to ${CACHE_FILE_PATH}`);
}

main();
