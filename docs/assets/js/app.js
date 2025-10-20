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


  // Load Board members from JSON with advisor featured prominently
  fetch('data/board.json').then(r=>r.json()).then(data=>{
    const grid = document.getElementById('boardGrid');
    if (!grid) return;
    
    // Add advisor first (featured prominently)
    if (data.advisor) {
      const advisorCard = document.createElement('div');
      advisorCard.className = 'card advisor-card';
      advisorCard.innerHTML = `
        <div class="card-inner" style="background:#17171c;border:2px solid #4ade80;border-radius:14px;padding:20px;margin-bottom:20px">
          <img src="${data.advisor.photo_url || 'assets/img/placeholder.png'}" alt="${data.advisor.name}" style="width:120px;height:120px;border-radius:50%;margin:0 auto 15px;display:block;object-fit:cover" />
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
      card.innerHTML = `
        <div class="card-inner" style="background:#17171c;border:1px solid #24242b;border-radius:14px;padding:14px">
          <img src="${m.photo_url || 'assets/img/placeholder.png'}" alt="${m.name}" style="width:100%;border-radius:10px;margin-bottom:10px;object-fit:cover;height:200px" />
          <strong>${m.name}</strong><br/>
          <span class="muted">${m.role} · ${m.years}</span>
          <p style="margin-top:8px">${m.bio}</p>
          <p><a href="${m.github_url}" target="_blank" rel="noopener">GitHub</a></p>
        </div>
      `;
      grid.appendChild(card);
    });
  }).catch(()=>{});

  // Add shadow to header on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
        console.log('scrolled added') ;
      } else {
        header.classList.remove('scrolled');
        console.log('scrolled removed') ;
      }
    });
  }
})();