// app.js - anchors + modal + AJAX submit
(function(){
  // Smooth scroll for anchor links
  document.querySelectorAll('a.scroll-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // External form handlers - open Google/Microsoft Forms in new tab
  function openExternalForm(formType) {
    const config = window.__ACM_CONFIG__;
    if (!config || !config.forms) {
      console.error('Form configuration not found');
      alert('Form not configured. Please contact us via Discord or email.');
      return;
    }
    
    const formUrl = config.forms[formType];
    if (!formUrl || formUrl.includes('YOUR_')) {
      console.warn(`${formType} form URL not configured`);
      alert('This form is not yet set up. Please contact us via Discord or email.');
      return;
    }
    
    window.open(formUrl, '_blank', 'noopener,noreferrer');
  }

  // Wire form buttons to open external forms
  document.getElementById('openPrintForm')?.addEventListener('click', () => openExternalForm('print'));
  document.getElementById('openLaptopForm')?.addEventListener('click', () => openExternalForm('laptop'));
  document.getElementById('researchContactBtn')?.addEventListener('click', () => openExternalForm('contact'));


  // Helper function to generate letter avatar using UI Avatars API
  function getAvatarUrl(name, photoUrl) {
    // Always use UI Avatars with ACM brand color
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=400&background=AF1329&color=fff&bold=true&font-size=0.45`;
  }

  // Load Board members from JSON with advisor featured prominently
  fetch('data/board.json').then(r=>r.json()).then(data=>{
    const grid = document.getElementById('boardGrid');
    if (!grid) return;
    
    // Clear loading state
    grid.innerHTML = '';
    
    // Add advisor first (featured prominently)
    if (data.advisor) {
      const advisorCard = document.createElement('div');
      advisorCard.className = 'card advisor-card';
      const avatarUrl = getAvatarUrl(data.advisor.name, data.advisor.photo_url);
      advisorCard.innerHTML = `
        <div class="card-inner" style="background:var(--panel);border:2px solid var(--accent);border-radius:14px;padding:20px;margin-bottom:20px">
          <img src="${avatarUrl}" alt="${data.advisor.name}" style="width:120px;height:120px;border-radius:50%;margin:0 auto 15px;display:block;object-fit:cover" />
          <h3 style="text-align:center;margin:0 0 8px;font-size:1.4rem;color:var(--text);font-weight:600">${data.advisor.name}</h3>
          <p style="text-align:center;margin:0 0 8px;color:var(--accent);font-size:1.1rem;font-weight:500">${data.advisor.role}</p>
          <p style="text-align:center;margin:0 0 15px;color:var(--muted);font-size:1rem">${data.advisor.years}</p>
          <p style="margin:0;text-align:center;color:var(--text);line-height:1.6">${data.advisor.bio}</p>
          <div style="text-align:center;margin-top:15px">
            <a href="${data.advisor.github_url}" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;display:inline-flex;align-items:center;gap:6px">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      `;
      grid.appendChild(advisorCard);
    }
    
    // Add regular members
    data.members.forEach(m=>{
      const card = document.createElement('div');
      card.className = 'card';
      const avatarUrl = getAvatarUrl(m.name, m.photo_url);
      
      // Detect if URL is Instagram or GitHub
      const isInstagram = m.github_url && m.github_url.includes('instagram.com');
      const socialIcon = isInstagram 
        ? `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
             <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
           </svg>`
        : `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
             <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
           </svg>`;
      const socialLabel = isInstagram ? 'Instagram' : 'GitHub';
      
      card.innerHTML = `
        <div class="card-inner" style="background:var(--panel);border:1px solid var(--panel-border);border-radius:14px;padding:14px;display:flex;flex-direction:column;height:100%;text-align:center">
          <img src="${avatarUrl}" alt="${m.name}" style="width:100%;aspect-ratio:1/1;border-radius:10px;margin-bottom:12px;object-fit:cover" />
          <h3 style="color:var(--text);margin:0 0 6px;font-size:1.25rem;font-weight:600">${m.name}</h3>
          <p style="color:var(--brand);margin:0 0 6px;font-size:1rem;font-weight:500">${m.role}</p>
          <p style="color:var(--muted);margin:0 0 12px;font-size:0.9rem">${m.years}</p>
          <p style="margin:0;color:var(--text);flex-grow:1;line-height:1.6">${m.bio}</p>
          <div style="margin-top:12px;text-align:center">
            <a href="${m.github_url}" target="_blank" rel="noopener" style="color:var(--brand);text-decoration:none;display:inline-flex;align-items:center;gap:4px">
              ${socialIcon}
              ${socialLabel}
            </a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }).catch(err => {
    const grid = document.getElementById('boardGrid');
    if (grid) {
      grid.innerHTML = '<div class="empty-state"><h3>Unable to load board members</h3><p>Please check back later or contact us on Discord.</p></div>';
    }
  });

  // Add shadow to header on scroll
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

  // Load photo gallery from JSON with filtering and pagination
  const photoGallery = document.getElementById('photoGallery');
  const galleryFilters = document.getElementById('galleryFilters');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  if (photoGallery && galleryFilters) {
    let allYearsData = [];
    let currentYear = null;
    let currentImages = [];
    let displayedCount = 0;
    const IMAGES_PER_PAGE = 12;
    let lightboxIndex = 0;
    
    fetch('data/gallery.json')
      .then(r => r.json())
      .then(data => {
        allYearsData = data.years;
        
        // Create filter buttons
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn';
        allBtn.textContent = 'All Years';
        allBtn.onclick = () => filterByYear(null);
        galleryFilters.appendChild(allBtn);
        
        data.years.forEach(yearData => {
          if (yearData.images && yearData.images.length > 0) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = yearData.label;
            btn.onclick = () => filterByYear(yearData);
            galleryFilters.appendChild(btn);
          }
        });
        
        // Initialize with 2025-2026 (first year with images)
        const defaultYear = data.years.find(y => y.label === '2025-2026') || data.years[0];
        filterByYear(defaultYear, true);
      })
      .catch(err => {
        console.error('Gallery error:', err);
        photoGallery.innerHTML = '<p style="text-align:center;color:var(--muted)">Unable to load photos. Please check back later.</p>';
      });
    
    function filterByYear(yearData, isInitial = false) {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      if (!isInitial && event && event.target) {
        event.target.classList.add('active');
      } else if (isInitial) {
        // Set active button for initial load (2025-2026)
        const targetBtn = Array.from(document.querySelectorAll('.filter-btn')).find(btn => 
          btn.textContent === (yearData ? yearData.label : 'All Years')
        );
        if (targetBtn) targetBtn.classList.add('active');
      }
      
      // Clear gallery
      photoGallery.innerHTML = '';
      displayedCount = 0;
      
      // Get images for selected year or all years
      if (yearData === null) {
        // Combine all images from all years
        currentImages = [];
        allYearsData.forEach(year => {
          if (year.images && year.images.length > 0) {
            year.images.forEach(img => {
              currentImages.push({
                filename: img,
                folder: year.folder
              });
            });
          }
        });
      } else {
        currentYear = yearData;
        currentImages = yearData.images.map(img => ({
          filename: img,
          folder: yearData.folder
        }));
      }
      
      // Shuffle for variety
      currentImages.sort(() => Math.random() - 0.5);
      
      // Load first batch
      loadMoreImages();
    }
    
    function loadMoreImages() {
      const nextBatch = currentImages.slice(displayedCount, displayedCount + IMAGES_PER_PAGE);
      
      nextBatch.forEach((imageData, index) => {
        const img = document.createElement('img');
        img.src = `assets/img/gallery/${imageData.folder}/${encodeURIComponent(imageData.filename)}`;
        img.alt = 'ACM Event Photo';
        img.loading = 'lazy';
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.cursor = 'pointer';
        
        // Add click handler for lightbox
        const imgIndex = displayedCount + index;
        img.onclick = () => openLightbox(imgIndex);
        
        img.onerror = function() {
          console.error('✗ Failed to load:', imageData.filename);
          this.remove();
        };
        
        photoGallery.appendChild(img);
      });
      
      displayedCount += nextBatch.length;
      
      // Show/hide load more button
      const loadMoreContainer = document.querySelector('.gallery-load-more');
      if (displayedCount < currentImages.length) {
        loadMoreContainer.style.display = 'block';
      } else {
        loadMoreContainer.style.display = 'none';
      }
      
      console.log(`Displayed ${displayedCount} of ${currentImages.length} images`);
    }
    
    // Lightbox functionality
    function openLightbox(index) {
      lightboxIndex = index;
      
      // Create lightbox if it doesn't exist
      let lightbox = document.getElementById('lightbox');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
          <span class="lightbox-close">&times;</span>
          <button class="lightbox-prev">&#10094;</button>
          <button class="lightbox-next">&#10095;</button>
          <img class="lightbox-img" src="" alt="Photo">
          <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(lightbox);
        
        // Event listeners
        lightbox.querySelector('.lightbox-close').onclick = closeLightbox;
        lightbox.querySelector('.lightbox-prev').onclick = (e) => {
          e.stopPropagation();
          navigateLightbox(-1);
        };
        lightbox.querySelector('.lightbox-next').onclick = (e) => {
          e.stopPropagation();
          navigateLightbox(1);
        };
        lightbox.onclick = (e) => {
          if (e.target === lightbox) closeLightbox();
        };
        
        // Keyboard navigation
        document.addEventListener('keydown', handleLightboxKeyboard);
      }
      
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
      const lightbox = document.getElementById('lightbox');
      if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    
    function navigateLightbox(direction) {
      lightboxIndex += direction;
      
      // Loop around
      if (lightboxIndex < 0) lightboxIndex = currentImages.length - 1;
      if (lightboxIndex >= currentImages.length) lightboxIndex = 0;
      
      updateLightboxImage();
    }
    
    function updateLightboxImage() {
      const lightbox = document.getElementById('lightbox');
      const img = lightbox.querySelector('.lightbox-img');
      const counter = lightbox.querySelector('.lightbox-counter');
      const imageData = currentImages[lightboxIndex];
      
      img.src = `assets/img/gallery/${imageData.folder}/${encodeURIComponent(imageData.filename)}`;
      counter.textContent = `${lightboxIndex + 1} / ${currentImages.length}`;
    }
    
    function handleLightboxKeyboard(e) {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox || !lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') navigateLightbox(-1);
      else if (e.key === 'ArrowRight') navigateLightbox(1);
    }
    
    // Load more button handler
    if (loadMoreBtn) {
      loadMoreBtn.onclick = loadMoreImages;
    }
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Animate sections on scroll
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
})();