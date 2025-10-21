# MSUM ACM Website# ACM Website - GitHub Actions Edition



Official website for the Minnesota State University Moorhead Association for Computing Machinery (ACM) student chapter.This is a complete **static website** with GitHub Actions form processing - fully converted from the original PHP/LAMP demo. Ready for GitHub Pages deployment with unlimited form submissions.



## 🚀 Live Site## 🚀 Quick Test (Updated Instructions)



**Production**: [https://the-trio-jlz.github.io/the-Trio-JLZ.github.io/](https://the-trio-jlz.github.io/the-Trio-JLZ.github.io/)1. Open PowerShell in this folder

2. Navigate to the repo: `cd the-Trio-JLZ.github.io`

## ✨ Features3. Run: `python -m http.server 8000 -d docs`

4. Open <http://localhost:8000> in browser

- **Modern single-page design** with smooth scrolling and animations5. Test all features (forms open external links)

- **Automatic event updates** from Dragon Central via GitHub Actions (every 6 hours)6. Check browser console for any JavaScript errors

- **Dynamic board member display** from JSON data

- **Photo gallery** with year filtering and lightbox view## 📦 What's Included

- **Research highlights** and current projects

- **Student services** (3D printing, laptop lending, computer clinic)### Core Features (Ready to Use)

- **Git learning resources** with essential commands and tutorials

- **Fully responsive** mobile-first design- **Single-page scroll site** with smooth navigation and animations

- **Accessible** with ARIA labels and keyboard navigation- **External forms** - Google/Microsoft Forms integration (no backend needed)

- **Board section** - reads from `data/board.json` with advisor highlighting

## 📁 Project Structure- **Auto-generated avatars** - UI Avatars API for missing photos

- **RSS Events parsing** - Dragon Central integration with CORS workaround

```- **Static site** - No PHP required, GitHub Pages ready

the-Trio-JLZ.github.io/- **Accessibility** - Focus states, ARIA labels, keyboard navigation

├── .github/

│   └── workflows/### Files Structure

│       └── fetch-acm-events.yml    # Auto-updates events every 6 hours

├── automation/```text

│   ├── RSS_ACTION_DOC.md           # Documentation for automationdocs/

│   └── scripts/├── index.html                 # Main static website

│       └── fetch_rss.py            # Fetches Dragon Central RSS feed├── events.rss                # Dragon Central RSS feed

├── docs/                           # GitHub Pages root├── assets/

│   ├── index.html                  # Main website│   ├── css/style.css         # Complete styling with animations

│   ├── assets/│   ├── img/                  # Logo and board member photos

│   │   ├── css/│   └── js/

│   │   │   └── style.css          # All styling and animations│       ├── app.js           # Navigation, modals, board loading, animations

│   │   ├── img/                    # Logos and photos│       └── rss-parser.js    # RSS parsing with CORS solution

│   │   └── js/├── data/

│   │       ├── app.js             # Main JavaScript│   ├── board.json           # Board member data

│   │       └── rss-parser.js      # Events display logic│   └── events.json          # Events data

│   └── data/automation/

│       ├── board.json              # Board member information└── scripts/

│       ├── events.json             # Auto-updated from Dragon Central    └── fetch_rss.py         # RSS fetching script

│       └── gallery.json            # Photo gallery data```

├── LICENSE

└── README.md## 👨‍💻 For Judah - Next Steps

```

### Immediate Tasks

## 🧪 Local Testing

1. **Configure External Forms**: Create Google/Microsoft Forms and update URLs in `index.html`

### Method 1: Python HTTP Server (Recommended)2. **Update Board Data**: Edit `docs/data/board.json` with real member info

```bash3. **Deploy to GitHub Pages**: Enable Pages in repository settings (use `/docs` folder)

cd the-Trio-JLZ.github.io4. **Add Member Photos**: Upload photos or use auto-generated avatars

python -m http.server 8000 -d docs5. **Test All Links**: Verify forms, Discord invite, email links work

# Visit: http://localhost:8000

```### Production Deployment



### Method 2: VS Code Live Server- Push to GitHub repository (MSUM-ACM organization or the-Trio-JLZ)

1. Install "Live Server" extension- Enable GitHub Pages: Settings → Pages → Source: "main branch /docs folder"

2. Right-click `docs/index.html` → "Open with Live Server"- Configure form URLs in `index.html` (Google Forms recommended)

- Optional: Set up Cloudflare R2 for media storage (see `MEDIA_STORAGE_GUIDE.md`)

### Method 3: Node.js HTTP Server

```bash### Additional Features (Optional)

npm install -g http-server

cd docs- Set up media storage using YouTube + Cloudflare R2 (see guide)

http-server -p 8000- Add more board member photos

```- Integrate RSS automation from `automation/` folder



## 🤖 Automated Event Updates## 🔧 Technical Notes



Events are automatically fetched from Dragon Central every 6 hours via GitHub Actions:- **Static site**: Pure HTML/CSS/JavaScript (no PHP or backend required)

- **External Forms**: Google/Microsoft Forms (unlimited submissions)

- **RSS Feed**: `https://mnstate.campuslabs.com/engage/organization/msum_acm/events.rss`- **Mobile responsive**: Complete responsive design with modern fonts

- **Output**: `docs/data/events.json`- **Form validation**: Client-side validation, external form processing

- **Workflow**: `.github/workflows/fetch-acm-events.yml`- **RSS Integration**: Dragon Central events with CORS workaround

- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

For details, see [automation/RSS_ACTION_DOC.md](automation/RSS_ACTION_DOC.md)- **Animations**: Smooth scroll, fade-in effects, hover states

- **Auto Avatars**: UI Avatars API for missing board photos

### Manual Trigger

1. Go to repository → Actions tab## � Ready for Production

2. Select "Update ACM Events" workflow

3. Click "Run workflow"The website is production-ready! Just configure your external forms and deploy to GitHub Pages.



## 📝 Updating Content**See `MEDIA_STORAGE_GUIDE.md` for optional media hosting setup.**


### Board Members
Edit `docs/data/board.json`:
```json
{
  "name": "John Doe",
  "role": "President",
  "photo": "assets/img/john-doe.jpg",
  "bio": "Computer Science major, passionate about AI"
}
```

### Photo Gallery
Edit `docs/data/gallery.json`:
```json
{
  "src": "assets/img/gallery/event-name.jpg",
  "caption": "Event description",
  "year": "2024"
}
```

### Events
Events update automatically! Just post to Dragon Central.

## 🚀 Deployment

### GitHub Pages (Current Setup)
1. Push changes to `main` branch
2. GitHub Pages serves from `/docs` folder
3. Site updates automatically

### Custom Domain (Optional)
1. Add `CNAME` file to `docs/` with your domain
2. Configure DNS records with your provider
3. Enable HTTPS in repository settings

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Fonts**: Google Fonts (Inter, Poppins)
- **Automation**: Python + feedparser library
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

## 📞 Contact

- **Email**: msumacm@mnstate.edu
- **Discord**: [Join our server](https://discord.gg/GKy9htGXau)
- **Dragon Central**: [MSUM ACM Organization](https://mnstate.campuslabs.com/engage/organization/msum_acm)

## 📄 License

See [LICENSE](LICENSE) file for details.

---

**Maintained by MSUM ACM Web Team**
