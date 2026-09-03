/* ==========================================
   SRI SRI UNIVERSITY - ADMIN PORTAL CONTROLLER
   Handles Authentication, Dashboard Tab Switcher & Full CRUD Operations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initLoginForm();
  initLogout();
  initTabSwitcher();
  initGalleryAdmin();
  initNewsAdmin();
  initScheduleAdmin();
  initCoachesAdmin();
  initModalCloseButtons();
});

// Authentication Guard
function checkAuth() {
  const loginContainer = document.getElementById('admin-login-container');
  const dashboardContainer = document.getElementById('admin-dashboard-container');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (SSUDataStore.isLoggedIn()) {
    if (loginContainer) loginContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    refreshAllAdminTables();
  } else {
    if (loginContainer) loginContainer.style.display = 'flex';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  const errorMsg = document.getElementById('login-error-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if (SSUDataStore.login(user, pass)) {
      if (errorMsg) errorMsg.style.display = 'none';
      checkAuth();
    } else {
      if (errorMsg) errorMsg.style.display = 'block';
    }
  });
}

function initLogout() {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      SSUDataStore.logout();
      checkAuth();
    });
  }
}

// Tab Switcher
function initTabSwitcher() {
  const tabBtns = document.querySelectorAll('.portal-tabs-nav .portal-tab-btn');
  const tabContents = document.querySelectorAll('.dashboard-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    });
  });
}

function refreshAllAdminTables() {
  renderGalleryTable();
  renderNewsTable();
  renderScheduleTable();
  renderCoachesTable();
  updateAdminStats();
}

function updateAdminStats() {
  const galCount = document.getElementById('stat-gallery-count');
  const newsCount = document.getElementById('stat-news-count');
  const schCount = document.getElementById('stat-schedule-count');
  const coachCount = document.getElementById('stat-coaches-count');

  if (galCount) galCount.textContent = SSUDataStore.getGallery().length;
  if (newsCount) newsCount.textContent = SSUDataStore.getNews().length;
  if (schCount) schCount.textContent = SSUDataStore.getSchedules().length;
  if (coachCount) coachCount.textContent = SSUDataStore.getCoaches().length;
}

/* -----------------------------------
   1. Gallery Admin CRUD
   ----------------------------------- */
function initGalleryAdmin() {
  const addBtn = document.getElementById('btn-open-add-gallery-modal');
  const modal = document.getElementById('modal-add-gallery');
  const form = document.getElementById('form-add-gallery');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => modal.classList.add('active'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('gal-input-title').value.trim();
      const category = document.getElementById('gal-input-category').value;
      const url = document.getElementById('gal-input-url').value.trim();

      SSUDataStore.addGalleryItem({ title, category, url });
      form.reset();
      modal.classList.remove('active');
      refreshAllAdminTables();
    });
  }
}

function renderGalleryTable() {
  const tbody = document.getElementById('admin-gallery-table-body');
  if (!tbody) return;

  const items = SSUDataStore.getGallery();
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--color-text-muted);">No gallery photos found. Click "Add New Gallery Photo" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td style="padding: 10px;">
        <img src="${item.url}" style="width: 60px; height: 45px; object-fit: cover; border-radius: 6px;" alt="${item.title}" />
      </td>
      <td style="padding: 10px;"><strong>${item.title}</strong></td>
      <td style="padding: 10px;"><span class="badge-ssu">${item.category}</span></td>
      <td style="padding: 10px;">
        <button class="btn-outline" onclick="deleteGalleryPhoto('${item.id}')" style="padding: 6px 12px; color: var(--color-danger); border-color: var(--color-danger); font-size: 12px;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

window.deleteGalleryPhoto = function(id) {
  if (confirm('Are you sure you want to delete this photo from the gallery?')) {
    SSUDataStore.deleteGalleryItem(id);
    refreshAllAdminTables();
  }
};

/* -----------------------------------
   2. News & Posts Admin CRUD (with Featured Image)
   ----------------------------------- */
function initNewsAdmin() {
  const addBtn = document.getElementById('btn-open-add-news-modal');
  const modal = document.getElementById('modal-news-form');
  const form = document.getElementById('form-news-save');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      document.getElementById('news-modal-title').textContent = 'Create Post / News';
      form.reset();
      document.getElementById('news-input-id').value = '';
      modal.classList.add('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('news-input-id').value;
      const title = document.getElementById('news-input-title').value.trim();
      const category = document.getElementById('news-input-category').value.trim();
      const imageUrl = document.getElementById('news-input-imageurl').value.trim();
      const summary = document.getElementById('news-input-summary').value.trim();
      const date = document.getElementById('news-input-date').value.trim();

      if (id) {
        SSUDataStore.updateNewsItem({ id, title, category, imageUrl, summary, date, type: 'news' });
      } else {
        SSUDataStore.addNewsItem({ title, category, imageUrl, summary, date, type: 'news' });
      }

      form.reset();
      modal.classList.remove('active');
      refreshAllAdminTables();
    });
  }
}

function renderNewsTable() {
  const tbody = document.getElementById('admin-news-table-body');
  if (!tbody) return;

  const items = SSUDataStore.getNews();
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-text-muted);">No news posts found. Click "Create New Post" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td style="padding: 10px;">
        ${item.imageUrl ? `<img src="${item.imageUrl}" style="width: 50px; height: 40px; object-fit: cover; border-radius: 6px;" alt="${item.title}" />` : '<span style="color:#aaa; font-size:11px;">No Image</span>'}
      </td>
      <td style="padding: 10px;"><strong>${item.title}</strong></td>
      <td style="padding: 10px;"><span class="badge-ssu">${item.category}</span></td>
      <td style="padding: 10px; font-size: 13px; max-width: 260px; color: var(--color-text-muted);">${item.summary}</td>
      <td style="padding: 10px; font-size: 12px;">${item.date}</td>
      <td style="padding: 10px; display: flex; gap: 8px;">
        <button class="btn-outline" onclick="editNewsPost('${item.id}')" style="padding: 6px 10px; font-size: 12px;">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-outline" onclick="deleteNewsPost('${item.id}')" style="padding: 6px 10px; color: var(--color-danger); border-color: var(--color-danger); font-size: 12px;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

window.editNewsPost = function(id) {
  const items = SSUDataStore.getNews();
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('news-modal-title').textContent = 'Edit Post / News';
  document.getElementById('news-input-id').value = item.id;
  document.getElementById('news-input-title').value = item.title;
  document.getElementById('news-input-category').value = item.category;
  document.getElementById('news-input-imageurl').value = item.imageUrl || '';
  document.getElementById('news-input-summary').value = item.summary;
  document.getElementById('news-input-date').value = item.date;

  document.getElementById('modal-news-form').classList.add('active');
};

window.deleteNewsPost = function(id) {
  if (confirm('Are you sure you want to delete this news post?')) {
    SSUDataStore.deleteNewsItem(id);
    refreshAllAdminTables();
  }
};

/* -----------------------------------
   3. Games & Match Schedule Admin CRUD (Intra & Inter)
   ----------------------------------- */
function initScheduleAdmin() {
  const addBtn = document.getElementById('btn-open-add-schedule-modal');
  const modal = document.getElementById('modal-schedule-form');
  const form = document.getElementById('form-schedule-save');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      document.getElementById('sch-modal-title').textContent = 'Add New Match Schedule';
      form.reset();
      document.getElementById('sch-input-id').value = '';
      modal.classList.add('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('sch-input-id').value;
      const type = document.getElementById('sch-input-type').value;
      const date = document.getElementById('sch-input-date').value.trim();
      const sport = document.getElementById('sch-input-sport').value.trim();
      const matchup = document.getElementById('sch-input-matchup').value.trim();
      const venue = document.getElementById('sch-input-venue').value.trim();
      const status = document.getElementById('sch-input-status').value.trim();

      const schData = { type, date, sport, matchup, venue, status };

      if (id) {
        schData.id = id;
        SSUDataStore.updateSchedule(schData);
      } else {
        SSUDataStore.addSchedule(schData);
      }

      form.reset();
      modal.classList.remove('active');
      refreshAllAdminTables();
    });
  }
}

function renderScheduleTable() {
  const tbody = document.getElementById('admin-schedule-table-body');
  if (!tbody) return;

  const items = SSUDataStore.getSchedules();
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-text-muted);">No match schedules found. Click "Add New Match Schedule" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td style="padding: 10px;">
        <span class="badge-ssu" style="${item.type === 'inter' ? 'background:#fff8ee; color:#b88600;' : ''}">
          ${item.type === 'inter' ? 'INTER-VARSITY' : 'INTRA-CAMPUS'}
        </span>
      </td>
      <td style="padding: 10px; font-size: 13px;">${item.date}</td>
      <td style="padding: 10px;"><strong>${item.sport}</strong></td>
      <td style="padding: 10px; font-size: 13px;">${item.matchup}</td>
      <td style="padding: 10px; font-size: 13px;">${item.venue}</td>
      <td style="padding: 10px;"><span class="badge-ssu">${item.status}</span></td>
      <td style="padding: 10px; display: flex; gap: 8px;">
        <button class="btn-outline" onclick="editScheduleItem('${item.id}')" style="padding: 6px 10px; font-size: 12px;">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-outline" onclick="deleteScheduleItem('${item.id}')" style="padding: 6px 10px; color: var(--color-danger); border-color: var(--color-danger); font-size: 12px;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

window.editScheduleItem = function(id) {
  const items = SSUDataStore.getSchedules();
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('sch-modal-title').textContent = 'Edit Match Schedule';
  document.getElementById('sch-input-id').value = item.id;
  document.getElementById('sch-input-type').value = item.type;
  document.getElementById('sch-input-date').value = item.date;
  document.getElementById('sch-input-sport').value = item.sport;
  document.getElementById('sch-input-matchup').value = item.matchup;
  document.getElementById('sch-input-venue').value = item.venue;
  document.getElementById('sch-input-status').value = item.status;

  document.getElementById('modal-schedule-form').classList.add('active');
};

window.deleteScheduleItem = function(id) {
  if (confirm('Are you sure you want to delete this match schedule fixture?')) {
    SSUDataStore.deleteSchedule(id);
    refreshAllAdminTables();
  }
};

/* -----------------------------------
   4. Faculty / Coaches Admin CRUD
   ----------------------------------- */
function initCoachesAdmin() {
  const addBtn = document.getElementById('btn-open-add-coach-modal');
  const modal = document.getElementById('modal-coach-form');
  const form = document.getElementById('form-coach-save');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      document.getElementById('coach-modal-title').textContent = 'Add New Coach Profile';
      form.reset();
      document.getElementById('coach-input-id').value = '';
      modal.classList.add('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('coach-input-id').value;
      const name = document.getElementById('coach-input-name').value.trim();
      const role = document.getElementById('coach-input-role').value.trim();
      const experience = document.getElementById('coach-input-exp').value.trim();
      const qualification = document.getElementById('coach-input-qual').value.trim();
      const email = document.getElementById('coach-input-email').value.trim();
      const phone = document.getElementById('coach-input-phone').value.trim();
      const photo = document.getElementById('coach-input-photo').value.trim();

      const coachData = { name, role, experience, qualification, certification: qualification, email, phone, photo };

      if (id) {
        coachData.id = id;
        SSUDataStore.updateCoachItem(coachData);
      } else {
        SSUDataStore.addCoachItem(coachData);
      }

      form.reset();
      modal.classList.remove('active');
      refreshAllAdminTables();
    });
  }
}

function renderCoachesTable() {
  const tbody = document.getElementById('admin-coaches-table-body');
  if (!tbody) return;

  const items = SSUDataStore.getCoaches();
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">No coach profiles found. Click "Add New Coach Profile" to add one.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td style="padding: 10px;">
        <img src="${item.photo}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary);" alt="${item.name}" />
      </td>
      <td style="padding: 10px;"><strong>${item.name}</strong></td>
      <td style="padding: 10px; font-size: 13px;">${item.role}<br><span style="color: var(--color-text-muted);">${item.experience}</span></td>
      <td style="padding: 10px; font-size: 12px;">${item.email}<br>${item.phone}</td>
      <td style="padding: 10px; display: flex; gap: 8px;">
        <button class="btn-outline" onclick="editCoachProfile('${item.id}')" style="padding: 6px 10px; font-size: 12px;">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-outline" onclick="deleteCoachProfile('${item.id}')" style="padding: 6px 10px; color: var(--color-danger); border-color: var(--color-danger); font-size: 12px;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
}

window.editCoachProfile = function(id) {
  const items = SSUDataStore.getCoaches();
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('coach-modal-title').textContent = 'Edit Coach Profile';
  document.getElementById('coach-input-id').value = item.id;
  document.getElementById('coach-input-name').value = item.name;
  document.getElementById('coach-input-role').value = item.role;
  document.getElementById('coach-input-exp').value = item.experience;
  document.getElementById('coach-input-qual').value = item.qualification;
  document.getElementById('coach-input-email').value = item.email;
  document.getElementById('coach-input-phone').value = item.phone;
  document.getElementById('coach-input-photo').value = item.photo;

  document.getElementById('modal-coach-form').classList.add('active');
};

window.deleteCoachProfile = function(id) {
  if (confirm('Are you sure you want to delete this coach profile?')) {
    SSUDataStore.deleteCoachItem(id);
    refreshAllAdminTables();
  }
};

function initModalCloseButtons() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });
}
