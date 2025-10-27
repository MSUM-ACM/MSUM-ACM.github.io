// projects.js - Handle project display with GitHub API integration
(function() {
  let allProjects = [];
  let filteredProjects = [];
  let githubStarsCache = {};
  
  // GitHub API rate limit handling
  const GITHUB_API_BASE = 'https://api.github.com/repos/';
  
  // Extract owner and repo from GitHub URL
  function parseGitHubUrl(url) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
    return null;
  }
  
  // Fetch GitHub stars for a repository
  async function fetchGitHubStars(githubUrl) {
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) return null;
    
    const cacheKey = `${parsed.owner}/${parsed.repo}`;
    
    // Check cache first
    if (githubStarsCache[cacheKey] !== undefined) {
      return githubStarsCache[cacheKey];
    }
    
    try {
      const response = await fetch(`${GITHUB_API_BASE}${cacheKey}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        githubStarsCache[cacheKey] = data.stargazers_count || 0;
        return githubStarsCache[cacheKey];
      } else if (response.status === 404) {
        // Repo not found or private
        githubStarsCache[cacheKey] = 0;
        return 0;
      } else if (response.status === 403) {
        // Rate limit exceeded
        console.warn('GitHub API rate limit exceeded');
        return null;
      }
    } catch (error) {
      console.error('Error fetching GitHub stars:', error);
      return null;
    }
    
    return null;
  }
  
  // Format star count (e.g., 1234 -> 1.2k)
  function formatStarCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
  
  // Create project card HTML
  function createProjectCard(project, stars = null) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const starBadge = stars !== null ? `
      <div class="project-stars" title="${stars} stars on GitHub">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
        </svg>
        <span>${formatStarCount(stars)}</span>
      </div>
    ` : '';
    
    const tagsHtml = project.tags.map(tag => 
      `<span class="project-tag">${tag}</span>`
    ).join('');
    
    card.innerHTML = `
      <div class="project-card-inner">
        ${starBadge}
        <h3 class="project-title">${project.title}</h3>
        <p class="project-author">by ${project.author}</p>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-footer">
          <a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="project-link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    `;
    
    return card;
  }
  
  // Load and display projects
  async function loadProjects(container, limit = null, fetchStars = true) {
    try {
      const response = await fetch('data/projects.json');
      const data = await response.json();
      allProjects = data.projects;
      
      // Sort by featured first, then by date
      allProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date) - new Date(a.date);
      });
      
      const projectsToDisplay = limit ? allProjects.filter(p => p.featured).slice(0, limit) : allProjects;
      filteredProjects = projectsToDisplay;
      
      // Display projects without stars first (for fast initial render)
      container.innerHTML = '';
      projectsToDisplay.forEach(project => {
        const card = createProjectCard(project);
        container.appendChild(card);
      });
      
      // Fetch GitHub stars in background if enabled
      if (fetchStars) {
        for (let i = 0; i < projectsToDisplay.length; i++) {
          const project = projectsToDisplay[i];
          const stars = await fetchGitHubStars(project.github_url);
          
          if (stars !== null) {
            // Update the card with star count
            const card = container.children[i];
            if (card) {
              const cardInner = card.querySelector('.project-card-inner');
              const existingStars = cardInner.querySelector('.project-stars');
              
              if (!existingStars && stars > 0) {
                const starBadge = document.createElement('div');
                starBadge.className = 'project-stars';
                starBadge.title = `${stars} stars on GitHub`;
                starBadge.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                  </svg>
                  <span>${formatStarCount(stars)}</span>
                `;
                cardInner.insertBefore(starBadge, cardInner.firstChild);
              }
            }
            
            // Store stars with project for sorting
            project.stars = stars;
          }
        }
      }
      
      return projectsToDisplay;
    } catch (error) {
      console.error('Error loading projects:', error);
      container.innerHTML = '<div class="empty-state"><h3>Unable to load projects</h3><p>Please check back later.</p></div>';
      return [];
    }
  }
  
  // Main page - Featured projects only
  const featuredContainer = document.getElementById('featuredProjects');
  if (featuredContainer) {
    loadProjects(featuredContainer, 3, true);
  }
  
  // Projects page - All projects with search and filters
  const allProjectsContainer = document.getElementById('allProjects');
  if (allProjectsContainer) {
    const searchInput = document.getElementById('projectSearch');
    const sortSelect = document.getElementById('sortBy');
    const filterTagSelect = document.getElementById('filterTag');
    const projectsCount = document.getElementById('projectsCount');
    const emptyState = document.getElementById('emptyState');
    
    // Load all projects
    loadProjects(allProjectsContainer, null, true).then(projects => {
      // Populate tag filter
      const allTags = new Set();
      projects.forEach(project => {
        project.tags.forEach(tag => allTags.add(tag));
      });
      
      Array.from(allTags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filterTagSelect.appendChild(option);
      });
      
      updateProjectsDisplay();
    });
    
    // Filter and sort functions
    function filterAndSortProjects() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedTag = filterTagSelect.value;
      const sortBy = sortSelect.value;
      
      // Filter
      filteredProjects = allProjects.filter(project => {
        const matchesSearch = !searchTerm || 
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.author.toLowerCase().includes(searchTerm) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag);
        
        return matchesSearch && matchesTag;
      });
      
      // Sort
      filteredProjects.sort((a, b) => {
        switch(sortBy) {
          case 'date-desc':
            return new Date(b.date) - new Date(a.date);
          case 'date-asc':
            return new Date(a.date) - new Date(b.date);
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'name-desc':
            return b.title.localeCompare(a.title);
          case 'stars-desc':
            return (b.stars || 0) - (a.stars || 0);
          default:
            return 0;
        }
      });
      
      updateProjectsDisplay();
    }
    
    function updateProjectsDisplay() {
      allProjectsContainer.innerHTML = '';
      
      if (filteredProjects.length === 0) {
        emptyState.style.display = 'block';
        allProjectsContainer.style.display = 'none';
        projectsCount.textContent = 'No projects found';
      } else {
        emptyState.style.display = 'none';
        allProjectsContainer.style.display = 'grid';
        projectsCount.textContent = `Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`;
        
        filteredProjects.forEach(project => {
          const card = createProjectCard(project, project.stars);
          allProjectsContainer.appendChild(card);
        });
      }
    }
    
    // Event listeners
    searchInput.addEventListener('input', filterAndSortProjects);
    sortSelect.addEventListener('change', filterAndSortProjects);
    filterTagSelect.addEventListener('change', filterAndSortProjects);
  }
  
  // Add scroll effect to header
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
})();
