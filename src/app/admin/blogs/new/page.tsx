"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RichTextEditor from "@/components/editor/rich-text-editor"
import { generateSlug } from "@/lib/utils"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBlogPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    category: "latest",
    status: "draft"
  })

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

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
        router.push("/admin/blogs")
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

  return (
    <AdminLayout title="New Blog" description="Create a new blog post">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/blogs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "draft")}>
          <div className="space-y-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Blog Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter blog title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Slug
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="blog-url-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="latest">Latest Blog</option>
                      <option value="english">English Blog</option>
                      <option value="hindi">हिंदी Blog</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cover Image URL
                    </label>
                    <Input
                      value={formData.coverImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the blog post..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Start writing your blog post..."
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={loading || !formData.title.trim()}
                >
                  {loading ? "Saving..." : "Save as Draft"}
                  <Save className="h-4 w-4 ml-2" />
                </Button>
                
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  disabled={loading || !formData.title.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Publishing..." : "Publish"}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                Draft will be saved automatically
              </p>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
} 