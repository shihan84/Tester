#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test APK upload functionality
async function testApkUpload() {
  console.log('🧪 Testing APK Upload Functionality\n');

  // Check if uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads', 'apps');
  console.log('📁 Checking uploads directory...');
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Uploads directory does not exist');
      console.log('📝 Creating uploads directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created successfully');
    } else {
      console.log('✅ Uploads directory exists');
    }

    // Check directory permissions
    try {
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      console.log('✅ Uploads directory is writable');
    } catch (err) {
      console.log('❌ Uploads directory is not writable:', err.message);
    }

    // Check directory stats
    const stats = fs.statSync(uploadsDir);
    console.log(`📊 Directory permissions: ${stats.mode.toString(8)}`);
    console.log(`📊 Directory owner: ${stats.uid}`);

    // Create a test file to verify write permissions
    const testFile = path.join(uploadsDir, 'test-upload.txt');
    try {
      fs.writeFileSync(testFile, 'Test upload functionality');
      console.log('✅ Test file created successfully');
      
      // Clean up test file
      fs.unlinkSync(testFile);
      console.log('✅ Test file cleaned up');
    } catch (err) {
      console.log('❌ Failed to create test file:', err.message);
    }

  } catch (error) {
    console.log('❌ Error checking uploads directory:', error.message);
  }

  console.log('\n🔍 Checking for common APK upload issues...');

  // Check file size limits
  console.log('📏 File size limit: 100MB (104,857,600 bytes)');

  // Check valid file extensions
  console.log('✅ Valid file extensions: .apk, .aab');

  // Check valid MIME types
  console.log('✅ Valid MIME types:');
  console.log('   - application/vnd.android.package-archive');
  console.log('   - application/octet-stream');
  console.log('   - application/x-zip-compressed');

  console.log('\n🌐 API Endpoint: POST /api/upload-app');
  console.log('📋 Required fields: appFile, deviceId, userId');

  console.log('\n💡 Troubleshooting Tips:');
  console.log('1. Make sure you select a valid .apk or .aab file');
  console.log('2. Ensure the file size is less than 100MB');
  console.log('3. Select a device from the dropdown');
  console.log('4. Check browser console for error messages');
  console.log('5. Check server logs for detailed error information');

  console.log('\n🚀 To test the upload:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Go to the "App Test" tab');
  console.log('3. Select an APK/AAB file');
  console.log('4. Choose a device');
  console.log('5. Click "Start App Test Session"');

  console.log('\n📱 Sample APK files for testing:');
  console.log('- You can use any valid Android APK file');
  console.log('- Maximum file size: 100MB');
  console.log('- Supported formats: .apk, .aab');
}

testApkUpload().catch(console.error);