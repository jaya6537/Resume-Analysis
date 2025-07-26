"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResumeDetailsDisplay } from "@/components/resume-details-display"
import type { ResumeAnalysisResult } from "@/lib/types"
import { Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// No pdfjs-dist imports needed here anymore, as PDF parsing is now mocked on server

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setAnalysisResult(null) // Clear previous results
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF resume to upload.",
        variant: "destructive",
      })
      return
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed.",
        variant: "destructive",
      })
      setFile(null)
      return
    }

    setIsLoading(true)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append("resume", file) // Send the file directly in FormData

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData, // Send FormData directly
      })

      if (!response.ok) {
        // Attempt to parse error as JSON, fallback to text if not
        let errorData: any = { error: "Failed to analyze resume." }
        try {
          errorData = await response.json() // Try parsing as JSON
        } catch (jsonParseError) {
          const rawResponseText = await response.text() // Get raw text if JSON parsing fails
          console.warn("Server response was not valid JSON:", rawResponseText, jsonParseError)
          errorData.error = `Server responded with an error: "${rawResponseText.substring(0, 100)}..." (Not valid JSON)`
        }
        throw new Error(errorData.error || "Failed to analyze resume.")
      }

      const data: ResumeAnalysisResult = await response.json()
      setAnalysisResult(data)
      toast({
        title: "Analysis Complete",
        description: "Your resume has been successfully analyzed.",
      })
    } catch (error: any) {
      console.error("Error analyzing resume (CLIENT CATCH):", error)
      toast({
        title: "Analysis Failed",
        description: error.message || "An unexpected error occurred during analysis.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>Upload a PDF file to get an automated analysis and AI-driven feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Here's the detailed breakdown and AI feedback for your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeDetailsDisplay analysisResult={analysisResult} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
