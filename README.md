# Next.js CMS - Full Stack Content Management System

A modern, full-stack Content Management System built with Next.js 14, featuring a powerful admin dashboard, rich text editing, and seamless content publishing.

## 🚀 Features

### Admin Dashboard
- **Secure Authentication** with NextAuth.js
- **Blog Management** - Create, edit, delete, and publish blog posts
- **Rich Text Editor** with TipTap (formatting, images, links)
- **Ad Management** - Create and manage advertisements
- **Dashboard Analytics** - View content statistics
- **Image Upload Support** (ready for Cloudinary integration)

### Public Site
- **Blog Listing** with responsive design
- **Individual Blog Posts** with SEO optimization
- **Advertisement Display** capability
- **Mobile-First Design** with Tailwind CSS

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Prisma ORM** with MongoDB
- **NextAuth.js** for authentication
- **TipTap** rich text editor
- **Tailwind CSS** for styling
- **SEO Optimized** with meta tags and Open Graph

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd your-cms-project
npm install
\`\`\`

### 2. Environment Setup
Create a \`.env\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/cms_db?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
\`\`\`

### 3. Database Setup
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create admin user
node scripts/setup-admin.js
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit:
- **Public Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Login**: admin@example.com / admin123

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── blogs/         # Blog management
│   │   ├── ads/           # Ad management
│   │   └── login/         # Admin login
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth routes
│   │   ├── blogs/         # Blog API
│   │   └── ads/           # Ads API
│   ├── blog/              # Public blog pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── editor/            # Rich text editor
│   ├── providers/         # Context providers
│   └── ui/                # UI components
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript type definitions
\`\`\`

## 🎯 Usage Guide

### Admin Dashboard

1. **Login**: Navigate to \`/admin/login\` and use admin credentials
2. **Dashboard**: View content statistics and recent activity
3. **Blog Management**:
   - Create new blog posts with rich text editor
   - Edit existing posts
   - Publish/unpublish posts
   - Delete posts
4. **Ad Management**: Create and manage advertisements

### Content Creation

1. **Rich Text Editor Features**:
   - Bold, italic, underline formatting
   - Bullet and numbered lists
   - Blockquotes
   - Images and links
   - Undo/redo functionality

2. **SEO Features**:
   - Automatic slug generation
   - Meta descriptions (excerpt)
   - Open Graph tags
   - Twitter Card support

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
\`\`\`env
DATABASE_URL="your-production-mongodb-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
\`\`\`

### Database Migration
\`\`\`bash
npx prisma db push
node scripts/setup-admin.js
\`\`\`

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update \`DATABASE_URL\` in \`.env\`

### Cloudinary Setup (Optional)
1. Create Cloudinary account
2. Get cloud name, API key, and secret
3. Update environment variables
4. Implement image upload in components

## 🛡️ Security Features

- **Protected Admin Routes** with NextAuth.js
- **Password Hashing** with bcryptjs
- **CSRF Protection** built into Next.js
- **Environment Variable Protection**
- **Input Validation** on API routes

## 🎨 Customization

### Styling
- Update \`src/app/globals.css\` for global styles
- Modify Tailwind configuration in \`tailwind.config.js\`
- Customize UI components in \`src/components/ui/\`

### Branding
- Update site name in navigation components
- Modify homepage content in \`src/app/page.tsx\`
- Change footer information

## 📝 API Documentation

### Blog Endpoints
- \`GET /api/blogs\` - List blogs
- \`POST /api/blogs\` - Create blog
- \`GET /api/blogs/[id]\` - Get blog
- \`PUT /api/blogs/[id]\` - Update blog
- \`PATCH /api/blogs/[id]\` - Partial update
- \`DELETE /api/blogs/[id]\` - Delete blog

### Authentication
- \`POST /api/auth/signin\` - Sign in
- \`POST /api/auth/signout\` - Sign out
- \`GET /api/auth/session\` - Get session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

## 🔄 Future Enhancements

- [ ] Image upload with Cloudinary
- [ ] Comment system
- [ ] User roles and permissions
- [ ] Content scheduling
- [ ] Analytics integration
- [ ] Email notifications
- [ ] Content versioning
- [ ] Multi-language support

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
# Updated MongoDB password for Vercel deployment
# Fix production NEXTAUTH_URL for domain pkminfotech-cms.vercel.app
