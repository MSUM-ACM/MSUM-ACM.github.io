# GitHub Action: RSS → repo data

## What this shows
- On a schedule (hourly) or manual dispatch, the workflow:
  1. Checks out the repo.
  2. Installs Python and `feedparser`.
  3. Runs `automation/scripts/fetch_rss.py` to fetch an RSS/Atom feed.
  4. Writes/updates `public/data/rss.json` with new items.
  5. Commits the change if there are new items.

## Setup
1. Put the workflow file at `.github/workflows/rss.yml` (already included under `automation/.github/workflows/rss.yml` in this package).
2. In the GitHub repo settings, add a **Repository secret** named `RSS_URL` with the feed you want (e.g., `https://example.com/feed.xml`).
3. Push the `automation/` and `public/` folders to the repo root.
4. The action will run hourly. You can also trigger it via **Actions → Update RSS to data/rss.json → Run workflow**.

## Output
- The aggregated items live at `public/data/rss.json` and can be fetched on the website to render a simple News section.

## Notes
- De-dupes by hashing the item’s id/link/title.
- Keeps existing items and appends new ones, sorted newest-first.
- If your source provides no RSS, consider: a Google Calendar public feed, Dragon Central exports, or a lightweight Google Apps Script that emits RSS from a Sheet.
