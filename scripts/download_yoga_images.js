#!/usr/bin/env node

/**
 * Download Yoga Pose Images from Yogateket.com
 *
 * This script downloads pose images from yogateket.com and saves them
 * to the public/poses/ directory with proper naming.
 *
 * Usage: node scripts/download_yoga_images.js
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

// Mapping of yogateket image filenames to our pose IDs
const imageMapping = {
  // Core poses (23)
  'tadasana_pose.jpg': 'mountain-pose.jpg',
  'downwardfacingdog.jpg': 'downward-dog.jpg',
  'virabhadrasana_i.jpg': 'warrior-one.jpg',
  'virabhadrasana_ii.jpg': 'warrior-two.jpg',
  'vrksasana.jpg': 'tree-pose.jpg',
  'trikonasana.jpg': 'triangle-pose.jpg',
  'balasana.jpg': 'child-pose.jpg',
  'cat_pose.jpg': 'cat-cow.jpg', // Note: Cat-Cow is combined, using cat
  'bhujangasana.jpg': 'cobra-pose.jpg',
  'bridge_pose.jpg': 'bridge-pose.jpg',
  'paschimottanasana.jpg': 'seated-forward-fold.jpg',
  'savasana.jpg': 'corpse-pose.jpg',
  'plank_pose.jpg': 'plank-pose.jpg',
  'utthita_parsvakonasana.jpg': 'extended-side-angle.jpg',
  'parsvottanasana.jpg': 'pyramid-pose.jpg',
  'pigeon_pose.jpg': 'pigeon-pose.jpg',
  'happy_baby.jpg': 'happy-baby.jpg',
  'garudasana.jpg': 'eagle-pose.jpg',
  'half_moon.jpg': 'half-moon.jpg',
  'navasana.jpg': 'boat-pose.jpg',
  'supine_twist.jpg': 'supine-twist.jpg',
  'legs_up_wall.jpg': 'legs-up-wall.jpg',

  // Extended poses (28)
  'utkatasana.jpg': 'chair-pose.jpg',
  'uttanasana.jpg': 'standing-forward-fold.jpg',
  'ardha_uttanasana.jpg': 'half-forward-fold.jpg',
  'prasarita_padottanasana.jpg': 'wide-legged-forward-fold.jpg',
  'parivrtta_trikonasana.jpg': 'revolved-triangle.jpg',
  'virabhadrasana_iii.jpg': 'warrior-three.jpg',
  'standing_split.jpg': 'standing-split.jpg',
  'natarajasana.jpg': 'dancer-pose.jpg',
  'dandasana.jpg': 'staff-pose.jpg',
  'virasana.jpg': 'hero-pose.jpg',
  'vajrasana.jpg': 'thunderbolt-pose.jpg',
  'supta_virasana.jpg': 'reclining-hero.jpg',
  'gomukhasana.jpg': 'cow-face-pose.jpg',
  'janu_sirsasana.jpg': 'head-to-knee-pose.jpg',
  'sphinx_pose.jpg': 'sphinx-pose.jpg',
  'salabhasana.jpg': 'locust-pose.jpg',
  'dhanurasana.jpg': 'bow-pose.jpg',
  'ustrasana.jpg': 'camel-pose.jpg',
  'ardha_matsyendrasana.jpg': 'seated-spinal-twist.jpg',
  'marichyasana_iii.jpg': 'sage-twist.jpg',
  'parivrtta_janu_sirsasana.jpg': 'revolved-head-to-knee.jpg',
  'shoulder_stand.jpg': 'shoulder-stand-prep.jpg',
  'halasana.jpg': 'plow-pose.jpg',
  'dolphin_pose.jpg': 'dolphin-pose.jpg',
  'side_plank.jpg': 'side-plank.jpg',
  'bakasana.jpg': 'crow-pose.jpg',
  'low_lunge.jpg': 'low-lunge.jpg',
  'high_lunge.jpg': 'high-lunge.jpg',
};

const baseUrl = 'https://www.yogateket.com/image/original/';

// Download a single image
function downloadImage(sourceFilename, targetFilename) {
  return new Promise((resolve, reject) => {
    const url = baseUrl + sourceFilename;
    const outputPath = path.join(outputDir, targetFilename);

    console.log(`Downloading: ${sourceFilename} -> ${targetFilename}`);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`❌ Failed to download ${sourceFilename}: HTTP ${response.statusCode}`);
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
  console.log('🧘 Starting yoga pose image download...\n');
  console.log(`Output directory: ${outputDir}\n`);

  const results = {
    success: [],
    failed: []
  };

  const entries = Object.entries(imageMapping);

  for (let i = 0; i < entries.length; i++) {
    const [source, target] = entries[i];

    try {
      const result = await downloadImage(source, target);

      if (result.success) {
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
  console.log(`✅ Successful: ${results.success.length}/${entries.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${entries.length}`);

  if (results.failed.length > 0) {
    console.log('\n⚠️  Failed downloads:');
    results.failed.forEach(({ source, target }) => {
      console.log(`   - ${source} -> ${target}`);
    });
    console.log('\nYou may need to manually download these images.');
  }

  console.log('\n✨ Download complete!\n');
}

// Run the download
downloadAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
