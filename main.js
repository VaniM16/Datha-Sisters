/**
 * DATHA SISTERS - OFFICIAL WEBSITE JAVASCRIPT
 * Aryadatha K R & Priyadatha K R | Carnatic Classical Artistes
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNavigation();
  initGallery();
  initLightbox();
  initVideoModal();
  initContactForm();
});

/* ==========================================================================
   1. Header Scroll Effect
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Navigation & Active Section Tracking
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mainNav) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
      if (header) header.classList.remove('nav-open');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'true');
      mainNav.classList.add('open');
      if (header) header.classList.add('nav-open');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close mobile nav when clicking any link inside the navigation drawer
    const drawerLinks = mainNav.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Reset drawer if resized back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && mainNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Active section tracking via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

/* ==========================================================================
   3. Gallery Filtering (Photos, Videos, Live Stage)
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const categories = (item.dataset.category || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Image Lightbox
   ========================================================================== */
let activeImageIndex = 0;
let currentVisibleImages = [];

function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxClose');
  const backdrop = document.getElementById('lightboxBackdrop');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox) return;

  const getVisibleImageItems = () => {
    return Array.from(document.querySelectorAll('.gallery-item[data-type="image"]'))
      .filter(item => window.getComputedStyle(item).display !== 'none');
  };

  const showImageAtIndex = (index) => {
    currentVisibleImages = getVisibleImageItems();
    if (currentVisibleImages.length === 0) return;

    if (index < 0) index = currentVisibleImages.length - 1;
    if (index >= currentVisibleImages.length) index = 0;
    activeImageIndex = index;

    const targetItem = currentVisibleImages[activeImageIndex];
    const src = targetItem.dataset.src;
    const title = targetItem.dataset.title || '';
    const caption = targetItem.dataset.caption || '';

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = caption;
  };

  const openLightbox = (item) => {
    currentVisibleImages = getVisibleImageItems();
    activeImageIndex = currentVisibleImages.indexOf(item);
    if (activeImageIndex === -1) activeImageIndex = 0;

    showImageAtIndex(activeImageIndex);
    lightbox.hidden = false;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  // Attach click listener to image items
  document.querySelectorAll('.gallery-item[data-type="image"]').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImageAtIndex(activeImageIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImageAtIndex(activeImageIndex + 1);
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImageAtIndex(activeImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImageAtIndex(activeImageIndex + 1);
    }
  });
}

/* ==========================================================================
   5. Video Modal Player
   ========================================================================== */
function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalDesc = document.getElementById('videoModalDesc');
  const closeBtn = document.getElementById('videoModalClose');
  const backdrop = document.getElementById('videoModalBackdrop');

  if (!videoModal || !modalVideoPlayer) return;

  const openVideoModal = (src, title, caption) => {
    modalVideoPlayer.src = src;
    videoModalTitle.textContent = title;
    videoModalDesc.textContent = caption;
    videoModal.hidden = false;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    modalVideoPlayer.play().catch(() => {
      // Autoplay might be restricted, user can click play
    });
  };

  const closeVideoModal = () => {
    modalVideoPlayer.pause();
    modalVideoPlayer.src = '';
    videoModal.hidden = true;
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item[data-type="video"]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const title = item.dataset.title || 'Performance Video';
      const caption = item.dataset.caption || '';
      openVideoModal(src, title, caption);
    });
  });

  closeBtn?.addEventListener('click', closeVideoModal);
  backdrop?.addEventListener('click', closeVideoModal);

  window.addEventListener('keydown', (e) => {
    if (!videoModal.hidden && e.key === 'Escape') {
      closeVideoModal();
    }
  });
}

/* ==========================================================================
   6. Contact Form & Inquiry Routing
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !feedback) return;

  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScYb_nw-S08a3AvUperuf4uK9rvMGKJQ40uwcXK8ruyXgJDUg/formResponse';
  const NAME_ENTRY = 'entry.28418843';
  const EMAIL_ENTRY = 'entry.1718396892';
  const MESSAGE_ENTRY = 'entry.1644287480';
  const DESTINATION_EMAIL = 'apdatha@gmail.com';

  const checkIsMobileOrTablet = () => {
    return window.innerWidth <= 992 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // Smart handler for apdatha@gmail.com links across the site
  // On mobile & tablet: launches Gmail with apdatha@gmail.com already set
  // On desktop: opens Gmail Web compose in a new tab
  const emailLinks = document.querySelectorAll('.email-direct-item, .footer-email-link, .mobile-drawer-email-link');
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const isMobile = checkIsMobileOrTablet();
      const subject = link.getAttribute('data-subject') || 'Concert Booking Inquiry - Datha Sisters';

      if (!isMobile) {
        // Desktop: open Gmail web compose tab
        e.preventDefault();
        const webUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${DESTINATION_EMAIL}&su=${encodeURIComponent(subject)}`;
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Mobile & Tablet: ensure mailto has subject and targets apdatha@gmail.com
        const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(subject)}`;
        link.setAttribute('href', mailtoUrl);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('userName')?.value.trim();
    const email = document.getElementById('userEmail')?.value.trim();
    const message = document.getElementById('userMessage')?.value.trim();

    // Standard form validation
    if (!name || !email || !message) {
      showFeedback('Please fill out all fields.', 'error');
      return;
    }

    // Email regex validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showFeedback('Please provide a valid email address.', 'error');
      return;
    }

    // Button loading animation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;

    const formData = new FormData();
    formData.append(NAME_ENTRY, name);
    formData.append(EMAIL_ENTRY, email);
    formData.append(MESSAGE_ENTRY, message);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      const successHTML = `
        <strong>Thank you, ${escapeHTML(name)}!</strong><br>
        Your response has been recorded and submitted successfully. We will review your message and get back to you soon.
      `;
      showFeedback(successHTML, 'success', true);
      form.reset();
    } catch (err) {
      // Fallback: submit via hidden iframe
      try {
        form.submit();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        const successHTML = `
          <strong>Thank you, ${escapeHTML(name)}!</strong><br>
          Your response has been recorded and submitted successfully. We will review your message and get back to you soon.
        `;
        showFeedback(successHTML, 'success', true);
        form.reset();
      } catch (submitErr) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showFeedback('There was an issue sending your message. Please reach out directly to apdatha@gmail.com.', 'error');
      }
    }
  });

  function showFeedback(msg, type, isHtml = false) {
    feedback.className = `form-feedback ${type}`;
    if (isHtml) {
      feedback.innerHTML = msg;
    } else {
      feedback.textContent = msg;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

/**
 * Global helper to preselect the inquiry dropdown (e.g. from the Academy section)
 */
window.selectInquiryType = function(val) {
  const msg = document.getElementById('userMessage');
  if (msg) {
    msg.focus();
  }
};
