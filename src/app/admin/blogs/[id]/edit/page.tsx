"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { Save, ArrowLeft, Eye, Target, FileText, CheckCircle, AlertCircle, BarChart3, Edit, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditBlogPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [seoScore, setSeoScore] = useState(0)
  const [error, setError] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    coverImageAlt: "", // Alt text for featured image
    category: "latest",
    status: "draft",
    focusKeyword: "",
    metaTitle: "", // Meta Title
    metaDescription: "",
    canonicalUrl: "", // Canonical URL
    ogTitle: "", // Open Graph Title
    ogDescription: "", // Open Graph Description
    ogImage: "", // Open Graph Image
    tags: [] as string[] // Added tags field
  })
  const [tagsInput, setTagsInput] = useState("")

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}`)
        if (response.ok) {
          const blog = await response.json()
          setFormData({
            title: blog.title || "",
            slug: blog.slug || "",
            content: blog.content || "",
            excerpt: blog.excerpt || "",
            coverImage: blog.coverImage || "",
            coverImageAlt: blog.coverImageAlt || "",
            category: blog.category || "latest",
            status: blog.status || "draft",
            focusKeyword: blog.focusKeyword || "",
            metaTitle: blog.metaTitle || "",
            metaDescription: blog.metaDescription || "",
            canonicalUrl: blog.canonicalUrl || "",
            ogTitle: blog.ogTitle || "",
            ogDescription: blog.ogDescription || "",
            ogImage: blog.ogImage || "",
            tags: blog.tags || []
          })
          setTagsInput((blog.tags || []).join(", ")) // Sync tagsInput
          
          // Set initial word count
          const count = calculateWordCount(blog.content || "")
          setWordCount(count)
          setReadingTime(calculateReadingTime(count))
          setHasChanges(false) // Reset changes after loading
        } else {
          setError("Failed to load blog")
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
        setError("Failed to load blog")
      } finally {
        setInitialLoading(false)
      }
    }

    if (blogId) {
      fetchBlog()
    }
  }, [blogId])

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
    setHasChanges(true)
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
    setHasChanges(true)
    const count = calculateWordCount(content)
    setWordCount(count)
    setReadingTime(calculateReadingTime(count))
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  // Sync tagsInput with formData.tags when blog loads
  useEffect(() => {
    setTagsInput(formData.tags.join(", "))
  }, [formData.tags])

  // Enhanced handler for tags input
  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value)
    setHasChanges(true)
  }
  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const value = tagsInput.trim()
      if (value) {
        const tags = [...formData.tags, ...value.split(',').map(tag => tag.trim()).filter(Boolean)]
        setFormData(prev => ({ ...prev, tags: Array.from(new Set(tags)) }))
        setTagsInput("")
        setHasChanges(true)
      }
    } else if (e.key === 'Backspace' && !tagsInput && formData.tags.length) {
      setFormData(prev => ({ ...prev, tags: prev.tags.slice(0, -1) }))
      setHasChanges(true)
    }
  }
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    setHasChanges(true)
  }

  // Update SEO score when relevant fields change
  useEffect(() => {
    setSeoScore(analyzeSEO())
  }, [formData.title, formData.metaDescription, formData.focusKeyword, formData.content, wordCount])

  const handleSubmit = async (e: React.FormEvent, status: string = formData.status) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setLoading(true)
    setError("")
    
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status,
        }),
      })

      if (response.ok) {
        setHasChanges(false)
        setFormData(prev => ({ ...prev, status }))
        if (status === "published") {
          alert("Blog updated and published successfully!")
        } else {
          alert("Blog saved as draft!")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update blog")
      }
    } catch (error) {
      console.error("Failed to update blog:", error)
      setError("Failed to update blog")
    } finally {
      setLoading(false)
    }
  }

  const seoStatus = getSEOStatus(seoScore)
  const StatusIcon = seoStatus.icon

  // --- Google Search Snippet Preview Component ---
  function GoogleSnippetPreview({
    title,
    metaTitle,
    metaDescription,
    slug,
    canonicalUrl
  }: {
    title: string
    metaTitle: string
    metaDescription: string
    slug: string
    canonicalUrl: string
  }) {
    const displayTitle = metaTitle || title
    const displayUrl = canonicalUrl || (slug ? `https://www.pkminfotech.com/blog/${slug}` : "https://www.pkminfotech.com/blog/your-slug")
    return (
      <div className="bg-white border border-gray-200 rounded p-4 mb-4">
        <div className="mb-1 text-xs text-gray-500">Google Preview</div>
        <div className="text-blue-800 text-lg leading-tight font-medium truncate">{displayTitle || "Meta Title or Blog Title"}</div>
        <div className="text-green-700 text-xs mb-1 truncate">{displayUrl}</div>
        <div className="text-gray-700 text-sm leading-snug">
          {metaDescription || "Meta description will appear here. Edit it for best SEO results."}
        </div>
      </div>
    )
  }

  // Auto-generate Canonical URL, OG Title, OG Description, OG Image
  useEffect(() => {
    setFormData(prev => {
      const autoCanonicalUrl = prev.slug ? `https://www.pkminfotech.com/blog/${prev.slug}` : ''
      const autoOgTitle = prev.metaTitle || prev.title
      const autoOgDescription = prev.metaDescription || prev.excerpt
      const autoOgImage = prev.coverImage
      return {
        ...prev,
        canonicalUrl: autoCanonicalUrl,
        ogTitle: autoOgTitle,
        ogDescription: autoOgDescription,
        ogImage: autoOgImage
      }
    })
  }, [formData.slug, formData.metaTitle, formData.title, formData.metaDescription, formData.excerpt, formData.coverImage])

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Blog" description="Loading blog...">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/blogs">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading blog editor...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error && initialLoading) {
    return (
      <AdminLayout title="Edit Blog" description="Error loading blog">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-500 bg-red-50 text-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Blog" description="Update your blog post">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/blogs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        {error && (
          <Alert className="border-red-500 bg-red-50 text-red-900 mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <form onSubmit={(e) => handleSubmit(e, formData.status)}>
              <div className="space-y-6">
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

                {/* Blog Details */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Blog Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Google Search Snippet Preview */}
                    <GoogleSnippetPreview
                      title={formData.title}
                      metaTitle={formData.metaTitle}
                      metaDescription={formData.metaDescription}
                      slug={formData.slug}
                      canonicalUrl={formData.canonicalUrl}
                    />
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
                        onChange={(e) => handleFieldChange('slug', e.target.value)}
                        placeholder="your-blog-url-slug"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => handleFieldChange('category', e.target.value)}
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
                          onChange={(url) => handleFieldChange('coverImage', url)}
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
                        onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                        placeholder="Brief description of your blog post..."
                        rows={3}
                      />
                    </div>

                    {/* Tags Field */}
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                            {tag}
                            <button type="button" className="ml-1 text-xs text-red-500" onClick={() => handleRemoveTag(tag)}>&times;</button>
                          </span>
                        ))}
                      </div>
                      <Input
                        id="tags"
                        value={tagsInput}
                        onChange={handleTagsInputChange}
                        onKeyDown={handleTagsKeyDown}
                        placeholder="Type a tag and press Enter or comma"
                        autoComplete="off"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Add relevant tags for SEO and navigation (press Enter or comma to add)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Settings - at the end */}
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
                        readOnly
                        placeholder="Enter your main keyword..."
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Choose a keyword you want this post to rank for
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        readOnly
                        placeholder="Enter meta title for SEO (optional)"
                        maxLength={70}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.metaTitle.length}/70 characters (recommended: 30-60)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        readOnly
                        placeholder="Write a compelling description for search engines..."
                        rows={3}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.metaDescription.length}/160 characters (120-160 is optimal)
                      </p>
                    </div>
                    {/* Canonical URL - readOnly, auto-generated */}
                    <div>
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input
                        id="canonicalUrl"
                        value={formData.canonicalUrl}
                        readOnly
                        placeholder="https://yourdomain.com/blog/your-slug"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Set a canonical URL to avoid duplicate content issues
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* OG Title - readOnly, auto-generated */}
                      <div>
                        <Label htmlFor="ogTitle">OG Title</Label>
                        <Input
                          id="ogTitle"
                          value={formData.ogTitle}
                          readOnly
                          placeholder="Open Graph title for social sharing"
                        />
                      </div>
                      {/* OG Description - readOnly, auto-generated */}
                      <div>
                        <Label htmlFor="ogDescription">OG Description</Label>
                        <Input
                          id="ogDescription"
                          value={formData.ogDescription}
                          readOnly
                          placeholder="Open Graph description for social sharing"
                        />
                      </div>
                      {/* OG Image - readOnly, auto-generated */}
                      <div>
                        <Label htmlFor="ogImage">OG Image URL</Label>
                        <Input
                          id="ogImage"
                          value={formData.ogImage}
                          readOnly
                          placeholder="URL for OG image (1200x630 recommended)"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="coverImageAlt">Alt Text for Featured Image</Label>
                      <Input
                        id="coverImageAlt"
                        value={formData.coverImageAlt}
                        readOnly
                        placeholder="Alt text for featured image (SEO)"
                        maxLength={120}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "draft")}
                      disabled={loading || !formData.title.trim() || (!hasChanges && formData.status === "draft")}
                      variant="outline"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save as Draft"}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={(e) => handleSubmit(e, "published")}
                      disabled={loading || !formData.title.trim() || (!hasChanges && formData.status === "published")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Updating..." : formData.status === "published" ? "Update & Publish" : "Publish"}
                    </Button>
                    
                    {formData.status === "published" && (
                      <Button
                        type="button"
                        onClick={(e) => handleSubmit(e, "draft")}
                        disabled={loading}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        Convert to Draft
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {loading ? "Processing..." : hasChanges ? "You have unsaved changes" : "All changes saved"}
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
                    <span className={`font-medium ${
                      formData.status === 'published' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {formData.status === 'published' ? 'Published' : 'Draft'}
                    </span>
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
              width={800}
              height={600}
              className="mt-1 w-full h-24 object-cover rounded border"
              sizes="100vw"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
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