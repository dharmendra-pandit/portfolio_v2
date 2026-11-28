// Single source of truth for portfolio content. The page sections render it and
// the AI assistant (/api/chat) answers from it, so the two can never drift apart.

export const PROFILE = {
  name: 'Dharmendra Pandit',
  role: 'Software Engineer',
  headline: 'Software engineer building backend services, AI-enabled applications and the infrastructure that runs them.',
  focus: 'Backend systems, applied AI, DevOps and cloud',
  location: 'Jaipur, Rajasthan, India',
  email: 'dharmendra193728@gmail.com',
  phone: '+91 62042 98947',
  resume: '/Dharmendra_Pandit_Software_Engineer_Resume.pdf',
  links: {
    github: 'https://github.com/dharmendra-pandit',
    linkedin: 'https://linkedin.com/in/dharmendra-pandit1',
    x: 'https://x.com/Dharmendra62042',
    leetcode: 'https://leetcode.com/dpbth/',
    kaggle: 'https://www.kaggle.com/dharmendrapandit12',
    dockerhub: 'https://hub.docker.com/u/iampanditji',
  },
  availability: 'Open to full-time engineering roles, AI/ML systems work and freelance consultation.',
  cgpa: 8.17,
}

export const ABOUT = [
  'I design and build production software across the stack, with a particular focus on backend services, applied machine learning and cloud deployment. My work ranges from REST and microservice architectures to retrieval-augmented generation (RAG) pipelines built on large language models.',
  'Alongside my role as a Full Stack Engineer at BrandThink, I am completing a Bachelor of Technology in Computer Science at JECRC University. I place particular weight on sound fundamentals in data structures, algorithms and system design, and on software that remains reliable, maintainable and efficient in production.',
]

export const SERVICES = [
  {
    id: 'backend',
    title: 'Backend engineering',
    desc: 'REST APIs and microservices in Python (FastAPI) and Node.js (Express), backed by PostgreSQL, MongoDB and Redis.',
  },
  {
    id: 'genai',
    title: 'Applied AI',
    desc: 'LLM-based applications and RAG pipelines built with LangChain, FAISS and Hugging Face, integrated into production services.',
  },
  {
    id: 'devops',
    title: 'DevOps and cloud',
    desc: 'Containerised deployments with Docker and Kubernetes, CI/CD with GitHub Actions, and hosting on AWS (EC2, S3, DynamoDB), Vercel and Render.',
  },
] as const

export const SKILL_CATEGORIES = [
  {
    id: 'languages',
    title: 'Programming languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++'],
  },
  {
    id: 'backend',
    title: 'Backend engineering',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'Microservices', 'System Design', 'Data Pipelines'],
  },
  {
    id: 'ai-ml',
    title: 'AI and machine learning',
    skills: ['Machine Learning', 'Deep Learning', 'NLP & LLMs', 'Computer Vision', 'Hugging Face', 'Prompt Engineering', 'RAG Systems', 'LangChain', 'TensorFlow', 'PyTorch'],
  },
  {
    id: 'devops',
    title: 'DevOps and cloud',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'AWS', 'Linux', 'Terraform'],
  },
  {
    id: 'databases',
    title: 'Databases and storage',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Vector databases (FAISS)'],
  },
  {
    id: 'dsa',
    title: 'Algorithms',
    skills: ['Problem Solving', 'Algorithm Design', 'Time/Space Complexity', 'Graph Theory', 'Dynamic Programming'],
  },
  {
    id: 'tools',
    title: 'Tools',
    skills: ['Git & GitHub', 'Vercel', 'Postman', 'VS Code', 'Jupyter'],
  },
] as const

// Dates are 'YYYY-MM'; `end: null` means the role is current. Durations are computed from them.
export const EXPERIENCE = [
  {
    id: 'brandthink',
    start: '2026-08',
    end: null,
    title: 'Full Stack Engineer',
    org: 'BrandThink',
    monogram: 'BT',
    type: 'Full-time',
    mode: 'On-site',
    place: 'Jamshedpur, Jharkhand, India',
    description: 'Designs, builds and ships product features end to end, across both the frontend and the backend.',
    skills: ['Full-Stack Development', 'DevOps'],
  },
  {
    id: 'hostro',
    start: '2025-06',
    end: '2025-12',
    title: 'Full Stack Engineer',
    org: 'Hostro Ventures Private Limited',
    monogram: 'HV',
    type: 'Full-time',
    mode: 'On-site',
    place: 'Jaipur, Rajasthan, India',
    description: 'Developed and maintained web application features across the frontend and the backend.',
    skills: ['Full-Stack Development', 'DevOps'],
  },
] as const

export const EDUCATION = [
  {
    id: 'btech',
    start: '2023-07',
    end: '2027-07',
    title: 'Bachelor of Technology (B.Tech), Computer Science',
    short: 'B.Tech, Computer Science',
    org: 'JECRC University',
    monogram: 'JU',
    type: 'Undergraduate degree',
    mode: null,
    place: 'Jaipur, Rajasthan, India',
    description:
      'CGPA 8.17 / 10. Coursework in core computer-science fundamentals, with electives in DevOps and in artificial intelligence and machine learning.',
    skills: ['Engineering', 'Web Development'],
  },
] as const

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 'YYYY-MM' → 'Aug 2026' */
export const formatMonth = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

/** 'Aug 2026 – Present' */
export const formatRange = (start: string, end: string | null) =>
  `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`

/** Inclusive month count, as LinkedIn shows it: Jun–Dec 2025 → '7 mos'. */
export const formatDuration = (start: string, end: string | null, now = new Date()) => {
  const [sy, sm] = start.split('-').map(Number)
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
  const total = (ey - sy) * 12 + (em - sm) + 1
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts = [years && `${years} yr${years > 1 ? 's' : ''}`, months && `${months} mo${months > 1 ? 's' : ''}`]
  return parts.filter(Boolean).join(' ')
}

export const CERTIFICATIONS = [
  { title: 'AI and Machine Learning', issuer: 'freeCodeCamp', date: '2026' },
  { title: 'DevOps', issuer: 'Kunal Kushwaha', date: '2026' },
  { title: 'Generative AI', issuer: 'Inceptiondb', date: '2026' },
  { title: 'Python', issuer: 'Code and Debug', date: '2026' },
  { title: 'Java', issuer: 'Code Hunt', date: '2026' },
  { title: 'MERN Stack', issuer: 'Udemy', date: '2025' },
] as const
