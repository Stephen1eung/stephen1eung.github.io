document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const tabButtons = Array.from(document.querySelectorAll('.nav-links a[role="tab"]'));
    const tabPanels = Array.from(document.querySelectorAll('.tab-section'));

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    const closeMobileMenu = () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });

    const activateTab = (newTab, options = {}) => {
        if (!newTab) return;
        const { shouldScroll = true } = options;

        const targetId = newTab.getAttribute('aria-controls');

        tabButtons.forEach(tab => {
            const isActive = tab === newTab;
            tab.setAttribute('aria-selected', isActive);
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
            tab.classList.toggle('active', isActive);
        });

        tabPanels.forEach(panel => {
            const isTarget = panel.id === targetId;
            panel.classList.toggle('active', isTarget);
            panel.setAttribute('aria-hidden', !isTarget);
        });

        closeMobileMenu();

        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    tabButtons.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            activateTab(event.currentTarget);
        });

        tab.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

            event.preventDefault();
            const currentIndex = tabButtons.indexOf(event.currentTarget);
            const offset = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (currentIndex + offset + tabButtons.length) % tabButtons.length;
            const nextTab = tabButtons[nextIndex];
            nextTab.focus();
            activateTab(nextTab);
        });
    });

    // Enable tab activation from other in-page links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const linkedTab = tabButtons.find(tab => tab.getAttribute('href') === targetId);
            if (linkedTab) {
                event.preventDefault();
                activateTab(linkedTab);
                linkedTab.focus();
            }
        });
    });

    // Ensure default tab state
    activateTab(tabButtons.find(tab => tab.getAttribute('aria-selected') === 'true') || tabButtons[0], { shouldScroll: false });

    // Add shadow to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('header').classList.remove('scrolled');
        }
    });

    // Add fade-in animation to elements when they come into view
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for fade elements
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run once on load
    fadeInOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', fadeInOnScroll);
});