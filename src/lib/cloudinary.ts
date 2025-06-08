import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dt5fhzlcv',
  api_key: process.env.CLOUDINARY_API_KEY || '762481177423999',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Is4kP38ahm2lJaURbXJdoEYEaZA',
})

export { cloudinary }

export const uploadImage = async (
  file: string | Buffer,
  options?: {
    folder?: string
    public_id?: string
    width?: number
    height?: number
    crop?: string
  }
) => {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder: options?.folder || 'blog-images',
      public_id: options?.public_id,
      transformation: options?.width || options?.height ? [
        {
          width: options.width,
          height: options.height,
          crop: options.crop || 'fill',
          quality: 'auto',
          format: 'auto'
        }
      ] : [
        { quality: 'auto', format: 'auto' }
      ]
    })

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return { success: true, result }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
  }
}

export const getOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
  }
) => {
  return cloudinary.url(publicId, {
    width: options?.width,
    height: options?.height,
    quality: options?.quality || 'auto',
    format: options?.format || 'auto',
    crop: 'fill'
  })
} 