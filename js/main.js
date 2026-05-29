/* =============================================
   FLEXY ADMIN — main.js
   ============================================= */

'use strict';

/* ── Sidebar Toggle ── */
(function initSidebar() {
  const toggle  = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!toggle || !sidebar) return;

  const isMobile = () => window.innerWidth <= 992;

  function openSidebar() {
    if (isMobile()) {
      sidebar.classList.add('open');
      overlay && overlay.classList.add('active');
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay && overlay.classList.remove('active');
  }

  toggle.addEventListener('click', openSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);

  // Close on resize if mobile → desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) closeSidebar();
  });
})();

/* ── Submenu Accordion ── */
(function initSubmenus() {
  document.querySelectorAll('.nav-link').forEach(link => {
    const item = link.closest('.nav-item');
    if (!item) return;
    const submenu = item.querySelector('.nav-submenu');
    if (!submenu) return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      const wasOpen = item.classList.contains('open');

      // Close siblings
      const siblings = item.parentElement.querySelectorAll('.nav-item.open');
      siblings.forEach(s => { if (s !== item) s.classList.remove('open'); });

      item.classList.toggle('open', !wasOpen);
    });
  });
})();

/* ── Dropdowns ── */
(function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    const menuId = trigger.dataset.dropdown;
    const menu   = document.getElementById(menuId);
    if (!menu) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      // Close all dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
      if (!isOpen) menu.classList.add('show');
    });
  });

  // Close on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  });
})();

/* ── Modals ── */
(function initModals() {
  // Open via data-modal
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modal;
      const modal = document.getElementById(id);
      if (modal) modal.classList.add('show');
    });
  });

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  });

  // Close via .modal-close button
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('show');
    });
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });
})();

/* ── Toast Notifications ── */
window.showToast = function (title = '', message = '', type = 'primary', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>`,
    warning: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
    danger:  `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>`,
    info:    `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    primary: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.primary}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Close">×</button>
  `;

  container.appendChild(toast);

  const removeToast = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  setTimeout(removeToast, duration);
};

/* ── Tabs ── */
(function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tabGroup = btn.dataset.tab;
      const tabId    = btn.dataset.id;
      if (!tabGroup || !tabId) return;

      // Deactivate all buttons in this group
      document.querySelectorAll(`.tab-btn[data-tab="${tabGroup}"]`).forEach(b => b.classList.remove('active'));
      // Deactivate all panes in this group
      document.querySelectorAll(`.tab-pane[data-tab="${tabGroup}"]`).forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.querySelector(`.tab-pane[data-tab="${tabGroup}"][data-id="${tabId}"]`);
      if (pane) pane.classList.add('active');
    });
  });
})();

/* ── Stat Counter Animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const fmt = (val, prefix, suffix) => {
    const s = Math.round(val).toLocaleString();
    return (prefix || '') + s + (suffix || '');
  };

  const animate = el => {
    const target   = parseFloat(el.dataset.count);
    const prefix   = el.dataset.prefix   || '';
    const suffix   = el.dataset.suffix   || '';
    const duration = 1600;
    const start    = performance.now();

    const step = now => {
      const elapsed = Math.min(now - start, duration);
      const progress = elapsed / duration;
      // Ease-out-expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = fmt(target * ease, prefix, suffix);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  // Use IntersectionObserver if available
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
  } else {
    counters.forEach(animate);
  }
})();

/* ── Scroll To Top ── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Active Nav Link Highlight ── */
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const target = href.split('#')[0].split('/').pop();
    if (target && target === page) {
      link.classList.add('active');
      // Open parent submenu if nested
      const parentItem = link.closest('.nav-submenu')?.closest('.nav-item');
      if (parentItem) parentItem.classList.add('open');
    }
  });
})();

/* ── Progress Bar Animate ── */
(function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (!bars.length) return;

  const animateBar = el => {
    const w = el.dataset.width || '0';
    requestAnimationFrame(() => { el.style.width = w; });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    bars.forEach(el => observer.observe(el));
  } else {
    bars.forEach(animateBar);
  }
})();

/* ── Smooth Section Scroll (anchor links) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});