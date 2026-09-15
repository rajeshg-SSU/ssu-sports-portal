/* ==========================================
   SRI SRI UNIVERSITY - MAIN APP CONTROLLER
   Handles Dynamic Rendering from DataStore (Gallery, News, Schedules & Coaches)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initUserRunnerBgRemoval();
  initMobileMenu();
  renderDynamicGallery();
  renderDynamicNews();
  renderDynamicSchedules();
  renderDynamicCoaches();
  initSocialSharing();
  initGalleryLightbox();
});

// Automatic HTML5 Canvas Background Removal for User Runner Image
function initUserRunnerBgRemoval() {
  const runnerImg = document.getElementById('user-torch-runner-img');
  if (!runnerImg) return;

  function processImage() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = runnerImg.naturalWidth || runnerImg.width;
      const height = runnerImg.naturalHeight || runnerImg.height;

      if (!width || !height) return;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(runnerImg, 0, 0);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Convert white & off-white background pixels to transparent alpha 0
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0; // 100% Transparent
        } else if (r > 215 && g > 215 && b > 215) {
          const alpha = (255 - Math.max(r, g, b)) * 6.375;
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      runnerImg.src = canvas.toDataURL('image/png');
    } catch (e) {
      console.log('Background removal canvas process complete');
    }
  }

  if (runnerImg.complete) {
    processImage();
  } else {
    runnerImg.onload = processImage;
  }
}

// Mobile Responsive Drawer & Navigation Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    const icon = toggleBtn.querySelector('i');

    function closeMenu() {
      navMenu.classList.remove('active');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }

    function openMenu() {
      navMenu.classList.add('active');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
          closeMenu();
        }
      }
    });
  }
}

// Dynamic Gallery Rendering from SSUDataStore
function renderDynamicGallery() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid || typeof SSUDataStore === 'undefined') return;

  const items = SSUDataStore.getGallery();
  galleryGrid.innerHTML = items.map(item => `
    <div class="gallery-item" data-category="${item.category}">
      <img src="${item.url}" class="gallery-img" alt="${item.title}">
      <div class="gallery-overlay">
        <span class="badge-ssu">${item.category}</span>
        <h4>${item.title}</h4>
      </div>
    </div>
  `).join('');

  initGalleryFilter();
  initGalleryLightbox();
}

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'events' && (category === 'events' || category === 'winners'))) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (!modal || !lightboxImg) return;

  // Global click listener for any card or image popup across all 3 sections & entire site
  document.addEventListener('click', (e) => {
    // Ignore clicks inside interactive buttons or links or inside active modals
    if (e.target.closest('a, button, input, select, textarea, .modal-overlay')) return;

    const card = e.target.closest('.card-ssu, .gallery-item, .news-card');
    if (!card) return;

    const img = card.querySelector('img');
    if (!img) return;

    let titleText = img.alt || 'Veerodaya 2026 Sports View';
    const heading = card.querySelector('h3, h4');
    if (heading) titleText = heading.textContent;

    lightboxImg.src = img.src;
    if (lightboxTitle) lightboxTitle.textContent = titleText;
    modal.classList.add('active');
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === lightboxClose || e.target.closest('#lightbox-close')) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// Dynamic News Rendering from SSUDataStore (with Featured Image Support)
function renderDynamicNews() {
  const newsContainer = document.querySelector('.news-feed-list');
  if (!newsContainer || typeof SSUDataStore === 'undefined') return;

  const items = SSUDataStore.getNews();
  newsContainer.innerHTML = items.map(item => `
    <div class="news-card">
      ${item.imageUrl ? `<img src="${item.imageUrl}" class="news-card-img" alt="${item.title}">` : '<div class="news-icon"><i class="fas fa-trophy"></i></div>'}
      <div style="flex: 1;">
        <span style="font-size: 11px; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">${item.category}</span>
        <h4 style="font-size: 16px; margin: 2px 0;">${item.title}</h4>
        <p style="font-size: 13px; color: var(--color-text-muted);">${item.summary}</p>
        <span style="font-size: 11px; color: #888;"><i class="far fa-calendar-alt"></i> ${item.date}</span>
      </div>
    </div>
  `).join('');
}

// Dynamic Match Schedule Table & Hero Spotlight Card Rendering on Intra & Inter Pages
function renderDynamicSchedules() {
  const intraTable = document.getElementById('intra-schedule-body');
  const interTable = document.getElementById('inter-schedule-body');

  if (typeof SSUDataStore === 'undefined') return;

  const schedules = SSUDataStore.getSchedules();

  // 1. Intra University Schedule Table & Hero Card Spotlight
  const intraItems = schedules.filter(s => s.type === 'intra' || !s.type);
  if (intraTable) {
    if (intraItems.length) {
      intraTable.innerHTML = intraItems.map(s => `
        <tr>
          <td style="padding: 14px;">${s.date}</td>
          <td style="padding: 14px;"><strong>${s.sport}</strong></td>
          <td style="padding: 14px;">${s.matchup}</td>
          <td style="padding: 14px;">${s.venue}</td>
          <td style="padding: 14px;"><span class="badge-ssu">${s.status}</span></td>
        </tr>
      `).join('');
    } else {
      intraTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">No intra-university match fixtures scheduled yet.</td></tr>`;
    }
  }

  // 2. Inter University Schedule Table & Hero Card Spotlight
  const interItems = schedules.filter(s => s.type === 'inter');
  if (interTable) {
    if (interItems.length) {
      interTable.innerHTML = interItems.map(s => `
        <tr>
          <td style="padding: 14px;">${s.date}</td>
          <td style="padding: 14px;"><strong>${s.sport}</strong></td>
          <td style="padding: 14px;">${s.matchup}</td>
          <td style="padding: 14px;">${s.venue}</td>
          <td style="padding: 14px;"><span class="badge-ssu" style="background:#fff8ee; color:#b88600;">${s.status}</span></td>
        </tr>
      `).join('');
    } else {
      interTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">No inter-university selection trials or fixtures scheduled yet.</td></tr>`;
    }
  }

  // Populate Hero Spotlight Card on Inter Page
  if (interItems.length) {
    const topInter = interItems[0];
    const interTitle = document.getElementById('hero-inter-sport-title');
    const interMatchup = document.getElementById('hero-inter-matchup');
    const interDate = document.getElementById('hero-inter-date');
    const interVenue = document.getElementById('hero-inter-venue');

    if (interTitle) interTitle.textContent = topInter.sport;
    if (interMatchup) interMatchup.innerHTML = `<i class="fas fa-trophy" style="color: var(--color-accent-gold);"></i> ${topInter.matchup}`;
    if (interDate) interDate.textContent = topInter.date;
    if (interVenue) interVenue.textContent = topInter.venue;
  }
}

// Dynamic Coaches Rendering from SSUDataStore
function renderDynamicCoaches() {
  const coachesGrid = document.querySelector('.coaches-grid');
  if (!coachesGrid || typeof SSUDataStore === 'undefined') return;

  const items = SSUDataStore.getCoaches();
  coachesGrid.innerHTML = items.map(item => `
    <div class="coach-card">
      <div class="coach-photo-wrapper">
        ${item.photo ? `<img src="${item.photo}" class="coach-photo" alt="${item.name}">` : `<div style="width: 100%; height: 100%; background: #f8f9fa; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--color-primary); font-size: 64px; border: 1px dashed var(--color-bg-medium);"><i class="fas fa-user"></i></div>`}
      </div>
      <div class="coach-info">
        <div>
          <h3 class="coach-name" style="font-size: 19px; font-weight: 700; margin-bottom: 4px;">${item.name}</h3>
          <div class="coach-role" style="color: var(--color-primary); font-weight: 700; font-size: 13px; margin-bottom: 2px;">
            <i class="fas fa-university"></i> ${item.univRole || item.role}
          </div>
          <div style="font-size: 12px; font-weight: 600; color: var(--color-secondary); margin-bottom: 12px;">
            <i class="fas fa-trophy"></i> ${item.role}
          </div>
          <ul class="coach-details-list" style="margin-bottom: 0; padding: 0; list-style: none;">
            <li style="font-size: 10.5px; display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.email}">
              <i class="fas fa-envelope" style="font-size: 11px; color: var(--color-primary); width: 14px; flex-shrink: 0;"></i>
              <span style="font-size: 10.5px; letter-spacing: -0.3px; color: var(--color-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.email}</span>
            </li>
            ${item.phone ? `<li style="font-size: 11px; display: flex; align-items: center; gap: 5px; margin-top: 4px; white-space: nowrap;"><i class="fas fa-phone" style="font-size: 11px; color: var(--color-primary); width: 14px; flex-shrink: 0;"></i> <span style="color: var(--color-text-muted);">${item.phone}</span></li>` : ''}
          </ul>
        </div>
      </div>
    </div>
  `).join('');

  initCoachesModal();
}

function initCoachesModal() {
  const coachCards = document.querySelectorAll('.coach-card');
  const coachModal = document.getElementById('coach-detail-modal');
  const modalBody = document.getElementById('coach-modal-body');

  if (!coachCards.length || !coachModal || !modalBody) return;

  coachCards.forEach(card => {
    const detailBtn = card.querySelector('.btn-coach-detail');
    if (!detailBtn) return;

    detailBtn.addEventListener('click', () => {
      const name = card.querySelector('.coach-name').textContent;
      const role = card.querySelector('.coach-role').textContent;
      const img = card.querySelector('.coach-photo').src;
      const detailsHtml = card.querySelector('.coach-details-list').innerHTML;

      modalBody.innerHTML = `
        <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
          <img src="${img}" style="width: 160px; height: 160px; border-radius: 20px; object-fit: cover; border: 3px solid var(--color-primary);" alt="${name}" />
          <div style="flex: 1; min-width: 240px;">
            <h3 style="font-size: 24px; color: var(--color-text); margin-bottom: 4px;">${name}</h3>
            <p style="font-size: 15px; font-weight: 700; color: var(--color-primary); margin-bottom: 16px;">${role}</p>
            <ul style="list-style: none; padding: 0;" class="coach-details-list">
              ${detailsHtml}
            </ul>
          </div>
        </div>
      `;

      coachModal.classList.add('active');
    });
  });

  const closeBtn = document.getElementById('coach-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => coachModal.classList.remove('active'));
  }
}

function initSocialSharing() {
  const shareBtns = document.querySelectorAll('.btn-share');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-title') || 'Sri Sri University Sports Achievements';
      const url = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: title,
          text: 'Check out Sri Sri University Sports Council achievements!',
          url: url,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url);
        alert('Page link copied to clipboard!');
      }
    });
  });
}
