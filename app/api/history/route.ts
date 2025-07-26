import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import type { ResumeAnalysisResult } from "@/lib/types"

export const runtime = "nodejs" // Ensure this runs in Node.js environment

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT
        id,
        file_name as "fileName",
        personal_details as "personalDetails",
        resume_content as "resumeContent",
        skills,
        ai_feedback as "aiFeedback",
        created_at as "createdAt"
      FROM resumes
      ORDER BY created_at DESC;
    `

    // Ensure JSONB fields are parsed if they come as strings (though neon usually handles this)
    const history: ResumeAnalysisResult[] = rows.map((row: any) => ({
      ...row,
      personalDetails: row.personalDetails,
      resumeContent: row.resumeContent,
      skills: row.skills,
      aiFeedback: row.aiFeedback,
    }))

    return NextResponse.json(history, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching historical data:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch historical data." }, { status: 500 })
  }
}
