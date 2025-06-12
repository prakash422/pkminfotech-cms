#!/usr/bin/env node

/**
 * Canonical URL Fix Script
 * Automatically fixes all canonical URLs to prevent redirect chains
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Files to update with canonical URL fixes
const FILES_TO_UPDATE = [
  'src/app/latest/page.tsx',
  'src/app/english/page.tsx', 
  'src/app/hindi/page.tsx',
  'src/app/page/[pageNumber]/page.tsx',
  'src/app/pages/[slug]/page.tsx',
  'src/app/about-us/page.tsx',
  'src/app/contact-us/page.tsx',
  'src/app/privacy-policy/page.tsx',
  'src/app/disclaimers/page.tsx'
]

console.log('🔧 Starting Canonical URL Fix...')

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }

  let content = fs.readFileSync(filePath, 'utf8')
  let updated = false

  // Add canonical utils import if not present
  if (!content.includes('generateCanonicalUrl') && content.includes('Metadata')) {
    const importLine = `import { generateCanonicalUrl } from "@/lib/canonical-utils"`
    
    if (content.includes('import { Metadata }')) {
      content = content.replace(
        /import { Metadata }.*\n/,
        `$&${importLine}\n`
      )
    } else {
      // Add import after other imports
      const lastImport = content.lastIndexOf('import ')
      const endOfLine = content.indexOf('\n', lastImport)
      content = content.slice(0, endOfLine + 1) + importLine + '\n' + content.slice(endOfLine + 1)
    }
    updated = true
  }

  // Fix canonical URLs in metadata
  // Pattern 1: alternates: { canonical: '/some-path' }
  content = content.replace(
    /alternates:\s*{\s*canonical:\s*['"`]([^'"`]+)['"`]\s*}/g,
    (match, url) => {
      if (url.startsWith('http')) {
        // Extract path from full URL
        const urlObj = new URL(url)
        return `alternates: { canonical: generateCanonicalUrl('${urlObj.pathname}') }`
      } else {
        return `alternates: { canonical: generateCanonicalUrl('${url}') }`
      }
    }
  )

  // Pattern 2: canonical: '/some-path'
  content = content.replace(
    /canonical:\s*['"`]([^'"`]+)['"`]/g,
    (match, url) => {
      if (url.startsWith('http')) {
        const urlObj = new URL(url)
        return `canonical: generateCanonicalUrl('${urlObj.pathname}')`
      } else {
        return `canonical: generateCanonicalUrl('${url}')`
      }
    }
  )

  // Fix OpenGraph URLs
  content = content.replace(
    /url:\s*['"`]([^'"`]+)['"`]/g,
    (match, url) => {
      if (url.startsWith('http')) {
        const urlObj = new URL(url)
        return `url: generateCanonicalUrl('${urlObj.pathname}')`
      } else if (url.startsWith('/')) {
        return `url: generateCanonicalUrl('${url}')`
      }
      return match
    }
  )

  // Fix hardcoded pkminfotech.com URLs
  content = content.replace(
    /https:\/\/(?:www\.)?pkminfotech\.com([^'"`\s]*)/g,
    (match, path) => {
      if (path) {
        return `" + generateCanonicalUrl('${path}') + "`
      }
      return `" + generateCanonicalUrl('/') + "`
    }
  )

  if (updated || content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Fixed: ${filePath}`)
  } else {
    console.log(`⚪ No changes needed: ${filePath}`)
  }
}

// Process all files
FILES_TO_UPDATE.forEach(updateFile)

// Create canonical validation API
const validationAPI = `import { NextRequest, NextResponse } from 'next/server'
import { validateCanonicalUrls } from '@/lib/canonical-utils'

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()
    
    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs array required' }, { status: 400 })
    }

    const results = validateCanonicalUrls(urls)
    const issues = results.filter(r => !r.isValid)
    
    return NextResponse.json({
      total: results.length,
      issues: issues.length,
      valid: results.length - issues.length,
      results: results
    })
  } catch (error) {
    console.error('Error validating canonical URLs:', error)
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}

export async function GET() {
  // Get all pages and validate their canonical URLs
  const sampleUrls = [
    'https://www.pkminfotech.com/',
    'https://www.pkminfotech.com/latest',
    'https://www.pkminfotech.com/english', 
    'https://www.pkminfotech.com/hindi',
    'https://www.pkminfotech.com/about-us',
    'https://www.pkminfotech.com/contact-us',
    'https://www.pkminfotech.com/privacy-policy',
    'https://www.pkminfotech.com/disclaimers'
  ]
  
  const results = validateCanonicalUrls(sampleUrls)
  const issues = results.filter(r => !r.isValid)
  
  return NextResponse.json({
    status: issues.length === 0 ? 'All canonical URLs are valid' : \`\${issues.length} canonical URL issues found\`,
    total: results.length,
    issues: issues.length,
    valid: results.length - issues.length,
    results: results
  })
}`

fs.writeFileSync('src/app/api/validate-canonical/route.ts', validationAPI)
console.log('✅ Created canonical validation API')

console.log('🎉 Canonical URL fix completed!')
console.log('')
console.log('📊 Next steps:')
console.log('1. Test the validation API: /api/validate-canonical')
console.log('2. Run build to verify all canonical URLs')
console.log('3. Check Ahrefs again after deployment')
console.log('')
console.log('🔍 The script has:')
console.log('• Added canonical URL resolver imports')
console.log('• Fixed hardcoded canonical URLs') 
console.log('• Updated OpenGraph URLs')
console.log('• Created validation API endpoint') 