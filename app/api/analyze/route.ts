import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { sql } from "@/lib/db"
import { generateResumeAnalysisPrompt } from "@/lib/llm-prompts"
import type { ResumeAnalysisResult } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// No PDF parsing libraries (pdf-parse, pdfjs-dist, Buffer) needed on server side
// as parsing is now done client-side.

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    // Expect JSON body with resumeText and fileName from the client
    const { resumeText, fileName } = await request.json()

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return NextResponse.json({ error: "No valid text provided for analysis." }, { status: 400 })
    }

    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "File name is missing or invalid." }, { status: 400 })
    }

    const prompt = generateResumeAnalysisPrompt(resumeText)

    const { text: llmResponse } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const cleanedLlmResponse = llmResponse.replace(/^```json\s*|\s*```$/g, "").trim()

    let analysisData: Omit<ResumeAnalysisResult, "id" | "fileName" | "createdAt">
    try {
      analysisData = JSON.parse(cleanedLlmResponse)
    } catch (jsonError) {
      console.error("Invalid JSON from LLM:", cleanedLlmResponse, jsonError)
      return NextResponse.json({ error: "LLM response is not valid JSON from the model." }, { status: 500 })
    }

    // Ensure generated personalDetails has a name, if not, use a placeholder
    if (!analysisData.personalDetails || !analysisData.personalDetails.name) {
      analysisData.personalDetails = { ...analysisData.personalDetails, name: "Unknown User" }
    }

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
    console.error("Unexpected error in resume analysis handler (SERVER CATCH):", error)
    return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 })
  }
}
