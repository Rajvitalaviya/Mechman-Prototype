/* ===================================================
   MECHMANN ENGINEERING - HOMEPAGE JAVASCRIPT
   Features:
   - Smooth Hero Slider with auto-play
   - Sticky Navbar with scroll detection
   - Scroll-triggered animations (Intersection Observer)
   - Animated number counters
   - Mobile nav toggle
   - Form submit handling
=================================================== */

(function () {
    'use strict';

    /* ===== HERO SLIDER ===== */
    // Slider functionality removed since we now use a single video background

    /* ===== STICKY NAVBAR ===== */
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ===== MOBILE NAV TOGGLE ===== */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navLinks.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close nav on outside click
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // Mobile dropdown toggles
    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        });
    }

    /* ===== SCROLL-TRIGGERED ANIMATIONS ===== */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay || 0);

                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);

                scrollObserver.unobserve(el);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));



    /* ===== SMOOTH SCROLL for nav links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });

                // Close mobile nav
                if (navLinks) {
                    navLinks.classList.remove('open');
                }
            }
        });
    });

    /* ===== FORM SUBMISSION ===== */
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.75';

            // Simulated async submission
            setTimeout(() => {
                btn.textContent = '✓ Enquiry Sent!';
                btn.style.backgroundColor = '#22c55e';
                btn.style.borderColor = '#22c55e';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                    form.reset();
                }, 3500);
            }, 1200);
        });
    }

    /* ===== PARALLAX MOUSE EFFECT on Hero ===== */
    const heroSection = document.querySelector('.hero-geo');
    if (heroSection) {
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            const { clientX, clientY, currentTarget } = e;
            const { width, height } = currentTarget.getBoundingClientRect();
            const x = (clientX / width - 0.5) * 20;
            const y = (clientY / height - 0.5) * 20;

            document.querySelectorAll('.geo-line').forEach(line => {
                line.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            document.querySelectorAll('.geo-circle').forEach(circle => {
                const rot = parseFloat(getComputedStyle(circle).getPropertyValue('--r') || 0);
                circle.style.marginLeft = `${x * 0.5}px`;
                circle.style.marginTop = `${y * 0.5}px`;
            });
        });
    }

    /* ===== ACTIVE NAV LINK on Scroll ===== */
    const sections = document.querySelectorAll('section[id]');
    const navAnchor = document.querySelectorAll('.nav-links > li > a');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchor.forEach(a => {
                    a.parentElement.classList.remove('active-nav');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.parentElement.classList.add('active-nav');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => activeObserver.observe(s));

    /* ===== RESIZE HANDLER ===== */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navLinks) {
                navLinks.classList.remove('open');
            }
        }, 200);
    });

    /* ===== MARKET SEGMENTS SLIDER ===== */
    const segmentsGrid = document.querySelector('.segments-grid');
    const segPrev = document.getElementById('prevSegment');
    const segNext = document.getElementById('nextSegment');
    let currentIdx = 0;

    function getItemsPerView() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateSlider() {
        if (!segmentsGrid) return;
        const items = segmentsGrid.querySelectorAll('.segment-item');
        if (items.length === 0) return;
        
        const itemsPerView = getItemsPerView();
        const totalItems = items.length;
        const maxIdx = Math.max(0, totalItems - itemsPerView);

        if (currentIdx > maxIdx) currentIdx = maxIdx;
        
        const gap = 20;
        const itemWidth = items[0].offsetWidth;
        const moveDistance = (itemWidth + gap) * currentIdx;
        
        segmentsGrid.style.transform = `translateX(-${moveDistance}px)`;
        
        // Update button states
        if (segPrev) segPrev.style.opacity = currentIdx === 0 ? '0.3' : '1';
        if (segNext) segNext.style.opacity = currentIdx >= maxIdx ? '0.3' : '1';
    }

    if (segPrev && segNext) {
        segPrev.addEventListener('click', () => {
            if (currentIdx > 0) {
                currentIdx--;
                updateSlider();
            }
        });

        segNext.addEventListener('click', () => {
            const itemsPerView = getItemsPerView();
            const totalItems = segmentsGrid.querySelectorAll('.segment-item').length;
            if (currentIdx < totalItems - itemsPerView) {
                currentIdx++;
                updateSlider();
            }
        });

        // Initialize and handle resize
        updateSlider();
        window.addEventListener('resize', updateSlider);
    }

    // Mega Menu Interactivity (3-Column Tabbed)
    const megaMainItems = document.querySelectorAll('.mega-main-item');
    const megaSubGroups = document.querySelectorAll('.mega-sub-group');
    const megaSubItems = document.querySelectorAll('.mega-sub-item');
    const megaProductLists = document.querySelectorAll('.mega-product-list');

    megaMainItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const mainId = item.getAttribute('data-main');
            
            // Update Main Nav
            megaMainItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Sub Groups
            megaSubGroups.forEach(group => {
                group.classList.remove('active');
                if (group.getAttribute('data-main-ref') === mainId) {
                    group.classList.add('active');
                    // Activate first sub item in this group
                    const firstSub = group.querySelector('.mega-sub-item');
                    if (firstSub) {
                        // Manually trigger the hover effect for the first sub-item
                        firstSub.dispatchEvent(new Event('mouseenter'));
                    }
                }
            });
        });
    });

    megaSubItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const subId = item.getAttribute('data-sub');
            
            // Update Sub Nav
            megaSubItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Product View
            megaProductLists.forEach(list => {
                list.classList.remove('active');
                if (list.getAttribute('data-sub-ref') === subId) {
                    list.classList.add('active');
                }
            });
        });
    });

    console.log('%cMechmann Engineering - Homepage Loaded ✓', 'color:#D80C08; font-weight:bold; font-size:14px');

})();
