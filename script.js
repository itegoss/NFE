const loadSharedComponents = async () => {
  const [navbarResponse, footerResponse] = await Promise.all([
    fetch('navbar.html'),
    fetch('footer.html'),
  ]);

  if (!navbarResponse.ok || !footerResponse.ok) {
    throw new Error('Unable to load shared navigation components.');
  }

  const navbarContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');

  if (navbarContainer) navbarContainer.innerHTML = await navbarResponse.text();
  if (footerContainer) footerContainer.innerHTML = await footerResponse.text();

  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) return;

  document.querySelectorAll('#navbar-container a[href^="#"], #footer-container a[href^="#"]').forEach((link) => {
    link.href = `index.html${link.getAttribute('href')}`;
  });
};

loadSharedComponents().then(() => {
  // Initialize navbar scroll effects on all pages
  if (typeof initializeNavbar === 'function') {
    initializeNavbar();
  }

  gsap.registerPlugin(ScrollTrigger);

// =========================
// HERO TYPING ANIMATION
// =========================
const dynamicText = document.querySelector('.hero__title-dynamic');
if (dynamicText) {
  const words = JSON.parse(dynamicText.getAttribute('data-words'));
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      dynamicText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 100;
    } else {
      dynamicText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();
}

// Hero intro
const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
heroTl
  .from('.nav', { y: -40, opacity: 0, duration: 0.6 })
  .from('.hero h1', { y: 40, opacity: 0, duration: 0.7 }, '-=0.2')
  .from('.hero .subhead', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.cta-row .btn', { y: 20, opacity: 0, stagger: 0.12, duration: 0.4 }, '-=0.4');

// Count-up snapshot cards
const counters = document.querySelectorAll('[data-count]');

gsap.from('.snapshot__item', {
  scrollTrigger: { trigger: '.snapshot', start: 'top 95%' },
  y: 20,
  opacity: 0,
  stagger: 0.05,
  duration: 0.4,
  ease: 'power2.out',
});

counters.forEach((el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';

  ScrollTrigger.create({
    trigger: el,
    start: 'top 95%',
    once: true,
    onEnter: () => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 1,
        ease: 'power1.out',
        onUpdate: () => {
          const val = Math.round(obj.value);
          el.textContent = `${val}${suffix}`;
        },
      });
    },
  });
});

// Section header + content reveals
const revealSection = (selector) => {
  const header = document.querySelector(`${selector} .section__header`);
  if (header) {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 95%' },
      y: 15,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  gsap.utils
    .toArray(
      `${selector} .card, ${selector} .tile, ${selector} .why__item, ${selector} .logo, ${selector} .project-card, ${selector} .award, ${selector} .cta__inner`
    )
    .forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 95%' },
        y: 15,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        delay: i * 0.01,
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
    delay: index * 0.06,
    ease: "power3.out",
    scrollTrigger: {
      trigger: card,
      start: "top 95%",
      end: "top 30%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate icon on scroll
  const icon = card.querySelector('.service-card__icon');
  gsap.from(icon, {
    scale: 0,
    rotation: -180,
    duration: 0.35,
    delay: index * 0.06 + 0.3,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: card,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate number on scroll
  const number = card.querySelector('.service-card__number');
  gsap.from(number, {
    opacity: 0,
    scale: 0,
    rotation: 360,
    duration: 0.5,
    delay: index * 0.06 + 0.2,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 95%",
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
      start: "top 95%",
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
    duration: 0.35,
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
    duration: 0.35,
    delay: index * 0.1 + 0.2,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 95%",
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
        start: "top 95%",
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
    duration: 0.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate header elements separately
  gsap.from('.products__header .eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.35,
    delay: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from('.products__header h2', {
    opacity: 0,
    y: 30,
    duration: 0.35,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.from('.products__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.35,
    delay: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: productsHeader,
      start: "top 95%",
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
    duration: 0.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: industriesHeader,
      start: "top 95%",
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
    duration: 0.5,
    delay: index * 0.05,
    ease: "power3.out",
    scrollTrigger: {
      trigger: card,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Icon entrance - static at proper size, only rotation (removed scale: 0)
  if (icon) {
    gsap.from(icon, {
      rotation: -90,
      opacity: 0,
      duration: 0.7,
      delay: index * 0.05 + 0.3,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: card,
        start: "top 95%",
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
      duration: 0.35,
      delay: index * 0.05 + 0.4,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: card,
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Content fade in
  if (content) {
    gsap.from(content, {
      opacity: 0,
      y: 30,
      duration: 0.35,
      delay: index * 0.05 + 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 95%",
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
    duration: 0.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate eyebrow
  gsap.from('.why-choose__header .eyebrow', {
    opacity: 0,
    scale: 0.8,
    duration: 0.35,
    delay: 0.2,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate title
  gsap.from('.why-choose__header h2', {
    opacity: 0,
    y: 30,
    duration: 0.35,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate subtitle
  gsap.from('.why-choose__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.35,
    delay: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: whyChooseHeader,
      start: "top 95%",
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
      duration: 0.35,
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
    delay: index * 0.065
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
    duration: 0.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate eyebrow
  gsap.from('.clients__header .eyebrow', {
    opacity: 0,
    scale: 0.8,
    duration: 0.35,
    delay: 0.2,
    ease: "back.out(2)",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate title
  gsap.from('.clients__header h2', {
    opacity: 0,
    y: 30,
    duration: 0.35,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate subtitle
  gsap.from('.clients__subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.35,
    delay: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: clientsHeader,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });
}

// Animate featured clients
const featuredClients = document.querySelectorAll('.featured-client');
featuredClients.forEach((client, index) => {
  gsap.from(client, {
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 1,
    delay: index * 0.06,
    ease: "power3.out",
    scrollTrigger: {
      trigger: client,
      start: "top 95%",
      toggleActions: "play none none reverse"
    }
  });
});

// Animate client cards grid
const clientCards = document.querySelectorAll('.client-card');
clientCards.forEach((card, index) => {
  gsap.from(card, {
    opacity: 0,
    y: 40,
    scale: 0.9,
    duration: 0.35,
    delay: index * 0.08,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      toggleActions: "play none none reverse"
    }
  });
});

// Animate client stats
clientStats.forEach((stat, index) => {
  const number = stat.querySelector('.client-stat__number');
  const label = stat.querySelector('.client-stat__label');
  const sublabel = stat.querySelector('.client-stat__sublabel');

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
    duration: 0.35,
    delay: index * 0.05,
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
      delay: index * 0.05 + 0.3,
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
      delay: index * 0.05 + 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: stat,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  // Sublabel fade in
  if (sublabel) {
    gsap.from(sublabel, {
      opacity: 0,
      y: 10,
      duration: 0.6,
      delay: index * 0.05 + 0.6,
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

// Mouse tracking effect for featured clients
featuredClients.forEach(client => {
  client.addEventListener('mousemove', (e) => {
    const rect = client.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    client.style.setProperty('--mouse-x', `${x}%`);
    client.style.setProperty('--mouse-y', `${y}%`);
  });
});

// =========================
// AWARDS CAROUSEL
// =========================
const awardsTrack = document.getElementById('awardsTrack');
const awardsPrevBtn = document.getElementById('awardsPrev');
const awardsNextBtn = document.getElementById('awardsNext');
const awardsDots = document.getElementById('awardsDots');
const awardCards = document.querySelectorAll('.award-card');

let currentAwardIndex = 0;
let cardsPerView = 2;
let maxAwardIndex = 0;
let autoplayInterval;

// Calculate cards per view based on screen size
function updateCardsPerView() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    cardsPerView = 1;
  } else if (screenWidth < 1200) {
    cardsPerView = 2;
  } else {
    cardsPerView = 2;
  }
  maxAwardIndex = Math.max(0, awardCards.length - cardsPerView);
  createDots();
  updateCarousel();
}

// Create dots for carousel
function createDots() {
  if (!awardsDots) return;
  awardsDots.innerHTML = '';
  const totalDots = maxAwardIndex + 1;
  for (let i = 0; i <= maxAwardIndex; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === currentAwardIndex) dot.classList.add('active');
    dot.addEventListener('click', () => goToAwardSlide(i));
    awardsDots.appendChild(dot);
  }
}

// Update carousel position
function updateCarousel() {
  if (!awardsTrack || awardCards.length === 0) return;
  
  const cardWidth = awardCards[0].offsetWidth;
  const gap = 32;
  const offset = -(currentAwardIndex * (cardWidth + gap));
  
  gsap.to(awardsTrack, {
    x: offset,
    duration: 0.6,
    ease: "power2.out"
  });

  // Update buttons state
  if (awardsPrevBtn) awardsPrevBtn.disabled = currentAwardIndex === 0;
  if (awardsNextBtn) awardsNextBtn.disabled = currentAwardIndex >= maxAwardIndex;

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentAwardIndex);
  });
}

// Go to specific slide
function goToAwardSlide(index) {
  currentAwardIndex = Math.max(0, Math.min(index, maxAwardIndex));
  updateCarousel();
  resetAutoplay();
}

// Next slide
function nextAwardSlide() {
  if (currentAwardIndex < maxAwardIndex) {
    currentAwardIndex++;
    updateCarousel();
    resetAutoplay();
  }
}

// Previous slide
function prevAwardSlide() {
  if (currentAwardIndex > 0) {
    currentAwardIndex--;
    updateCarousel();
    resetAutoplay();
  }
}

// Autoplay functionality
function startAutoplay() {
  autoplayInterval = setInterval(() => {
    if (currentAwardIndex >= maxAwardIndex) {
      currentAwardIndex = 0;
    } else {
      currentAwardIndex++;
    }
    updateCarousel();
  }, 5000); // Change slide every 5 seconds
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Event listeners
if (awardsPrevBtn) awardsPrevBtn.addEventListener('click', prevAwardSlide);
if (awardsNextBtn) awardsNextBtn.addEventListener('click', nextAwardSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevAwardSlide();
  if (e.key === 'ArrowRight') nextAwardSlide();
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

if (awardsTrack) {
  awardsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  });

  awardsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
  });
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchStartX - touchEndX > swipeThreshold) {
    nextAwardSlide();
  } else if (touchEndX - touchStartX > swipeThreshold) {
    prevAwardSlide();
  }
}

// Pause autoplay on hover
if (awardsTrack) {
  awardsTrack.addEventListener('mouseenter', stopAutoplay);
  awardsTrack.addEventListener('mouseleave', startAutoplay);
}

// Initialize carousel
updateCardsPerView();
window.addEventListener('resize', updateCardsPerView);

// Start autoplay when awards section is in view
ScrollTrigger.create({
  trigger: '.awards',
  start: 'top 80%',
  onEnter: startAutoplay,
  onLeave: stopAutoplay,
  onEnterBack: startAutoplay,
  onLeaveBack: stopAutoplay
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
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (heading) {
    gsap.from(heading, {
      opacity: 0,
      y: 30,
      duration: 0.35,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: awardsHeader,
        start: "top 95%",
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
        start: "top 95%",
        toggleActions: "play none none reverse"
      }
    });
  }
}

// Animate carousel container on scroll
gsap.from('.awards__carousel-container', {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: '.awards__carousel-container',
    start: "top 90%",
    toggleActions: "play none none reverse"
  }
});

// Animate individual award cards
awardCards.forEach((card, index) => {
  const icon = card.querySelector('.award-card__icon');
  const year = card.querySelector('.award-card__year');

  if (icon) {
    gsap.from(icon, {
      rotation: -180,
      scale: 0,
      duration: 0.7,
      delay: index * 0.1 + 0.5,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: '.awards__carousel-container',
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (year) {
    gsap.from(year, {
      opacity: 0,
      scale: 0.5,
      duration: 0.35,
      delay: index * 0.1 + 0.3,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: '.awards__carousel-container',
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  }
});

// ============================================
// MILESTONE JOURNEY HORIZONTAL SCROLL
// ============================================
const milestoneJourney = document.querySelector('.milestone-journey');
const milestoneTimeline = document.querySelector('.milestone-timeline');
const milestoneCards = gsap.utils.toArray('.milestone-timeline .milestone-card');

if (milestoneJourney && milestoneTimeline && milestoneCards.length > 0) {
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': function () {
      gsap.set(milestoneCards, {
        opacity: 1,
        y: 0
      });

      const getScrollDistance = () => {
        const journeyRect = milestoneJourney.getBoundingClientRect();
        const timelineRect = milestoneTimeline.getBoundingClientRect();
        const availableWidth = journeyRect.right - timelineRect.left;
        return Math.max(0, milestoneTimeline.scrollWidth - availableWidth);
      };

      const horizontalTween = gsap.to(milestoneTimeline, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: milestoneJourney,
          start: 'top top',
          end: () => `+=${getScrollDistance() + window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      return function () {
        horizontalTween.scrollTrigger.kill();
        horizontalTween.kill();
        gsap.set(milestoneTimeline, { clearProps: 'transform' });
      };
    },

    '(max-width: 900px)': function () {
      milestoneCards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            delay: index * 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  });
}
// ============================================
// CLIENT CARD MOBILE INTERACTION
// ============================================
const sectorCards = document.querySelectorAll('.client-card');
sectorCards.forEach(card => {
  card.addEventListener('click', () => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) {
      card.classList.toggle('active');
      sectorCards.forEach(otherCard => {
        if (otherCard !== card) otherCard.classList.remove('active');
      });
    }
  });
});

// ============================================
// WATER PROTECTION PAGE ANIMATIONS
// ============================================
const waterStories = document.querySelectorAll('.water-protection-story');
waterStories.forEach((story) => {
  const imgWrap = story.querySelector('.water-protection-story__image-wrap');
  const copy = story.querySelector('.water-protection-story__copy');

  if (imgWrap) {
    gsap.from(imgWrap, {
      scrollTrigger: { trigger: story, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  if (copy) {
    gsap.from(copy, {
      scrollTrigger: { trigger: story, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out'
    });
  }
});

const waterPanels = document.querySelectorAll('.water-protection-panel');
waterPanels.forEach((panel, i) => {
  gsap.from(panel, {
    scrollTrigger: { trigger: panel, start: 'top 88%' },
    y: 35,
    opacity: 0,
    duration: 0.7,
    delay: (i % 2) * 0.1,
    ease: 'power2.out'
  });
});

// ============================================
// FIRE DETECTION PAGE ANIMATIONS
// ============================================
const detectionStories = document.querySelectorAll('.detection-story');
detectionStories.forEach((story) => {
  const imgWrap = story.querySelector('.detection-story__image-wrap');
  const copy = story.querySelector('.detection-story__copy');

  if (imgWrap) {
    gsap.from(imgWrap, {
      scrollTrigger: { trigger: story, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }

  if (copy) {
    gsap.from(copy, {
      scrollTrigger: { trigger: story, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'power3.out'
    });
  }
});

// Animate .fd-reveal-left (slides in from left)
document.querySelectorAll('.fd-reveal-left').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// Animate .fd-reveal-right (slides in from right)
document.querySelectorAll('.fd-reveal-right').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    x: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// Animate .fd-reveal-up (slides up softly)
document.querySelectorAll('.fd-reveal-up').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
});
});




