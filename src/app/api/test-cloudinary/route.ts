import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    // Test Cloudinary configuration
    const result = await cloudinary.api.ping()
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful!',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dt5fhzlcv',
      apiKey: process.env.CLOUDINARY_API_KEY || '762481177423999',
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      apiSecret: process.env.CLOUDINARY_API_SECRET || 'Is4kP38ahm2lJaURbXJdoEYEaZA',
      result
    })
    
  } catch (error) {
    console.error('Cloudinary test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dt5fhzlcv',
      apiKey: process.env.CLOUDINARY_API_KEY || '762481177423999',
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      apiSecret: process.env.CLOUDINARY_API_SECRET || 'Is4kP38ahm2lJaURbXJdoEYEaZA'
    }, { status: 500 })
  }
}

// Test image optimization URLs
export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json()
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },  
        { status: 400 }
      )
    }

    // Generate optimized URLs like in your example
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto'
    })
    
    const autoCropUrl = cloudinary.url(publicId, {
      crop: 'auto',
      gravity: 'auto', 
      width: 500,
      height: 500,
    })

    const thumbnailUrl = cloudinary.url(publicId, {
      width: 300,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    })

    return NextResponse.json({
      success: true,
      urls: {
        original: cloudinary.url(publicId),
        optimized: optimizeUrl,
        autoCrop: autoCropUrl,
        thumbnail: thumbnailUrl
      }
    })

  } catch (error) {
    console.error('URL generation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'URL generation failed'
    }, { status: 500 })
  }
} 