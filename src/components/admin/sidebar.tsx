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
  Files,
  Image,
  ListChecks,
  Timer,
  CalendarDays
} from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Pages", href: "/admin/pages", icon: Files },
  { name: "Question Practice", href: "/admin/question-practice", icon: ListChecks },
  { name: "Mock Tests", href: "/admin/mock-tests", icon: Timer },
  { name: "Daily Quiz", href: "/admin/daily-quiz", icon: CalendarDays },
  { name: "Media", href: "/admin/media", icon: Image },
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
    <aside className="flex h-full w-56 flex-col bg-white border-r border-gray-200">
      <div className="px-3 py-2.5 border-b border-gray-200">
        <div className="rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-2.5 py-2">
          <h1 className="text-base font-semibold text-white leading-tight">CMS Admin</h1>
          <p className="text-[10px] text-blue-100 mt-0.5">pkminfotech Panel</p>
        </div>
      </div>
      
      <div className="px-3 pt-3 pb-2">
        <p className="text-[11px] font-semibold tracking-wide uppercase text-gray-400">Navigation</p>
      </div>

      <nav className="flex-1 space-y-1 px-2.5 pb-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2.5 py-2 text-sm font-medium rounded-md transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-700 border border-transparent hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-2.5 h-4 w-4 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pt-2 pb-2 border-t border-gray-200">
        <p className="text-[11px] font-semibold tracking-wide uppercase text-gray-400 mb-2">Quick Actions</p>
        <Link
          href="/"
          target="_blank"
          className="group flex items-center px-2.5 py-2 text-sm font-medium text-gray-700 rounded-md border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors mb-2"
        >
          <ExternalLink className="mr-2.5 h-4 w-4 flex-shrink-0 text-gray-500" />
          View Public Site
        </Link>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-2.5 py-2 text-sm font-medium text-red-600 rounded-md border border-red-100 bg-red-50/40 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="mr-2.5 h-4 w-4 flex-shrink-0 text-red-500" />
          Logout
        </button>
      </div>
    </aside>
  )
}