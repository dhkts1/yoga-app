# Yoga Pose Image Replacement Plan

## Overview
Replace current SVG illustrations with actual yoga photos from yogateket.com (free to use per their policy).

## Image Source Pattern
- **Base URL**: `https://www.yogateket.com/image/original/`
- **Format**: JPG images
- **Example**: `https://www.yogateket.com/image/original/tadasana_pose.jpg`

## Implementation Steps

### 1. Pose Mapping (23 core + 28 extended = 51 poses)

#### Core Poses (poses.js)
| App Pose ID | Sanskrit Name | Yogateket Blog URL | Image Filename |
|------------|---------------|-------------------|----------------|
| mountain-pose | Tadasana | /blog/tadasana-mountain-pose | tadasana_pose.jpg |
| downward-dog | Adho Mukha Svanasana | /blog/adho-mukha-svanasana-downward-facing-dog | downwardfacingdog.jpg |
| warrior-one | Virabhadrasana I | /blog/virabhadrasana-i-warrior-i-pose | virabhadrasana_i.jpg |
| warrior-two | Virabhadrasana II | /blog/virabhadrasana-ii-warrior-ii-pose | virabhadrasana_ii.jpg |
| tree-pose | Vrksasana | /blog/vrksasana-tree-pose | vrksasana.jpg |
| triangle-pose | Trikonasana | /blog/how-to-trikonasana-variations | trikonasana.jpg |
| child-pose | Balasana | /blog/balasana-childs-pose | balasana.jpg |
| cat-cow | Marjaryasana-Bitilasana | (combined pose - use cat or cow) | cat_pose.jpg or cow_pose.jpg |
| cobra-pose | Bhujangasana | /blog/bhujangasana-cobra-pose | bhujangasana.jpg |
| bridge-pose | Setu Bandha Sarvangasana | /blog/setu-bandha-sarvangasana-bridge-pose | bridge_pose.jpg |
| seated-forward-fold | Paschimottanasana | /blog/paschimottanasana-seated-forward-bend | paschimottanasana.jpg |
| corpse-pose | Savasana | /blog/savasana-corpse-pose | savasana.jpg |
| plank-pose | Phalakasana | /blog/how-to-do-plank-pose-step-by-step-guide | plank_pose.jpg |
| extended-side-angle | Utthita Parsvakonasana | /blog/utthita-parsvakonasana-extended-side-angle-pose | utthita_parsvakonasana.jpg |
| pyramid-pose | Parsvottanasana | /blog/parsvottanasana-pyramid-pose | parsvottanasana.jpg |
| pigeon-pose | Eka Pada Rajakapotasana | /blog/eka-pada-rajakapotasana-pigeon-pose | pigeon_pose.jpg |
| happy-baby | Ananda Balasana | /blog/ananda-balasana-happy-baby-pose | happy_baby.jpg |
| eagle-pose | Garudasana | /blog/garudasana-eagle-pose | garudasana.jpg |
| half-moon | Ardha Chandrasana | /blog/ardha-chandrasana-half-moon-pose | half_moon.jpg |
| boat-pose | Navasana | /blog/navasana-boat-pose | navasana.jpg |
| supine-twist | Supta Matsyendrasana | /blog/supta-matsyendrasana-supine-twist | supine_twist.jpg |
| legs-up-wall | Viparita Karani | /blog/viparita-karani-legs-up-wall | legs_up_wall.jpg |

#### Extended Poses (poses_extended.js)
| App Pose ID | Sanskrit Name | Expected Blog URL | Image Filename |
|------------|---------------|-------------------|----------------|
| chair-pose | Utkatasana | /blog/utkatasana-chair-pose | utkatasana.jpg |
| standing-forward-fold | Uttanasana | /blog/uttanasana-standing-forward-bend | uttanasana.jpg |
| half-forward-fold | Ardha Uttanasana | /blog/ardha-uttanasana-half-forward-fold | ardha_uttanasana.jpg |
| wide-legged-forward-fold | Prasarita Padottanasana | /blog/prasarita-padottanasana-wide-legged-forward-bend-pose | prasarita_padottanasana.jpg |
| revolved-triangle | Parivrtta Trikonasana | /blog/how-to-trikonasana-variations | parivrtta_trikonasana.jpg |
| warrior-three | Virabhadrasana III | /blog/virabhadrasana-iii-warrior-iii | virabhadrasana_iii.jpg |
| standing-split | Urdhva Prasarita Eka Padasana | /blog/standing-splits | standing_split.jpg |
| dancer-pose | Natarajasana | /blog/natarajasana-lord-of-dance-pose | natarajasana.jpg |
| staff-pose | Dandasana | /blog/dandasana-staff-pose | dandasana.jpg |
| hero-pose | Virasana | /blog/virasana-hero-pose | virasana.jpg |
| thunderbolt-pose | Vajrasana | /blog/vajrasana-thunderbolt-pose | vajrasana.jpg |
| reclining-hero | Supta Virasana | /blog/supta-virasana-reclining-hero-pose | supta_virasana.jpg |
| cow-face-pose | Gomukhasana | /blog/gomukhasana-cow-face-pose | gomukhasana.jpg |
| head-to-knee-pose | Janu Sirsasana | /blog/janu-sirsasana-head-to-knee-pose | janu_sirsasana.jpg |
| sphinx-pose | Salamba Bhujangasana | /blog/sphinx-pose-salamba-bhujangasana | sphinx_pose.jpg |
| locust-pose | Salabhasana | /blog/salabhasana-locust-pose | salabhasana.jpg |
| bow-pose | Dhanurasana | /blog/dhanurasana-bow-pose | dhanurasana.jpg |
| camel-pose | Ustrasana | /blog/ustrasana-camel-pose | ustrasana.jpg |
| seated-spinal-twist | Ardha Matsyendrasana | /blog/ardha-matsyendrasana-half-lord-fishes-pose | ardha_matsyendrasana.jpg |
| sage-twist | Marichyasana III | /blog/marichyasana-iii-pose | marichyasana_iii.jpg |
| revolved-head-to-knee | Parivrtta Janu Sirsasana | /blog/parivrtta-janu-sirsasana | parivrtta_janu_sirsasana.jpg |
| shoulder-stand-prep | Salamba Sarvangasana | /blog/salamba-sarvangasana-shoulder-stand | shoulder_stand.jpg |
| plow-pose | Halasana | /blog/halasana-plow-pose | halasana.jpg |
| dolphin-pose | Ardha Pincha Mayurasana | /blog/dolphin-pose-ardha-pincha-mayurasana | dolphin_pose.jpg |
| side-plank | Vasisthasana | /blog/vasisthasana-side-plank-pose | side_plank.jpg |
| crow-pose | Bakasana | /blog/how-to-master-bakasana-the-crow-pose | bakasana.jpg |
| low-lunge | Anjaneyasana | /blog/anjaneyasana-low-lunge | low_lunge.jpg |
| high-lunge | Utthita Ashwa Sanchalanasana | /blog/high-lunge-pose | high_lunge.jpg |

### 2. Download Strategy

**Option A: Manual Download (Recommended for Quality Control)**
1. Visit each blog page
2. Right-click on pose image → Save As
3. Save to `/public/poses/` directory with consistent naming
4. Check image quality and orientation

**Option B: Automated Script**
```bash
#!/bin/bash
# download_yoga_images.sh

# Array of image URLs (to be populated)
declare -a images=(
    "tadasana_pose.jpg:mountain-pose.jpg"
    "downwardfacingdog.jpg:downward-dog.jpg"
    # ... add all mappings
)

# Create directory
mkdir -p public/poses/photos

# Download each image
for img in "${images[@]}"; do
    IFS=':' read -r source target <<< "$img"
    curl -o "public/poses/photos/$target" \
         "https://www.yogateket.com/image/original/$source"
    echo "Downloaded: $target"
done
```

### 3. Image Optimization

After download, optimize for web:
```bash
# Install sharp-cli for image optimization
npm install -g sharp-cli

# Convert to WebP and resize (optional)
for file in public/poses/photos/*.jpg; do
    sharp -i "$file" -o "${file%.jpg}.webp" \
          --resize 800 --quality 85
done
```

**Target specs:**
- Format: WebP (with JPG fallback)
- Max width: 800px
- Quality: 85%
- File size: < 100KB per image

### 4. Code Updates

#### Update poses.js
Change from:
```javascript
imageUrl: '/src/assets/poses/mountain-pose.svg'
```

To:
```javascript
imageUrl: '/poses/mountain-pose.webp'
// or keep as .jpg if not converting
```

#### Update poses_extended.js
Same pattern for all 28 extended poses.

#### Update PoseImage component (if needed)
If using WebP with fallback:
```jsx
<picture>
  <source srcSet={pose.imageUrl} type="image/webp" />
  <img src={pose.imageUrl.replace('.webp', '.jpg')} alt={pose.nameEnglish} />
</picture>
```

### 5. Testing Checklist

- [ ] All 51 images load correctly
- [ ] Images display at proper size (not stretched/pixelated)
- [ ] Mobile performance is acceptable
- [ ] Offline PWA still works (images cached)
- [ ] Build size is reasonable (<10MB total for images)

### 6. Fallback Plan

If some poses don't have images on yogateket.com:
1. Use alternative free yoga image sources:
   - Pixabay (search "yoga [pose name]")
   - Unsplash (yoga category)
   - Pexels (yoga poses)
2. Keep SVG for poses without photos
3. Commission custom photography (if budget allows)

## Alternative Approach: Gradual Replacement

Instead of replacing all 51 at once:
1. Start with 12 most common poses (used in Sessions)
2. Test user response to photos vs illustrations
3. Roll out remaining poses if positive

## Legal Considerations

- Yogateket.com states images are free to copy per user's claim
- Verify this in their Terms of Service before bulk download
- Add attribution if required: "Pose images courtesy of Yogateket.com"
- Consider reaching out for explicit permission for commercial use

## Timeline Estimate

- Pose mapping: 1 hour
- Manual download (51 images): 2-3 hours
- Image optimization: 30 minutes
- Code updates: 1 hour
- Testing: 1 hour
- **Total: 5-6 hours**

Automated approach: ~2 hours (but higher risk of errors)

## Notes

- Some poses may not have exact matches (e.g., "cat-cow" is two separate poses)
- Extended poses may require more URL hunting
- Image quality/style may vary across the website
- Consider downloading higher resolution ("original" vs "thumb") for retina displays
