/* =============================================
   GALLERY - gallery.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxTag = lightbox.querySelector('.lightbox-tag');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let currentIndex = 0;
  let visibleItems = [];

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const allItems = document.querySelectorAll('.gallery-item');
      
      allItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'scaleIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open lightbox
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent;
    const tag = item.querySelector('.gallery-item-tag')?.textContent;

    if (!img) return;

    const allItems = [...document.querySelectorAll('.gallery-item')].filter(i => i.style.display !== 'none');
    visibleItems = allItems;
    currentIndex = allItems.indexOf(item);

    openLightbox(img.src, title, tag);
  });

  function openLightbox(src, title, tag) {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxTag) lightboxTag.textContent = tag || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent;
    const tag = item.querySelector('.gallery-item-tag')?.textContent;
    if (img) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = title || '';
        if (lightboxTag) lightboxTag.textContent = tag || '';
        lightboxImg.style.opacity = '1';
      }, 200);
    }
  }

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
});
