// Quick Database Setup Script for Production
// Run this after your domain is working and MongoDB is connected

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const setupDatabase = async () => {
    const prisma = new PrismaClient()

    try {
        console.log('🚀 Setting up production database...')

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

        console.log('✅ Admin user created:', adminUser.email)

        // Create About Us page
        await prisma.page.upsert({
            where: { slug: 'about-us' },
            update: {},
            create: {
                title: 'About Us - Pkminfotech',
                slug: 'about-us',
                content: `<h2>About Pkminfotech</h2>
<p>Welcome to Pkminfotech.com - Your trusted source for technology news, travel guides, and cultural insights in both Hindi and English.</p>
<p>Founded by Prakash Mahto, we deliver authentic, informative content to keep you updated with the latest trends.</p>`,
                metaTitle: 'About Us - Pkminfotech | Tech News & Travel Guides',
                metaDescription: 'Learn about Pkminfotech.com - your source for tech news, travel guides, and cultural content in Hindi and English.',
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
                title: 'Contact Us - Pkminfotech',
                slug: 'contact-us',
                content: `<h2>Contact Us</h2>
<p>Get in touch with Pkminfotech for any inquiries, feedback, or collaboration opportunities.</p>
<p><strong>Email:</strong> prakash@pkminfotech.com</p>
<p><strong>Website:</strong> https://www.pkminfotech.com</p>`,
                metaTitle: 'Contact Us - Pkminfotech',
                metaDescription: 'Contact Pkminfotech for inquiries, feedback, or collaboration. Get in touch with us today!',
                keywords: 'contact pkminfotech, prakash mahto contact',
                status: 'published',
                showInMenu: true,
                menuOrder: 2,
                authorId: adminUser.id
            }
        })

        console.log('✅ Essential pages created')

        // Create welcome blog post
        const blogCount = await prisma.blog.count()
        if (blogCount === 0) {
            await prisma.blog.create({
                data: {
                    title: 'Welcome to the New Pkminfotech.com!',
                    slug: 'welcome-to-new-pkminfotech',
                    content: `<h2>Welcome to Our Enhanced Website!</h2>
<p>We're excited to launch our new and improved website with better performance, SEO optimization, and user experience.</p>
<p>Explore our content on technology, travel, and cultural insights. Stay updated with the latest trends and news!</p>`,
                    excerpt: 'Welcome to the new Pkminfotech.com with enhanced features and better user experience.',
                    category: 'latest',
                    status: 'published',
                    publishedAt: new Date(),
                    focusKeyword: 'new website',
                    metaDescription: 'Welcome to the new Pkminfotech.com with enhanced features, better SEO, and improved performance.',
                    authorId: adminUser.id
                }
            })
            console.log('✅ Welcome blog post created')
        }

        console.log('🎉 Database setup completed!')
        console.log('🔐 Admin login: prakash@pkminfotech.com / pkm@2024!secure')
        console.log('🌐 Admin panel: https://www.pkminfotech.com/admin')

    } catch (error) {
        console.error('❌ Setup failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run setup
setupDatabase() 