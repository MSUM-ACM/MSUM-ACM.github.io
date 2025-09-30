// rss-parser.js - Parse MSUM/ACM RSS feed and display events
class RSSParser {
  constructor() {
    this.eventsContainer = document.getElementById('eventsContainer');
    this.maxEvents = 6; // Show 6 most recent events
  }

  async loadEvents() {
    try {
      // Load events from GitHub Actions processed JSON (solves CORS issues)
      const response = await fetch('data/events.json');
      const data = await response.json();
      
      if (data.events && data.events.length > 0) {
        this.displayProcessedEvents(data.events);
      } else {
        this.showErrorMessage();
      }
    } catch (error) {
      console.error('Error loading events:', error);
      this.showErrorMessage();
    }
  }

  displayProcessedEvents(events) {
    // Filter for relevant events (ACM, Computer Science, Tech related)
    const keywords = /ACM|Computer Science|Programming|Coding|Tech|Software|Development|Hackathon|IT|Data Science|Web Development|Algorithm|Machine Learning|AI/i;
    
    const relevantEvents = events.filter(event => {
      return keywords.test(event.title) || 
             keywords.test(event.description) || 
             keywords.test(event.author) ||
             keywords.test(event.host) ||
             event.categories.some(cat => keywords.test(cat));
    });

    // If no relevant events found, show recent general events as placeholder
    const eventsToShow = relevantEvents.length > 0 ? relevantEvents : events;
    
    // Limit to maxEvents and format for display
    const formattedEvents = eventsToShow
      .slice(0, this.maxEvents)
      .map(event => ({
        title: event.title,
        description: event.description,
        author: event.host || event.author,
        date: this.formatEventDate(event.start || event.pubDate),
        location: event.location || 'TBA',
        link: event.link
      }));

    this.displayEvents(formattedEvents);
  }

  parseEventItem(item) {
    try {
      const title = item.querySelector('title')?.textContent || 'Untitled Event';
      const link = item.querySelector('link')?.textContent || '#';
      const description = this.extractDescription(item.querySelector('description')?.textContent || '');
      const author = item.querySelector('author')?.textContent?.replace(/.*\((.*)\)/, '$1') || 'MSUM';
      
      // Parse dates
      const startDate = item.querySelector('start')?.textContent || item.querySelector('pubDate')?.textContent;
      const endDate = item.querySelector('end')?.textContent;
      const location = item.querySelector('location')?.textContent || 'TBA';
      
      // Format date nicely
      const formattedDate = this.formatEventDate(startDate, endDate);
      
      return {
        title,
        description,
        author,
        date: formattedDate,
        location,
        link
      };
    } catch (error) {
      console.error('Error parsing event item:', error);
      return null;
    }
  }

  extractDescription(rawDescription) {
    // Remove HTML tags and get clean text
    const div = document.createElement('div');
    div.innerHTML = rawDescription;
    const cleanText = div.textContent || div.innerText || '';
    
    // Truncate to reasonable length
    return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
  }

  formatEventDate(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      
      let formatted = start.toLocaleDateString('en-US', options);
      
      if (endDate) {
        const end = new Date(endDate);
        const endTime = end.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        formatted += ` - ${endTime}`;
      }
      
      return formatted;
    } catch (error) {
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
        </div>
      `;
      return;
    }

    const eventsHTML = events.map(event => `
      <div class="event-card">
        <div class="event-header">
          <h3 class="event-title">${event.title}</h3>
          <span class="event-author">${event.author}</span>
        </div>
        <div class="event-details">
          <div class="event-date">${event.date}</div>
          <div class="event-location">${event.location}</div>
        </div>
        <p class="event-description">${event.description}</p>
        <a href="${event.link}" target="_blank" rel="noopener" class="event-link">View Details →</a>
      </div>
    `).join('');

    this.eventsContainer.innerHTML = eventsHTML;
  }

  showErrorMessage() {
    if (!this.eventsContainer) return;
    
    this.eventsContainer.innerHTML = `
      <div class="error-message">
        <p>Unable to load events at this time.</p>
        <p><a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener">View events on Dragon Central</a></p>
      </div>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const rssParser = new RSSParser();
  rssParser.loadEvents();
});