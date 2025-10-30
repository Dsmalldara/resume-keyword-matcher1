import { AnalysisResult } from "./AnalysisTypes";

const mockResumes = [
  { id: 1, name: "John_Doe_Resume.pdf" },
  { id: 2, name: "Senior_Developer_Resume.docx" },
  { id: 3, name: "Marketing_Resume_2024.pdf" },
];

const mockAnalyses: AnalysisResult[] = [
  {
    id: 1,
    resumeName: "John_Doe_Resume.pdf",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    dateAnalyzed: "2024-03-15",
    matchScore: 85,
    status: "Strong",
    summary:
      "Resume strongly matches job requirements with solid React and TypeScript experience. Could benefit from more cloud platform mentions.",
    strengths: [
      "React",
      "TypeScript",
      "JavaScript",
      "CSS/SASS",
      "Git",
      "Agile Development",
    ],
    gaps: ["AWS", "Docker", "GraphQL", "Testing Frameworks", "CI/CD"],
    nextSteps:
      "Consider adding experience with AWS services and automated testing to strengthen your profile for cloud-native roles.",
  },
  {
    id: 2,
    resumeName: "Marketing_Resume_2024.pdf",
    jobTitle: "Digital Marketing Manager",
    company: "Growth Labs",
    dateAnalyzed: "2024-03-14",
    matchScore: 72,
    status: "Moderate",
    summary:
      "Good marketing foundation but lacks specific digital analytics and automation tool experience mentioned in job posting.",
    strengths: [
      "Content Marketing",
      "Social Media",
      "SEO",
      "Brand Management",
      "Campaign Strategy",
    ],
    gaps: [
      "Google Analytics 4",
      "Marketing Automation",
      "A/B Testing",
      "Conversion Optimization",
      "Paid Advertising",
    ],
    nextSteps:
      "Focus on gaining certifications in Google Analytics and marketing automation platforms like HubSpot or Marketo.",
  },
  {
    id: 3,
    resumeName: "Senior_Developer_Resume.docx",
    jobTitle: "DevOps Engineer",
    company: "CloudFirst Solutions",
    dateAnalyzed: "2024-03-13",
    matchScore: 45,
    status: "Weak",
    summary:
      "Strong development background but significant gaps in DevOps-specific tools and practices required for this role.",
    strengths: ["Python", "Linux", "Git", "Problem Solving", "System Design"],
    gaps: [
      "Kubernetes",
      "Terraform",
      "Jenkins",
      "Monitoring Tools",
      "Infrastructure as Code",
      "Container Orchestration",
    ],
    nextSteps:
      "Consider gaining hands-on experience with containerization and cloud infrastructure tools before applying to DevOps positions.",
  },
];

export { mockResumes, mockAnalyses };
