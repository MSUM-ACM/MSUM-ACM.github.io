# Fetches ACM events from Dragon Central RSS feed and updates docs/data/events.json
# Usage: python automation/scripts/fetch_rss.py

import hashlib, json, os, sys, re
from datetime import datetime, timezone
from xml.etree import ElementTree as ET

try:
    import feedparser
except ImportError:
    print(
        "feedparser not installed. In Actions, the workflow installs it via pip.",
        file=sys.stderr,
    )
    sys.exit(2)


# ACM Dragon Central RSS Feed
ACM_RSS_URL = "https://mnstate.campuslabs.com/engage/organization/msum_acm/events.rss"
OUTPUT_FILE = "docs/data/events.json"


def item_key(entry):
    """Create a stable key using id/link/title"""
    basis = entry.get("id") or entry.get("link") or entry.get("title", "")
    return hashlib.sha1(basis.encode("utf-8", "ignore")).hexdigest()[:16]


def clean_html(raw_html):
    """Remove HTML tags and clean up text"""
    if not raw_html:
        return ""
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', '', raw_html)
    # Decode HTML entities
    clean = re.sub(r'&nbsp;', ' ', clean)
    clean = re.sub(r'&amp;', '&', clean)
    clean = re.sub(r'&lt;', '<', clean)
    clean = re.sub(r'&gt;', '>', clean)
    # Clean up whitespace
    clean = re.sub(r'\s+', ' ', clean).strip()
    # Truncate if too long
    if len(clean) > 300:
        clean = clean[:297] + "..."
    return clean


def extract_author(entry):
    """Extract clean author/host name"""
    author = entry.get("author", "MSUM ACM")
    # Remove email format: "email@example.com (Name)" -> "Name"
    match = re.search(r'\(([^)]+)\)', author)
    if match:
        return match.group(1)
    return author


def iso_now():
    return datetime.now(timezone.utc).isoformat()


def main():
    print(f"Fetching ACM events from: {ACM_RSS_URL}")
    
    feed = feedparser.parse(ACM_RSS_URL)
    if feed.bozo:
        print("Feed parse error.", file=sys.stderr)
        # Don't fail completely - might be temporary network issue
        # Keep existing events file intact
        sys.exit(0)

    # Create output directory if needed
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    # Load existing events
    existing_events = []
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                if isinstance(data, dict) and "events" in data:
                    existing_events = data.get("events", [])
                elif isinstance(data, list):
                    existing_events = data
            except Exception as e:
                print(f"Error loading existing events: {e}", file=sys.stderr)
                existing_events = []

    # Track seen events
    seen = set(e.get("key") for e in existing_events if "key" in e)
    
    # Process new events
    events = []
    new_count = 0
    
    for entry in feed.entries[:50]:  # Limit to 50 most recent
        key = item_key(entry)
        
        # Check if we've already processed this event
        if key in seen:
            # Keep existing event data
            for existing in existing_events:
                if existing.get("key") == key:
                    events.append(existing)
                    break
            continue
        
        # Parse new event
        event = {
            "key": key,
            "title": entry.get("title", "Untitled Event").strip(),
            "link": entry.get("link", ""),
            "description": clean_html(entry.get("summary", "")),
            "author": extract_author(entry),
            "host": extract_author(entry),
            "pubDate": entry.get("published", ""),
            "start": entry.get("ev_startdate", entry.get("published", "")),
            "end": entry.get("ev_enddate", ""),
            "location": entry.get("ev_location", "TBA"),
            "categories": [tag.get("term", "") for tag in entry.get("tags", [])],
            "fetched_at": iso_now()
        }
        
        events.append(event)
        seen.add(key)
        new_count += 1
    
    # Sort by start date (newest first)
    def get_date(event):
        return event.get("start") or event.get("pubDate") or event.get("fetched_at") or ""
    
    events.sort(key=get_date, reverse=True)
    
    # Write output with metadata
    output = {
        "lastUpdated": iso_now(),
        "totalEvents": len(events),
        "events": events,
        "message": "Events automatically updated by GitHub Actions every 6 hours"
    }
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    if new_count > 0:
        print(f"✅ Added {new_count} new event(s). Total events: {len(events)}")
    else:
        print(f"✅ No new events. Total events: {len(events)}")
    
    sys.exit(0)


if __name__ == "__main__":
    main()
