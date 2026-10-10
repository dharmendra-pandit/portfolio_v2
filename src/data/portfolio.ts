// Single source of truth for portfolio content. The page sections render it and
// the AI assistant (/api/chat) answers from it, so the two can never drift apart.

export const PROFILE = {
  name: 'Dharmendra Pandit',
  role: 'Software Engineer',
  focus: ['AI/ML systems', 'backend APIs', 'DevOps & cloud', 'RAG pipelines'],
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
  "I'm an aspiring software engineer and Computer Science undergraduate at JECRC University, driven by a passion for building intelligent systems and robust applications. My work spans backend development, Generative AI, Python, DevOps and algorithmic problem solving.",
  "What excites me most is bridging the gap between AI models and real-world products. Whether I'm designing REST architectures or building RAG pipelines on large language models, the goal stays the same: impactful, scalable and efficient software.",
]

export const SERVICES = [
  {
    id: 'backend',
    title: 'Backend & APIs',
    desc: 'Scalable REST services and microservices with Python, FastAPI and Node.js.',
  },
  {
    id: 'genai',
    title: 'Generative AI',
    desc: 'LLM-powered apps, RAG pipelines and model integrations that ship to production.',
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    desc: 'Containerised deploys, CI/CD pipelines and AWS infrastructure.',
  },
] as const

export const SKILL_CATEGORIES = [
  {
    id: 'ai-ml',
    title: 'AI & ML',
    skills: ['Machine Learning', 'Deep Learning', 'NLP & LLMs', 'Computer Vision', 'Hugging Face', 'Prompt Engineering', 'RAG Systems', 'LangChain', 'TensorFlow', 'PyTorch'],
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'Microservices', 'System Design', 'Data Pipelines'],
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'AWS', 'Linux', 'Terraform'],
  },
  {
    id: 'databases',
    title: 'Databases & Storage',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Vector DBs (FAISS)'],
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    skills: ['Problem Solving', 'Algorithm Design', 'Time/Space Complexity', 'Graph Theory', 'Dynamic Programming'],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++'],
  },
  {
    id: 'tools',
    title: 'Tools & Ecosystem',
    skills: ['Git & GitHub', 'Vercel', 'Postman', 'VS Code', 'Jupyter'],
  },
] as const

export const TIMELINE = [
  {
    id: 'brandthink',
    date: 'Aug 2026 — Present',
    title: 'Full Stack Engineer',
    org: 'BrandThink, Jamshedpur',
    description: 'Building and shipping product features end to end, across both the frontend and the backend.',
  },
  {
    id: 'hostro',
    date: 'Aug 2025 — Oct 2025',
    title: 'Full Stack Engineer Intern',
    org: 'Hostro Ventures Pvt. Ltd., Jaipur',
    description: 'A three-month full-stack internship, contributing to web application features across the stack.',
  },
  {
    id: 'btech',
    date: 'Jul 2023 — Jul 2027',
    title: 'B.Tech in Computer Science Engineering',
    org: 'JECRC University, Jaipur',
    description:
      'Pursuing a bachelor’s degree with a CGPA of 8.17, focusing on core computer-science fundamentals, DevOps, and AI & ML.',
  },
  {
    id: 'ai-apps',
    date: 'Achievement',
    title: 'AI-Powered Applications',
    org: 'AI & ML Integration',
    description: 'Built and deployed AI-powered applications integrating machine learning and RAG-based systems.',
  },
  {
    id: 'genai',
    date: 'Achievement',
    title: 'Generative AI Integration',
    org: 'Tech Stack Mastery',
    description:
      'Hands-on experience with Generative AI tooling including LangChain, FAISS, Hugging Face and LLM API integration.',
  },
  {
    id: 'cloud',
    date: 'Achievement',
    title: 'Cloud Deployment',
    org: 'DevOps & Infrastructure',
    description: 'Shipped to cloud platforms including AWS (EC2, S3, DynamoDB), Vercel and Render.',
  },
] as const

export const CERTIFICATIONS = [
  { title: 'AI & ML', issuer: 'freeCodeCamp', date: '2026' },
  { title: 'DevOps', issuer: 'Kunal Kushwaha', date: '2026' },
  { title: 'GenAI', issuer: 'Inceptiondb', date: '2026' },
  { title: 'MERN Stack', issuer: 'Udemy', date: '2025' },
  { title: 'Python', issuer: 'Code and Debug', date: '2026' },
  { title: 'Java', issuer: 'Code Hunt', date: '2026' },
] as const
