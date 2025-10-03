#!/usr/bin/env node

/**
 * Download Final Batch - Images found by agents
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'poses');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Images found by agents searching the blog
const imageMapping = {
  'DSC_9851.jpg': 'happy-baby.jpg',
  'Ustrasana.jpg': 'camel-pose.jpg',
  'Bow_posture_bikram_yoga.jpg': 'bow-pose.jpg',
  'locust.jpg': 'locust-pose.jpg',
  'cowface-1.jpg': 'cow-face-pose.jpg',
  'Head_to_knee_pose-min.jpg': 'head-to-knee-pose.jpg',
  'Spine_twisting_pose.jpg': 'seated-spinal-twist.jpg',
  'shoulderstand.jpg': 'shoulder-stand-prep.jpg',
  'Halasana.jpg': 'plow-pose.jpg',
};

const baseUrl = 'https://www.yogateket.com/image/original/';

function downloadImage(sourceFilename, targetFilename) {
  return new Promise((resolve) => {
    const url = baseUrl + sourceFilename;
    const outputPath = path.join(outputDir, targetFilename);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped: ${targetFilename}`);
      resolve({ success: true, skipped: true });
      return;
    }

    console.log(`Downloading: ${sourceFilename} -> ${targetFilename}`);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`❌ Failed: ${sourceFilename} (HTTP ${response.statusCode})`);
        resolve({ success: false });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded: ${targetFilename}`);
        resolve({ success: true });
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        console.error(`❌ Error: ${err.message}`);
        resolve({ success: false });
      });
    }).on('error', (err) => {
      console.error(`❌ Error: ${err.message}`);
      resolve({ success: false });
    });
  });
}

async function downloadAll() {
  console.log('🧘 Downloading final batch of images found by agents...\n');

  let success = 0, failed = 0, skipped = 0;

  for (const [source, target] of Object.entries(imageMapping)) {
    const result = await downloadImage(source, target);
    if (result.skipped) skipped++;
    else if (result.success) success++;
    else failed++;

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL BATCH SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Downloaded: ${success}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('\n✨ Complete!\n');
}

downloadAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
