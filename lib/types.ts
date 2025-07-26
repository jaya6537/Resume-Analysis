export interface PersonalDetails {
  name: string | null
  email: string | null
  phone: string | null
  linkedin: string | null
  portfolio: string | null
}

export interface WorkExperience {
  title: string
  company: string
  duration: string
  description: string
}

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface Project {
  name: string
  description: string
}

export interface ResumeContent {
  summary: string | null
  workExperience: WorkExperience[]
  education: Education[]
  projects: Project[]
  certifications: string[]
}

export interface Skills {
  technicalSkills: string[]
  softSkills: string[]
}

export interface AIFeedback {
  rating: number | null
  improvementAreas: string | null
  suggestedSkills: string[]
}

export interface ResumeAnalysisResult {
  id: string // UUID from DB
  fileName: string
  personalDetails: PersonalDetails | null
  resumeContent: ResumeContent | null
  skills: Skills | null
  aiFeedback: AIFeedback | null
  createdAt: string // ISO string
}
