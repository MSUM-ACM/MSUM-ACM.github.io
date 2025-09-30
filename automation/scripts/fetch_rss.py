# Fetches an RSS feed, updates data/rss.json with new items, and writes a last_seen.txt marker.
# Usage: python scripts/fetch_rss.py --url "https://example.com/feed.xml"

import argparse, hashlib, json, os, sys, time
from datetime import datetime, timezone

try:
    import feedparser
except ImportError:
    print(
        "feedparser not installed. In Actions, the workflow installs it via pip.",
        file=sys.stderr,
    )
    sys.exit(2)


def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True, help="RSS/Atom feed URL")
    ap.add_argument(
        "--output", default="data/rss.json", help="Path to JSON output file"
    )
    ap.add_argument(
        "--state",
        default=".rss_last_seen.txt",
        help="Path to marker file for last seen item",
    )
    return ap.parse_args()


def item_key(entry):
    # Create a stable key using id/link/title+published
    basis = entry.get("id") or entry.get("link") or entry.get("title", "")
    return hashlib.sha1(basis.encode("utf-8", "ignore")).hexdigest()[:16]


def iso_now():
    return datetime.now(timezone.utc).isoformat()


def main():
    args = parse_args()
    feed = feedparser.parse(args.url)
    if feed.bozo:
        print("Feed parse error.", file=sys.stderr)
        sys.exit(3)

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    items = []
    if os.path.exists(args.output):
        with open(args.output, "r", encoding="utf-8") as f:
            try:
                items = json.load(f)
            except Exception:
                items = []

    seen = set(i.get("key") for i in items if "key" in i)

    new_count = 0
    for e in feed.entries[:50]:
        key = item_key(e)
        if key in seen:
            continue
        items.append(
            {
                "key": key,
                "title": e.get("title", "").strip(),
                "link": e.get("link", ""),
                "published": e.get("published", ""),
                "summary": e.get("summary", ""),
                "fetched_at": iso_now(),
            }
        )
        seen.add(key)
        new_count += 1

    if new_count > 0:
        # Sort newest first by published or fetched_at
        def ts(v):
            return v.get("published") or v.get("fetched_at")

        items.sort(key=lambda v: ts(v) or "", reverse=True)
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        print(f"Added {new_count} new item(s).")
        sys.exit(0)
    else:
        print("No new items.")
        sys.exit(0)


if __name__ == "__main__":
    main()
