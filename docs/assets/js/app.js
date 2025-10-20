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
  const contactBtns = [
    document.getElementById('contactBtn'), 
    document.getElementById('contactBtnHero'),
    document.getElementById('researchContactBtn')
  ].filter(Boolean);
  contactBtns.forEach(btn => btn.addEventListener('click', () => openExternalForm('contact')));
  
  document.getElementById('openPrintForm')?.addEventListener('click', () => openExternalForm('print'));
  document.getElementById('openLaptopForm')?.addEventListener('click', () => openExternalForm('laptop'));


  // Helper function to get avatar URL (uses UI Avatars API if no photo)
  function getAvatarUrl(name, photoUrl) {
    if (photoUrl && !photoUrl.includes('placeholder.png')) {
      return photoUrl;
    }
    // Generate UI Avatars URL with ACM brand color
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=400&background=831925&color=fff&bold=true&font-size=0.4`;
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
          <h3 style="text-align:center;margin:0 0 5px;font-size:1.3em;color:var(--accent)">${data.advisor.name}</h3>
          <p style="text-align:center;margin:0 0 15px;color:var(--muted);font-size:1.1em">${data.advisor.role} · ${data.advisor.years}</p>
          <p style="margin-top:10px;text-align:center;color:var(--text)">${data.advisor.bio}</p>
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
      card.innerHTML = `
        <div class="card-inner" style="background:var(--panel);border:1px solid var(--panel-border);border-radius:14px;padding:14px">
          <img src="${avatarUrl}" alt="${m.name}" style="width:100%;aspect-ratio:1/1;border-radius:10px;margin-bottom:10px;object-fit:cover" />
          <strong style="color:var(--text)">${m.name}</strong><br/>
          <span class="muted">${m.role} · ${m.years}</span>
          <p style="margin-top:8px;color:var(--text)">${m.bio}</p>
          <p style="margin-top:10px">
            <a href="${m.github_url}" target="_blank" rel="noopener" style="color:var(--brand);text-decoration:none;display:inline-flex;align-items:center;gap:4px">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </p>
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