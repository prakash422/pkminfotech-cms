import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import formidable from 'formidable'
import { promises as fs } from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  const data = await req.formData()
  const file = data.get('file') as File
  
  if (!file) {
    throw new Error('No file uploaded')
  }

  // Convert File to Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  // Convert buffer to base64 for Cloudinary
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
  
  return {
    fields: {
      folder: data.get('folder') || 'blog-images',
      alt: data.get('alt') || '',
      title: data.get('title') || file.name
    },
    files: {
      file: {
        data: base64,
        name: file.name,
        type: file.type,
        size: file.size
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the form data
    const { fields, files } = await parseForm(request)
    
    if (!files.file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(files.file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (files.file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(files.file.data, {
      folder: fields.folder,
      public_id: undefined, // Let Cloudinary generate ID
    })

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error },
        { status: 500 }
      )
    }

    // Return the upload result
    return NextResponse.json({
      success: true,
      image: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
        alt: fields.alt,
        title: fields.title
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
} 