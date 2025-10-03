# Yoga Image Download Results

## Summary
- **Total poses**: 51
- **Successfully downloaded**: 32 (63%)
- **Still need images**: 19 (37%)
- **Source**: yogateket.com

## ✅ Successfully Downloaded Images (32)

### Core Poses (18/23)
1. ✅ mountain-pose.jpg
2. ✅ downward-dog.jpg
3. ✅ warrior-one.jpg
4. ✅ warrior-two.jpg
5. ✅ tree-pose.jpg
6. ✅ triangle-pose.jpg
7. ✅ child-pose.jpg
8. ✅ cat-cow.jpg
9. ✅ cobra-pose.jpg
10. ✅ bridge-pose.jpg
11. ✅ seated-forward-fold.jpg
12. ✅ corpse-pose.jpg
13. ✅ plank-pose.jpg
14. ✅ extended-side-angle.jpg
15. ✅ pyramid-pose.jpg
16. ✅ pigeon-pose.jpg
17. ❌ happy-baby.jpg
18. ✅ eagle-pose.jpg
19. ✅ half-moon.jpg
20. ✅ boat-pose.jpg
21. ✅ supine-twist.jpg
22. ❌ legs-up-wall.jpg
23. ✅ staff-pose.jpg (from extended poses)

### Extended Poses (14/28)
24. ✅ chair-pose.jpg
25. ❌ standing-forward-fold.jpg
26. ❌ half-forward-fold.jpg
27. ✅ wide-legged-forward-fold.jpg
28. ✅ revolved-triangle.jpg
29. ✅ warrior-three.jpg
30. ✅ standing-split.jpg
31. ❌ dancer-pose.jpg
32. ❌ hero-pose.jpg
33. ❌ thunderbolt-pose.jpg
34. ❌ reclining-hero.jpg
35. ❌ cow-face-pose.jpg
36. ❌ head-to-knee-pose.jpg
37. ✅ sphinx-pose.jpg
38. ❌ locust-pose.jpg
39. ❌ bow-pose.jpg
40. ❌ camel-pose.jpg
41. ❌ seated-spinal-twist.jpg
42. ❌ sage-twist.jpg
43. ❌ revolved-head-to-knee.jpg
44. ❌ shoulder-stand-prep.jpg
45. ❌ plow-pose.jpg
46. ✅ dolphin-pose.jpg
47. ✅ side-plank.jpg
48. ✅ crow-pose.jpg
49. ✅ low-lunge.jpg
50. ✅ high-lunge.jpg

## ❌ Missing Images (19 poses)

### Need from Alternative Sources

**Core Poses (2):**
1. happy-baby.jpg - Ananda Balasana
2. legs-up-wall.jpg - Viparita Karani

**Extended Poses (17):**
3. standing-forward-fold.jpg - Uttanasana
4. half-forward-fold.jpg - Ardha Uttanasana
5. dancer-pose.jpg - Natarajasana
6. hero-pose.jpg - Virasana
7. thunderbolt-pose.jpg - Vajrasana
8. reclining-hero.jpg - Supta Virasana
9. cow-face-pose.jpg - Gomukhasana
10. head-to-knee-pose.jpg - Janu Sirsasana
11. locust-pose.jpg - Salabhasana
12. bow-pose.jpg - Dhanurasana
13. camel-pose.jpg - Ustrasana
14. seated-spinal-twist.jpg - Ardha Matsyendrasana
15. sage-twist.jpg - Marichyasana III
16. revolved-head-to-knee.jpg - Parivrtta Janu Sirsasana
17. shoulder-stand-prep.jpg - Salamba Sarvangasana
18. plow-pose.jpg - Halasana

## Recommended Alternative Sources

### Free Stock Photo Sites
1. **Pixabay** - https://pixabay.com/images/search/yoga/
   - Free for commercial use
   - No attribution required
   - High quality images

2. **Unsplash** - https://unsplash.com/s/photos/yoga-pose
   - Free high-resolution photos
   - Requires attribution (optional but nice)
   - Professional quality

3. **Pexels** - https://www.pexels.com/search/yoga%20pose/
   - Free stock photos
   - No attribution required
   - Good variety

### Search Strategy
For each missing pose, search:
- "{Pose Name} yoga" (e.g., "camel pose yoga")
- "{Sanskrit Name}" (e.g., "Ustrasana")
- Look for clean, white/neutral background
- Prefer single person, clear form
- Consistent style if possible

## Next Steps

### Option 1: Hybrid Approach (Recommended)
- Use downloaded JPG images for 32 poses
- Keep SVG illustrations for 19 missing poses
- Gradual replacement as you find/create better images

### Option 2: Complete Photo Set
- Manually download 19 remaining images from Pixabay/Unsplash
- Ensures consistent photo style across all poses
- Requires ~1-2 hours of image sourcing

### Option 3: Custom Photography
- Commission or create your own photos
- Maximum control over style/quality
- Most time/cost intensive

## Implementation

### Update Code References
Edit these files to use `.jpg` instead of `.svg`:

**File: `/src/data/poses.js`**
Change imageUrl for these 18 poses:
```javascript
// Example:
imageUrl: '/poses/mountain-pose.jpg'  // was: '/src/assets/poses/mountain-pose.svg'
```

**File: `/src/data/poses_extended.js`**
Change imageUrl for these 14 poses with downloaded images.

### Code Update Script
You can use find-and-replace or run:
```bash
# This will update only the poses we have images for
node scripts/update_image_references.js
```

## File Locations
- Downloaded images: `/public/poses/*.jpg`
- Original SVGs: `/src/assets/poses/*.svg` (keep as fallback)
- Download script: `/scripts/download_yoga_images_corrected.js`

## Notes
- yogateket.com doesn't have images for all poses
- Some pose names don't have dedicated blog posts
- Alternative spellings/variations were tried
- HTTP 500 errors suggest images don't exist on their server

---

**Last Updated**: October 3, 2025
**Success Rate**: 63% (32/51 poses)
