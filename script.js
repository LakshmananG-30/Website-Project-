/* =========================================================
   EDUGUIDE EDUCATIONAL CONSULTANCY — SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function highlightActiveLink() {
    var scrollPos = window.scrollY + 130;
    var current = sections[0] ? sections[0].id : '';

    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) {
        current = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      var target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active-link', target === current);
    });
  }
  highlightActiveLink();
  window.addEventListener('scroll', highlightActiveLink, { passive: true });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Animated stat counters ---------- */
  var statNumbers = document.querySelectorAll('.stat-number');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN');
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Testimonial slider ---------- */
  var track = document.getElementById('testimonialTrack');
  var slides = track ? Array.prototype.slice.call(track.querySelectorAll('.testimonial-slide')) : [];
  var dotsWrap = document.getElementById('testimonialDots');
  var prevBtn = document.getElementById('testimonialPrev');
  var nextBtn = document.getElementById('testimonialNext');
  var current = 0;
  var autoplayTimer;

  if (slides.length) {
    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsWrap.appendChild(dot);
    });

    function render() {
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function goToSlide(i) {
      current = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () { goToSlide(current + 1); }, 6000);
    }

    prevBtn.addEventListener('click', function () { goToSlide(current - 1); });
    nextBtn.addEventListener('click', function () { goToSlide(current + 1); });

    render();
    restartAutoplay();
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 480);
  }
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ---------- Lead form validation ---------- */
  var leadForm = document.getElementById('leadForm');

  function setFieldError(field, message) {
    var wrap = field.closest('.form-field');
    var errorEl = wrap ? wrap.querySelector('.field-error') : null;
    if (wrap) wrap.classList.toggle('field-invalid', !!message);
    if (errorEl) errorEl.textContent = message || '';
  }

  function validatePhone(value) {
    return /^[0-9+\-\s]{10,14}$/.test(value.trim());
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      var nameField = document.getElementById('studentName');
      if (!nameField.value.trim()) {
        setFieldError(nameField, 'Please enter the student name.');
        isValid = false;
      } else {
        setFieldError(nameField, '');
      }

      var mobileField = document.getElementById('mobileNumber');
      if (!validatePhone(mobileField.value)) {
        setFieldError(mobileField, 'Enter a valid mobile number.');
        isValid = false;
      } else {
        setFieldError(mobileField, '');
      }

      var emailField = document.getElementById('email');
      if (!validateEmail(emailField.value)) {
        setFieldError(emailField, 'Enter a valid email address.');
        isValid = false;
      } else {
        setFieldError(emailField, '');
      }

      var courseField = document.getElementById('courseInterested');
      if (!courseField.value) {
        setFieldError(courseField, 'Please select a course.');
        isValid = false;
      } else {
        setFieldError(courseField, '');
      }

      var consentField = document.getElementById('consent');
      var consentError = document.getElementById('consentError');
      if (!consentField.checked) {
        consentError.textContent = 'Please accept to be contacted so we can reach you.';
        isValid = false;
      } else {
        consentError.textContent = '';
      }

      if (!isValid) return;

      // Placeholder submit — replace with Formspree endpoint or backend API call.
      var submitBtn = leadForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Enquiry Submitted';
      submitBtn.disabled = true;

      setTimeout(function () {
        alert('Thank you, ' + nameField.value + '! A counsellor will call you within 24 hours.');
        leadForm.reset();
        submitBtn.innerHTML = originalLabel;
        submitBtn.disabled = false;
      }, 900);
    });

    // Clear error on input
    leadForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () { setFieldError(field, ''); });
    });
  }

});
