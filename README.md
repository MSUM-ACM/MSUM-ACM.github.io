# ACM Website - GitHub Actions Edition

This is a complete **static website** with GitHub Actions form processing - fully converted from the original PHP/LAMP demo. Ready for GitHub Pages deployment with unlimited form submissions.

## 🚀 Quick Test (Updated Instructions)

1. Open PowerShell in this folder
2. Navigate to the repo: `cd the-Trio-JLZ.github.io`
3. Run: `python -m http.server 8000 -d docs`
4. Open <http://localhost:8000> in browser
5. Test all features (forms open external links)
6. Check browser console for any JavaScript errors

## 📦 What's Included

### Core Features (Ready to Use)

- **Single-page scroll site** with smooth navigation and animations
- **External forms** - Google/Microsoft Forms integration (no backend needed)
- **Board section** - reads from `data/board.json` with advisor highlighting
- **Auto-generated avatars** - UI Avatars API for missing photos
- **RSS Events parsing** - Dragon Central integration with CORS workaround
- **Static site** - No PHP required, GitHub Pages ready
- **Accessibility** - Focus states, ARIA labels, keyboard navigation

### Files Structure

```text
docs/
├── index.html                 # Main static website
├── events.rss                # Dragon Central RSS feed
├── assets/
│   ├── css/style.css         # Complete styling with animations
│   ├── img/                  # Logo and board member photos
│   └── js/
│       ├── app.js           # Navigation, modals, board loading, animations
│       └── rss-parser.js    # RSS parsing with CORS solution
├── data/
│   ├── board.json           # Board member data
│   └── events.json          # Events data
automation/
└── scripts/
    └── fetch_rss.py         # RSS fetching script
```

## 👨‍💻 For Judah - Next Steps

### Immediate Tasks

1. **Configure External Forms**: Create Google/Microsoft Forms and update URLs in `index.html`
2. **Update Board Data**: Edit `docs/data/board.json` with real member info
3. **Deploy to GitHub Pages**: Enable Pages in repository settings (use `/docs` folder)
4. **Add Member Photos**: Upload photos or use auto-generated avatars
5. **Test All Links**: Verify forms, Discord invite, email links work

### Production Deployment

- Push to GitHub repository (MSUM-ACM organization or the-Trio-JLZ)
- Enable GitHub Pages: Settings → Pages → Source: "main branch /docs folder"
- Configure form URLs in `index.html` (Google Forms recommended)
- Optional: Set up Cloudflare R2 for media storage (see `MEDIA_STORAGE_GUIDE.md`)

### Additional Features (Optional)

- Set up media storage using YouTube + Cloudflare R2 (see guide)
- Add more board member photos
- Integrate RSS automation from `automation/` folder

## 🔧 Technical Notes

- **Static site**: Pure HTML/CSS/JavaScript (no PHP or backend required)
- **External Forms**: Google/Microsoft Forms (unlimited submissions)
- **Mobile responsive**: Complete responsive design with modern fonts
- **Form validation**: Client-side validation, external form processing
- **RSS Integration**: Dragon Central events with CORS workaround
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Animations**: Smooth scroll, fade-in effects, hover states
- **Auto Avatars**: UI Avatars API for missing board photos

## � Ready for Production

The website is production-ready! Just configure your external forms and deploy to GitHub Pages.

**See `MEDIA_STORAGE_GUIDE.md` for optional media hosting setup.**
