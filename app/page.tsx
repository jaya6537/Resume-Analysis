import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResumeAnalyzer } from "@/components/resume-analyzer"
import { HistoricalViewer } from "@/components/historical-viewer"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Resume Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analyze">Live Resume Analysis</TabsTrigger>
              <TabsTrigger value="history">Historical Viewer</TabsTrigger>
            </TabsList>
            <TabsContent value="analyze" className="mt-4">
              <ResumeAnalyzer />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <HistoricalViewer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
