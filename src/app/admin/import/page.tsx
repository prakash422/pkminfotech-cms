"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ImportResult {
  total: number
  imported: number
  skipped: number
  errors: string[]
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import")
      return
    }

    setImporting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/blogger-import', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Import from Blogger</h1>
          <p className="text-gray-600 mt-2">
            Migrate your existing blog posts from Google Blogger to your new CMS
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  How to Export from Blogger
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Go to Blogger Dashboard</p>
                      <p className="text-gray-600">Visit blogger.com and select your blog</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Navigate to Settings</p>
                      <p className="text-gray-600">Click Settings → Other</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Backup Content</p>
                      <p className="text-gray-600">Click "Back up Content" button</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Download XML</p>
                      <p className="text-gray-600">Save the XML file to your computer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      5
                    </div>
                    <div>
                      <p className="font-medium">Upload Here</p>
                      <p className="text-gray-600">Use the form to import your content</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Note:</strong> This will import all published posts. 
                    Draft posts and comments will be skipped.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Import Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Blogger XML
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Blogger XML File
                  </label>
                  <Input
                    type="file"
                    accept=".xml"
                    onChange={handleFileChange}
                    disabled={importing}
                  />
                  {file && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Import Button */}
                <Button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="w-full"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Importing Posts...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import from Blogger
                    </>
                  )}
                </Button>

                {/* Progress (shown during import) */}
                {importing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing XML file...</span>
                    </div>
                    <Progress value={50} className="w-full" />
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Results Display */}
                {result && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Import completed successfully!</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-green-600">{result.imported}</p>
                            <p className="text-gray-600">Imported</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-600">{result.skipped}</p>
                            <p className="text-gray-600">Skipped</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">{result.total}</p>
                            <p className="text-gray-600">Total Found</p>
                          </div>
                        </div>
                        
                        {result.errors.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium text-red-600 mb-2">Errors:</p>
                            <ul className="text-sm text-red-600 space-y-1">
                              {result.errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <Button 
                            onClick={() => router.push('/admin/blogs')}
                            variant="outline"
                          >
                            View Imported Posts
                          </Button>
                          <Button 
                            onClick={() => router.push('/')}
                            variant="outline"
                          >
                            View Website
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">💡 Import Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Posts will automatically be categorized based on their labels</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Original publish dates and update times will be preserved</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Duplicate posts will be skipped to avoid conflicts</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>HTML content and formatting will be preserved</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 