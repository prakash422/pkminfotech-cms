# 🚀 **Google AdSense Setup Guide for Pkminfotech**

## ✅ **Current Status:**
- **AdSense Script**: ✅ Added to website
- **Publisher ID**: `pub-3361406010222956` ✅ Configured
- **Ad Components**: ✅ Ready for ad slots

---

## 🎯 **Step-by-Step AdSense Setup:**

### **1. Login to Google AdSense**
1. Go to [https://www.google.com/adsense/](https://www.google.com/adsense/)
2. Login with your Google account
3. Navigate to **"Ads" → "By ad unit"**

### **2. Create Ad Units for Your Website**

#### **🏠 Homepage Ad Units:**

**Header Banner (728x90)**
```
Name: Pkminfotech Header Banner
Size: 728x90 (Leaderboard)
Type: Display ads
```

**Left Sidebar (300x600)**
```
Name: Pkminfotech Left Sidebar
Size: 300x600 (Half Page)
Type: Display ads
```

**Right Sidebar (300x600)**
```
Name: Pkminfotech Right Sidebar  
Size: 300x600 (Half Page)
Type: Display ads
```

**Square Ad (300x300)**
```
Name: Pkminfotech Square Ad
Size: 300x300 (Medium Rectangle)
Type: Display ads
```

**Mobile Ad (320x250)**
```
Name: Pkminfotech Mobile Banner
Size: 320x250 (Mobile Banner)
Type: Display ads
```

**Footer Banner (728x90)**
```
Name: Pkminfotech Footer Banner
Size: 728x90 (Leaderboard)
Type: Display ads
```

#### **📰 Blog Post Ad Units:**

**In-Content Ad (Responsive)**
```
Name: Pkminfotech Content Ad
Size: Responsive
Type: In-article ads
```

**Related Posts Ad (300x250)**
```
Name: Pkminfotech Related Posts
Size: 300x250 (Medium Rectangle)
Type: Display ads
```

---

## 🔧 **Step 3: Update Your Ad Slots**

After creating ad units in AdSense, you'll get **Ad Slot IDs** like:
- `1234567890`
- `9876543210`
- etc.

**Replace the placeholder slot IDs in your code:**

### Update `src/components/AdSpace.tsx`:
```javascript
export const AdConfigs = {
  headerBanner: {
    width: 728,
    height: 90,
    adFormat: 'horizontal' as const,
    adSlot: 'YOUR_HEADER_SLOT_ID' // Replace with actual slot ID
  },
  sidebarBanner: {
    width: 300,
    height: 600,
    adFormat: 'vertical' as const,
    adSlot: 'YOUR_SIDEBAR_SLOT_ID' // Replace with actual slot ID
  },
  squareAd: {
    width: 300,
    height: 300,
    adFormat: 'rectangle' as const,
    adSlot: 'YOUR_SQUARE_SLOT_ID' // Replace with actual slot ID
  },
  contentAd: {
    adFormat: 'auto' as const,
    adSlot: 'YOUR_CONTENT_SLOT_ID' // Replace with actual slot ID
  },
  footerBanner: {
    width: 728,
    height: 90,
    adFormat: 'horizontal' as const,
    adSlot: 'YOUR_FOOTER_SLOT_ID' // Replace with actual slot ID
  },
  mobileAd: {
    width: 320,
    height: 250,
    adFormat: 'rectangle' as const,
    adSlot: 'YOUR_MOBILE_SLOT_ID' // Replace with actual slot ID
  }
}
```

---

## 📍 **Current Ad Placements on Your Website:**

### **Homepage (`/`):**
- ✅ Header Banner (after navigation)
- ✅ Left Sidebar (300x600)
- ✅ Right Sidebar (300x600)
- ✅ Mobile Banner (320x250)
- ✅ Footer Banner (728x90)

### **Blog Posts (`/[slug]`):**
- ✅ Header Banner
- ✅ Left/Right Sidebars
- ✅ In-content ads
- ✅ Related posts section
- ✅ Footer Banner

### **Static Pages (`/pages/[slug]`):**
- ✅ Sidebar ads
- ✅ Content ads

---

## ⚠️ **Important AdSense Requirements:**

### **1. Website Review:**
- AdSense will review your website
- Ensure quality content and good user experience
- Follow AdSense policies

### **2. Content Requirements:**
- ✅ Original, high-quality content
- ✅ Clear navigation
- ✅ Privacy policy (add to your site)
- ✅ Terms of service

### **3. Traffic Requirements:**
- Minimum organic traffic
- Quality engagement
- Regular content updates

---

## 🚀 **Activation Process:**

### **Phase 1: Application (You're Here)**
1. ✅ AdSense script added
2. ⏳ Create ad units
3. ⏳ Add ad slot IDs to code
4. ⏳ Deploy to production

### **Phase 2: Review**
1. Google reviews your website
2. Check content quality
3. Verify compliance
4. **Timeline: 1-14 days**

### **Phase 3: Approval**
1. ✅ Ads start showing
2. ✅ Revenue tracking begins
3. ✅ Monthly payouts (min $100)

---

## 💰 **Expected Revenue:**

### **Blog Website Typical Earnings:**
- **RPM**: $0.50 - $3.00 (Revenue per 1000 views)
- **CTR**: 1-3% (Click-through rate)
- **CPC**: $0.20 - $2.00 (Cost per click)

### **For 10,000 monthly views:**
- **Estimated**: $5 - $30/month
- **With quality content**: $15 - $50/month
- **Scales with traffic**: More views = More revenue

---

## 🎯 **Next Steps:**

1. **Create ad units** in AdSense dashboard
2. **Copy the slot IDs**
3. **Update AdConfigs** in your code
4. **Deploy to production**
5. **Wait for approval** (1-14 days)
6. **Monitor performance** in AdSense dashboard

**Your website is ready for AdSense! 🚀** 