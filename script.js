/*
  Vanilla JS enhancements:
  - Smooth scrolling with fixed-header offset
  - Active nav item while scrolling
  - Subtle reveal animations on scroll
  - Mobile nav toggle
*/

(() => {
  document.documentElement.classList.add('js');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;

  const navToggle = document.querySelector('.nav__toggle');
  const navList = document.getElementById('nav-list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches('a')) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const navLinks = Array.from(document.querySelectorAll('.nav__link'));

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      // Let "#" behave normally, but intercept valid anchors.
      const id = href.slice(1);
      if (!id) return;

      event.preventDefault();
      scrollToSection(id);
    });
  });

  // Active section highlighting.
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  function setActiveLink(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isActive = href === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry that is most visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute('id');
          if (id) setActiveLink(id);
        }
      },
      {
        // Root margin accounts for the fixed header.
        rootMargin: `-${Math.round(headerHeight)}px 0px -55% 0px`,
        threshold: [0.15, 0.35, 0.55, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset + headerHeight + 20;
      const current = sections
        .filter((s) => s.offsetTop <= y)
        .sort((a, b) => b.offsetTop - a.offsetTop)[0];
      if (current) setActiveLink(current.id);
    });
  }

  const revealEls = Array.from(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Timeline card animations
  const timelineCards = Array.from(document.querySelectorAll('.timeline__card'));
  
  if ('IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    timelineCards.forEach((card) => timelineObserver.observe(card));
  } else {
    timelineCards.forEach((card) => card.classList.add('is-visible'));
  }
})();