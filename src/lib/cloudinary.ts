import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dt5fhzlcv',
  api_key: process.env.CLOUDINARY_API_KEY || '762481177423999',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Is4kP38ahm2lJaURbXJdoEYEaZA',
})

export { cloudinary }

// Import shared image size constants
import { IMAGE_SIZES, type ImageSizeType } from '@/constants/imageSizes'
export { IMAGE_SIZES, type ImageSizeType }

export const uploadImage = async (
  file: string | Buffer,
  options?: {
    folder?: string
    public_id?: string
    sizeType?: ImageSizeType
    customSize?: { width: number; height: number }
    generateVariants?: boolean
  }
) => {
  try {
    const folder = options?.folder || 'blog-images'
    
    // Determine target size
    let targetSize: { width: number; height: number; quality: number }
    if (options?.sizeType) {
      targetSize = IMAGE_SIZES[options.sizeType]
    } else if (options?.customSize) {
      targetSize = { ...options.customSize, quality: 80 }
    } else {
      targetSize = IMAGE_SIZES.featured // Default to featured size
    }

    // Upload main image with automatic resizing
    const result = await cloudinary.uploader.upload(file as string, {
      folder,
      public_id: options?.public_id,
      transformation: [
        {
          width: targetSize.width,
          height: targetSize.height,
          crop: 'fill',
          gravity: 'auto', // Smart cropping
          quality: targetSize.quality,
          format: 'auto', // Auto WebP/JPEG
          fetch_format: 'auto'
        }
      ],
      // Generate responsive breakpoints automatically
      responsive_breakpoints: options?.generateVariants ? [
        {
          create_derived: true,
          bytes_step: 20000,
          min_width: 200,
          max_width: 1200,
          transformation: {
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            format: 'auto'
          }
        }
      ] : undefined
    })

    // Generate standard variants if requested
    const variants: Record<string, any> = {}
    if (options?.generateVariants) {
      for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
        try {
          const variantUrl = cloudinary.url(result.public_id, {
            width: sizeConfig.width,
            height: sizeConfig.height,
            crop: 'fill',
            gravity: 'auto',
            quality: sizeConfig.quality,
            format: 'auto'
          })
          variants[sizeName] = {
            url: variantUrl,
            width: sizeConfig.width,
            height: sizeConfig.height
          }
        } catch (error) {
          console.warn(`Failed to generate ${sizeName} variant:`, error)
        }
      }
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      sizeType: options?.sizeType || 'featured',
      variants: Object.keys(variants).length > 0 ? variants : undefined
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

// Helper function to get standard size URLs
export const getStandardImageUrls = (publicId: string) => {
  const urls: Record<ImageSizeType, string> = {} as Record<ImageSizeType, string>
  
  for (const [sizeKey, sizeConfig] of Object.entries(IMAGE_SIZES)) {
    urls[sizeKey as ImageSizeType] = cloudinary.url(publicId, {
      width: sizeConfig.width,
      height: sizeConfig.height,
      quality: sizeConfig.quality,
      format: 'auto',
      crop: 'fill',
      gravity: 'auto'
    })
  }
  
  return urls
}

// Helper function to get a specific standard size URL
export const getStandardImageUrl = (
  publicId: string, 
  sizeType: ImageSizeType = 'featured'
) => {
  const config = IMAGE_SIZES[sizeType]
  return cloudinary.url(publicId, {
    width: config.width,
    height: config.height,
    quality: config.quality,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
  })
} 