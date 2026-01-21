const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.menu-toggle');

// Mobile menu toggle
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
}

// Smooth scrolling to anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', evt => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    evt.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Animate circular progress rings when in view
const circles = document.querySelectorAll('.circle');
const paintRing = circle => {
  const value = Number(circle.dataset.value) || 0;
  const ring = circle.querySelector('.ring');
  const deg = (value / 100) * 360;
  ring.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(255,255,255,0.1) ${deg}deg)`;
};

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        paintRing(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  circles.forEach(circle => io.observe(circle));
} else {
  circles.forEach(paintRing);
}

// Duplicate marquee badges for seamless loop
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const clone = marqueeTrack.cloneNode(true);
  marqueeTrack.parentElement.appendChild(clone);
  clone.classList.add('marquee-track');
}
