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
    <aside className="flex h-full w-48 flex-col bg-white border-r border-gray-200">
      <div className="px-2 py-1.5 border-b border-gray-200">
        <div className="rounded bg-gradient-to-r from-blue-600 to-blue-700 px-2 py-1.5">
          <h1 className="text-sm font-semibold text-white leading-tight">CMS Admin</h1>
          <p className="text-[9px] text-blue-100 mt-0.5">pkminfotech</p>
        </div>
      </div>
      <div className="px-2 pt-2 pb-1">
        <p className="text-[10px] font-semibold tracking-wide uppercase text-gray-400">Nav</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-1.5 pb-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-1.5 text-xs font-medium rounded transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-700 border border-transparent hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-2 h-3.5 w-3.5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pt-1.5 pb-1 border-t border-gray-200">
        <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">Quick</p>
        <Link
          href="/"
          target="_blank"
          className="group flex items-center px-2 py-1.5 text-xs font-medium text-gray-700 rounded border border-gray-200 hover:bg-gray-50 transition-colors mb-1"
        >
          <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0 text-gray-500" />
          View Site
        </Link>
      </div>
      <div className="px-2 py-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-2 py-1.5 text-xs font-medium text-red-600 rounded border border-red-100 bg-red-50/40 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-3 w-3 flex-shrink-0 text-red-500" />
          Logout
        </button>
      </div>
    </aside>
  )
}