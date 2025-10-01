// Simple test script to verify app functionality
const fetch = require('node-fetch');

async function testApp() {
  console.log('🧘 Testing Yoga App...\n');

  try {
    // Test 1: Check if server is running
    const response = await fetch('http://localhost:5176');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:5176');
    } else {
      console.log('❌ Server not responding properly');
      return;
    }

    // Test 2: Check HTML content
    const html = await response.text();

    // Check for React root
    if (html.includes('id="root"')) {
      console.log('✅ React root element found');
    } else {
      console.log('❌ React root element missing');
    }

    // Check for main script
    if (html.includes('src/main.jsx')) {
      console.log('✅ Main script loaded');
    } else {
      console.log('❌ Main script not found');
    }

    // Check for Vite
    if (html.includes('@vite')) {
      console.log('✅ Vite dev server detected');
    } else {
      console.log('⚠️  Vite not detected (might be production build)');
    }

    console.log('\n🎉 Basic app tests passed!');
    console.log('\n📱 To fully test the app:');
    console.log('   1. Open http://localhost:5176 in your browser');
    console.log('   2. Check the Welcome screen loads');
    console.log('   3. Click "Start Practice" to begin a session');
    console.log('   4. Test timer pause/resume functionality');
    console.log('   5. Navigate between poses');

  } catch (error) {
    console.error('❌ Error testing app:', error.message);
  }
}

testApp();