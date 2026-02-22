// Quick Database Setup Script for Production
// Run this after your domain is working and MongoDB is connected

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const setupDatabase = async () => {
    const prisma = new PrismaClient()

    try {
        // Create admin user
        const hashedPassword = await bcrypt.hash('pkm@2024!secure', 12)

        const adminUser = await prisma.user.upsert({
            where: { email: 'prakash@pkminfotech.com' },
            update: {},
            create: {
                name: 'Prakash Mahto',
                email: 'prakash@pkminfotech.com',
                password: hashedPassword,
                role: 'admin'
            }
        })

        // Create About Us page
        await prisma.page.upsert({
            where: { slug: 'about-us' },
            update: {},
            create: {
                title: 'About Us - pkminfotech',
                slug: 'about-us',
                content: `<h2>About pkminfotech</h2>
<p>Welcome to pkminfotech.com - Your trusted source for technology news, travel guides, and cultural insights in both Hindi and English.</p>
<p>Founded by Prakash Mahto, we deliver authentic, informative content to keep you updated with the latest trends.</p>`,
                metaTitle: 'About Us - pkminfotech | Tech News & Travel Guides',
                metaDescription: 'Learn about pkminfotech.com - your source for tech news, travel guides, and cultural content in Hindi and English.',
                keywords: 'about pkminfotech, prakash mahto, tech blogger, travel guides',
                status: 'published',
                showInMenu: true,
                menuOrder: 1,
                authorId: adminUser.id
            }
        })

        // Create Contact page
        await prisma.page.upsert({
            where: { slug: 'contact-us' },
            update: {},
            create: {
                title: 'Contact Us - pkminfotech',
                slug: 'contact-us',
                content: `<h2>Contact Us</h2>
<p>Get in touch with pkminfotech for any inquiries, feedback, or collaboration opportunities.</p>
<p><strong>Email:</strong> prakash@pkminfotech.com</p>
<p><strong>Website:</strong> https://www.pkminfotech.com</p>`,
                metaTitle: 'Contact Us - pkminfotech',
                metaDescription: 'Contact pkminfotech for inquiries, feedback, or collaboration. Get in touch with us today!',
                keywords: 'contact pkminfotech, prakash mahto contact',
                status: 'published',
                showInMenu: true,
                menuOrder: 2,
                authorId: adminUser.id
            }
        })

        // Create welcome blog post
        const blogCount = await prisma.blog.count()
        if (blogCount === 0) {
            await prisma.blog.create({
                data: {
                    title: 'Welcome to the New pkminfotech.com!',
                    slug: 'welcome-to-new-pkminfotech',
                    content: `<h2>Welcome to Our Enhanced Website!</h2>
<p>We're excited to launch our new and improved website with better performance, SEO optimization, and user experience.</p>
<p>Explore our content on technology, travel, and cultural insights. Stay updated with the latest trends and news!</p>`,
                    excerpt: 'Welcome to the new pkminfotech.com with enhanced features and better user experience.',
                    category: 'latest',
                    status: 'published',
                    publishedAt: new Date(),
                    focusKeyword: 'new website',
                    metaDescription: 'Welcome to the new pkminfotech.com with enhanced features, better SEO, and improved performance.',
                    authorId: adminUser.id
                }
            })
        }

    } catch (error) {
        console.error('❌ Setup failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run setup
setupDatabase()