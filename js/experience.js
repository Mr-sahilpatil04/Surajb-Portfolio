/* =============================================
   EXPERIENCE PAGE - experience.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.exp-tab-btn');
  const panels = document.querySelectorAll('.timeline-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger reveal animations for items
        panel.querySelectorAll('.reveal, .reveal-left').forEach((el, i) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }
    });
  });

  // Activate first tab by default
  if (tabBtns.length > 0) tabBtns[0].click();
});
