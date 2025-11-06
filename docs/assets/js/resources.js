// Resources loader for MSUM ACM website
(function() {
  'use strict';

  // Icon SVGs
  const icons = {
    tag: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>',
    book: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>',
    map: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>',
    external: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>'
  };

  // Load featured resources on homepage
  function loadFeaturedResources() {
    const container = document.getElementById('featuredResources');
    if (!container) return;

    fetch('data/resources.json')
      .then(response => response.json())
      .then(data => {
        const featured = data.resources.filter(r => r.featured);
        container.innerHTML = featured.map(resource => createResourceCard(resource, false)).join('');
      })
      .catch(error => {
        console.error('Error loading resources:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--muted);">Unable to load resources at this time.</p>';
      });
  }

  // Load all resources on resources page
  function loadAllResources() {
    const container = document.getElementById('allResources');
    if (!container) return;

    fetch('data/resources.json')
      .then(response => response.json())
      .then(data => {
        container.innerHTML = data.resources.map(resource => createResourceCard(resource, true)).join('');
      })
      .catch(error => {
        console.error('Error loading resources:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--muted);">Unable to load resources at this time.</p>';
      });
  }

  // Create resource card HTML
  function createResourceCard(resource, showIcon = false) {
    const icon = icons[resource.icon] || icons.book;
    
    return `
      <div class="resource-card">
        ${showIcon ? `<div class="resource-icon">${icon}</div>` : ''}
        <div class="resource-category">${resource.category}</div>
        <h3>${resource.title}</h3>
        <p>${resource.description}</p>
        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
          View Resource
          ${icons.external}
        </a>
      </div>
    `;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    loadFeaturedResources();
    loadAllResources();
  }
})();
