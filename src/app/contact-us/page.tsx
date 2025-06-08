import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Contact Us - PKMInfotech | Get in Touch for Queries & Advertisements',
  description: 'Have a question about PKMInfotech? Contact us at prakash@pkminfotech.com for inquiries, advertising, technical issues, or feedback. We\'re here to help!',
  alternates: {
    canonical: '/contact-us'
  }
}

export default function ContactUsPage() {
  // Redirect to the CMS page content
  redirect('/pages/contact-us')
} 