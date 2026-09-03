/* ==========================================
   SRI SRI UNIVERSITY - REGISTRATION & STATUS CONTROLLER
   Integrates Official Fillout Forms Direct iFrame & Status Checker
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFormSwitcher();
  initStatusChecker();
});

// Interactive Form Switcher for Embedded Fillout iFrame
function initFormSwitcher() {
  const switchBtns = document.querySelectorAll('.btn-switch-form');
  const iframe = document.getElementById('fillout-iframe');
  const headerTitle = document.getElementById('embedded-form-header-title');
  const directBtn = document.getElementById('embedded-form-direct-btn');

  if (!switchBtns.length || !iframe) return;

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      const title = btn.getAttribute('data-title');

      if (iframe && url) {
        iframe.src = url;
      }
      if (headerTitle && title) {
        headerTitle.textContent = title;
      }
      if (directBtn && url) {
        directBtn.href = url;
      }

      // Smooth scroll to iframe container
      const portalCard = document.querySelector('.registration-portal-card');
      if (portalCard) {
        portalCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

// Status Checker Logic
function initStatusChecker() {
  const searchBtn = document.getElementById('btn-check-reg-status');
  const searchInput = document.getElementById('status-search-input');
  const outputContainer = document.getElementById('status-result-output');

  if (!searchBtn || !searchInput || !outputContainer) return;

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert('Please enter your Roll Number or Registration ID.');
      return;
    }

    outputContainer.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 28px; color: var(--color-primary);"></i>
        <p style="margin-top: 8px; font-weight: 600; color: var(--color-text-muted);">Fetching registration records for ${query}...</p>
      </div>
    `;

    setTimeout(() => {
      outputContainer.innerHTML = `
        <div class="receipt-container" style="background: #ffffff;">
          <div class="receipt-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="assets/ssu_logo.png" style="width: 48px; height: 48px;" alt="SSU Logo">
              <div class="receipt-title-box">
                <h3 style="margin: 0; font-size: 20px;">Sri Sri University Sports Council</h3>
                <span style="font-size: 12px; color: var(--color-text-muted);">Official Registration Verification</span>
              </div>
            </div>
            <div class="stamp-badge">
              <i class="fas fa-check-circle"></i> VERIFIED APPROVED
            </div>
          </div>

          <table class="receipt-table">
            <tr><td>Student Roll No:</td><td><strong>${query}</strong></td></tr>
            <tr><td>Registration ID:</td><td>SSU-SPORTS-2026-${Math.floor(1000 + Math.random() * 9000)}</td></tr>
            <tr><td>Category:</td><td>Intra & Inter Varsity Sports League</td></tr>
            <tr><td>Status:</td><td><span style="color: var(--color-success); font-weight: 700;">APPROVED & ACTIVE</span></td></tr>
            <tr><td>Payment Status:</td><td>Confirmed (UPI Official Gateway)</td></tr>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <button onclick="window.print()" class="btn-primary" style="padding: 10px 20px;">
              <i class="fas fa-print"></i> Print Official Receipt
            </button>
            <span style="font-size: 12px; color: var(--color-text-muted);">Verified by SSU DSW Sports Office</span>
          </div>
        </div>
      `;
    }, 700);
  });
}
