import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, userAgent, referer } = body
    
    const headersList = headers()
    const realIP = headersList.get('x-real-ip') || 
                   headersList.get('x-forwarded-for') || 
                   'unknown'

    // Log 404 for analysis
    console.log('🔍 404 Error Logged:', {
      timestamp: new Date().toISOString(),
      slug,
      ip: realIP,
      userAgent,
      referer,
      url: request.url
    })

    // Here you could save to database for analytics
    // await prisma.errorLog.create({
    //   data: {
    //     type: '404',
    //     slug,
    //     ip: realIP,
    //     userAgent,
    //     referer,
    //     timestamp: new Date()
    //   }
    // })

    return NextResponse.json({ 
      success: true, 
      message: '404 logged successfully' 
    })
  } catch (error) {
    console.error('Error logging 404:', error)
    return NextResponse.json(
      { error: 'Failed to log 404' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'This endpoint is for logging 404 errors' 
  })
} 