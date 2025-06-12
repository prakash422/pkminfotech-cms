'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BrokenLink {
  sourceUrl: string
  sourcePage: string
  brokenUrl: string
  linkText: string
  suggestedFix: string
  expectedStatus: number
}

interface LinkHealthData {
  status: string
  summary: {
    totalBrokenLinks: number
    fixableLinks: number
    by404: number
    by308: number
  }
  brokenLinks: BrokenLink[]
  recommendations: string[]
}

export default function LinkHealthPage() {
  const [data, setData] = useState<LinkHealthData | null>(null)
  const [loading, setLoading] = useState(false)
  const [fixing, setFixing] = useState(false)
  const [lastScan, setLastScan] = useState<Date | null>(null)

  const scanLinks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/link-health')
      const result = await response.json()
      setData(result)
      setLastScan(new Date())
    } catch (error) {
      console.error('Error scanning links:', error)
    } finally {
      setLoading(false)
    }
  }

  const fixLinks = async () => {
    setFixing(true)
    try {
      const response = await fetch('/api/link-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fix' })
      })
      const result = await response.json()
      
      if (result.success) {
        alert(`✅ Fixed ${result.summary.blogsUpdated} blogs with broken links!`)
        await scanLinks()
      } else {
        alert('❌ Error fixing links. Check console for details.')
      }
    } catch (error) {
      console.error('Error fixing links:', error)
      alert('❌ Error fixing links')
    } finally {
      setFixing(false)
    }
  }

  useEffect(() => {
    scanLinks()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 Link Health Monitor</h1>
        <p className="text-gray-600">Detect and fix broken internal links across your site</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <Button 
          onClick={scanLinks} 
          disabled={loading}
          variant="outline"
        >
          {loading ? '🔄 Scanning...' : '🔍 Scan Links'}
        </Button>
        
        {data && data.summary.fixableLinks > 0 && (
          <Button 
            onClick={fixLinks}
            disabled={fixing}
            className="bg-green-600 hover:bg-green-700"
          >
            {fixing ? '⚙️ Fixing...' : `🔧 Fix ${data.summary.fixableLinks} Broken Links`}
          </Button>
        )}
      </div>

      {lastScan && (
        <p className="text-sm text-gray-500 mb-6">
          Last scan: {lastScan.toLocaleString()}
        </p>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Broken Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {data.summary.totalBrokenLinks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Fixable Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.summary.fixableLinks}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">404 Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {data.summary.by404}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">308 Redirects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {data.summary.by308}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>💡 Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Broken Links Table */}
          <Card>
            <CardHeader>
              <CardTitle>⚠️ Broken Links ({data.brokenLinks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {data.brokenLinks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  🎉 No broken links found! Your site is healthy.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Source Page</th>
                        <th className="text-left py-2">Broken URL</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Suggested Fix</th>
                        <th className="text-left py-2">Link Text</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.brokenLinks.map((link, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2">
                            <a 
                              href={link.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {link.sourcePage} 🔗
                            </a>
                          </td>
                          <td className="py-2 font-mono text-xs bg-gray-100 px-2 rounded">
                            {link.brokenUrl}
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              link.expectedStatus === 404 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {link.expectedStatus}
                            </span>
                          </td>
                          <td className="py-2 font-mono text-xs text-green-600">
                            {link.suggestedFix}
                          </td>
                          <td className="py-2 text-gray-600 max-w-xs truncate">
                            {link.linkText || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 