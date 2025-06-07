"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Globe, Mail, Shield, Palette, AlertCircle } from "lucide-react"

interface Settings {
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  enableComments: boolean
  enableAnalytics: boolean
  analyticsId: string
  maintenanceMode: boolean
  seoTitle: string
  seoDescription: string
  socialMediaLinks: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "PKM InfoTech",
    siteDescription: "Your trusted source for technology insights and travel guides",
    siteUrl: "https://pkminfotech-cms.vercel.app",
    adminEmail: "pkminfotech048@gmail.com",
    enableComments: true,
    enableAnalytics: false,
    analyticsId: "",
    maintenanceMode: false,
    seoTitle: "PKM InfoTech - Technology & Travel Blog",
    seoDescription: "Discover the latest in technology trends, programming tutorials, and amazing travel destinations with PKM InfoTech.",
    socialMediaLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      youtube: ""
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSettings(data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    
    // Simulate save operation
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const updateSettings = (field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const updateSocialMedia = (platform: keyof Settings['socialMediaLinks'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [platform]: value
      }
    }))
  }

  if (loading) {
    return (
      <AdminLayout title="Settings" description="Configure your website settings">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
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
    <AdminLayout title="Settings" description="Configure your website settings">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Website Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Configure your website preferences and options</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        {saved && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSettings('siteName', e.target.value)}
                  placeholder="Your website name"
                />
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSettings('siteDescription', e.target.value)}
                  placeholder="Brief description of your website"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => updateSettings('siteUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => updateSettings('adminEmail', e.target.value)}
                  placeholder="admin@yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={settings.seoTitle}
                  onChange={(e) => updateSettings('seoTitle', e.target.value)}
                  placeholder="Your website SEO title"
                />
              </div>
              
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seoDescription}
                  onChange={(e) => updateSettings('seoDescription', e.target.value)}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="analyticsId">Google Analytics ID</Label>
                <Input
                  id="analyticsId"
                  value={settings.analyticsId}
                  onChange={(e) => updateSettings('analyticsId', e.target.value)}
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Settings */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Feature Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Comments</Label>
                  <p className="text-sm text-gray-600">Allow users to comment on blog posts</p>
                </div>
                <Switch
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => updateSettings('enableComments', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Analytics</Label>
                  <p className="text-sm text-gray-600">Track website analytics with Google Analytics</p>
                </div>
                <Switch
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => updateSettings('enableAnalytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Put website in maintenance mode</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSettings('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialMediaLinks.facebook}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialMediaLinks.twitter}
                  onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                  placeholder="https://twitter.com/youraccount"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialMediaLinks.instagram}
                  onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                  placeholder="https://instagram.com/youraccount"
                />
              </div>
              
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={settings.socialMediaLinks.youtube}
                  onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>

        {/* Information */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Some settings may require a page refresh to take effect. 
            Make sure to save your changes before navigating away from this page.
          </AlertDescription>
        </Alert>
      </div>
    </AdminLayout>
  )
} 