import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'

// Fetch page content from API
async function getPageBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/pages/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.page
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact-us')
  
  if (!page) {
    return {
      title: 'Contact Us - Pkminfotech',
      description: 'Get in touch with Pkminfotech team. We\'d love to hear from you!'
    }
  }

  return {
    title: page.metaTitle || `${page.title} - Pkminfotech`,
    description: page.metaDescription || `${page.title} - Pkminfotech`,
    keywords: page.keywords,
    openGraph: {
      title: page.metaTitle || `${page.title} - Pkminfotech`,
      description: page.metaDescription || `${page.title} - Pkminfotech`,
      type: 'website',
    },
    alternates: {
      canonical: '/contact-us'
    }
  }
}

export default function ContactUsPage() {
  // For now, redirect to the existing page structure
  // In production, you would move the content here for better SEO
  redirect('/pages/contact-us')
} 