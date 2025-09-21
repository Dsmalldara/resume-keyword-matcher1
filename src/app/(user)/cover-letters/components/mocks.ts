const mockCoverLetters = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    dateGenerated: "2024-03-15",
    status: "Draft",
    resumeUsed: "John_Doe_Resume.pdf",
    preview:
      "Dear Hiring Manager, I am writing to express my strong interest in the Senior Frontend Developer position at TechCorp Inc. With over 5 years of experience in React and TypeScript development...",
    fullText: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at TechCorp Inc. With over 5 years of experience in React and TypeScript development, I am excited about the opportunity to contribute to your innovative team.

In my current role at Digital Solutions, I have successfully led the development of multiple high-traffic web applications, serving over 100,000 daily active users. My expertise in modern frontend technologies, including React, TypeScript, and advanced CSS frameworks, aligns perfectly with the requirements outlined in your job posting.

Key accomplishments that make me an ideal candidate:
• Architected and delivered 3 major product features that increased user engagement by 40%
• Led a team of 4 developers in migrating legacy codebase to modern React architecture
• Implemented automated testing strategies that reduced bug reports by 60%
• Collaborated closely with UX designers to create pixel-perfect, responsive interfaces

I am particularly drawn to TechCorp's commitment to innovation and user-centric design. Your recent product launches demonstrate the kind of forward-thinking approach I thrive in, and I would love to contribute my technical expertise and leadership experience to your continued success.

I would welcome the opportunity to discuss how my background in frontend development and passion for creating exceptional user experiences can benefit your team. Thank you for considering my application.

Sincerely,
John Doe`,
  },
  {
    id: "2",
    jobTitle: "Digital Marketing Manager",
    company: "Growth Labs",
    dateGenerated: "2024-03-14",
    status: "Finalized",
    resumeUsed: "Marketing_Resume_2024.pdf",
    preview:
      "Dear Growth Labs Team, I am thrilled to apply for the Digital Marketing Manager position at your innovative company. My 4+ years of experience in digital marketing campaigns and data-driven strategies...",
    fullText: `Dear Growth Labs Team,

I am thrilled to apply for the Digital Marketing Manager position at your innovative company. My 4+ years of experience in digital marketing campaigns and data-driven strategies make me an ideal candidate to help drive Growth Labs' continued expansion.

Throughout my career, I have consistently delivered measurable results through strategic campaign management and creative problem-solving. At my current company, I've managed marketing budgets exceeding $500K annually and have achieved an average ROI of 400% across all digital channels.

My relevant experience includes:
• Developing and executing multi-channel marketing campaigns that increased lead generation by 250%
• Managing social media presence across 5 platforms, growing follower base by 180%
• Implementing SEO strategies that improved organic traffic by 300% year-over-year
• Creating content marketing initiatives that established thought leadership in our industry

What excites me most about Growth Labs is your data-driven approach to marketing and your commitment to helping businesses scale efficiently. I believe my analytical mindset and creative approach to campaign optimization would be valuable assets to your team.

I would love to discuss how my experience in performance marketing and growth hacking can contribute to Growth Labs' mission of empowering businesses to achieve sustainable growth.

Thank you for your time and consideration.

Best regards,
Sarah Johnson`,
  },
  {
    id: "3",
    jobTitle: "Product Manager",
    company: "Innovation Co",
    dateGenerated: "2024-03-13",
    status: "Draft",
    resumeUsed: "John_Doe_Resume.pdf",
    preview:
      "Dear Innovation Co Hiring Team, I am excited to submit my application for the Product Manager role. My background in both technical development and user experience design provides...",
    fullText: `Dear Innovation Co Hiring Team,

I am excited to submit my application for the Product Manager role. My background in both technical development and user experience design provides a unique perspective that I believe would be valuable to your product team.

Having worked as a frontend developer for several years, I understand the technical challenges and opportunities that come with building great products. This technical foundation, combined with my passion for user-centered design, has naturally evolved into a strong interest in product management.

Relevant experience and skills:
• Collaborated with product managers on feature planning and technical feasibility assessments
• Conducted user research and usability testing for multiple product iterations
• Led cross-functional teams in delivering complex technical projects on time
• Analyzed user behavior data to inform product decisions and improvements

I am particularly impressed by Innovation Co's commitment to solving real-world problems through technology. Your recent product launch in the sustainability space aligns perfectly with my personal values and professional interests.

I would welcome the opportunity to discuss how my technical background and product intuition can contribute to your team's success.

Thank you for considering my application.

Sincerely,
John Doe`,
  },
];

const mockAnalyses = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    resumeName: "John_Doe_Resume.pdf",
    matchScore: 85,
  },
  {
    id: "2",
    jobTitle: "Digital Marketing Manager",
    company: "Growth Labs",
    resumeName: "Marketing_Resume_2024.pdf",
    matchScore: 72,
  },
  {
    id: "3",
    jobTitle: "DevOps Engineer",
    company: "CloudFirst Solutions",
    resumeName: "Senior_Developer_Resume.docx",
    matchScore: 45,
  },
];

// Mock data
const mockResumes = [
  { id: 1, name: "John_Doe_Resume.pdf" },
  { id: 2, name: "Senior_Developer_Resume.docx" },
  { id: 3, name: "Marketing_Resume_2024.pdf" },
];

export { mockCoverLetters, mockAnalyses, mockResumes };
