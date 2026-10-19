/**
 * RAKSH KALESH (@the.kalesh02) — LUXURY UGC PORTFOLIO JAVASCRIPT
 * Handles mobile nav, smooth stats counting, gallery filtering, lightbox modal,
 * email copying toast, and form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------
     1. STICKY HEADER SCROLL EFFECT
  ------------------------------------------------------------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* -------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
  ------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-drawer-footer a');

  function toggleMobileMenu() {
    const isActive = hamburgerBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', String(isActive));
    mobileNav.setAttribute('aria-hidden', String(!isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
          toggleMobileMenu();
        }
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  }

  /* -------------------------------------------------------------
     3. ANIMATED NUMBER COUNTERS IN STATS BAR
  ------------------------------------------------------------- */
  const statValues = document.querySelectorAll('.stat-value');
  let animatedStats = false;

  function runStatsCounter() {
    statValues.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeProgress * target);

        el.textContent = `${currentCount}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          runStatsCounter();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  /* -------------------------------------------------------------
     4. SERVICES PILL TABS FILTER
  ------------------------------------------------------------- */
  const servicePillBtns = document.querySelectorAll('.service-pill-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  servicePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      servicePillBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------
     5. GALLERY FILTER TABS
  ------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-gallery-filter');

      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------
     6. CONTENT GALLERY LIGHTBOX MODAL
  ------------------------------------------------------------- */
  const modal = document.getElementById('gallery-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalClient = document.getElementById('modal-client');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalInquireBtn = document.getElementById('modal-inquire-btn');

  function openGalleryModal(card) {
    const title = card.getAttribute('data-modal-title');
    const client = card.getAttribute('data-modal-client');
    const desc = card.getAttribute('data-modal-desc');
    const metrics = card.getAttribute('data-modal-metrics');
    const imgSrc = card.getAttribute('data-modal-img');

    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalClient.textContent = client;
    modalDesc.textContent = desc;
    modalMetrics.textContent = metrics;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGalleryModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => openGalleryModal(card));
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeGalleryModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeGalleryModal);
  }
  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeGalleryModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeGalleryModal();
    }
  });

  /* -------------------------------------------------------------
     7. ONE-CLICK EMAIL COPY & TOAST NOTIFICATION
  ------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const creatorEmail = document.getElementById('creator-email');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  if (copyEmailBtn && creatorEmail) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = creatorEmail.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('✓ Email address copied: ' + email);
      } catch (err) {
        showToast('Direct email: ' + email);
      }
    });
  }

  // Media kit trigger
  const mediaKitTrigger = document.getElementById('download-mediakit-trigger');
  if (mediaKitTrigger) {
    mediaKitTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📄 Raksh (@the.kalesh02) 2026 Media Kit & Rate Card requested!');
    });
  }

  /* -------------------------------------------------------------
     8. COLLABORATION INQUIRY FORM SUBMISSION
  ------------------------------------------------------------- */
  const collabForm = document.getElementById('collab-form');
  const formSuccessBox = document.getElementById('form-success-box');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (collabForm) {
    collabForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const brandName = document.getElementById('brand-name').value.trim();
      const contactName = document.getElementById('contact-name').value.trim();
      const brandEmail = document.getElementById('brand-email').value.trim();
      const brief = document.getElementById('campaign-brief').value.trim();

      if (!brandName || !contactName || !brandEmail || !brief) {
        showToast('⚠️ Please complete all required fields.');
        return;
      }

      // Simulate sending inquiry
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending Proposal...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        collabForm.style.display = 'none';
        formSuccessBox.style.display = 'block';
        showToast('✨ Inquiry sent to Raksh (@the.kalesh02)!');
      }, 700);
    });
  }

  if (resetFormBtn && collabForm && formSuccessBox) {
    resetFormBtn.addEventListener('click', () => {
      collabForm.reset();
      formSuccessBox.style.display = 'none';
      collabForm.style.display = 'flex';
    });
  }
});
