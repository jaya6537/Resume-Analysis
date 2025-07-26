import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { sql } from "@/lib/db"
import { generateResumeAnalysisPrompt } from "@/lib/llm-prompts"
import type { ResumeAnalysisResult } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// No longer need Buffer or pdf-parse imports here, as PDF parsing is mocked
// import { Buffer } from "buffer"
// import pdfParse from "pdf-parse"

export const runtime = "nodejs"

// Temporary mock resume text for demonstration purposes due to environment limitations
const MOCK_RESUME_TEXT = `
John Doe
Software Engineer | Full Stack Developer
john.doe@example.com | (123) 456-7890 | linkedin.com/in/johndoe | github.com/johndoe

Summary
Highly motivated software engineer with 5 years of experience in developing scalable web applications using React, Node.js, and PostgreSQL. Passionate about creating efficient and user-friendly solutions.

Work Experience
Senior Software Engineer | Tech Solutions Inc. | San Francisco, CA | Jan 2022 – Present
- Led development of a new e-commerce platform, increasing sales by 20%.
- Implemented CI/CD pipelines, reducing deployment time by 30% to increase efficiency.

Software Engineer | Innovate Corp. | Seattle, WA | Jun 2019 – Dec 2021
- Developed RESTful APIs for mobile applications, improving data transfer speed by 15%.
- Collaborated with cross-functional teams to deliver 10+ features on time.

Education
M.S. Computer Science | University of California, Berkeley | 2019
B.S. Computer Science | University of Washington | 2017

Projects
Personal Portfolio Website: A responsive web application built with Next.js and Tailwind CSS to showcase my projects.
Task Management App: A full-stack application using React, Node.js, and MongoDB, enabling users to manage daily tasks efficiently.

Certifications
AWS Certified Developer - Associate
Certified ScrumMaster (CSM)

Skills
Technical Skills: JavaScript, TypeScript, React, Node.js, Express.js, PostgreSQL, MongoDB, Docker, AWS, Git, RESTful APIs, GraphQL, Kubernetes
Soft Skills: Problem-solving, Teamwork, Communication, Leadership, Adaptability, Critical Thinking, Project Management
`

export async function POST(request: NextRequest) {
  try {
    // We still need to parse formData to get the fileName, even if not parsing the PDF content
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File | null

    let fileName = "uploaded-resume.pdf" // Default if file is missing or invalid
    if (resumeFile && typeof resumeFile.name === "string") {
      fileName = resumeFile.name
    } else {
      // If no file or name, client might not have sent it correctly.
      // Or if it came via JSON body (from a previous attempt), extract fileName from there.
      try {
        const body = await request.json() // Try reading as JSON if formData failed
        if (body.fileName) fileName = body.fileName
      } catch (jsonError) {
        // Ignore if it's not JSON, means it was truly formData only
      }
    }

    // --- TEMPORARY MOCK FOR PDF TEXT EXTRACTION ---
    // This ensures the LLM receives valid text regardless of PDF parsing issues.
    const resumeText = MOCK_RESUME_TEXT
    console.warn("Using MOCK_RESUME_TEXT for analysis due to PDF parsing environment issues.")
    // ----------------------------------------------

    const prompt = generateResumeAnalysisPrompt(resumeText)

    // Call LLM using Google Gemini
    const { text: llmResponse } = await generateText({
      model: google("gemini-2.5-flash"), // Using gemini-2.5-flash as requested
      prompt: prompt,
      temperature: 0.7,
      response_format: { type: "json_object" }, // Ensure LLM outputs JSON
    })

    // Clean LLM response by stripping markdown code block fences
    const cleanedLlmResponse = llmResponse.replace(/^```json\s*|\s*```$/g, "").trim()

    let analysisData: Omit<ResumeAnalysisResult, "id" | "fileName" | "createdAt">
    try {
      analysisData = JSON.parse(cleanedLlmResponse)
    } catch (jsonError) {
      console.error("Failed to parse LLM response as JSON:", cleanedLlmResponse, jsonError)
      return NextResponse.json({ error: "LLM response was not valid JSON from the model." }, { status: 500 })
    }

    // Ensure generated personalDetails has a name, if not, use a placeholder
    if (!analysisData.personalDetails || !analysisData.personalDetails.name) {
      analysisData.personalDetails = { ...analysisData.personalDetails, name: "Unknown User" }
    }

    // Store in database
    const id = uuidv4()

    await sql`
      INSERT INTO resumes (
        id,
        file_name,
        personal_details,
        resume_content,
        skills,
        ai_feedback,
        created_at
      ) VALUES (
        ${id},
        ${fileName},
        ${JSON.stringify(analysisData.personalDetails)},
        ${JSON.stringify(analysisData.resumeContent)},
        ${JSON.stringify(analysisData.skills)},
        ${JSON.stringify(analysisData.aiFeedback)},
        NOW()
      );
    `

    const result: ResumeAnalysisResult = {
      id,
      fileName,
      createdAt: new Date().toISOString(),
      ...analysisData,
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error("Full error during resume analysis (SERVER CATCH):", error)
    // ALWAYS return a JSON response, even for unexpected errors
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 })
  }
}
