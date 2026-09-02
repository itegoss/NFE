/**
 * NEWFIRE Navbar Functionality
 * Handles all navbar interactions, scroll effects, and menu management
 * This file is loaded on ALL pages to ensure consistent navbar behavior
 * 
 * IMPORTANT: Call initializeNavbar() after navbar HTML has been injected into the page
 */

// Initialize navbar - call this AFTER navbar HTML is in the DOM
const initializeNavbar = () => {
  const nav = document.getElementById('nav');
  
  // Ensure navbar is available before initializing
  if (!nav) {
    console.error('Navbar element (#nav) not found in the DOM');
    return;
  }

  // =========================
  // NAVBAR SCROLL EFFECT
  // =========================
  const toggleNavSolid = () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav-solid');
    } else {
      nav.classList.remove('nav-solid');
    }
  };

  // Attach scroll listener to toggle navbar background on scroll
  window.addEventListener('scroll', toggleNavSolid);
  
  // Call once on page load to set initial state
  toggleNavSolid();

  // =========================
  // NAVIGATION MENU INTERACTIONS
  // =========================
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('burger');
  const dropdownTriggers = document.querySelectorAll('.nav__trigger');
  const solutionParents = document.querySelectorAll('.nav__parent');
  const solutionSubmenus = document.querySelectorAll('.nav__submenu');
  const solutionPanel = document.querySelector('.nav__submenu-panel');
  const menuItemsWithDropdown = document.querySelectorAll('.nav__item--has-menu');

  // Mobile burger menu toggle
  if (burger) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu when a link is clicked
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') navLinks.classList.remove('open');
    });
  }

  // Close all dropdown menus
  const closeAllMenus = (except) => {
    menuItemsWithDropdown.forEach((item) => {
      if (item === except) return;
      item.classList.remove('nav__item--open');
      if (item.classList.contains('nav__item--solutions')) setActiveSolution(null);
    });
  };

  // Handle dropdown trigger clicks
  dropdownTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      if (!isMobile && btn.tagName === 'BUTTON') {
        // On desktop, don't trap the click and prevent "sticking"
        // CSS hover will handle the dropdown visibility
        return;
      }

      if (btn.tagName === 'BUTTON' || isMobile) {
        e.preventDefault();
      }

      const parent = btn.closest('.nav__item--has-menu');
      if (!parent) return;

      const isOpen = parent.classList.contains('nav__item--open');
      closeAllMenus(parent);
      parent.classList.toggle('nav__item--open', !isOpen);

      const isSolutions = parent.classList.contains('nav__item--solutions');
      if (isSolutions) {
        if (!isOpen) {
          const first = solutionParents[0];
          if (!isMobile && first) setActiveSolution(first.dataset.target);
          if (isMobile) setActiveSolution(null);
        } else {
          setActiveSolution(null);
        }
      }
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    const isMenu = e.target.closest('.nav');
    if (!isMenu) closeAllMenus();
  });

  // Close menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
  });

  // Set active solution submenu
  const setActiveSolution = (targetId) => {
    solutionParents.forEach((p) =>
      p.classList.toggle('active', targetId && p.dataset.target === targetId)
    );
    solutionSubmenus.forEach((panel) =>
      panel.classList.toggle('nav__submenu--active', targetId && panel.id === targetId)
    );
    if (solutionPanel) {
      solutionPanel.classList.toggle('is-active', Boolean(targetId));
    }
  };

  // Handle solution parent interactions
  solutionParents.forEach((parent) => {
    // Add mouseenter for desktop
    parent.addEventListener('mouseenter', () => {
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;
      if (!isMobile) {
        setActiveSolution(parent.dataset.target);
      }
    });

    parent.addEventListener('click', (e) => {
      const page = parent.dataset.page;
      if (page) {
        window.location.href = page;
        return;
      }

      e.preventDefault();
      setActiveSolution(parent.dataset.target);
    });
  });

  // Handle Solutions dropdown on hover with graceful tolerance
  const solutionsNavItem = document.querySelector('.nav__item--solutions');
  if (solutionsNavItem) {
    let hoverTimeout = null;

    solutionsNavItem.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      const inDesktop = window.matchMedia('(min-width: 1025px)').matches;
      if (inDesktop) {
        solutionsNavItem.classList.add('nav__item--open');
        const hasActive = Array.from(solutionParents).some((p) =>
          p.classList.contains('active')
        );
        if (!hasActive && solutionParents[0]) {
          setActiveSolution(solutionParents[0].dataset.target);
        }
      }
    });

    solutionsNavItem.addEventListener('mouseleave', () => {
      const inDesktop = window.matchMedia('(min-width: 1025px)').matches;
      if (inDesktop) {
        hoverTimeout = setTimeout(() => {
          solutionsNavItem.classList.remove('nav__item--open');
        }, 180);
      }
    });
  }

  // Handle smooth scroll for internal anchor links and navigation
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
        closeAllMenus();
      });
    });
  }
};
