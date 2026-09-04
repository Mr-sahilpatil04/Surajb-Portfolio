/* =============================================
   ANIMATED CURSOR - cursor.js
   ============================================= */

class AnimatedCursor {
  constructor() {
    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    if (!this.dot || !this.ring) return;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.ringX = 0;
    this.ringY = 0;
    this.rafId = null;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.dot.style.left = `${e.clientX}px`;
      this.dot.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-click');
      setTimeout(() => document.body.classList.remove('cursor-click'), 300);
    });

    // Hover effects for interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, [role="button"], .research-card, .cert-envelope, .gallery-item, .timeline-card, .skill-card, .fdp-card, .exp-tab-btn, .research-tab-btn, .filter-btn'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    const textTargets = document.querySelectorAll('input, textarea');
    textTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });

    this.animateRing();
  }

  animateRing() {
    const lerp = (a, b, t) => a + (b - a) * t;
    
    const animate = () => {
      this.ringX = lerp(this.ringX, this.mouseX, 0.12);
      this.ringY = lerp(this.ringY, this.mouseY, 0.12);
      this.ring.style.left = `${this.ringX}px`;
      this.ring.style.top = `${this.ringY}px`;
      this.rafId = requestAnimationFrame(animate);
    };
    animate();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AnimatedCursor();
});
