export interface ImageFolder {
  key: string
  name: string
  description: string
  icon: string
  path: string
  allowedTypes?: string[]
  maxSizeMB?: number
  suggestedSize?: string
}

export const IMAGE_FOLDERS: Record<string, ImageFolder> = {
  'featured-images': {
    key: 'featured-images',
    name: 'Featured Images',
    description: 'Main hero images for blog posts and pages',
    icon: '🖼️',
    path: 'featured-images',
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    maxSizeMB: 10,
    suggestedSize: '1200×630px (recommended for social sharing)'
  },
  'thumbnails': {
    key: 'thumbnails',
    name: 'Thumbnails',
    description: 'Small preview images for cards and listings',
    icon: '🖼️',
    path: 'thumbnails',
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    maxSizeMB: 5,
    suggestedSize: '400×300px (4:3 aspect ratio)'
  },
  'content-images': {
    key: 'content-images',
    name: 'Content Images',
    description: 'Images used within blog post content',
    icon: '📷',
    path: 'content-images',
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
    maxSizeMB: 8,
    suggestedSize: '800×600px (flexible dimensions)'
  },
  'banners': {
    key: 'banners',
    name: 'Banners & Headers',
    description: 'Wide banner images for headers and promotional content',
    icon: '🎯',
    path: 'banners',
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp'],
    maxSizeMB: 12,
    suggestedSize: '1920×600px (banner format)'
  },
  'profile-images': {
    key: 'profile-images',
    name: 'Profile Images',
    description: 'Author photos and profile pictures',
    icon: '👤',
    path: 'profile-images',
    allowedTypes: ['jpeg', 'jpg', 'png'],
    maxSizeMB: 3,
    suggestedSize: '400×400px (square format)'
  },
  'icons': {
    key: 'icons',
    name: 'Icons & Graphics',
    description: 'Small icons, logos, and graphic elements',
    icon: '🎨',
    path: 'icons',
    allowedTypes: ['png', 'svg', 'webp'],
    maxSizeMB: 2,
    suggestedSize: '256×256px (square icons)'
  },
  'gallery': {
    key: 'gallery',
    name: 'Image Gallery',
    description: 'General purpose image gallery',
    icon: '🏛️',
    path: 'gallery',
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
    maxSizeMB: 10,
    suggestedSize: 'Variable (maintain aspect ratio)'
  },
  'blog-images': {
    key: 'blog-images',
    name: 'Blog Images (Legacy)',
    description: 'Legacy folder for existing blog images',
    icon: '📝',
    path: 'blog-images',
    allowedTypes: ['jpeg', 'jpg', 'png', 'webp', 'gif'],
    maxSizeMB: 10,
    suggestedSize: 'Variable'
  }
}

export const getFolderByKey = (key: string): ImageFolder | undefined => {
  return IMAGE_FOLDERS[key]
}

export const getAllFolders = (): ImageFolder[] => {
  return Object.values(IMAGE_FOLDERS)
}

export const getFolderOptions = () => {
  return Object.values(IMAGE_FOLDERS).map(folder => ({
    value: folder.key,
    label: `${folder.icon} ${folder.name}`,
    description: folder.description,
    path: folder.path
  }))
} 