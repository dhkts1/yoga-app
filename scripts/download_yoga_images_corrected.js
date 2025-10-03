#!/usr/bin/env node

/**
 * Download Yoga Pose Images from Yogateket.com - CORRECTED VERSION
 *
 * This script downloads pose images with corrected filenames found through
 * manual research of yogateket.com blog posts.
 *
 * Usage: node scripts/download_yoga_images_corrected.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const outputDir = path.join(__dirname, '..', 'public', 'poses');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Corrected mapping based on manual research
// Format: 'yogateket_filename.jpg': 'our-pose-name.jpg'
const imageMapping = {
  // ===== SUCCESSFULLY DOWNLOADED (17 - already have these) =====
  // 'tadasana_pose.jpg': 'mountain-pose.jpg',
  // 'downwardfacingdog.jpg': 'downward-dog.jpg',
  // 'trikonasana.jpg': 'triangle-pose.jpg',
  // 'cat_pose.jpg': 'cat-cow.jpg',
  // 'bridge_pose.jpg': 'bridge-pose.jpg',
  // 'paschimottanasana.jpg': 'seated-forward-fold.jpg',
  // 'plank_pose.jpg': 'plank-pose.jpg',
  // 'parsvottanasana.jpg': 'pyramid-pose.jpg',
  // 'pigeon_pose.jpg': 'pigeon-pose.jpg',
  // 'navasana.jpg': 'boat-pose.jpg',
  // 'supine_twist.jpg': 'supine-twist.jpg',
  // 'dandasana.jpg': 'staff-pose.jpg',
  // 'sphinx_pose.jpg': 'sphinx-pose.jpg',
  // 'dolphin_pose.jpg': 'dolphin-pose.jpg',
  // 'side_plank.jpg': 'side-plank.jpg',
  // 'low_lunge.jpg': 'low-lunge.jpg',
  // 'high_lunge.jpg': 'high-lunge.jpg',

  // ===== CORRECTED URLS FOUND (10 poses) =====
  'warrior1.jpg': 'warrior-one.jpg',
  'child_pose_extended.jpg': 'child-pose.jpg',
  'tree_pose.jpg': 'tree-pose.jpg',
  'cobra_pose.jpg': 'cobra-pose.jpg',
  'Savasana-1.jpg': 'corpse-pose.jpg',
  'eaglepose.jpg': 'eagle-pose.jpg',
  'Extended-Side-Angle-Pose.jpg': 'extended-side-angle.jpg',
  'ardha_chandrasana_greece.jpg': 'half-moon.jpg',
  'IMG_0678.jpg': 'chair-pose.jpg',
  'wide_legged_forwardbend_pose.jpg': 'wide-legged-forward-fold.jpg',

  // ===== ADDITIONAL URLS TO TRY (educated guesses based on patterns) =====
  // These might work based on common yogateket naming patterns
  'warrior_2.jpg': 'warrior-two.jpg',
  'warrior2.jpg': 'warrior-two.jpg', // alternate
  'warrior_three.jpg': 'warrior-three.jpg',
  'warrior3.jpg': 'warrior-three.jpg', // alternate
  'happy_baby_pose.jpg': 'happy-baby.jpg',
  'legs_up_the_wall.jpg': 'legs-up-wall.jpg',
  'viparita_karani.jpg': 'legs-up-wall.jpg', // alternate
  'ustrasana_camel.jpg': 'camel-pose.jpg',
  'ustrasana.jpg': 'camel-pose.jpg', // alternate
  'dhanurasana_bow.jpg': 'bow-pose.jpg',
  'dhanurasana.jpg': 'bow-pose.jpg', // alternate
  'salabhasana_locust.jpg': 'locust-pose.jpg',
  'locust_pose.jpg': 'locust-pose.jpg', // alternate
  'halasana_plow.jpg': 'plow-pose.jpg',
  'plow_pose.jpg': 'plow-pose.jpg', // alternate
  'shoulder_stand.jpg': 'shoulder-stand-prep.jpg',
  'sarvangasana.jpg': 'shoulder-stand-prep.jpg', // alternate
  'bakasana_crow.jpg': 'crow-pose.jpg',
  'crow_pose.jpg': 'crow-pose.jpg', // alternate
  'natarajasana_dancer.jpg': 'dancer-pose.jpg',
  'dancer_pose.jpg': 'dancer-pose.jpg', // alternate
  'virasana_hero.jpg': 'hero-pose.jpg',
  'hero_pose.jpg': 'hero-pose.jpg', // alternate
  'vajrasana_thunderbolt.jpg': 'thunderbolt-pose.jpg',
  'supta_virasana_reclining.jpg': 'reclining-hero.jpg',
  'gomukhasana_cow_face.jpg': 'cow-face-pose.jpg',
  'janu_sirsasana_head_to_knee.jpg': 'head-to-knee-pose.jpg',
  'ardha_matsyendrasana_twist.jpg': 'seated-spinal-twist.jpg',
  'marichyasana_3.jpg': 'sage-twist.jpg',
  'parivrtta_janu_sirsasana.jpg': 'revolved-head-to-knee.jpg',
  'uttanasana_forward_fold.jpg': 'standing-forward-fold.jpg',
  'standing_forward_fold.jpg': 'standing-forward-fold.jpg', // alternate
  'ardha_uttanasana_half_forward.jpg': 'half-forward-fold.jpg',
  'parivrtta_trikonasana_revolved.jpg': 'revolved-triangle.jpg',
  'revolved_triangle.jpg': 'revolved-triangle.jpg', // alternate
  'standing_splits.jpg': 'standing-split.jpg',
  'urdhva_prasarita_eka_padasana.jpg': 'standing-split.jpg', // alternate
};

const baseUrl = 'https://www.yogateket.com/image/original/';

// Download a single image
function downloadImage(sourceFilename, targetFilename) {
  return new Promise((resolve, reject) => {
    const url = baseUrl + sourceFilename;
    const outputPath = path.join(outputDir, targetFilename);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped (already exists): ${targetFilename}`);
      resolve({ success: true, source: sourceFilename, target: targetFilename, skipped: true });
      return;
    }

    console.log(`Downloading: ${sourceFilename} -> ${targetFilename}`);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`❌ Failed: ${sourceFilename} (HTTP ${response.statusCode})`);
        resolve({ success: false, source: sourceFilename, target: targetFilename });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded: ${targetFilename}`);
        resolve({ success: true, source: sourceFilename, target: targetFilename });
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        console.error(`❌ Error writing ${targetFilename}:`, err.message);
        reject(err);
      });
    }).on('error', (err) => {
      console.error(`❌ Error downloading ${sourceFilename}:`, err.message);
      resolve({ success: false, source: sourceFilename, target: targetFilename });
    });
  });
}

// Download all images with rate limiting
async function downloadAll() {
  console.log('🧘 Starting corrected yoga pose image download...\n');
  console.log(`Output directory: ${outputDir}\n`);

  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  const entries = Object.entries(imageMapping);

  for (let i = 0; i < entries.length; i++) {
    const [source, target] = entries[i];

    try {
      const result = await downloadImage(source, target);

      if (result.skipped) {
        results.skipped.push(result);
      } else if (result.success) {
        results.success.push(result);
      } else {
        results.failed.push(result);
      }

      // Rate limiting: wait 500ms between requests
      if (i < entries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (err) {
      results.failed.push({ success: false, source, target });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 DOWNLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.success.length}`);
  console.log(`⏭️  Already had (skipped): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📁 Total attempts: ${entries.length}`);

  if (results.failed.length > 0) {
    console.log('\n⚠️  Failed downloads:');
    results.failed.forEach(({ source, target }) => {
      console.log(`   - ${source} -> ${target}`);
    });
  }

  console.log('\n✨ Download complete!\n');
  console.log('💡 For missing images, consider:');
  console.log('   1. Using alternative free sources (Pixabay, Unsplash, Pexels)');
  console.log('   2. Keeping SVG illustrations for poses without photos');
  console.log('   3. Using placeholder images temporarily');
}

// Run the download
downloadAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
