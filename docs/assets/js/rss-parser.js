// rss-parser.js - Load processed MSUM/ACM events (JSON) and display them

class RSSParser {
  constructor() {
    this.eventsContainer = document.getElementById('eventsContainer');
    this.maxEvents = 6; // Show 6 most recent events
  }

  async loadEvents() {
    try {
      const response = await fetch('data/events.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const events = Array.isArray(data?.events) ? data.events : [];
      if (events.length === 0) {
        this.showNoEventsMessage();
        return;
      }

      this.displayProcessedEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
      this.showErrorMessage();
    }
  }

  displayProcessedEvents(events) {
    // Filter for relevant events (ACM, CS, tech keywords)
    const keywords = /ACM|Association for Computing Machinery|Computer Science|Programming|Coding|Tech|Software|Development|Hackathon|IT|Data Science|Web Development|Algorithm|Machine Learning|AI/i;

    const relevant = events.filter(evt => {
      const title = evt.title || '';
      const desc = evt.description || '';
      const author = evt.author || '';
      const host = evt.host || '';
      const cats = Array.isArray(evt.categories) ? evt.categories.join(' ') : '';
      return (
        keywords.test(title) ||
        keywords.test(desc) ||
        keywords.test(author) ||
        keywords.test(host) ||
        keywords.test(cats)
      );
    });

    const eventsToShow = (relevant.length > 0 ? relevant : events)
      .slice(0, this.maxEvents)
      .map(evt => ({
        title: evt.title || 'Untitled Event',
        description: this.extractText(evt.description || ''),
        author: evt.host || evt.author || 'MSUM',
        date: this.formatEventDate(evt.start || evt.pubDate, evt.end),
        location: evt.location || 'TBA',
        link: evt.link || '#'
      }));

    if (eventsToShow.length === 0) {
      this.showNoEventsMessage();
      return;
    }

    this.displayEvents(eventsToShow);
  }

  extractText(raw) {
    // Strip HTML & truncate
    const div = document.createElement('div');
    div.innerHTML = raw;
    const text = (div.textContent || div.innerText || '').trim();
    return text.length > 200 ? text.slice(0, 200) + '…' : text;
  }

  formatEventDate(startDate, endDate) {
    try {
      if (!startDate) return 'Date TBA';
      const start = new Date(startDate);
      if (Number.isNaN(start.getTime())) return 'Date TBA';

      const datePart = start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      const timePart = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      let formatted = `${datePart} ${timePart}`;

      if (endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.getTime())) {
          const endTime = end.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          formatted += ` – ${endTime}`;
        }
      }
      return formatted;
    } catch {
      return 'Date TBA';
    }
  }

  displayEvents(events) {
    if (!this.eventsContainer) {
      console.error('Events container not found');
      return;
    }

    if (events.length === 0) {
      this.eventsContainer.innerHTML = `
        <div class="no-events">
          <p>No upcoming events found. Check back soon!</p>
          <p><a href="https://mnstate.campuslabs.com/engage/events" target="_blank" rel="noopener">View all MSUM events</a></p>
        </div>`;
      return;
    }

    const html = events.map(e => `
      <div class="event-card">
        <div class="event-header">
          <h3 class="event-title">${this.escapeHtml(e.title)}</h3>
          <span class="event-author">${this.escapeHtml(e.author)}</span>
        </div>
        <div class="event-details">
          <div class="event-date">📅 ${this.escapeHtml(e.date)}</div>
          <div class="event-location">📍 ${this.escapeHtml(e.location)}</div>
        </div>
        <p class="event-description">${this.escapeHtml(e.description)}</p>
        <a href="${e.link}" target="_blank" rel="noopener" class="event-link">View Details →</a>
      </div>
    `).join('');

    this.eventsContainer.innerHTML = html;
  }

  showNoEventsMessage() {
    if (!this.eventsContainer) return;
    this.eventsContainer.innerHTML = `
      <div class="no-events">
        <h3>📅 No Events Found</h3>
        <p>The events feed is currently empty. Check back soon!</p>
        <p><a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener" class="btn">Visit Dragon Central</a></p>
      </div>`;
  }

  showErrorMessage() {
    if (!this.eventsContainer) return;
    this.eventsContainer.innerHTML = `
      <div class="error-message">
        <h3>⚠️ Unable to Load Events</h3>
        <p>There was a problem loading events from Dragon Central.</p>
        <p><a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener" class="btn">View Events on Dragon Central</a></p>
      </div>`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const rssParser = new RSSParser();
  rssParser.loadEvents();
});
