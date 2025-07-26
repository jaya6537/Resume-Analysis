"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ResumeAnalysisResult } from "@/lib/types"
import { ResumeDetailsDisplay } from "@/components/resume-details-display"
import { Loader2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function HistoricalViewer() {
  const [history, setHistory] = useState<ResumeAnalysisResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedResume, setSelectedResume] = useState<ResumeAnalysisResult | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/history")
        if (!response.ok) {
          throw new Error("Failed to fetch historical data.")
        }
        const data: ResumeAnalysisResult[] = await response.json()
        setHistory(data)
      } catch (error: any) {
        console.error("Error fetching history:", error)
        toast({
          title: "Error",
          description: error.message || "Could not load historical data. Please check server logs for details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading historical data...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previously Analyzed Resumes</CardTitle>
        <CardDescription>View the details of all resumes analyzed so far.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-gray-500">
            No resumes analyzed yet. Go to "Live Resume Analysis" to upload one!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell className="font-medium">{resume.fileName}</TableCell>
                    <TableCell>{resume.personalDetails?.name || "N/A"}</TableCell>
                    <TableCell>{resume.personalDetails?.email || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedResume(resume)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Resume Analysis Details</DialogTitle>
                            <DialogDescription>
                              Full analysis for {resume.personalDetails?.name || resume.fileName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedResume && <ResumeDetailsDisplay analysisResult={selectedResume} />}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
