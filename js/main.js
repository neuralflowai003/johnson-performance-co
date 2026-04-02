/* ============================================
   JOHNSON PERFORMANCE CO.
   Main JavaScript — Enhanced Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- NOISE TEXTURE CANVAS OVERLAY ---
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 9998; opacity: 0.035; mix-blend-mode: overlay;
    `;
    document.body.appendChild(noiseCanvas);

    function generateNoise() {
        const ctx = noiseCanvas.getContext('2d');
        noiseCanvas.width = window.innerWidth;
        noiseCanvas.height = window.innerHeight;
        const imageData = ctx.createImageData(noiseCanvas.width, noiseCanvas.height);
        const buffer32 = new Uint32Array(imageData.data.buffer);
        for (let i = 0; i < buffer32.length; i++) {
            buffer32[i] = (Math.random() < 0.5) ? 0xffffffff : 0xff000000;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    generateNoise();
    setInterval(generateNoise, 100);
    window.addEventListener('resize', generateNoise, { passive: true });

    // --- LOADER ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 800);
    });
    if (document.readyState === 'complete') {
        setTimeout(() => loader.classList.add('loaded'), 800);
    }

    // --- NAVIGATION: Scroll behavior ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    const handleNavScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- NAVIGATION: Mobile toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- ANIMATED COUNTERS ---
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

    // --- ACTIVE NAV LINK ---
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--white)';
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => sectionObserver.observe(sec));

    // --- PARALLAX: Hero + Section backgrounds ---
    const heroBg = document.querySelector('.hero__bg-placeholder');
    const parallaxEls = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;

        if (heroBg && window.innerWidth > 768 && scroll < window.innerHeight) {
            heroBg.style.transform = `scale(1.08) translateY(${scroll * 0.2}px)`;
        }

        if (window.innerWidth > 768) {
            parallaxEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
                const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }
    }, { passive: true });

    // --- MAGNETIC BUTTONS ---
    document.querySelectorAll('.btn, .nav__link--cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // --- DUMBBELL / GYM CURSOR TRAIL ---
    if (window.innerWidth > 768) {
        const trail = [];
        const TRAIL_LENGTH = 8;

        for (let i = 0; i < TRAIL_LENGTH; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed; width: ${6 - i * 0.5}px; height: ${6 - i * 0.5}px;
                border-radius: 50%; background: var(--gold, #C9A94E);
                pointer-events: none; z-index: 9997;
                opacity: ${(TRAIL_LENGTH - i) / TRAIL_LENGTH * 0.4};
                transition: opacity 0.1s;
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(dot);
            trail.push({ el: dot, x: 0, y: 0 });
        }

        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateTrail() {
            trail[0].x = mouseX;
            trail[0].y = mouseY;
            for (let i = 1; i < trail.length; i++) {
                trail[i].x += (trail[i-1].x - trail[i].x) * 0.4;
                trail[i].y += (trail[i-1].y - trail[i].y) * 0.4;
            }
            trail.forEach(t => {
                t.el.style.left = t.x + 'px';
                t.el.style.top = t.y + 'px';
            });
            requestAnimationFrame(updateTrail);
        }
        updateTrail();
    }

    // --- STAGGERED GALLERY REVEAL ---
    const galleryPhotos = document.querySelectorAll('.facility__photo');
    galleryPhotos.forEach((photo, i) => {
        photo.style.transitionDelay = `${i * 0.1}s`;
    });

    // --- HORIZONTAL SCROLL TICKER (if element exists) ---
    const ticker = document.querySelector('.ticker__inner');
    if (ticker) {
        let pos = 0;
        function animateTicker() {
            pos -= 0.5;
            if (pos <= -ticker.scrollWidth / 2) pos = 0;
            ticker.style.transform = `translateX(${pos}px)`;
            requestAnimationFrame(animateTicker);
        }
        animateTicker();
    }

    // --- CONTACT FORM HANDLING ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = '#4A8C5C';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                btn.textContent = 'Error — Try Again';
                btn.style.background = '#8C4A4A';
                btn.disabled = false;
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

});

// --- SCROLL PROGRESS BAR (inside nav bottom edge) ---
const navProgress = document.getElementById('navProgress');
if (navProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        navProgress.style.width = progress + '%';
    }, { passive: true });
}

// --- LIGHTNING EFFECT on Hero ---
(function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Canvas for lightning
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 2; opacity: 0;
    `;
    hero.style.position = 'relative';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function drawBolt(x1, y1, x2, y2, branches, ctx) {
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 120;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 60;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(mx, my);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (branches > 0 && Math.random() > 0.4) {
            const bx = mx + (Math.random() - 0.5) * 200;
            const by = my + Math.random() * 150;
            ctx.globalAlpha *= 0.6;
            drawBolt(mx, my, bx, by, branches - 1, ctx);
            ctx.globalAlpha /= 0.6;
        }
    }

    function lightning() {
        resize();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const numBolts = Math.floor(Math.random() * 2) + 1;

        for (let b = 0; b < numBolts; b++) {
            const startX = Math.random() * canvas.width;
            const endX = startX + (Math.random() - 0.5) * 300;
            const endY = Math.random() * canvas.height * 0.7 + canvas.height * 0.2;

            // Gold lightning
            ctx.strokeStyle = `rgba(201, 169, 78, ${0.6 + Math.random() * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = 'rgba(201, 169, 78, 0.8)';
            ctx.shadowBlur = 12;
            ctx.globalAlpha = 0.9;
            drawBolt(startX, 0, endX, endY, 3, ctx);

            // White core
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 4;
            ctx.globalAlpha = 0.6;
            drawBolt(startX, 0, endX, endY, 2, ctx);
        }

        // Flash sequence: bright → fade
        canvas.style.transition = 'none';
        canvas.style.opacity = '1';

        setTimeout(() => {
            canvas.style.transition = 'opacity 0.08s';
            canvas.style.opacity = '0';
        }, 60);

        setTimeout(() => {
            canvas.style.transition = 'none';
            canvas.style.opacity = '0.7';
        }, 140);

        setTimeout(() => {
            canvas.style.transition = 'opacity 0.3s';
            canvas.style.opacity = '0';
        }, 200);
    }

    // Random interval: every 3-8 seconds
    function scheduleLightning() {
        const delay = 3000 + Math.random() * 5000;
        setTimeout(() => {
            lightning();
            scheduleLightning();
        }, delay);
    }

    // First strike after 2 seconds
    setTimeout(() => {
        lightning();
        scheduleLightning();
    }, 2000);
})();

// --- PULSING GOLD GLOW on Hero Title Lines ---
(function() {
    const titleLines = document.querySelectorAll('.hero__title-line');
    titleLines.forEach((line, i) => {
        line.classList.add('hero__title-pulse');
        line.style.animationDelay = `${i * 0.3}s`;
    });
})();
