# Vercel Environment Variables Setup

Go to your Vercel project → Settings → Environment Variables and add these:

## Required Environment Variables:

### Database
```
DATABASE_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/pkminfotech?retryWrites=true&w=majority
```
**Note:** Replace YOUR_USERNAME, YOUR_PASSWORD, and YOUR_CLUSTER with your actual MongoDB Atlas credentials.

### NextAuth
```
NEXTAUTH_URL=https://www.pkminfotech.com
NEXTAUTH_SECRET=your-super-secret-key-here
```

### SEO & Analytics
```
NEXT_PUBLIC_BASE_URL=https://www.pkminfotech.com
NEXT_PUBLIC_GA_ID=G-320370173
GOOGLE_SITE_VERIFICATION=your-google-verification-code
```

### Optional (when you get them)
```
NEXT_PUBLIC_ADSENSE_ID=ca-pub-your-adsense-id
```

## Important Notes:
1. Set all variables for "Production", "Preview", and "Development" environments
2. After adding variables, redeploy your project
3. The DATABASE_URL should point to your production MongoDB database
4. **NEVER commit real credentials to git - use Vercel environment variables instead** 