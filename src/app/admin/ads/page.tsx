"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Eye, AlertCircle } from "lucide-react"

interface Ad {
  id: string
  name: string
  type: string
  position: string
  content: string
  isActive: boolean
  createdAt: string
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "banner",
    position: "header",
    content: "",
    isActive: true
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch("/api/ads")
      if (response.ok) {
        const data = await response.json()
        setAds(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error)
      setAds([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAd ? `/api/ads/${editingAd.id}` : "/api/ads"
      const method = editingAd ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newAd = await response.json()
        if (editingAd) {
          setAds(ads.map(ad => ad.id === editingAd.id ? newAd : ad))
        } else {
          setAds([...ads, newAd])
        }
        resetForm()
      }
    } catch (error) {
      console.error("Failed to save ad:", error)
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      name: ad.name,
      type: ad.type,
      position: ad.position,
      content: ad.content,
      isActive: ad.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setAds(ads.filter(ad => ad.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete ad:", error)
    }
  }

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      })
      
      if (response.ok) {
        setAds(ads.map(ad => ad.id === id ? { ...ad, isActive } : ad))
      }
    } catch (error) {
      console.error("Failed to update ad status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "banner",
      position: "header",
      content: "",
      isActive: true
    })
    setEditingAd(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <AdminLayout title="Ads Management" description="Manage your advertisement placements">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
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
    <AdminLayout title="Ads Management" description="Manage your advertisement placements">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advertisement Management</h2>
            <p className="text-sm text-gray-700 mt-1">{ads.length} total ads</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Ad
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle>{editingAd ? "Edit Ad" : "Create New Ad"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ad Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter ad name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Ad Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="inline">Inline Content</SelectItem>
                        <SelectItem value="popup">Popup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="content">Content Area</SelectItem>
                        <SelectItem value="between-posts">Between Posts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="content">Ad Content (HTML/Script)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter your ad code, HTML, or script here..."
                    rows={6}
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingAd ? "Update Ad" : "Create Ad"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Ads List */}
        {ads.length === 0 ? (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ads yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first advertisement.</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Ad
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ads.map((ad) => (
              <Card key={ad.id} className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900">{ad.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={ad.isActive}
                        onCheckedChange={(checked) => toggleStatus(ad.id, checked)}
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ad.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{ad.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium">{ad.position}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Content Preview:</span>
                      <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono truncate">
                        {ad.content.substring(0, 100)}...
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Information Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Ads will be displayed on your website based on their position and active status. 
            Make sure to test your ads before making them active.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  )
} 