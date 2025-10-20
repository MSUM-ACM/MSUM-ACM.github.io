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
        <div class="card-inner" style="background:#17171c;border:2px solid #4ade80;border-radius:14px;padding:20px;margin-bottom:20px">
          <img src="${avatarUrl}" alt="${data.advisor.name}" style="width:120px;height:120px;border-radius:50%;margin:0 auto 15px;display:block;object-fit:cover" />
          <h3 style="text-align:center;margin:0 0 5px;font-size:1.3em;color:#4ade80">${data.advisor.name}</h3>
          <p style="text-align:center;margin:0 0 15px;color:#888;font-size:1.1em">${data.advisor.role} · ${data.advisor.years}</p>
          <p style="margin-top:10px;text-align:center">${data.advisor.bio}</p>
          <div style="text-align:center;margin-top:15px">
            <a href="${data.advisor.github_url}" target="_blank" rel="noopener" style="color:#4ade80;text-decoration:none">GitHub Profile</a>
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
        <div class="card-inner" style="background:#17171c;border:1px solid #24242b;border-radius:14px;padding:14px">
          <img src="${avatarUrl}" alt="${m.name}" style="width:100%;border-radius:10px;margin-bottom:10px;object-fit:cover;height:200px" />
          <strong>${m.name}</strong><br/>
          <span class="muted">${m.role} · ${m.years}</span>
          <p style="margin-top:8px">${m.bio}</p>
          <p><a href="${m.github_url}" target="_blank" rel="noopener">GitHub</a></p>
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