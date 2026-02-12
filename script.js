// ===================================
// LVA Índices - Main JavaScript
// ===================================

(function () {
    'use strict';

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- Navbar Scroll Shrink ---
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function highlightNavLink() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // --- IntersectionObserver for Fade-In Animations ---
    const fadeElements = document.querySelectorAll('.fade-in-up');

    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
    } else {
        // Fallback: show all elements
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // --- Animated Number Counters ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);

            element.textContent = current.toLocaleString('es-CL') + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(el => counterObserver.observe(el));
    } else {
        statNumbers.forEach(el => {
            const target = el.getAttribute('data-target');
            const suffix = el.getAttribute('data-suffix') || '';
            el.textContent = parseInt(target).toLocaleString('es-CL') + suffix;
        });
    }

    // --- Smooth Scroll Enhancement ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            // Skip data-tab links (handled separately)
            if (this.hasAttribute('data-tab')) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Client Type Tab Switching ---
    const clientTabs = document.querySelectorAll('.client-tab');
    const clientPanels = document.querySelectorAll('.client-panel');

    function switchClientTab(targetClient) {
        // Update tabs
        clientTabs.forEach(tab => {
            const isTarget = tab.dataset.client === targetClient;
            tab.classList.toggle('active', isTarget);
            tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        // Update panels
        clientPanels.forEach(panel => {
            const isTarget = panel.id === 'panel-' + targetClient;
            if (isTarget) {
                panel.hidden = false;
                panel.classList.add('active');
            } else {
                panel.hidden = true;
                panel.classList.remove('active');
            }
        });

        // Update URL hash without scroll jump
        history.replaceState(null, '', '#soluciones-' + targetClient);
    }

    clientTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchClientTab(tab.dataset.client);
        });
    });

    // Keyboard navigation for tabs (arrow keys)
    const tabList = document.querySelector('.client-tabs');
    if (tabList) {
        tabList.addEventListener('keydown', (e) => {
            const tabs = Array.from(clientTabs);
            const currentIndex = tabs.findIndex(t => t.classList.contains('active'));
            let newIndex = currentIndex;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (currentIndex + 1) % tabs.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }

            if (newIndex !== currentIndex) {
                tabs[newIndex].focus();
                switchClientTab(tabs[newIndex].dataset.client);
            }
        });
    }

    // Handle initial hash (deep linking)
    function handleInitialHash() {
        const hash = window.location.hash;
        const hashMap = {
            '#soluciones-agf': 'agf',
            '#soluciones-distribuidora': 'distribuidora',
            '#soluciones-afp': 'afp',
            '#soluciones-intl': 'intl'
        };
        if (hashMap[hash]) {
            switchClientTab(hashMap[hash]);
        }
    }

    handleInitialHash();

    // Footer links that target specific tabs
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.tab;
            switchClientTab(targetTab);
            const soluciones = document.getElementById('soluciones');
            if (soluciones) {
                const navHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: soluciones.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

})();
