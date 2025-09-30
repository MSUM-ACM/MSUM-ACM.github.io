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

  // Modal helpers
  function openModal(id){ const m = document.getElementById(id); if (m){ m.setAttribute('aria-hidden','false'); m.querySelector('input,textarea,select,button')?.focus(); } }
  function closeModal(el){ el.setAttribute('aria-hidden','true'); }

  // Wire open buttons
  const contactBtns = [
    document.getElementById('contactBtn'), 
    document.getElementById('contactBtnHero'),
    document.getElementById('researchContactBtn')
  ].filter(Boolean);
  contactBtns.forEach(btn => btn.addEventListener('click', ()=>openModal('contactModal')));
  document.getElementById('openPrintForm')?.addEventListener('click', ()=>openModal('printModal'));
  document.getElementById('openLaptopForm')?.addEventListener('click', ()=>openModal('laptopModal'));

  // Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', ()=> closeModal(btn.closest('.modal')));
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e)=>{ if(e.target === m) closeModal(m); });
  });

  // Contact form AJAX
  async function handleAjaxForm(formId, statusId, endpoint){
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending...';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      try {
        const formData = new FormData(form);
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        if (json.ok) {
          status.textContent = 'Thanks! We received your message.';
          form.reset();
        } else {
          status.textContent = json.error || 'Something went wrong.';
        }
      } catch (err) {
        status.textContent = 'Network error.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }


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
})();