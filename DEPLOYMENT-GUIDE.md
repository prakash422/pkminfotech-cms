# 🚀 Complete Deployment Guide: Migrate from Blogger to Next.js

## 📋 **Current Issue**
Your domain `www.pkminfotech.com` is still pointing to Blogger instead of your new Vercel deployment.

## 🔧 **Step-by-Step Fix**

### **Step 1: Update DNS Settings**

#### Option A: If using Google Domains/Cloudflare/Namecheap
1. Go to your domain provider's DNS settings
2. Remove all existing CNAME/A records for `www.pkminfotech.com`
3. Add these records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com.
   TTL: 300
   ```
   
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 300
   ```

#### Option B: If using custom DNS
Contact your DNS provider to update records to point to Vercel.

### **Step 2: Configure Vercel Domain**

1. **In Vercel Dashboard** (Settings → Domains):
   - Remove `www.pkminfotech.com` if already added
   - Click "Add Domain"
   - Enter `www.pkminfotech.com`
   - Follow verification steps
   - Add `pkminfotech.com` (without www) and set it to redirect to www version

### **Step 3: Set Environment Variables in Vercel**

Go to **Project Settings → Environment Variables** and add:

#### **Production Environment**
```bash
# Database (replace with your production MongoDB URL)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/pkminfotech?retryWrites=true&w=majority

# Authentication
NEXTAUTH_URL=https://www.pkminfotech.com
NEXTAUTH_SECRET=generate-a-super-secret-key-here

# SEO & Analytics
NEXT_PUBLIC_BASE_URL=https://www.pkminfotech.com
NEXT_PUBLIC_GA_ID=G-320370173
GOOGLE_SITE_VERIFICATION=your-google-site-verification-code

# Optional (for later)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-your-adsense-id
```

**Important:** Set these for **Production**, **Preview**, AND **Development** environments.

### **Step 4: Set Up Production Database**

#### **4.1 Create MongoDB Atlas Cluster**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (free tier is fine)
3. Set up database user and whitelist IP (0.0.0.0/0 for Vercel)
4. Get connection string

#### **4.2 Run Database Setup**
After setting up MongoDB, run this in your local terminal:

```bash
# Install dependencies
npm install

# Set environment variable temporarily
export DATABASE_URL="your-mongodb-connection-string"

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run setup script (create admin user & pages)
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('YourSecurePassword123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'prakash@pkminfotech.com' },
    update: {},
    create: {
      name: 'Prakash Mahto',
      email: 'prakash@pkminfotech.com', 
      password: hashedPassword,
      role: 'admin'
    }
  });
  
  await prisma.\$disconnect();
})();
"
```

### **Step 5: Deploy & Test**

1. **Redeploy in Vercel:**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push new commit to trigger deployment

2. **Clear DNS Cache:**
   ```bash
   # On Mac/Linux
   sudo dscacheutil -flushcache
   
   # Or use online tools like:
   # https://www.whatsmydns.net/
   ```

3. **Test the Website:**
   - Visit `https://www.pkminfotech.com`
   - Should see your new Next.js site instead of Blogger
   - Test admin login at `https://www.pkminfotech.com/admin`

### **Step 6: Migrate Content from Blogger**

Once the domain is working:

1. **Access Admin Panel:**
   - Go to `https://www.pkminfotech.com/admin`
   - Login with `prakash@pkminfotech.com`

2. **Import Blogger Content:**
   - Use the Blogger Import feature in admin
   - Upload your Blogger export file
   - Content will be auto-imported with SEO optimization

## 🔍 **Troubleshooting**

### **If still showing Blogger:**
1. Check DNS propagation: https://www.whatsmydns.net/
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito/private browsing mode
4. Wait 24-48 hours for full DNS propagation

### **If showing Vercel 404:**
1. Check environment variables are set
2. Redeploy the project
3. Check build logs for errors

### **If database connection fails:**
1. Verify MongoDB Atlas IP whitelist (use 0.0.0.0/0)
2. Check DATABASE_URL format
3. Ensure database user has read/write permissions

## 📊 **After Migration**

1. **Submit sitemap to Google:** `https://www.pkminfotech.com/sitemap.xml`
2. **Update Google Search Console** to use new domain
3. **Set up Google Analytics** with your existing ID: G-320370173
4. **Monitor performance** and search rankings

## 🆘 **Need Help?**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test database connection
4. Contact me with specific error messages

**Your new website will have:**
- ⚡ **10x faster loading**
- 🔍 **Advanced SEO optimization**
- 📱 **Mobile-first responsive design**
- 🎯 **Auto-generated meta tags**
- 📈 **Built-in analytics**
- �� **SSL security** 