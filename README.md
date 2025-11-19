# MSUM ACM Website

Official website for the Minnesota State University Moorhead Association for Computing Machinery (ACM) student chapter.

## Live Site

**Production**: [msum-acm.github.io](https://msum-acm.github.io/)

## Features


- **Automatic event updates** from Dragon Central via GitHub Actions (every 6 hours)
- **Discord integration** with live member count widget

## Project Structure

```
msum-acm.github.io/
├── .github/
│   └── workflows/
│       └── fetch-acm-events.yml    # Auto-updates events every 6 hours
├── automation/
│   ├── RSS_ACTION_DOC.md           # Documentation for automation
│   └── scripts/
│       └── fetch_rss.py            # Fetches Dragon Central RSS feed
├── docs/                           # GitHub Pages root
│   ├── index.html                  # Main homepage
│   ├── research.html               # Faculty research page
│   ├── past-board.html             # Past board members archive
│   ├── guides.html                 # Developer guides
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css           # All styling and animations
│   │   ├── img/                    # Logos and board member photos
│   │   └── js/
│   │       ├── app.js              # Main JavaScript (navigation, board, gallery)
│   │       ├── discord-widget.js   # Live Discord member count
│   │       ├── rss-parser.js       # Events display
│   │       ├── projects.js         # Projects page functionality
│   │       └── resources.js        # Resources page functionality
│   └── data/
│       ├── board.json              # Current board member information
│       ├── board-history.json      # Past board members by year
│       ├── events.json             # Auto-updated from Dragon Central
│       ├── gallery.json            # Photo gallery data
│       ├── projects.json           # Student projects
│       └── resources.json          # Learning resources
├── LICENSE
├── README.md
```

## Editing Content

### Board Members

Edit `docs/data/board.json` to update current board:

```json
{
  "advisor": {
    "name": "Professor Name",
    "role": "ACM Advisor",
    "years": "Spring 2025 - Present",
    "bio": "Brief bio...",
    "github_url": "https://github.com/username"
  },
  "members": [
    {
      "name": "Student Name",
      "role": "President",
      "years": "Spring 2025 - Fall 2025",
      "bio": "Brief bio...",
      "github_url": "https://github.com/username"
    }
  ]
}
```

**Adding photos**: Place images in `docs/assets/img/` and reference in board.json, or leave blank for auto-generated avatars.

### Past Board Members

Edit `docs/data/board-history.json` to archive previous boards:

```json
{
  "2025": {
    "advisor": { ... },
    "members": [ ... ]
  },
  "2024": {
    "advisor": { ... },
    "members": [ ... ]
  }
}
```

### Events

**Events update automatically!** Just post events to Dragon Central and they'll appear within 6 hours.

- **RSS Feed**: `https://mnstate.campuslabs.com/engage/organization/msum_acm/events.rss`
- **Output**: `docs/data/events.json`
- **Workflow**: `.github/workflows/fetch-acm-events.yml`

**Manual trigger**: Go to repository → Actions → "Update ACM Events" → Run workflow

### Photo Gallery

Edit `docs/data/gallery.json`:

```json
{
  "years": [
    {
      "label": "2025-2026",
      "folder": "2025-2026",
      "images": ["01.jpg", "02.jpg", "03.jpg"]
    }
  ]
}
```

Upload images to `docs/assets/img/gallery/{year}/` folder.

### Projects

Edit `docs/data/projects.json` to add student projects with descriptions, technologies, and GitHub links.

### Resources

Edit `docs/data/resources.json` to add learning resources, tutorials, and documentation links.

**Dependencies**:
- Python 3.11
- feedparser library
- No secrets required (public RSS feed)

**Testing locally**:
```bash
pip install feedparser
python automation/scripts/fetch_rss.py
cat docs/data/events.json
```

## Running Locally

### Python HTTP Server (Recommended)

```bash
# Navigate to repo
cd msum-acm.github.io

# Start server
python -m http.server 8000 -d docs

# Visit http://localhost:8000
```

### Node.js HTTP Server

```bash
npm install -g http-server
cd docs
http-server -p 8000
```


## Contact

- **Email**: msumacm@mnstate.edu
- **Dragon Central**: https://mnstate.campuslabs.com/engage/organization/msum_acm

## License

See [LICENSE](LICENSE) file for details.


--- 
**Maintained by MSUM ACM Web Team**
