document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('loaded'), 800);
    });
    if (document.readyState === 'complete') {
        setTimeout(() => loader.classList.add('loaded'), 800);
    }

    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0, glowRunning = false, glowTimer;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        clearTimeout(glowTimer);
        if (!glowRunning) { glowRunning = true; animateGlow(); }
        glowTimer = setTimeout(() => { glowRunning = false; }, 2000);
    });
    function animateGlow() {
        if (!glowRunning) return;
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }

    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    // Close menu when tapping backdrop
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    // Close menu on Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            // Bare "#" links (placeholder socials, etc.) — block them silently
            if (href === '#') {
                e.preventDefault();
                return;
            }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('nav__link--active', isActive);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: `-80px 0px 0px 0px` });
    document.querySelectorAll('.section, .hero').forEach(sec => sectionObserver.observe(sec));

    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (window.innerWidth > 768 && parallaxEls.length) {
        window.addEventListener('scroll', () => {
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const rect = el.getBoundingClientRect();
                const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }, { passive: true });
    }

    const heroBg = document.querySelector('.hero__bg-placeholder');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                heroBg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.2}px)`;
            }
        }, { passive: true });
    }

    const particleContainer = document.querySelector('.hero__particles');
    if (particleContainer && window.innerWidth > 768) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('hero__particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (6 + Math.random() * 6) + 's';
            const size = (1 + Math.random() * 2) + 'px';
            p.style.width = size;
            p.style.height = size;
            particleContainer.appendChild(p);
        }
    }

    document.querySelectorAll('.btn--gold, .nav__link--cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    document.querySelectorAll('.facility__feature, .testimonial, .experience__card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.facility__photo').forEach((photo, i) => {
        photo.style.transitionDelay = `${i * 0.1}s`;
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        let lastSubmit = 0;
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            // Rate limit: 10s between submissions
            if (Date.now() - lastSubmit < 10000) {
                btn.textContent = 'Please wait...';
                setTimeout(() => { btn.textContent = originalText; }, 2000);
                return;
            }

            // Validate email format
            const emailInput = contactForm.querySelector('#email');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.focus();
                return;
            }

            // Validate message length
            const msgInput = contactForm.querySelector('#message');
            if (msgInput && msgInput.value.trim().length < 10) {
                msgInput.focus();
                return;
            }

            lastSubmit = Date.now();
            btn.textContent = 'Sending...';
            btn.disabled = true;
            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = 'linear-gradient(135deg, #5a8a5c, #4A8C5C)';
                    contactForm.reset();
                    setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
                } else { throw new Error(); }
            } catch {
                btn.textContent = 'Error — Try Again';
                btn.style.background = 'linear-gradient(135deg, #8C4A4A, #6b3535)';
                btn.disabled = false;
                setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 3000);
            }
        });
    }

    // --- LAZY IMAGE FADE-IN ---
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
        }
    });

    // --- FACILITY FEATURE EXPAND/COLLAPSE ---
    document.querySelectorAll('.facility__feature').forEach(card => {
        const toggle = () => {
            const isExpanded = card.classList.toggle('expanded');
            card.setAttribute('aria-expanded', isExpanded);
        };
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    // --- LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    if (lightbox) {
        document.querySelectorAll('.facility__photo img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });
        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
        });
    }

    // --- BACK TO TOP BUTTON ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > window.innerHeight);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- SECTION TITLE WORD-STAGGER REVEAL ---
    // Splits each title into word spans that rise in sequence when the
    // title scrolls into view (pairs with .w / .w-inner CSS).
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.section__title').forEach(title => {
            let wordIndex = 0;
            const wrapWords = (text, target) => {
                text.split(/\s+/).filter(Boolean).forEach(word => {
                    const w = document.createElement('span');
                    w.className = 'w';
                    const inner = document.createElement('span');
                    inner.className = 'w-inner';
                    inner.textContent = word;
                    inner.style.transitionDelay = (wordIndex * 0.055) + 's';
                    wordIndex++;
                    w.appendChild(inner);
                    target.appendChild(w);
                    target.appendChild(document.createTextNode(' '));
                });
            };
            const rebuilt = document.createDocumentFragment();
            Array.from(title.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    wrapWords(node.textContent, rebuilt);
                } else if (node.nodeName === 'BR') {
                    rebuilt.appendChild(node.cloneNode());
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node.cloneNode(false);
                    Array.from(node.childNodes).forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) wrapWords(child.textContent, el);
                        else el.appendChild(child.cloneNode(true));
                    });
                    rebuilt.appendChild(el);
                }
            });
            title.textContent = '';
            title.appendChild(rebuilt);
            title.classList.add('split');
        });
    }
});
