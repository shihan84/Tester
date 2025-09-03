# APK Upload Troubleshooting Guide

If you're unable to upload APK files, follow this comprehensive troubleshooting guide to identify and resolve the issue.

## 🔍 Quick Diagnosis Steps

### 1. Use the Debug Tool
Visit: `http://localhost:3000/debug`
This tool provides step-by-step validation and testing of the upload functionality.

### 2. Check Common Issues
Run the test script:
```bash
node test-upload.js
```

## 🚨 Common Issues and Solutions

### Issue 1: File Validation Errors
**Symptoms:**
- "Invalid file type" error message
- File selection rejected immediately

**Solutions:**
- Ensure file extension is `.apk` or `.aab`
- Check file size is under 100MB
- Verify file is not corrupted

### Issue 2: No Available Devices
**Symptoms:**
- "No devices available" error
- Device dropdown is empty

**Solutions:**
- Go to "Devices & Browsers" tab to verify devices exist
- Ensure mobile/tablet devices are available
- Check that devices are marked as active

### Issue 3: Server File Permission Issues
**Symptoms:**
- "Failed to save file to disk" error
- 500 server error

**Solutions:**
```bash
# Create uploads directory with proper permissions
mkdir -p uploads/apps
chmod 755 uploads/apps
```

### Issue 4: Network/Connectivity Issues
**Symptoms:**
- Upload hangs or times out
- Network error in browser console

**Solutions:**
- Check browser console (F12) for errors
- Verify server is running on port 3000
- Check firewall settings

### Issue 5: Browser-Specific Issues
**Symptoms:**
- Works in one browser but not another
- File selection dialog doesn't appear

**Solutions:**
- Try different browsers (Chrome, Firefox, Safari)
- Clear browser cache and cookies
- Disable browser extensions temporarily

## 🔧 Step-by-Step Testing

### Step 1: Verify Server Status
```bash
# Check if server is running
curl http://localhost:3000/api/health
```

### Step 2: Test Devices API
```bash
# Check if devices are available
curl http://localhost:3000/api/devices
```

### Step 3: Test File Upload Manually
```bash
# Create a test file
echo "test" > test.apk

# Use curl to test upload (you'll need a real device ID)
curl -X POST \
  -F "appFile=@test.apk" \
  -F "deviceId=YOUR_DEVICE_ID" \
  -F "userId=test-user" \
  http://localhost:3000/api/upload-app
```

### Step 4: Check Server Logs
```bash
# View real-time server logs
tail -f dev.log
```

### Step 5: Check Upload Directory
```bash
# Verify uploads directory exists and is writable
ls -la uploads/apps/
touch uploads/apps/test-write && rm uploads/apps/test-write
```

## 📱 Testing with Real APK Files

### Sample APK Sources
If you don't have an APK file for testing:

1. **Android Studio Projects**: Build any Android project to generate APK
2. **Open Source Apps**: Download from F-Droid or GitHub
3. **Sample APKs**: Use small demo APKs for testing

### Recommended Test APK Properties:
- **Size**: Under 10MB (for faster testing)
- **Type**: Debug APK (smaller than release APK)
- **Format**: `.apk` (`.aab` also supported)

## 🛠 Advanced Troubleshooting

### Check Database State
```bash
# Check if devices exist in database
npx prisma studio
```

### Verify File Upload Limits
The system has these limits:
- **Maximum file size**: 100MB
- **Allowed extensions**: `.apk`, `.aab`
- **MIME types**: `application/vnd.android.package-archive`, `application/octet-stream`

### Check Next.js Configuration
Verify `next.config.ts` has proper configuration for file uploads:
```typescript
// next.config.ts should include:
export const config = {
  api: {
    bodyParser: false, // Allow FormData
  },
}
```

## 🐛 Debug Mode

### Enable Detailed Logging
Check the server logs for detailed error messages:
```bash
# View server logs in real-time
tail -f dev.log | grep -i "upload\|error\|apk"
```

### Browser Developer Tools
1. Open browser developer tools (F12)
2. Go to Network tab
3. Attempt upload
4. Check the request to `/api/upload-app`
5. Look for error responses

### Test with Different Files
Try uploading different types of files to isolate the issue:
- Small text file (should fail validation)
- Small APK file (should work)
- Large APK file (may fail size validation)
- Renamed file (extension test)

## 📞 Getting Help

If you're still having issues:

1. **Check the debug tool**: `http://localhost:3000/debug`
2. **Review server logs**: Look for error messages in `dev.log`
3. **Test with different files**: Isolate whether it's a file-specific issue
4. **Try different browsers**: Rule out browser-specific problems
5. **Check console errors**: Browser developer tools may show client-side errors

## 🔄 Reset and Retry

If all else fails, you can reset the testing environment:

```bash
# Clear uploads directory
rm -rf uploads/apps
mkdir -p uploads/apps
chmod 755 uploads/apps

# Reset database (optional)
npm run db:reset

# Restart server
npm run dev
```

Remember: This is a development environment. In production, you would need additional security measures, proper file storage, and real device integration.