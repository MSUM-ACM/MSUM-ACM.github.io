// rss-parser.js - Parse MSUM events RSS and filter for ACM events// rss-parser.js - Parse MSUM/ACM RSS feed and display events

class RSSParser {class RSSParser {

  constructor() {  constructor() {

    this.eventsContainer = document.getElementById('eventsContainer');    this.eventsContainer = document.getElementById('eventsContainer');

    this.maxEvents = 6; // Show 6 most recent events    this.maxEvents = 6; // Show 6 most recent events

  }  }



  async loadEvents() {  async loadEvents() {

    try {    try {

      // Fetch the RSS feed directly      // Load events from GitHub Actions processed JSON (solves CORS issues)

      const response = await fetch('events.rss');      const response = await fetch('data/events.json');

      const xmlText = await response.text();      const data = await response.json();

            

      // Parse XML      if (data.events && data.events.length > 0) {

      const parser = new DOMParser();        this.displayProcessedEvents(data.events);

      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');      } else {

              this.showErrorMessage();

      // Check for parsing errors      }

      const parserError = xmlDoc.querySelector('parsererror');    } catch (error) {

      if (parserError) {      console.error('Error loading events:', error);

        console.error('XML parsing error:', parserError.textContent);      this.showErrorMessage();

        this.showErrorMessage();    }

        return;  }

      }

        displayProcessedEvents(events) {

      // Get all event items    // Filter for relevant events (ACM, Computer Science, Tech related)

      const items = xmlDoc.querySelectorAll('item');    const keywords = /ACM|Computer Science|Programming|Coding|Tech|Software|Development|Hackathon|IT|Data Science|Web Development|Algorithm|Machine Learning|AI/i;

          

      if (items.length === 0) {    const relevantEvents = events.filter(event => {

        this.showNoEventsMessage();      return keywords.test(event.title) || 

        return;             keywords.test(event.description) || 

      }             keywords.test(event.author) ||

                   keywords.test(event.host) ||

      // Parse and filter events             event.categories.some(cat => keywords.test(cat));

      const allEvents = Array.from(items)    });

        .map(item => this.parseEventItem(item))

        .filter(event => event !== null);    // If no relevant events found, show recent general events as placeholder

          const eventsToShow = relevantEvents.length > 0 ? relevantEvents : events;

      // Filter for ACM events specifically    

      const acmEvents = this.filterACMEvents(allEvents);    // Limit to maxEvents and format for display

          const formattedEvents = eventsToShow

      if (acmEvents.length > 0) {      .slice(0, this.maxEvents)

        this.displayEvents(acmEvents.slice(0, this.maxEvents));      .map(event => ({

      } else {        title: event.title,

        this.showNoACMEventsMessage(allEvents.length);        description: event.description,

      }        author: event.host || event.author,

              date: this.formatEventDate(event.start || event.pubDate),

    } catch (error) {        location: event.location || 'TBA',

      console.error('Error loading events:', error);        link: event.link

      this.showErrorMessage();      }));

    }

  }    this.displayEvents(formattedEvents);

  }

  filterACMEvents(events) {

    // Filter for ACM events by checking author/host and keywords  parseEventItem(item) {

    return events.filter(event => {    try {

      const acmKeywords = /ACM|Association for Computing Machinery|MSUM ACM/i;      const title = item.querySelector('title')?.textContent || 'Untitled Event';

      const techKeywords = /Computer Science Club|Programming Club|Coding Workshop|Tech Talk|Hackathon/i;      const link = item.querySelector('link')?.textContent || '#';

            const description = this.extractDescription(item.querySelector('description')?.textContent || '');

      // Check if event is specifically from ACM      const author = item.querySelector('author')?.textContent?.replace(/.*\((.*)\)/, '$1') || 'MSUM';

      const isACMHost = acmKeywords.test(event.author) || acmKeywords.test(event.host);      

            // Parse dates

      // Check if event mentions ACM in title or description      const startDate = item.querySelector('start')?.textContent || item.querySelector('pubDate')?.textContent;

      const mentionsACM = acmKeywords.test(event.title) || acmKeywords.test(event.description);      const endDate = item.querySelector('end')?.textContent;

            const location = item.querySelector('location')?.textContent || 'TBA';

      // Check for tech-related events that might be relevant      

      const isTechEvent = techKeywords.test(event.title) || techKeywords.test(event.description);      // Format date nicely

            const formattedDate = this.formatEventDate(startDate, endDate);

      return isACMHost || mentionsACM || isTechEvent;      

    });      return {

  }        title,

        description,

  parseEventItem(item) {        author,

    try {        date: formattedDate,

      const title = item.querySelector('title')?.textContent || 'Untitled Event';        location,

      const link = item.querySelector('link')?.textContent || '#';        link

      const description = this.extractDescription(item.querySelector('description')?.textContent || '');      };

          } catch (error) {

      // Get author/host info      console.error('Error parsing event item:', error);

      const authorText = item.querySelector('author')?.textContent || '';      return null;

      const author = authorText.replace(/.*\((.*)\)/, '$1') || 'MSUM';    }

      const host = item.querySelector('host')?.textContent || author;  }

      

      // Parse dates  extractDescription(rawDescription) {

      const startDate = item.querySelector('start')?.textContent || item.querySelector('pubDate')?.textContent;    // Remove HTML tags and get clean text

      const endDate = item.querySelector('end')?.textContent;    const div = document.createElement('div');

      const location = item.querySelector('location')?.textContent || 'TBA';    div.innerHTML = rawDescription;

          const cleanText = div.textContent || div.innerText || '';

      // Get categories    

      const categories = Array.from(item.querySelectorAll('category')).map(cat => cat.textContent);    // Truncate to reasonable length

          return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;

      // Format date nicely  }

      const formattedDate = this.formatEventDate(startDate, endDate);

        formatEventDate(startDate, endDate) {

      return {    try {

        title,      const start = new Date(startDate);

        description,      const options = { 

        author,        weekday: 'short', 

        host,        month: 'short', 

        date: formattedDate,        day: 'numeric',

        location,        hour: 'numeric',

        link,        minute: '2-digit',

        categories,        hour12: true

        startDate: new Date(startDate)      };

      };      

    } catch (error) {      let formatted = start.toLocaleDateString('en-US', options);

      console.error('Error parsing event item:', error);      

      return null;      if (endDate) {

    }        const end = new Date(endDate);

  }        const endTime = end.toLocaleTimeString('en-US', { 

          hour: 'numeric', 

  extractDescription(rawDescription) {          minute: '2-digit', 

    // Remove HTML tags and CDATA          hour12: true 

    const div = document.createElement('div');        });

    div.innerHTML = rawDescription;        formatted += ` - ${endTime}`;

    const cleanText = div.textContent || div.innerText || '';      }

          

    // Remove extra whitespace and newlines      return formatted;

    const cleaned = cleanText.replace(/\s+/g, ' ').trim();    } catch (error) {

          return 'Date TBA';

    // Truncate to reasonable length    }

    return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;  }

  }

  displayEvents(events) {

  formatEventDate(startDate, endDate) {    if (!this.eventsContainer) {

    try {      console.error('Events container not found');

      const start = new Date(startDate);      return;

      const options = {     }

        weekday: 'short', 

        month: 'short',     if (events.length === 0) {

        day: 'numeric',      this.eventsContainer.innerHTML = `

        hour: 'numeric',        <div class="no-events">

        minute: '2-digit',          <p>No upcoming events found. Check back soon!</p>

        hour12: true          <p><a href="https://mnstate.campuslabs.com/engage/events" target="_blank" rel="noopener">View all MSUM events</a></p>

      };        </div>

            `;

      let formatted = start.toLocaleDateString('en-US', options);      return;

          }

      if (endDate) {

        const end = new Date(endDate);    const eventsHTML = events.map(event => `

        const endTime = end.toLocaleTimeString('en-US', {       <div class="event-card">

          hour: 'numeric',         <div class="event-header">

          minute: '2-digit',           <h3 class="event-title">${event.title}</h3>

          hour12: true           <span class="event-author">${event.author}</span>

        });        </div>

        formatted += ` - ${endTime}`;        <div class="event-details">

      }          <div class="event-date">${event.date}</div>

                <div class="event-location">${event.location}</div>

      return formatted;        </div>

    } catch (error) {        <p class="event-description">${event.description}</p>

      return 'Date TBA';        <a href="${event.link}" target="_blank" rel="noopener" class="event-link">View Details →</a>

    }      </div>

  }    `).join('');



  displayEvents(events) {    this.eventsContainer.innerHTML = eventsHTML;

    if (!this.eventsContainer) {  }

      console.error('Events container not found');

      return;  showErrorMessage() {

    }    if (!this.eventsContainer) return;

    

    const eventsHTML = events.map(event => `    this.eventsContainer.innerHTML = `

      <div class="event-card">      <div class="error-message">

        <div class="event-header">        <p>Unable to load events at this time.</p>

          <h3 class="event-title">${this.escapeHtml(event.title)}</h3>        <p><a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener">View events on Dragon Central</a></p>

          <span class="event-author">${this.escapeHtml(event.host || event.author)}</span>      </div>

        </div>    `;

        <div class="event-details">  }

          <div class="event-date">📅 ${event.date}</div>}

          <div class="event-location">📍 ${this.escapeHtml(event.location)}</div>

        </div>// Initialize when DOM is loaded

        <p class="event-description">${this.escapeHtml(event.description)}</p>document.addEventListener('DOMContentLoaded', () => {

        <a href="${event.link}" target="_blank" rel="noopener" class="event-link">View Details →</a>  const rssParser = new RSSParser();

      </div>  rssParser.loadEvents();

    `).join('');});

    this.eventsContainer.innerHTML = eventsHTML;
  }

  showNoEventsMessage() {
    if (!this.eventsContainer) return;
    
    this.eventsContainer.innerHTML = `
      <div class="no-events">
        <h3>📅 No Events Found</h3>
        <p>The events feed is currently empty. Check back soon!</p>
        <p><a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener" class="btn">Visit Dragon Central</a></p>
      </div>
    `;
  }

  showNoACMEventsMessage(totalEvents) {
    if (!this.eventsContainer) return;
    
    this.eventsContainer.innerHTML = `
      <div class="no-events">
        <h3>📅 No ACM Events Scheduled</h3>
        <p>We found ${totalEvents} campus events, but no ACM-specific events at this time.</p>
        <p>Join our Discord or attend our weekly meetings to stay updated!</p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
          <a href="https://discord.gg/GKy9htGXau" target="_blank" rel="noopener" class="btn btn-discord">Join Discord</a>
          <a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener" class="btn">Dragon Central</a>
        </div>
      </div>
    `;
  }

  showErrorMessage() {
    if (!this.eventsContainer) return;
    
    this.eventsContainer.innerHTML = `
      <div class="error-message">
        <h3>⚠️ Unable to Load Events</h3>
        <p>There was a problem loading events from Dragon Central.</p>
        <p><a href="https://mnstate.campuslabs.com/engage/organization/msum_acm" target="_blank" rel="noopener" class="btn">View Events on Dragon Central</a></p>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const rssParser = new RSSParser();
  rssParser.loadEvents();
});
