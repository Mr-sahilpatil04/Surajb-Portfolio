/* =============================================
   LIVE MOTION BACKGROUND — bg-motion.js
   Particle system + mouse interaction + bursts
   ============================================= */

class MotionBackground {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;

    this.ctx       = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse     = { x: -9999, y: -9999 };
    this.rafId     = null;

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  /* ── Theme-aware colour palette ── */
  get isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  get palette() {
    return this.isDark
      ? [
          'rgba(212,175,55,',   /* gold        */
          'rgba(212,175,55,',   /* gold x2     */
          'rgba(74,158,255,',   /* blue        */
          'rgba(32,178,170,',   /* teal        */
          'rgba(240,230,204,',  /* cream       */
        ]
      : [
          'rgba(160,124,32,',
          'rgba(160,124,32,',
          'rgba(26,95,168,',
          'rgba(20,122,115,',
          'rgba(90,70,20,',
        ];
  }

  get lineColor() {
    return this.isDark
      ? 'rgba(212,175,55,'
      : 'rgba(160,124,32,';
  }

  /* ── Canvas fill viewport ── */
  resize() {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
  }

  /* ── Build particle pool ── */
  createParticles() {
    const count = Math.min(Math.floor((this.W * this.H) / 13000), 95);
    this.particles = Array.from({ length: count }, () => this.makeParticle());
  }

  makeParticle(spawnX, spawnY) {
    const pal   = this.palette;
    const color = pal[Math.floor(Math.random() * pal.length)];
    const speed = Math.random() * 0.32 + 0.08;
    const angle = Math.random() * Math.PI * 2;
    const size  = Math.random() * 2.2 + 0.5;

    return {
      x:          spawnX ?? Math.random() * this.W,
      y:          spawnY ?? Math.random() * this.H,
      vx:         Math.cos(angle) * speed,
      vy:         Math.sin(angle) * speed,
      ox:         0,           /* mouse offset */
      oy:         0,
      size,
      maxSize:    size,
      color,
      alpha:      Math.random() * 0.50 + 0.15,
      drawAlpha:  0,
      pulse:      Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.022 + 0.008,
      age:        Math.floor(Math.random() * 300),  /* stagger */
      maxLife:    Math.random() * 420 + 200,
    };
  }

  /* ── Animation loop ── */
  animate() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    this.drawLines();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age++;

      /* Respawn */
      if (p.age >= p.maxLife) {
        this.particles[i] = this.makeParticle();
        continue;
      }

      /* Fade in / out */
      const fade = Math.min(p.age / 60, 1, (p.maxLife - p.age) / 60);
      p.drawAlpha = p.alpha * fade;

      /* Mouse repulsion */
      const dx   = p.x - this.mouse.x;
      const dy   = p.y - this.mouse.y;
      const dist = Math.hypot(dx, dy);
      const R    = 130;
      if (dist < R && dist > 0) {
        const f = (R - dist) / R;
        p.ox += (dx / dist) * f * 2.2;
        p.oy += (dy / dist) * f * 2.2;
      }
      p.ox *= 0.91;
      p.oy *= 0.91;

      /* Move */
      p.x += p.vx + p.ox * 0.04;
      p.y += p.vy + p.oy * 0.04;

      /* Wrap */
      if (p.x < -20)     p.x = W + 20;
      if (p.x > W + 20)  p.x = -20;
      if (p.y < -20)     p.y = H + 20;
      if (p.y > H + 20)  p.y = -20;

      /* Pulse size */
      p.pulse += p.pulseSpeed;
      const r = p.maxSize + Math.sin(p.pulse) * 0.45;

      /* Draw */
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.drawAlpha.toFixed(3)})`;
      ctx.fill();
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  /* ── Connecting lines ── */
  drawLines() {
    const pts    = this.particles;
    const maxD   = 130;
    const lColor = this.lineColor;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxD) {
          const a = (1 - dist / maxD) * 0.20
                    * Math.min(pts[i].drawAlpha, pts[j].drawAlpha) * 2;

          this.ctx.beginPath();
          this.ctx.moveTo(pts[i].x, pts[i].y);
          this.ctx.lineTo(pts[j].x, pts[j].y);
          this.ctx.strokeStyle = `${lColor}${a.toFixed(3)})`;
          this.ctx.lineWidth   = 0.6;
          this.ctx.stroke();
        }
      }
    }
  }

  /* ── Events ── */
  bindEvents() {
    /* Resize */
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    }, { passive: true });

    /* Mouse track */
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });

    /* Click → burst of particles */
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 8; i++) {
        const b     = this.makeParticle(e.clientX, e.clientY);
        b.vx        = (Math.random() - 0.5) * 2.5;
        b.vy        = (Math.random() - 0.5) * 2.5;
        b.alpha     = 0.85;
        b.maxSize   = Math.random() * 3 + 1.5;
        b.maxLife   = 130;
        b.age       = 0;
        this.particles.push(b);
      }
    });

    /* Theme change → palette switches automatically (getter re-reads attribute) */
    const observer = new MutationObserver(() => { /* palette getter is live */ });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
  }
}

/* ── Orb parallax on mouse ── */
class OrbParallax {
  constructor() {
    this.orbs = document.querySelectorAll('.motion-orb');
    if (!this.orbs.length) return;
    this.bind();
  }

  bind() {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      const rx = (e.clientX - cx) / cx;
      const ry = (e.clientY - cy) / cy;

      this.orbs.forEach((orb, i) => {
        const depth = (i + 1) * 15;
        orb.style.transform = `translate(${rx * depth}px, ${ry * depth}px)`;
      });
    }, { passive: true });
  }
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  new MotionBackground();
  new OrbParallax();
});
