# GitHub Action: ACM Events Auto-Update# GitHub Action: RSS → repo data



## What This Does## What this shows

Automatically fetches ACM events from Dragon Central and updates the website every 6 hours!- On a schedule (hourly) or manual dispatch, the workflow:

  1. Checks out the repo.

- On a schedule (every 6 hours) or manual dispatch, the workflow:  2. Installs Python and `feedparser`.

  1. Checks out the repo  3. Runs `automation/scripts/fetch_rss.py` to fetch an RSS/Atom feed.

  2. Installs Python and `feedparser`  4. Writes/updates `public/data/rss.json` with new items.

  3. Runs `automation/scripts/fetch_rss.py` to fetch ACM events from Dragon Central  5. Commits the change if there are new items.

  4. Updates `docs/data/events.json` with new events

  5. Commits and pushes changes if there are new events## Setup

1. Put the workflow file at `.github/workflows/rss.yml` (already included under `automation/.github/workflows/rss.yml` in this package).

## Setup ✅ (Already Configured!)2. In the GitHub repo settings, add a **Repository secret** named `RSS_URL` with the feed you want (e.g., `https://example.com/feed.xml`).

1. ✅ Workflow file exists at `.github/workflows/fetch-acm-events.yml`3. Push the `automation/` and `public/` folders to the repo root.

2. ✅ Python script configured at `automation/scripts/fetch_rss.py`4. The action will run hourly. You can also trigger it via **Actions → Update RSS to data/rss.json → Run workflow**.

3. ✅ RSS URL hardcoded: `https://mnstate.campuslabs.com/engage/organization/msum_acm/events.rss`

4. ✅ Output file: `docs/data/events.json`## Output

- The aggregated items live at `public/data/rss.json` and can be fetched on the website to render a simple News section.

## How to Use

## Notes

### Automatic Updates- De-dupes by hashing the item’s id/link/title.

- The action runs **every 6 hours** automatically- Keeps existing items and appends new ones, sorted newest-first.

- No manual intervention needed!- If your source provides no RSS, consider: a Google Calendar public feed, Dragon Central exports, or a lightweight Google Apps Script that emits RSS from a Sheet.


### Manual Trigger
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Update ACM Events** workflow
4. Click **Run workflow** button
5. Events will be fetched immediately

## Output
- Events are stored in `docs/data/events.json`
- The website (`docs/assets/js/rss-parser.js`) automatically loads and displays them
- Format includes: title, description, date, location, link, author, categories

## Features
- ✅ De-duplicates events by hashing id/link/title
- ✅ Keeps existing events and appends new ones
- ✅ Sorts events newest-first by start date
- ✅ Cleans HTML from descriptions
- ✅ Extracts clean author names
- ✅ Only commits if there are actual changes
- ✅ Includes metadata (last updated timestamp, event count)

## Testing Locally
```bash
# Install dependencies
pip install feedparser

# Run the script
python automation/scripts/fetch_rss.py

# Check the output
cat docs/data/events.json
```

## Notes
- Currently Dragon Central shows "0 events" for ACM (organization hasn't posted any yet)
- When ACM posts events to Dragon Central, they'll automatically appear on the website within 6 hours
- The RSS feed is ACM-specific (only includes MSUM ACM events, not all campus events)
