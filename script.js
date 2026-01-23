gsap.registerPlugin(ScrollTrigger);

const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const burger = document.getElementById('burger');
const dropdownTriggers = document.querySelectorAll('.nav__trigger');
const solutionParents = document.querySelectorAll('.nav__parent');
const solutionSubmenus = document.querySelectorAll('.nav__submenu');
const solutionPanel = document.querySelector('.nav__submenu-panel');
const menuItemsWithDropdown = document.querySelectorAll('.nav__item--has-menu');

const toggleNavSolid = () => {
  if (window.scrollY > 60) {
    nav.classList.add('nav-solid');
  } else {
    nav.classList.remove('nav-solid');
  }
};

window.addEventListener('scroll', toggleNavSolid);
toggleNavSolid();

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

const closeAllMenus = (except) => {
  menuItemsWithDropdown.forEach((item) => {
    if (item === except) return;
    item.classList.remove('nav__item--open');
    if (item.classList.contains('nav__item--solutions')) setActiveSolution(null);
  });
};

dropdownTriggers.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const parent = btn.closest('.nav__item--has-menu');
    const isOpen = parent.classList.contains('nav__item--open');
    closeAllMenus(parent);
    parent.classList.toggle('nav__item--open', !isOpen);

    const isSolutions = parent.classList.contains('nav__item--solutions');
    if (isSolutions) {
      if (!isOpen) {
        const first = solutionParents[0];
        const isMobile = window.matchMedia('(max-width: 1024px)').matches;
        if (!isMobile && first) setActiveSolution(first.dataset.target);
        if (isMobile) setActiveSolution(null);
      } else {
        setActiveSolution(null);
      }
    }
  });
});

document.addEventListener('click', (e) => {
  const isMenu = e.target.closest('.nav');
  if (!isMenu) closeAllMenus();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllMenus();
});

const setActiveSolution = (targetId) => {
  solutionParents.forEach((p) => p.classList.toggle('active', targetId && p.dataset.target === targetId));
  solutionSubmenus.forEach((panel) => panel.classList.toggle('nav__submenu--active', targetId && panel.id === targetId));
  if (solutionPanel) solutionPanel.classList.toggle('is-active', Boolean(targetId));
};

solutionParents.forEach((parent) => {
  parent.addEventListener('mouseenter', () => {
    const inDesktop = window.matchMedia('(min-width: 1025px)').matches;
    const solutionsOpen = parent.closest('.nav__item--solutions')?.classList.contains('nav__item--open');
    if (inDesktop && solutionsOpen) setActiveSolution(parent.dataset.target);
  });

  parent.addEventListener('click', () => {
    setActiveSolution(parent.dataset.target);
  });
});

// Hero intro
const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
heroTl
  .from('.nav', { y: -40, opacity: 0, duration: 0.6 })
  .from('.hero h1', { y: 40, opacity: 0, duration: 0.7 }, '-=0.2')
  .from('.hero .subhead', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.cta-row .btn', { y: 20, opacity: 0, stagger: 0.12, duration: 0.4 }, '-=0.4');

// Count-up snapshot cards
const counters = document.querySelectorAll('.number');
gsap.from('.snapshot__item', {
  scrollTrigger: { trigger: '.snapshot', start: 'top 80%' },
  y: 30,
  opacity: 0,
  stagger: 0.08,
  duration: 0.55,
  ease: 'power2.out',
});

counters.forEach((el) => {
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.4,
          ease: 'power1.out',
          snap: { innerText: 1 },
        }
      );
    },
  });
});

// Section header + content reveals
const revealSection = (selector) => {
  const header = document.querySelector(`${selector} .section__header`);
  if (header) {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 82%' },
      y: 26,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
    });
  }

  gsap.utils
    .toArray(
      `${selector} .card, ${selector} .tile, ${selector} .why__item, ${selector} .logo, ${selector} .project-card, ${selector} .award, ${selector} .cta__inner`
    )
    .forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 86%' },
        y: 24,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.02,
      });
    });
};

['.products', '.industries', '.why', '.certifications', '.projects', '.clients', '.awards', '.cta'].forEach(revealSection);

// Logo slider gentle float
if (window.matchMedia('(min-width: 768px)').matches) {
  gsap.to('.logo-slider .logo', {
    y: -6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    duration: 2,
    stagger: 0.12,
  });
}

// Newsletter submit feedback
const newsletter = document.querySelector('.newsletter');
if (newsletter) {
  newsletter.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletter.querySelector('button');
    const input = newsletter.querySelector('input');
    const original = btn.textContent;
    btn.textContent = 'Thanks!';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2200);
  });
}

// Smooth scroll for nav links
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
    closeAllMenus();
  });
});

// ============================================
// GSAP Animations for Service Cards
// ============================================

gsap.registerPlugin(ScrollTrigger);

// Animate service cards on scroll
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
  // Initial state - cards hidden and transformed
  gsap.set(card, {
    opacity: 0,
    y: 100,
    rotateX: -15,
    scale: 0.9
  });

  // Animate cards in sequence
  gsap.to(card, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    duration: 1,
    delay: index * 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      end: "top 30%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate icon on scroll
  const icon = card.querySelector('.service-card__icon');
  gsap.from(icon, {
    scale: 0,
    rotation: -180,
    duration: 0.8,
    delay: index * 0.2 + 0.3,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate number on scroll
  const number = card.querySelector('.service-card__number');
  gsap.from(number, {
    opacity: 0,
    scale: 0,
    rotation: 360,
    duration: 1.2,
    delay: index * 0.2 + 0.2,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  // Floating animation on hover
  card.addEventListener('mouseenter', () => {
    gsap.to(icon, {
      y: -10,
      rotation: 5,
      duration: 0.6,
      ease: "power2.out"
    });
    
    gsap.to(number, {
      scale: 1.1,
      rotation: 5,
      duration: 0.6,
      ease: "power2.out"
    });

    // Glow pulse effect
    const glow = card.querySelector('.service-card__glow');
    gsap.to(glow, {
      scale: 1.3,
      opacity: 0.9,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      y: 0,
      rotation: 0,
      duration: 0.6,
      ease: "power2.out"
    });
    
    gsap.to(number, {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "power2.out"
    });

    const glow = card.querySelector('.service-card__glow');
    gsap.to(glow, {
      scale: 1,
      opacity: 0.7,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  // Continuous subtle floating animation
  gsap.to(card, {
    y: -5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: index * 0.3
  });
});

// Animate section header
const serviceHeader = document.querySelector('.service__header');
if (serviceHeader) {
  gsap.from(serviceHeader, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: serviceHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}

// ============================================
// GSAP Animations for Product Cards
// ============================================

const productCards = document.querySelectorAll('.product-card');

productCards.forEach((card, index) => {
  // Initial state
  gsap.set(card, {
    opacity: 0,
    y: 80,
    scale: 0.8,
    rotateY: -30
  });

  // Animate cards in with 3D effect
  gsap.to(card, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    duration: 0.8,
    delay: index * 0.1,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      end: "top 40%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate icon - removed scale animation, keeping rotation only
  const icon = card.querySelector('.product-card__icon');
  gsap.from(icon, {
    rotation: -180,
    opacity: 0,
    duration: 0.8,
    delay: index * 0.1 + 0.2,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate badge
  const badge = card.querySelector('.product-card__badge');
  if (badge) {
    gsap.from(badge, {
      x: 50,
      opacity: 0,
      rotation: 180,
      duration: 0.6,
      delay: index * 0.1 + 0.5,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Icon hover animation with GSAP
  card.addEventListener('mouseenter', () => {
    gsap.to(icon, {
      scale: 1.1,
      rotation: 10,
      duration: 0.4,
      ease: "back.out(2)"
    });

    // Bounce effect
    gsap.to(card, {
      y: -8,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(card, {
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  // Removed continuous pulse animation - icon will stay static
});

// Animate products header
const productsHeader = document.querySelector('.products__header');
if (productsHeader) {
  gsap.from(productsHeader, {
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate header elements separately
  gsap.from('.products__header .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from('.products__header h2', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from('.products__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}
// Industry Cards GSAP Animations
const industryCards = document.querySelectorAll('.industry-card');

// Animate industries header
const industriesHeader = document.querySelector('.industries__header');
if (industriesHeader) {
  gsap.from(industriesHeader, {
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: industriesHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}

industryCards.forEach((card, index) => {
  const icon = card.querySelector('.industry-card__icon');
  const content = card.querySelector('.industry-card__content');
  const number = card.querySelector('.industry-card__number');
  const bg = card.querySelector('.industry-card__bg');

  // Initial state
  gsap.set(card, {
    opacity: 0,
    y: 100,
    rotateX: -15,
    scale: 0.9
  });

  // Scroll trigger animation - 3D flip entry
  gsap.to(card, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    duration: 1.2,
    delay: index * 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Icon entrance - static at proper size, only rotation (removed scale: 0)
  if (icon) {
    gsap.from(icon, {
      rotation: -90,
      opacity: 0,
      duration: 0.7,
      delay: index * 0.15 + 0.3,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Number animation with scale
  if (number) {
    gsap.from(number, {
      scale: 0,
      opacity: 0,
      rotation: 45,
      duration: 0.8,
      delay: index * 0.15 + 0.4,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Content fade in
  if (content) {
    gsap.from(content, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: index * 0.15 + 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Hover animations with GSAP
  card.addEventListener('mouseenter', () => {
    // Icon rotation and scale - reduced hover scale
    gsap.to(icon, {
      scale: 1.1,
      rotation: 8,
      duration: 0.6,
      ease: "back.out(2)"
    });

    // Number scale and rotation
    gsap.to(number, {
      scale: 1.3,
      rotation: -10,
      duration: 0.4,
      ease: "power2.out"
    });

    // Background fade in
    gsap.to(bg, {
      opacity: 1,
      duration: 0.4
    });

    // Subtle card lift
    gsap.to(card, {
      y: -10,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(number, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(bg, {
      opacity: 0,
      duration: 0.4
    });

    gsap.to(card, {
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  // Removed continuous floating animation - icon will stay static
  // Removed continuous pulse animation - only hover interactions
});

// Why Choose Section GSAP Animations
const whyChooseCards = document.querySelectorAll('.why-choose-card');

// Animate why-choose header
const whyChooseHeader = document.querySelector('.why-choose__header');
if (whyChooseHeader) {
  gsap.from(whyChooseHeader, {
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate eyebrow
  gsap.from('.why-choose__header .eyebrow', {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    delay: 0.2,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate title
  gsap.from('.why-choose__header h2', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate subtitle
  gsap.from('.why-choose__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}

whyChooseCards.forEach((card, index) => {
  const icon = card.querySelector('.why-choose-card__icon');
  const content = card.querySelector('.why-choose-card__content');
  const arrow = card.querySelector('.why-choose-card__arrow');
  const glow = card.querySelector('.why-choose-card__glow');

  // Initial state
  gsap.set(card, {
    opacity: 0,
    y: 80,
    scale: 0.95
  });

  // Scroll trigger animation - slide up with fade
  gsap.to(card, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    delay: index * 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  });

  // Icon entrance - removed scale, keeping rotation only
  if (icon) {
    gsap.from(icon, {
      rotation: -90,
      opacity: 0,
      duration: 0.7,
      delay: index * 0.12 + 0.2,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Content slide in
  if (content) {
    gsap.from(content, {
      opacity: 0,
      x: -30,
      duration: 0.8,
      delay: index * 0.12 + 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Arrow slide in from right
  if (arrow) {
    gsap.from(arrow, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      delay: index * 0.12 + 0.5,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Hover animations with GSAP
  card.addEventListener('mouseenter', () => {
    // Icon scale and rotation
    gsap.to(icon, {
      scale: 1.1,
      rotation: 8,
      duration: 0.5,
      ease: "back.out(2)"
    });

    // Glow effect
    gsap.to(glow, {
      opacity: 1,
      scale: 1.2,
      duration: 0.5
    });

    // Arrow bounce
    gsap.to(arrow, {
      x: 12,
      scale: 1.3,
      duration: 0.4,
      ease: "back.out(2)"
    });

    // Card lift
    gsap.to(card, {
      y: -8,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(glow, {
      opacity: 0,
      scale: 1,
      duration: 0.4
    });

    gsap.to(arrow, {
      x: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(card, {
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  // Removed continuous float - icon will stay static
  
  // Subtle arrow pulse only
  gsap.to(arrow, {
    opacity: 0.6,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: index * 0.25
  });
});

// Clients Section GSAP Animations
const clientStats = document.querySelectorAll('.client-stat');
const clientLogos = document.querySelectorAll('.client-logo');

// Animate clients header
const clientsHeader = document.querySelector('.clients__header');
if (clientsHeader) {
  gsap.from(clientsHeader, {
    opacity: 0,
    y: 60,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate eyebrow
  gsap.from('.clients__header .eyebrow', {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    delay: 0.2,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate title
  gsap.from('.clients__header h2', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate subtitle
  gsap.from('.clients__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}

// Animate marquee entrance
const clientsMarquee = document.querySelector('.clients__marquee');
if (clientsMarquee) {
  gsap.from(clientsMarquee, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: clientsMarquee,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
}

// Animate client stats
clientStats.forEach((stat, index) => {
  const number = stat.querySelector('.client-stat__number');
  const label = stat.querySelector('.client-stat__label');

  // Initial state
  gsap.set(stat, {
    opacity: 0,
    scale: 0.9,
    y: 40
  });

  // Scroll trigger animation
  gsap.to(stat, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.8,
    delay: index * 0.15,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: stat,
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  });

  // Number count-up animation
  if (number) {
    const numberText = number.textContent;
    const hasPlus = numberText.includes('+');
    const hasPercent = numberText.includes('%');
    const numValue = parseInt(numberText.replace(/[^0-9]/g, ''));

    gsap.from(number, {
      textContent: 0,
      duration: 1.5,
      delay: index * 0.15 + 0.3,
      ease: "power2.out",
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: stat,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      onUpdate: function() {
        const currentValue = Math.floor(this.targets()[0].textContent);
        number.textContent = currentValue + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
      }
    });
  }

  // Label fade in
  if (label) {
    gsap.from(label, {
      opacity: 0,
      y: 15,
      duration: 0.6,
      delay: index * 0.15 + 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: stat,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Continuous pulse
  gsap.to(stat, {
    scale: 1.03,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: index * 0.3
  });
});

// =========================
// AWARDS SECTION ANIMATIONS
// =========================
const awardCards = document.querySelectorAll('.award-card');

awardCards.forEach((card, index) => {
  const icon = card.querySelector('.award-card__icon');
  const year = card.querySelector('.award-card__year');
  const title = card.querySelector('.award-card__content h3');
  const description = card.querySelector('.award-card__content p');
  const badge = card.querySelector('.award-card__badge');

  // Card entrance with 3D flip
  gsap.from(card, {
    opacity: 0,
    y: 80,
    rotateX: -15,
    scale: 0.9,
    duration: 0.8,
    delay: index * 0.12,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // Icon spin entrance
  if (icon) {
    gsap.from(icon, {
      rotation: -180,
      scale: 0,
      duration: 0.7,
      delay: index * 0.12 + 0.3,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });

    // Removed continuous floating animation - icon stays static
  }

  // Year number fade and scale
  if (year) {
    gsap.from(year, {
      opacity: 0,
      scale: 0.5,
      rotation: 45,
      duration: 0.8,
      delay: index * 0.12 + 0.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Title slide in from left
  if (title) {
    gsap.from(title, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.12 + 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Description fade in
  if (description) {
    gsap.from(description, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: index * 0.12 + 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Badge pop in
  if (badge) {
    gsap.from(badge, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: index * 0.12 + 0.6,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Removed all continuous floating animations to prevent card overlap
});

// Awards header animation
const awardsHeader = document.querySelector('.awards__header');
if (awardsHeader) {
  const eyebrow = awardsHeader.querySelector('.eyebrow');
  const heading = awardsHeader.querySelector('h2');
  const subtitle = awardsHeader.querySelector('.awards__subtitle');

  if (eyebrow) {
    gsap.from(eyebrow, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: awardsHeader,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (heading) {
    gsap.from(heading, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: awardsHeader,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (subtitle) {
    gsap.from(subtitle, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: awardsHeader,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }
}
