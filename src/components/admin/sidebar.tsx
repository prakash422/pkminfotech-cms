"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  Settings,
  LogOut,
  ExternalLink,
  Upload,
  Files
} from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Pages", href: "/admin/pages", icon: Files },
  { name: "Import Blogger", href: "/admin/import", icon: Upload },
  { name: "Ads", href: "/admin/ads", icon: Megaphone },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg border-r border-gray-200">
      <div className="flex h-16 items-center justify-center bg-blue-600">
        <h1 className="text-xl font-bold text-white">CMS Admin</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          href="/"
          target="_blank"
          className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors mb-2"
        >
          <ExternalLink className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" />
          View Public Site
        </Link>
      </div>

      <div className="px-3 py-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" />
          Logout
        </button>
      </div>
    </div>
  )
} 