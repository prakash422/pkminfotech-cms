"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface ImportResult {
  total: number
  imported: number
  skipped: number
  errors: string[]
  imagesProcessed: number
  imagesDownloaded: number
  seoOptimized: number
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloadImages, setDownloadImages] = useState(false)
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
      formData.append('downloadImages', downloadImages.toString())

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
    <AdminLayout title="Import from Blogger" description="Migrate your existing blog posts from Google Blogger to your new CMS">

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

                {/* Image Handling Options */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Image Handling
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="keep-external"
                        name="imageHandling"
                        value="external"
                        checked={!downloadImages}
                        onChange={() => setDownloadImages(false)}
                        className="mt-1"
                        disabled={importing}
                      />
                      <div className="flex-1">
                        <label htmlFor="keep-external" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Keep images as external links (Recommended)
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Images will remain hosted on Blogger servers but optimized for better quality
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="download-images"
                        name="imageHandling"
                        value="download"
                        checked={downloadImages}
                        onChange={() => setDownloadImages(true)}
                        className="mt-1"
                        disabled={true} // Disabled for now
                      />
                      <div className="flex-1">
                        <label htmlFor="download-images" className="text-sm font-medium text-gray-400 cursor-not-allowed">
                          Download images to server (Coming Soon)
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Images will be downloaded and hosted on your server
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Image Optimization:</strong> Blogger images will be automatically optimized 
                      to use full resolution instead of compressed versions.
                    </AlertDescription>
                  </Alert>
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-green-600">{result.imported}</p>
                            <p className="text-gray-600">Imported</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-600">{result.imagesProcessed}</p>
                            <p className="text-gray-600">Images</p>
                          </div>
                          <div>
                            <p className="font-medium text-purple-600">{result.seoOptimized}</p>
                            <p className="text-gray-600">SEO Optimized</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-600">{result.skipped}</p>
                            <p className="text-gray-600">Skipped</p>
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
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Images will be optimized for full resolution and set as cover images</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>First image in each post becomes the featured/cover image</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Titles optimized for SEO (60 character limit)</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Meta descriptions generated automatically (160 characters)</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Image alt text and title attributes added for accessibility</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </AdminLayout>
  )
} 