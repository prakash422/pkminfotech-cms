# 🚨 URGENT: Fix Domain Issue - Blogger Still Showing

## Problem: Your domain www.pkminfotech.com is still showing Blogger instead of your new Next.js website

## 🔧 IMMEDIATE FIX (Do this NOW):

### Step 1: Update DNS Records
**Go to your domain provider (where you bought pkminfotech.com):**

**DELETE all existing DNS records, then ADD:**
```
Type: A
Name: @  
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com.
```

### Step 2: Set Vercel Environment Variables
**In Vercel Dashboard → Your Project → Settings → Environment Variables:**

Add these (Production + Preview + Development):
```
DATABASE_URL=mongodb+srv://your-credentials-here
NEXTAUTH_URL=https://www.pkminfotech.com  
NEXTAUTH_SECRET=make-this-32-characters-long-secret
NEXT_PUBLIC_BASE_URL=https://www.pkminfotech.com
NEXT_PUBLIC_GA_ID=G-320370173
```

### Step 3: Redeploy
**In Vercel → Deployments tab → Click "Redeploy"**

### Step 4: Test
- Wait 15 minutes
- Visit https://www.pkminfotech.com (should show your new site!)
- Clear browser cache if still showing Blogger

## 🗃️ Database Setup (After domain works):

1. **Create MongoDB Atlas account**: https://cloud.mongodb.com
2. **Create cluster** (free tier)
3. **Add database user** 
4. **Whitelist IP**: 0.0.0.0/0 (for Vercel)
5. **Get connection string** and update DATABASE_URL in Vercel
6. **Redeploy again**

## ✅ Success Check:
- www.pkminfotech.com shows your new Next.js site (not Blogger)
- Admin panel works: www.pkminfotech.com/admin
- Database connected (no errors in Vercel logs)

## 🆘 Still showing Blogger?
- Try incognito mode
- Check DNS propagation: whatsmydns.net
- Wait 24-48 hours (DNS can be slow)
- Contact your domain provider

**Your new site will be 10x faster with better SEO than Blogger!** 