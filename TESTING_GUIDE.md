# 🧪 Local Testing Guide for ACM Website

## Quick Setup Guide

### 1. Configure GitHub Repository Settings

**Update the GitHub repository configuration in `public/index.html`:**
```javascript
github: {
  repoOwner: "your-actual-username", // Replace with your GitHub username
  repoName: "your-repo-name"         // Replace with your repository name
}
```

### 2. Choose Your Local Testing Method

#### Option A: XAMPP (Recommended - You already have it)
```powershell
# Copy files to XAMPP directory (you already did this)
Copy-Item -Recurse "public/*" "C:\xampp\htdocs\acm_site_demo\"

# Start XAMPP Control Panel
# Start Apache service
# Visit: http://localhost/acm_site_demo/
```

#### Option B: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `public/index.html` → "Open with Live Server"
3. Your site opens at `http://127.0.0.1:5500/public/`

#### Option C: Python HTTP Server
```powershell
# Navigate to the public directory
cd "C:\Users\Laween\Downloads\acm_site_demo\public"

# Start Python server
python -m http.server 8000

# Visit: http://localhost:8000
```

#### Option D: Node.js HTTP Server
```powershell
# Install http-server globally
npm install -g http-server

# Navigate to public directory
cd "C:\Users\Laween\Downloads\acm_site_demo\public"

# Start server
http-server -p 8000

# Visit: http://localhost:8000
```

## 🔍 Testing the Forms Locally

### Step 1: Basic Page Load Test
1. Open your local site
2. Check browser console (F12) for any JavaScript errors
3. Verify all sections load correctly
4. Test modal open/close functionality

### Step 2: Test Form Submission (Without GitHub API)
**Note: Forms will fail to submit until you configure a real GitHub repository, but you can test the JavaScript logic:**

1. **Open Contact Modal**: Click "Get In Touch" button
2. **Fill out form**: Add name, email, message
3. **Submit**: Click submit button
4. **Expected behavior**:
   - Button shows "Sending..."
   - Console shows error (expected - no real GitHub repo configured)
   - Status shows error message

### Step 3: Configure Real GitHub Repository
1. **Create a GitHub repository** for your website
2. **Update configuration** in `public/index.html`:
   ```javascript
   github: {
     repoOwner: "your-username",    // Your actual GitHub username
     repoName: "acm-website"        // Your actual repository name
   }
   ```
3. **Create repository secrets** (for GitHub Actions):
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add `DISCORD_WEBHOOK_URL` (optional for testing)

### Step 4: Test Real Form Submission
1. **Submit a test form** with real data
2. **Check GitHub Issues**: Go to your repository → Issues tab
3. **Verify issue creation**: Look for new issue with form data
4. **Check Discord** (if configured): Look for notification

## 🐛 Common Issues & Solutions

### Issue: "GitHub API error: 422"
**Solution**: Repository doesn't exist or name is wrong
- Verify repository exists
- Check spelling of owner/repo names
- Make sure repository is public

### Issue: "Network error"
**Solution**: CORS or connection issue
- Test on actual domain (not localhost) if needed
- Check browser console for detailed error

### Issue: "Form submission not working"
**Solution**: JavaScript not loading properly
- Check browser console for errors
- Verify all script tags are correct
- Ensure files are in correct directories

### Issue: Modal not opening
**Solution**: CSS or JavaScript issue
- Check if `assets/css/style.css` is loading
- Verify button IDs match JavaScript selectors
- Test without browser extensions

## 📋 Test Checklist

### Basic Functionality
- [ ] Page loads without errors
- [ ] Navigation scrolling works
- [ ] All modals open/close correctly
- [ ] Board members display from JSON
- [ ] RSS events load (if available)

### Form Testing
- [ ] Contact form modal opens
- [ ] 3D Print form modal opens  
- [ ] Laptop borrowing form modal opens
- [ ] Form validation works (required fields)
- [ ] Submit buttons disable during submission
- [ ] Status messages display correctly

### GitHub Integration (After Configuration)
- [ ] Forms create GitHub Issues
- [ ] Issues have correct labels
- [ ] Issue content is properly formatted
- [ ] GitHub Actions workflow triggers (if set up)
- [ ] Discord notifications work (if configured)

## 🚀 Deploy to GitHub Pages

Once local testing is complete:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add ACM website with GitHub Actions forms"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set source to "Deploy from a branch"
   - Select "main" branch and "/public" folder
   - Save

3. **Access live site**:
   - Visit: `https://your-username.github.io/your-repo-name/`

## 🔧 Advanced Testing

### Test GitHub Actions Locally
```powershell
# Install act (GitHub Actions local runner)
# Run workflows locally to test before pushing
```

### Test with Different Browsers
- Chrome/Edge (Chromium-based)
- Firefox
- Safari (if available)

### Test Responsive Design
- Desktop (1920x1080)
- Tablet (768px width)
- Mobile (375px width)

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify all file paths are correct
3. Test with different browsers
4. Check GitHub repository permissions
5. Validate JSON files with online JSON validators