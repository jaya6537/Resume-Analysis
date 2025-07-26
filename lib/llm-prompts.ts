export const generateResumeAnalysisPrompt = (resumeText: string) => {
  return `Analyze the following resume text and extract structured information. Then, provide AI-driven feedback.
  
  The output MUST be a JSON object conforming to the following TypeScript interface. Ensure all fields are present, using null or empty arrays if information is not found. For arrays, extract all relevant items.

  interface PersonalDetails {
    name: string | null;
    email: string | null;
    phone: string | null;
    linkedin: string | null;
    portfolio: string | null;
  }

  interface WorkExperience {
    title: string;
    company: string;
    duration: string; // e.g., "Jan 2020 - Dec 2022" or "Jan 2020 - Present"
    description: string; // Summarize key responsibilities and achievements
  }

  interface Education {
    degree: string;
    institution: string;
    year: string; // e.g., "2022" or "Expected 2024"
  }

  interface Project {
    name: string;
    description: string; // Summarize the project and your role
  }

  interface ResumeContent {
    summary: string | null; // Or Objective
    workExperience: WorkExperience[];
    education: Education[];
    projects: Project[];
    certifications: string[];
  }

  interface Skills {
    technicalSkills: string[];
    softSkills: string[];
  }

  interface AIFeedback {
    rating: number | null; // A rating from 1 to 10 based on overall resume quality and completeness.
    improvementAreas: string | null; // A summary of specific areas for improvement (e.g., "Quantify achievements more", "Add a strong summary").
    suggestedSkills: string[]; // A list of 3-5 suggested skills to learn for upskilling, relevant to the user's profile and common industry demands.
  }

  interface ResumeAnalysisResult {
    personalDetails: PersonalDetails | null;
    resumeContent: ResumeContent | null;
    skills: Skills | null;
    aiFeedback: AIFeedback | null;
  }

  Resume Text:
  ---
  ${resumeText}
  ---

  JSON Output:
  `
}
