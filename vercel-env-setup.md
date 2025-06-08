# Vercel Environment Variables Setup

Go to your Vercel project → Settings → Environment Variables and add these:

## Required Environment Variables:

### Database Connection
```
DATABASE_URL=<Your MongoDB Atlas Connection String>
```
**How to get your connection string:**
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace the password placeholder with your actual password

### Authentication
```
NEXTAUTH_URL=https://www.pkminfotech.com
NEXTAUTH_SECRET=<Generate a random 32+ character string>
```

### SEO & Analytics
```
NEXT_PUBLIC_BASE_URL=https://www.pkminfotech.com
NEXT_PUBLIC_GA_ID=G-320370173
GOOGLE_SITE_VERIFICATION=<Your Google verification code>
```

### Optional (Add when you get them)
```
NEXT_PUBLIC_ADSENSE_ID=<Your Google AdSense Publisher ID>
```

## Important Security Notes:
1. Set all variables for "Production", "Preview", and "Development" environments
2. After adding variables, redeploy your project
3. **NEVER commit real credentials to git repositories**
4. Always use environment variables for sensitive data
5. Get your actual MongoDB connection string from Atlas dashboard 