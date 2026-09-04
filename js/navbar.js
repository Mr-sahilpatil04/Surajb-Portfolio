/* =============================================
   NAVBAR - navbar.js
   ============================================= */

class Navbar {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    this.navbar.classList.add('scrolled');
    // Scroll behavior
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Hamburger toggle
    if (this.hamburger && this.mobileMenu) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile on link click
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobile();
      });
    });

    // Active link based on current page
    this.setActiveLink();
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    this.lastScroll = scrollY;
  }

  toggleMobile() {
    const isOpen = this.hamburger.classList.toggle('open');
    this.mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMobile() {
    this.hamburger.classList.remove('open');
    this.mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});
