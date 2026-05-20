/* ============================================================
   CAMIGUIN TOURISM WEBSITE - MAIN JAVASCRIPT
   Complete implementation with all interactive features
   ============================================================ */

'use strict';

/* ============================================================
   PAGE INITIALIZATION — Master Function
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initScrollDepthIndicator();
  initStickyHeaderShadow();
  initTypewriterEffect();
  initScrollFadeAnimation();
  initCardHoverEffect();
  initLiveCounters();
  initFormValidation();
  initSmoothScrollAnchor();
  initGalleryLightbox();
  initDestinationFilters();
  initPhotoGalleryModalCarousel();
});

/* ============================================================
   1. SCROLL DEPTH INDICATOR
   ============================================================ */

function initScrollDepthIndicator() {
  let progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = '#ff8808';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
  }

  window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* ============================================================
   2. STICKY HEADER WITH SHADOW
   ============================================================ */

function initStickyHeaderShadow() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled-shadow');
    } else {
      header.classList.remove('scrolled-shadow');
    }
  });
}

/* ============================================================
   3. TYPEWRITER EFFECT FOR HERO
   ============================================================ */

function initTypewriterEffect() {
  const heroContent = document.querySelector('.hero-content p');
  if (!heroContent) return;

  const originalText = heroContent.textContent;
  heroContent.textContent = '';

  let index = 0;
  const speed = 50;

  function typeCharacter() {
    if (index < originalText.length) {
      heroContent.textContent += originalText.charAt(index);
      index++;
      setTimeout(typeCharacter, speed);
    }
  }

  setTimeout(typeCharacter, 500);
}

/* ============================================================
   4. SCROLL FADE-IN & FADE-OUT ANIMATION
   btw AI ni sir
   ============================================================ */

function initScrollFadeAnimation() {
  if (!document.getElementById('fadeAnimationStyles')) {
    const style = document.createElement('style');
    style.id = 'fadeAnimationStyles';
    style.textContent = `
      /* AI ni sir */
      .fade-in-element {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }

      .fade-in-element.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  const elements = document.querySelectorAll('.detail-card, .destination-section, .experience-section, .travel-section, .subpage-intro, .cat-card, .intro-img-card, .fact-item');
  elements.forEach(el => el.classList.add('fade-in-element'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   5. CARD HOVER EFFECTS (Scale & Lift)
   ============================================================ */

function initCardHoverEffect() {
  const cards = document.querySelectorAll('.detail-card, .intro-img-card, .cat-card, .dest-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.06)';
      this.style.transition = 'transform 0.3s ease';
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = 'none';
    });
  });
}

/* ============================================================
   6. LIVE NUMERIC COUNTERS
   ============================================================ */

function initLiveCounters() {
  const counters = document.querySelectorAll('[data-counter], .fact-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const counter = entry.target;
        let target = parseInt(counter.dataset.counter || counter.textContent.replace(/\D/g, ''), 10);

        if (isNaN(target)) return;

        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
            counter.dataset.counted = 'true';
          } else {
            counter.textContent = Math.floor(current);
          }
        }, 16);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ============================================================
   7. FORM VALIDATION (7 Fields)
   ============================================================ */

function initFormValidation() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateInquiryForm()) {
      submitInquiryForm();
    } else {
      form.classList.add('was-validated');
    }
  });

  document.querySelectorAll('#inquiryForm input, #inquiryForm select, #inquiryForm textarea').forEach(field => {
    field.addEventListener('blur', validateInquiryForm);
    field.addEventListener('change', validateInquiryForm);
  });
}

function validateInquiryForm() {
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const destination = document.getElementById('destination');
  const travelDate = document.getElementById('travelDate');
  const visitors = document.getElementById('visitors');
  const message = document.getElementById('message');

  let isValid = true;

  if (fullName) {
    if (!fullName.value.trim()) {
      fullName.classList.add('is-invalid');
      isValid = false;
    } else {
      fullName.classList.remove('is-invalid');
      fullName.classList.add('is-valid');
    }
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.classList.add('is-invalid');
      isValid = false;
    } else {
      email.classList.remove('is-invalid');
      email.classList.add('is-valid');
    }
  }

  if (phone) {
    const phoneRegex = /^[0-9\-\s+()]*$/;
    if (!phoneRegex.test(phone.value) || !phone.value.trim()) {
      phone.classList.add('is-invalid');
      isValid = false;
    } else {
      phone.classList.remove('is-invalid');
      phone.classList.add('is-valid');
    }
  }

  if (destination) {
    if (!destination.value) {
      destination.classList.add('is-invalid');
      isValid = false;
    } else {
      destination.classList.remove('is-invalid');
      destination.classList.add('is-valid');
    }
  }

  if (travelDate) {
    if (!travelDate.value) {
      travelDate.classList.add('is-invalid');
      isValid = false;
    } else {
      travelDate.classList.remove('is-invalid');
      travelDate.classList.add('is-valid');
    }
  }

  if (visitors) {
    if (!visitors.value || parseInt(visitors.value) < 1) {
      visitors.classList.add('is-invalid');
      isValid = false;
    } else {
      visitors.classList.remove('is-invalid');
      visitors.classList.add('is-valid');
    }
  }

  if (message) {
    if (!message.value.trim()) {
      message.classList.add('is-invalid');
      isValid = false;
    } else {
      message.classList.remove('is-invalid');
      message.classList.add('is-valid');
    }
  }

  return isValid;
}

function submitInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const successMessage = document.getElementById('successMessage');

  if (successMessage) {
    successMessage.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');

    setTimeout(function() {
      successMessage.classList.add('d-none');
    }, 5000);
  }
}

/* ============================================================
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */

function initSmoothScrollAnchor() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   9. GALLERY LIGHTBOX
   ============================================================ */

let currentGalleryIndex = 0;
const galleryImages = document.querySelectorAll('[data-gallery-image]');

function initGalleryLightbox() {
  if (galleryImages.length === 0) return;

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentGalleryIndex = index;
      openGalleryLightbox();
    });
  });

  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('galleryLightbox');
    if (!lightbox || lightbox.style.display !== 'flex') return;

    if (e.key === 'ArrowRight') nextGalleryImage();
    if (e.key === 'ArrowLeft') prevGalleryImage();
    if (e.key === 'Escape') closeGalleryLightbox();
  });
}

function openGalleryLightbox() {
  let lightbox = document.getElementById('galleryLightbox');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'galleryLightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <button class="lightbox-prev">&#10094;</button>
        <img class="lightbox-image" src="" alt="">
        <button class="lightbox-next">&#10095;</button>
        <div class="lightbox-caption"></div>
        <div class="lightbox-counter"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeGalleryLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevGalleryImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextGalleryImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeGalleryLightbox();
    });
  }

  updateGalleryLightbox();
  lightbox.style.display = 'flex';
}

function updateGalleryLightbox() {
  const img = galleryImages[currentGalleryIndex];
  const imgElement = document.querySelector('.lightbox-image');
  const captionElement = document.querySelector('.lightbox-caption');
  const counterElement = document.querySelector('.lightbox-counter');

  imgElement.style.opacity = '0';

  setTimeout(() => {
    imgElement.src = img.src;
    imgElement.alt = img.alt;
    captionElement.textContent = img.dataset.caption || '';
    counterElement.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;

    imgElement.style.opacity = '1';
  }, 300);
}

function nextGalleryImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  updateGalleryLightbox();
}

function prevGalleryImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  updateGalleryLightbox();
}

function closeGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) lightbox.style.display = 'none';
}

/* ============================================================
   10. DESTINATIONS SEARCH + CATEGORY FILTER
   ============================================================ */

function initDestinationFilters() {
  const categoryFilter = document.getElementById('destinationCategoryFilter');
  const searchFilter = document.getElementById('destinationSearchFilter');
  const summary = document.getElementById('destinationFilterSummary');
  const emptyState = document.getElementById('destinationNoResults');
  const destinationSections = document.querySelectorAll('.destination-section');

  if (!categoryFilter || !searchFilter || destinationSections.length === 0) return;

  function applyDestinationFilters() {
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchFilter.value.trim().toLowerCase();
    let visibleCount = 0;

    destinationSections.forEach((section) => {
      const category = section.dataset.category || 'all';
      const searchable = `${section.textContent} ${section.dataset.search || ''}`.toLowerCase();

      const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
      const searchMatch = searchTerm.length === 0 || searchable.includes(searchTerm);
      const isVisible = categoryMatch && searchMatch;

      section.classList.toggle('d-none', !isVisible);
      if (isVisible) visibleCount++;
    });

    if (summary) {
      const suffix = visibleCount === 1 ? '' : 's';
      summary.textContent = `Showing ${visibleCount} destination${suffix}`;
    }

    if (emptyState) {
      emptyState.classList.toggle('d-none', visibleCount !== 0);
    }
  }

  categoryFilter.addEventListener('change', applyDestinationFilters);
  searchFilter.addEventListener('input', applyDestinationFilters);
  applyDestinationFilters();
}

/* ============================================================
   11. PHOTO GALLERY MODAL + CAROUSEL
   ============================================================ */

function initPhotoGalleryModalCarousel() {
  const galleryCards = document.querySelectorAll('.gallery-section .gallery-card');
  if (galleryCards.length === 0 || typeof bootstrap === 'undefined') return;

  const galleryItems = [];
  galleryCards.forEach((card, index) => {
    const image = card.querySelector('img');
    if (!image) return;

    galleryItems.push({
      src: image.getAttribute('src') || '',
      alt: image.getAttribute('alt') || `Gallery image ${index + 1}`
    });

    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.dataset.galleryIndex = String(galleryItems.length - 1);
  });

  if (galleryItems.length === 0) return;

  let modal = document.getElementById('photoGalleryModal');
  if (!modal) {
    const slides = galleryItems.map((item, index) => `
      <div class="carousel-item${index === 0 ? ' active' : ''}">
        <img src="${item.src}" class="d-block w-100" alt="${escapeHtml(item.alt)}">
      </div>
    `).join('');

    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = `
      <div class="modal fade" id="photoGalleryModal" tabindex="-1" aria-labelledby="photoGalleryModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content bg-dark text-light border-0">
            <div class="modal-header border-secondary">
              <h5 class="modal-title" id="photoGalleryModalLabel">Photo Gallery</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <div id="photoGalleryCarousel" class="carousel slide" data-bs-ride="false">
                <div class="carousel-inner">
                  ${slides}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#photoGalleryCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#photoGalleryCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalWrapper.firstElementChild);
    modal = document.getElementById('photoGalleryModal');
  }

  const bsModal = new bootstrap.Modal(modal);
  const carouselElement = document.getElementById('photoGalleryCarousel');
  const bsCarousel = new bootstrap.Carousel(carouselElement, { interval: false, ride: false });

  function openAtIndex(index) {
    bsCarousel.to(index);
    bsModal.show();
  }

  galleryCards.forEach((card) => {
    const openCard = () => {
      const index = parseInt(card.dataset.galleryIndex || '0', 10);
      openAtIndex(index);
    };

    card.addEventListener('click', openCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCard();
      }
    });
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
