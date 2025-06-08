import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About Us - PKMInfotech',
  description: 'Learn more about PKMInfotech - your source for tech news, travel guides, and business insights.',
  alternates: {
    canonical: '/about-us'
  }
}

export default function AboutUsPage() {
  // Redirect to the CMS page content
  redirect('/pages/about-us')
} 