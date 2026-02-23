"use client"

import { useSession } from "next-auth/react"
import { Bell, User } from "lucide-react"

interface HeaderProps {
  title: string
  description?: string
}

export default function Header({ title, description }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{title}</h1>
          {description && (
            <p className="text-xs text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700 max-w-[120px] sm:max-w-none truncate">
              {session?.user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
} 