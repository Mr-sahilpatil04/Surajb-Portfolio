/* =============================================
   THEME TOGGLE - theme.js
   ============================================= */

class ThemeManager {
  constructor() {
    this.body = document.documentElement;
    this.currentTheme = localStorage.getItem('fp-theme') || 'dark';
    this.toggleBtns = document.querySelectorAll('.theme-toggle');
    this.init();
  }

  init() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);

    // Listen to toggle buttons
    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('fp-theme', theme);
  }

  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    // Animate the toggle
    this.toggleBtns.forEach(btn => {
      btn.style.transform = 'rotate(360deg)';
      setTimeout(() => btn.style.transform = '', 400);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
