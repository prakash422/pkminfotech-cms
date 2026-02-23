"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Megaphone, Eye, Users } from "lucide-react"

interface DashboardStats {
  totalBlogs: number
  publishedBlogs: number
  totalAds: number
  activeAds: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalAds: 0,
    activeAds: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Blogs",
      value: stats.totalBlogs,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Published Blogs",
      value: stats.publishedBlogs,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Ads",
      value: stats.totalAds,
      icon: Megaphone,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Ads",
      value: stats.activeAds,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  if (loading) {
    return (
      <AdminLayout title="Dashboard" description="CMS dashboard">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard" description="CMS dashboard">
      <div className="space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">{card.title}</p>
                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`p-1.5 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm font-semibold text-gray-900">Recent Blogs</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-xs text-gray-600">No recent blogs. Create from Blogs.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm font-semibold text-gray-900">Active Ads</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-xs text-gray-600">No active ads. Create from Ads.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
