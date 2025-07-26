import type { ResumeAnalysisResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResumeDetailsDisplayProps {
  analysisResult: ResumeAnalysisResult
}

export function ResumeDetailsDisplay({ analysisResult }: ResumeDetailsDisplayProps) {
  const { personalDetails, resumeContent, skills, aiFeedback } = analysisResult

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold">{personalDetails?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg">{personalDetails?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-lg">{personalDetails?.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">LinkedIn/Portfolio</p>
            <p className="text-lg">
              {personalDetails?.linkedin || personalDetails?.portfolio ? (
                <>
                  {personalDetails.linkedin && (
                    <a
                      href={personalDetails.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      LinkedIn
                    </a>
                  )}
                  {personalDetails.portfolio && (
                    <a
                      href={personalDetails.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      Portfolio
                    </a>
                  )}
                </>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resume Content */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeContent?.summary && (
            <div>
              <p className="text-sm font-medium text-gray-500">Summary/Objective</p>
              <p className="whitespace-pre-wrap">{resumeContent.summary}</p>
            </div>
          )}
          {resumeContent?.workExperience && resumeContent.workExperience.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Work Experience</p>
              <ul className="list-disc pl-5 space-y-2">
                {resumeContent.workExperience.map((exp, index) => (
                  <li key={index}>
                    <strong>{exp.title}</strong> at {exp.company} ({exp.duration})
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resumeContent?.education && resumeContent.education.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Education</p>
              <ul className="list-disc pl-5 space-y-2">
                {resumeContent.education.map((edu, index) => (
                  <li key={index}>
                    <strong>{edu.degree}</strong> from {edu.institution} ({edu.year})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resumeContent?.projects && resumeContent.projects.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Projects</p>
              <ul className="list-disc pl-5 space-y-2">
                {resumeContent.projects.map((proj, index) => (
                  <li key={index}>
                    <strong>{proj.name}</strong>: {proj.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resumeContent?.certifications && resumeContent.certifications.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Certifications</p>
              <ul className="list-disc pl-5 space-y-2">
                {resumeContent.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills?.technicalSkills && skills.technicalSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Technical Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.technicalSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {skills?.softSkills && skills.softSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Soft Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.softSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI-Generated Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiFeedback?.rating && (
            <div>
              <p className="text-sm font-medium text-gray-500">Resume Rating</p>
              <p className="text-2xl font-bold text-green-600">{aiFeedback.rating}/10</p>
            </div>
          )}
          {aiFeedback?.improvementAreas && (
            <div>
              <p className="text-sm font-medium text-gray-500">Improvement Areas</p>
              <p className="whitespace-pre-wrap">{aiFeedback.improvementAreas}</p>
            </div>
          )}
          {aiFeedback?.suggestedSkills && aiFeedback.suggestedSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Suggested Skills for Upskilling</p>
              <div className="flex flex-wrap gap-2">
                {aiFeedback.suggestedSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-blue-400 text-blue-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
