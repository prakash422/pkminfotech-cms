"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Blog {
  id: string
  title: string
  slug: string
  category: string
  status: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author: {
    name: string
    email: string
  }
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete blog:", error)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        setBlogs(blogs.map(blog => 
          blog.id === id 
            ? { ...blog, status: newStatus, publishedAt: newStatus === "published" ? new Date().toISOString() : undefined }
            : blog
        ))
      }
    } catch (error) {
      console.error("Failed to update blog status:", error)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Blogs" description="Manage your blog posts">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Blogs" description="Manage your blog posts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Blogs</h2>
            <p className="text-sm text-gray-600">{blogs.length} total blogs</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/" target="_blank">
              <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-600">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Blog Site
              </Button>
            </Link>
            <Link href="/admin/blogs/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create New Blog
              </Button>
            </Link>
          </div>
        </div>

        {blogs.length === 0 ? (
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No blogs yet</h3>
              <p className="text-gray-300 mb-4">Get started by creating your first blog post.</p>
              <Link href="/admin/blogs/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="border-b border-gray-600 hover:bg-gray-600">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-white">{blog.title}</p>
                            <p className="text-sm text-gray-400">/{blog.slug}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.category === 'hindi' 
                              ? 'bg-orange-100 text-orange-800' 
                              : blog.category === 'english'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {blog.category === 'hindi' ? 'हिंदी' : 
                             blog.category === 'english' ? 'English' : 'Latest'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleStatus(blog.id, blog.status)}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              blog.status === "published"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            {blog.status}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {blog.author.name || blog.author.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {formatDate(blog.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Link href={`/${blog.slug}`} target="_blank">
                              <Button variant="outline" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(blog.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
} 