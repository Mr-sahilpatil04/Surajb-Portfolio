/* =============================================
   ANIMATIONS - animations.js
   ============================================= */

class ScrollAnimations {
  constructor() {
    this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    this.counters = document.querySelectorAll('[data-count]');
    this.skillBars = document.querySelectorAll('.skill-bar');
    this.init();
  }

  init() {
    // Intersection observer for reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    this.revealElements.forEach(el => observer.observe(el));

    // Counter observer
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          this.animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(el => counterObserver.observe(el));

    // Skill bar observer
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || '0';
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    this.skillBars.forEach(bar => skillObserver.observe(bar));
  }

  animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = current + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

// Page transition on link click
class PageTransitions {
  constructor() {
    this.overlay = document.querySelector('.page-transition-overlay');
    this.init();
  }

  init() {
    if (!this.overlay) return;

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.overlay.classList.add('exit');
          setTimeout(() => { window.location.href = href; }, 400);
        });
      }
    });

    // Entry animation
    document.body.classList.add('page-entered');
  }
}

// Parallax on hero
class ParallaxHero {
  constructor() {
    this.orbs = document.querySelectorAll('.hero-orb');
    if (!this.orbs.length) return;
    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      this.orbs.forEach((orb, i) => {
        const factor = (i + 1) * 8;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }
}

// Modal Manager
class ModalManager {
  constructor() {
    this.overlays = document.querySelectorAll('.modal-overlay');
    this.init();
  }

  init() {
    this.overlays.forEach(overlay => {
      // Close on backdrop click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close(overlay);
      });

      // Close button
      overlay.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => this.close(overlay));
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.overlays.forEach(overlay => {
          if (overlay.classList.contains('active')) this.close(overlay);
        });
      }
    });
  }

  open(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  close(overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
  new PageTransitions();
  new ParallaxHero();
  window.modalManager = new ModalManager();
});

// Typed text effect
function typeText(element, texts, speed = 80) {
  if (!element) return;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeout;

  const type = () => {
    const current = texts[textIndex];
    
    if (isDeleting) {
      element.textContent = current.slice(0, --charIndex);
    } else {
      element.textContent = current.slice(0, ++charIndex);
    }

    let delay = isDeleting ? speed / 2 : speed;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 400;
    }

    timeout = setTimeout(type, delay);
  };

  type();
}
