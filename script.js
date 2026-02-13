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

    // --- Solution Area Tabs ---
    const solutionTabs = document.querySelectorAll('.solution-tab');
    const solutionAreas = document.querySelectorAll('.solution-area');

    solutionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetArea = tab.getAttribute('data-area');

            // Remove active class from all tabs
            solutionTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Hide all areas
            solutionAreas.forEach(area => {
                area.classList.remove('active');
                area.setAttribute('hidden', '');
            });

            // Show target area
            const targetPanel = document.getElementById(`panel-${targetArea}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.removeAttribute('hidden');
            }
        });
    });

    // --- Contact Modal ---
    const modal = document.getElementById('contactModal');
    const btnContacto = document.getElementById('btn-contacto');
    const openModalBtns = document.querySelectorAll('.open-contact-modal');
    const closeBtn = document.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Open modal
    function openModal(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for opening modal
    if (btnContacto) {
        btnContacto.addEventListener('click', openModal);
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    // Event listener for closing modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-form-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            // Hide previous messages
            formSuccess.style.display = 'none';
            formError.style.display = 'none';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';

                    // Reset form after delay and close modal
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.style.display = 'block';
                        closeModal();

                        // Reset success message for next time
                        setTimeout(() => {
                            formSuccess.style.display = 'none';
                        }, 500);
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error
                formError.style.display = 'block';
                console.error('Form submission error:', error);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

})();
