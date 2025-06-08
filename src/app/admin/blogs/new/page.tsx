"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RichTextEditor from "@/components/editor/rich-text-editor"
import FeaturedImagePicker from "@/components/admin/FeaturedImagePicker"
import { generateSlug } from "@/lib/utils"
import { Save, ArrowLeft, Eye, Target, FileText, CheckCircle, AlertCircle, BarChart3, Edit } from "lucide-react"
import Link from "next/link"

export default function NewBlogPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [seoScore, setSeoScore] = useState(0)
  const [blogId, setBlogId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    category: "latest",
    status: "draft",
    focusKeyword: "",
    metaDescription: ""
  })

  // Word count and reading time calculation
  const calculateWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    const words = plainText.split(/\s+/).filter(word => word.length > 0)
    return words.length
  }

  const calculateReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200 // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // SEO Analysis functions
  const analyzeSEO = () => {
    let score = 0
    const maxScore = 100

    // Title length (30-60 characters is optimal)
    if (formData.title.length >= 30 && formData.title.length <= 60) {
      score += 20
    } else if (formData.title.length >= 20 && formData.title.length <= 70) {
      score += 10
    }

    // Meta description length (120-160 characters)
    if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) {
      score += 20
    } else if (formData.metaDescription.length >= 100 && formData.metaDescription.length <= 180) {
      score += 10
    }

    // Focus keyword in title
    if (formData.focusKeyword && formData.title.toLowerCase().includes(formData.focusKeyword.toLowerCase())) {
      score += 15
    }

    // Focus keyword in meta description
    if (formData.focusKeyword && formData.metaDescription.toLowerCase().includes(formData.focusKeyword.toLowerCase())) {
      score += 15
    }

    // Content length (at least 300 words is good)
    if (wordCount >= 300) {
      score += 15
    } else if (wordCount >= 150) {
      score += 10
    }

    // Focus keyword in content
    if (formData.focusKeyword && formData.content.toLowerCase().includes(formData.focusKeyword.toLowerCase())) {
      score += 15
    }

    return Math.min(score, maxScore)
  }

  const getSEOStatus = (score: number) => {
    if (score >= 80) return { color: "text-green-600", bg: "bg-green-50", label: "Excellent", icon: CheckCircle }
    if (score >= 60) return { color: "text-yellow-600", bg: "bg-yellow-50", label: "Good", icon: AlertCircle }
    if (score >= 40) return { color: "text-orange-600", bg: "bg-orange-50", label: "Needs Work", icon: AlertCircle }
    return { color: "text-red-600", bg: "bg-red-50", label: "Poor", icon: AlertCircle }
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
    const count = calculateWordCount(content)
    setWordCount(count)
    setReadingTime(calculateReadingTime(count))
  }

  // Update SEO score when relevant fields change
  useEffect(() => {
    setSeoScore(analyzeSEO())
  }, [formData.title, formData.metaDescription, formData.focusKeyword, formData.content, wordCount])

  const handleSubmit = async (e: React.FormEvent, status: string = "draft") => {
    e.preventDefault()
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status,
          authorId: session.user.id
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (status === "draft") {
          // Save blog ID for future updates
          setBlogId(result.blog?.id)
          setFormData(prev => ({ ...prev, status: "draft" }))
          alert("Blog saved as draft successfully!")
        } else {
          router.push("/admin/blogs")
        }
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create blog")
      }
    } catch (error) {
      console.error("Failed to create blog:", error)
      alert("Failed to create blog")
    } finally {
      setLoading(false)
    }
  }

  const seoStatus = getSEOStatus(seoScore)
  const StatusIcon = seoStatus.icon

  return (
    <AdminLayout title="New Blog" description="Create a new blog post">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/blogs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <form onSubmit={(e) => handleSubmit(e, "draft")}>
              <div className="space-y-6">
                {/* Blog Details */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Blog Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter your blog title..."
                        required
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.title.length}/60 characters (30-60 is optimal for SEO)
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="your-blog-url-slug"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          required
                        >
                          <option value="latest">Latest Blog</option>
                          <option value="english">English Blog</option>
                          <option value="hindi">हिंदी Blog</option>
                        </select>
                      </div>
                      
                      <div>
                        <FeaturedImagePicker
                          value={formData.coverImage}
                          onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                          label="Featured Image"
                          placeholder="Enter image URL or select from media..."
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of your blog post..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Settings */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      SEO Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="focusKeyword">Focus Keyword</Label>
                      <Input
                        id="focusKeyword"
                        value={formData.focusKeyword}
                        onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                        placeholder="Enter your main keyword..."
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Choose a keyword you want this post to rank for
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="Write a compelling description for search engines..."
                        rows={3}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.metaDescription.length}/160 characters (120-160 is optimal)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center justify-between">
                      <span className="flex items-center">
                        <Edit className="h-5 w-5 mr-2" />
                        Content
                      </span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          <BarChart3 className="h-4 w-4 inline mr-1" />
                          {wordCount} words
                        </span>
                        <span className="text-gray-600">
                          <Eye className="h-4 w-4 inline mr-1" />
                          {readingTime} min read
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichTextEditor
                      content={formData.content}
                      onChange={handleContentChange}
                      placeholder="Start writing your amazing blog post..."
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={loading || !formData.title.trim()}
                      variant="outline"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Draft"}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "published")}
                      disabled={loading || !formData.title.trim() || formData.status !== "draft"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Publishing..." : "Publish Now"}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Save as draft first, then publish when ready
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* SEO Analysis */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    SEO Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-lg ${seoStatus.bg}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StatusIcon className={`h-5 w-5 mr-2 ${seoStatus.color}`} />
                        <span className={`font-medium ${seoStatus.color}`}>
                          {seoStatus.label}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${seoStatus.color}`}>
                        {seoScore}/100
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          seoScore >= 80 ? 'bg-green-500' : 
                          seoScore >= 60 ? 'bg-yellow-500' : 
                          seoScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${seoScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        formData.title.length >= 30 && formData.title.length <= 60 ? 'bg-green-500' : 
                        formData.title.length >= 20 && formData.title.length <= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span>Title length ({formData.title.length} chars)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160 ? 'bg-green-500' : 
                        formData.metaDescription.length >= 100 && formData.metaDescription.length <= 180 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span>Meta description ({formData.metaDescription.length} chars)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        formData.focusKeyword && formData.title.toLowerCase().includes(formData.focusKeyword.toLowerCase()) ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span>Focus keyword in title</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        wordCount >= 300 ? 'bg-green-500' : wordCount >= 150 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span>Content length ({wordCount} words)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Statistics */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Content Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium text-gray-900">{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reading Time:</span>
                    <span className="font-medium text-gray-900">{readingTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Character Count:</span>
                    <span className="font-medium text-gray-900">{formData.content.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900 capitalize">{formData.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">
                      {formData.category === 'hindi' ? 'हिंदी' : 
                       formData.category === 'english' ? 'English' : 'Latest'}
                    </span>
                  </div>
                  {formData.coverImage && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">Cover Image Preview:</span>
                      <img 
                        src={formData.coverImage} 
                        alt="Cover preview" 
                        className="mt-1 w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 