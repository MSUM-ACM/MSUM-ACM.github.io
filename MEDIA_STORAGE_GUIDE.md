# Media Storage Setup Guide

This guide shows how to set up free/cheap media hosting using YouTube + Cloudflare R2.

## Strategy Overview

| Media Type | Solution | Cost | Why |
|------------|----------|------|-----|
| **Videos** (hero, events) | YouTube (Unlisted) | FREE | Unlimited storage, great player, adaptive streaming |
| **Images** (board photos, event photos, 3D prints) | Cloudflare R2 | FREE (10GB) | No egress fees, fast CDN, S3-compatible |
| **Small files** (STLs, docs) | GitHub repo | FREE | Easy to manage, version controlled |

## Part 1: YouTube Setup (Videos)

### Step 1: Upload Videos
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click "CREATE" → "Upload videos"
3. Upload your video (e.g., `hero_vid.mp4`)
4. Set visibility to **"Unlisted"** (not private, not public)
   - Unlisted = anyone with the link can view, but won't show in search
5. Wait for processing to complete

### Step 2: Get Embed Code
1. Click on the video in YouTube Studio
2. Click "SHARE" → "Embed"
3. Copy the iframe code or just the video ID

### Step 3: Update Website
Replace the current video tag in `index.html`:

**Before:**
```html
<video autoplay muted loop id="bg-video">
    <source src="assets/hero_vid.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
```

**After:**
```html
<div id="bg-video">
  <iframe 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&controls=0&playlist=YOUR_VIDEO_ID" 
    frameborder="0" 
    allow="autoplay; encrypted-media" 
    allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;pointer-events:none;">
  </iframe>
</div>
```

**CSS update needed:**
```css
#bg-video iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  object-fit: cover;
  pointer-events: none;
}
```

### Benefits of YouTube:
- ✅ No bandwidth costs (no matter how many views)
- ✅ Adaptive quality (adjusts to user's connection)
- ✅ Mobile-optimized
- ✅ No storage limits
- ❌ YouTube branding (can minimize with `?controls=0&modestbranding=1`)

---

## Part 2: Cloudflare R2 Setup (Images)

### Step 1: Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up (free account works!)
3. No credit card required for 10GB storage

### Step 2: Create R2 Bucket
1. From Cloudflare dashboard, click "R2" in sidebar
2. Click "Create bucket"
3. Name it: `msum-acm-media` (or whatever you want)
4. Region: Automatic (it picks closest)
5. Click "Create bucket"

### Step 3: Upload Images
1. Click on your bucket
2. Click "Upload"
3. Upload your images:
   - Board member photos
   - Event photos
   - 3D print gallery images
4. Compress images first! Use [TinyPNG](https://tinypng.com/) or similar

### Step 4: Make Bucket Public
1. In bucket settings, click "Settings"
2. Under "Public access", click "Allow Access"
3. Copy the public bucket URL (looks like: `https://pub-XXXXX.r2.dev/`)

### Step 5: Update Website URLs
In `board.json`:
```json
{
  "members": [
    {
      "name": "Laween Al-Sulaivany",
      "photo_url": "https://pub-XXXXX.r2.dev/board/laween.jpg"
    }
  ]
}
```

### Cost Breakdown:
- **Storage:** 10GB FREE, then $0.015/GB/month (~$0.15/month for 20GB)
- **Bandwidth:** FREE (no egress charges!)
- **Operations:** 10M reads/month FREE (more than enough)

### Alternative: Use Custom Domain (Optional)
1. Add a CNAME in your domain DNS: `media.msumacm.org` → `pub-XXXXX.r2.dev`
2. Connect it in R2 settings
3. Use prettier URLs: `https://media.msumacm.org/board/laween.jpg`

---

## Part 3: GitHub for Small Files (STL Models, Docs)

For files under 10MB each:
1. Just commit them to the repo in `docs/assets/files/`
2. Link directly: `assets/files/model.stl`
3. GitHub Pages serves them fine (repo limit is 1GB total)

---

## Implementation Checklist

- [ ] Upload hero video to YouTube (unlisted)
- [ ] Update video embed in `index.html`
- [ ] Create Cloudflare R2 bucket
- [ ] Compress all images (use TinyPNG)
- [ ] Upload images to R2
- [ ] Update `board.json` with R2 URLs
- [ ] Test all image/video loading
- [ ] Delete large files from GitHub repo (free up space)

---

## Quick Image Compression Commands

If you have ImageMagick installed:
```bash
# Compress board photos to 300KB max
magick mogrify -resize 800x800> -quality 80 -strip *.jpg

# Compress event photos to 500KB max
magick mogrify -resize 1200x1200> -quality 75 -strip *.jpg
```

Or use online tools:
- [TinyPNG](https://tinypng.com/) - Best compression
- [Squoosh](https://squoosh.app/) - More control

---

## Troubleshooting

**Q: YouTube video not autoplaying?**
- Make sure `mute=1` is in the URL (browsers block unmuted autoplay)
- Add `allow="autoplay"` to iframe

**Q: R2 images not loading?**
- Check bucket is set to "Public access"
- Verify URL is correct (no typos)
- Check browser console for CORS errors

**Q: Images loading slowly?**
- Compress them more (target 200-500KB per image)
- Use WebP format instead of JPEG
- Enable Cloudflare CDN (automatic with R2)

---

## Migration Plan

1. **Immediate:** Set up YouTube for hero video (10 min)
2. **This week:** Create R2 bucket and upload compressed images (30 min)
3. **Next meeting:** Update all JSON files with new URLs (15 min)
4. **Testing:** Verify everything loads correctly
5. **Cleanup:** Delete large files from GitHub repo

**Total time investment:** ~1 hour
**Total cost:** $0/month (within free tiers)
