# Yoga App Scripts

This directory contains utility scripts for the yoga app.

## Available Scripts

### download_yoga_images.js

Downloads yoga pose images from yogateket.com to replace SVG illustrations.

**Usage:**
```bash
node scripts/download_yoga_images.js
```

**What it does:**
- Downloads 51 yoga pose images from yogateket.com
- Saves them to `/public/poses/` directory
- Uses proper rate limiting (500ms between requests)
- Provides summary of successful/failed downloads

**Note:** Some images may not be available on yogateket.com. You'll need to:
1. Check the failed downloads list
2. Manually find alternative images for those poses
3. Use sources like Pixabay, Unsplash, or Pexels

### After Download

1. **Optimize images** (optional but recommended):
```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Convert to WebP and resize
cd public/poses
for file in *.jpg; do
  sharp -i "$file" -o "${file%.jpg}.webp" --resize 800 --quality 85
done
```

2. **Update pose data files**:
   - Edit `/src/data/poses.js`
   - Edit `/src/data/poses_extended.js`
   - Change `imageUrl` from `/src/assets/poses/*.svg` to `/poses/*.jpg` (or `.webp`)

3. **Test the app**:
```bash
npm run dev
```

Visit pose library, sessions, and programs to verify images load correctly.

## Manual Download Alternative

If automated download fails or you prefer manual control:

1. Visit yogateket.com blog posts for each pose
2. Right-click on pose image → "Save Image As"
3. Save to `/public/poses/` with the target filename from `imageMapping`
4. Optimize images using your preferred tool

## Legal Notes

- Yogateket.com images are free to use per user verification
- Always verify terms of service before commercial use
- Consider adding attribution in app footer or settings
