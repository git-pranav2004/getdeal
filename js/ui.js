/* js/ui.js
   - Theme toggle (persisted)
   - Scroll-to-top
   - IntersectionObserver for fade-in elements
   - Show/hide scroll-to-top button
*/

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const topBtn = document.getElementById('scrollTopBtn');

// apply saved theme or system preference
(function initTheme(){
  const saved = localStorage.getItem('gd-theme');
  if (saved) body.classList.toggle('theme-dark', saved === 'dark');
  else {
    // prefer dark for modern look if user device prefers dark
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    body.classList.toggle('theme-dark', prefersDark);
  }
  updateToggleIcon();
})();

function updateToggleIcon(){
  if (!themeToggle) return;
  themeToggle.textContent = body.classList.contains('theme-dark') ? '☀️' : '🌙';
}

if (themeToggle) {
  themeToggle.addEventListener('click', ()=>{
    const isDark = body.classList.toggle('theme-dark');
    localStorage.setItem('gd-theme', isDark ? 'dark' : 'light');
    updateToggleIcon();
  });
}

// Fade-in using IntersectionObserver for .fade-in elements
const faders = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver((entries, obs)=>{
  entries.forEach(en=>{
    if (en.isIntersecting) {
      en.target.classList.add('appear');
      obs.unobserve(en.target);
    }
  });
},{ threshold: 0.12 });

faders.forEach(f => io.observe(f));

// Scroll-to-top
window.addEventListener('scroll', ()=>{
  if (!topBtn) return;
  if (window.scrollY > 360) topBtn.style.display = 'block';
  else topBtn.style.display = 'none';
});
if (topBtn) topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
