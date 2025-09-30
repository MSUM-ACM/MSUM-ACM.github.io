# ACM Website - GitHub Actions Edition

This is a complete **static website** with GitHub Actions form processing - fully converted from the original PHP/LAMP demo. Ready for GitHub Pages deployment with unlimited form submissions.

## 🚀 Quick Test (Updated Instructions)

1. Open PowerShell in this folder
2. Run: `python -m http.server 8000 -d public` (or use VS Code Live Server)
3. Open <http://localhost:8000> in browser
4. Test all **modal forms** (Contact, 3D Print, Laptop Borrowing)
5. Forms will show 401 errors locally (normal) - they work on GitHub Pages
6. Check browser console for any JavaScript errors

## 📦 What's Included

### Core Features (Ready to Use)

- **Single-page scroll site** with smooth navigation
- **Contact modal** - GitHub Issues integration with Discord notifications
- **Board section** - reads from `data/board.json` with advisor highlighting
- **3D Print & Laptop borrowing forms** - full GitHub Actions processing
- **RSS Events parsing** - Dragon Central integration with CORS workaround
- **Static site** - No PHP required, GitHub Pages ready

### Files Structure

```text
public/
├── index.html                 # Main static website
├── events.rss                # Dragon Central RSS feed
├── assets/
│   ├── css/style.css         # Complete styling with Inter/Poppins fonts
│   ├── img/                  # Logo and board member photos
│   └── js/
│       ├── app.js           # Navigation, modals, board loading
│       ├── github-forms.js  # GitHub Issues form system
│       └── rss-parser.js    # RSS parsing with CORS solution
├── data/
│   ├── board.json           # Board member data (update this!)
│   └── events.json          # Events data
.github/
├── workflows/
│   ├── handle-forms.yml     # Process forms → Discord
│   └── update-events.yml    # RSS → JSON conversion
└── ISSUE_TEMPLATE/          # Form templates for GitHub Issues
```

## 👨‍💻 For Judah - Next Steps

### Immediate Tasks

1. **Update Repository Config**: Verify GitHub repo name in `index.html`
2. **Update Board Data**: Edit `public/data/board.json` with real member info
3. **Add Discord Webhook**: Set up `DISCORD_WEBHOOK_URL` secret in GitHub repo
4. **Deploy to GitHub Pages**: Enable Pages in repository settings
5. **Test Forms**: Verify GitHub Issues creation and Discord notifications

### Production Deployment

- Push to GitHub repository (MSUM-ACM organization)
- Enable GitHub Pages: Settings → Pages → Source: "main branch /public folder"
- Configure Discord webhook for form notifications
- Forms automatically work via GitHub Actions (no server setup needed)

### Additional Features (as needed)

- Hook up 3D print & laptop forms to actual backend
- Add image galleries using external storage (as discussed)
- Integrate RSS automation from `automation/` folder

## 🔧 Technical Notes

- **Static site**: Pure HTML/CSS/JavaScript (no PHP required)
- **GitHub Actions**: Handles all form processing and Discord notifications
- **Mobile responsive**: Complete responsive design with modern fonts
- **Form validation**: Client-side validation with GitHub Issues backend
- **RSS Integration**: Dragon Central events with CORS workaround
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 📋 GitHub Actions System

- **Forms → GitHub Issues**: All form submissions create trackable Issues
- **Discord Notifications**: Automatic alerts for new submissions  
- **RSS Processing**: Converts Dragon Central RSS to JSON for display
- **Unlimited Forms**: No submission limits (vs 5/month with Formspree)

## 🚀 Ready for Production

**See `UPDATE_FOR_JUDAH.md` for complete deployment guide and status update.**
