/* ============================================
   JOHNSON PERFORMANCE CO.
   Main JavaScript — Enhanced Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- ORGANIC BLACK TEXTURE CANVAS (brushed metal / matte black fabric feel) ---
    (function() {
        const bgEl = document.querySelector('.hero__bg-placeholder');
        if (!bgEl) return;

        const tc = document.createElement('canvas');
        tc.id = 'heroTexture';
        bgEl.insertBefore(tc, bgEl.firstChild);

        function generateTexture() {
            const hero = document.querySelector('.hero');
            tc.width = (hero ? hero.offsetWidth : bgEl.offsetWidth) || window.innerWidth;
            tc.height = (hero ? hero.offsetHeight : bgEl.offsetHeight) || window.innerHeight;
            const ctx = tc.getContext('2d');
            const w = tc.width, h = tc.height;

            // Base fill
            ctx.fillStyle = '#060604';
            ctx.fillRect(0, 0, w, h);

            // Layer 1: Large brush strokes (horizontal sweeps)
            for (let i = 0; i < 80; i++) {
                const y = Math.random() * h;
                const x = Math.random() * w;
                const len = 100 + Math.random() * w * 0.6;
                const alpha = 0.015 + Math.random() * 0.04;
                const width = 2 + Math.random() * 20;
                const grad = ctx.createLinearGradient(x, y, x + len, y);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.3, `rgba(${20 + Math.random()*15}, ${15 + Math.random()*10}, ${5 + Math.random()*5}, ${alpha})`);
                grad.addColorStop(0.7, `rgba(${20 + Math.random()*15}, ${15 + Math.random()*10}, ${5 + Math.random()*5}, ${alpha})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(x - 10, y - width/2, len + 20, width);
            }

            // Layer 2: Fine vertical streaks (like fabric weave)
            for (let i = 0; i < 200; i++) {
                const x = Math.random() * w;
                const len = 30 + Math.random() * h * 0.3;
                const y = Math.random() * h;
                const alpha = 0.008 + Math.random() * 0.02;
                ctx.strokeStyle = `rgba(255, 240, 200, ${alpha})`;
                ctx.lineWidth = 0.5 + Math.random();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + (Math.random()-0.5)*8, y + len);
                ctx.stroke();
            }

            // Layer 3: Dark patches (depth variation)
            for (let i = 0; i < 12; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                const rx = 80 + Math.random() * 300;
                const ry = 60 + Math.random() * 200;
                const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx,ry));
                grad.addColorStop(0, `rgba(0, 0, 0, ${0.1 + Math.random() * 0.25})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            }

            // Layer 4: Fine grain noise
            const imgData = ctx.getImageData(0, 0, w, h);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 12;
                data[i]   = Math.max(0, Math.min(255, data[i] + noise));
                data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise * 0.8));
                data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise * 0.3));
            }
            ctx.putImageData(imgData, 0, 0);

            // Layer 5: Vignette
            const vig = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.9);
            vig.addColorStop(0, 'transparent');
            vig.addColorStop(1, 'rgba(0,0,0,0.6)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, w, h);

            // Layer 6: Subtle gold atmospheric glow center
            const goldGlow = ctx.createRadialGradient(w*0.5, h*0.4, 0, w*0.5, h*0.4, w*0.5);
            goldGlow.addColorStop(0, 'rgba(201, 169, 78, 0.04)');
            goldGlow.addColorStop(0.5, 'rgba(201, 169, 78, 0.01)');
            goldGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = goldGlow;
            ctx.fillRect(0, 0, w, h);
        }

        generateTexture();
        window.addEventListener('resize', generateTexture, { passive: true });
    })();


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

// --- LIGHTNING EFFECT on Hero (Full Page, Realistic) ---
(function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'lightningCanvas';
    canvas.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 2; opacity: 0;
    `;
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = hero.offsetWidth || window.innerWidth;
        canvas.height = hero.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Realistic branching lightning using midpoint displacement
    function boltSegment(ctx, x1, y1, x2, y2, offset, depth) {
        if (depth <= 0 || (Math.abs(x2-x1) < 3 && Math.abs(y2-y1) < 3)) {
            ctx.lineTo(x2, y2);
            return;
        }
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * offset;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * offset * 0.4;
        boltSegment(ctx, x1, y1, mx, my, offset * 0.55, depth - 1);
        boltSegment(ctx, mx, my, x2, y2, offset * 0.55, depth - 1);
    }

    function drawLightningBolt(startX, startY, endX, endY, alpha, lineWidth, color, glowColor) {
        // Glow layer
        ctx.save();
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = lineWidth * 6;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 30;
        ctx.globalAlpha = alpha * 0.21;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        boltSegment(ctx, startX, startY, endX, endY, 120, 8);
        ctx.stroke();
        ctx.restore();

        // Mid glow
        ctx.save();
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = lineWidth * 3;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = alpha * 0.35;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        boltSegment(ctx, startX, startY, endX, endY, 120, 8);
        ctx.stroke();
        ctx.restore();

        // Core white bolt
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        boltSegment(ctx, startX, startY, endX, endY, 120, 8);
        ctx.stroke();
        ctx.restore();

        // Random branches
        const numBranches = 2 + Math.floor(Math.random() * 3);
        for (let b = 0; b < numBranches; b++) {
            const branchT = 0.2 + Math.random() * 0.6;
            const bx1 = startX + (endX - startX) * branchT;
            const by1 = startY + (endY - startY) * branchT;
            const angle = (Math.random() - 0.5) * Math.PI * 0.8;
            const len = 80 + Math.random() * 200;
            const bx2 = bx1 + Math.cos(angle) * len;
            const by2 = by1 + Math.sin(angle) * len + 50;

            ctx.save();
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = lineWidth * 2;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 10;
            ctx.globalAlpha = alpha * 0.28;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(bx1, by1);
            boltSegment(ctx, bx1, by1, bx2, by2, 60, 5);
            ctx.stroke();
            ctx.restore();
        }
    }

    function strikeSequence() {
        const numStrikes = 3 + Math.floor(Math.random() * 4); // 3-6 bolts per sequence
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numStrikes; i++) {
            const startX = Math.random() * canvas.width;
            const endX = startX + (Math.random() - 0.5) * 400;
            const endY = canvas.height * (0.3 + Math.random() * 0.6);

            // Gold bolts
            drawLightningBolt(startX, 0, endX, endY, 0.9, 1.5,
                'rgba(255, 255, 220, 0.95)',
                'rgba(201, 169, 78, 1)'
            );
        }

        // Flash sequence: instant on → flicker → off
        const flashEl = canvas;
        flashEl.style.transition = 'none';
        flashEl.style.opacity = '0.49';

        // Flicker effect
        setTimeout(() => { flashEl.style.opacity = '0.21'; }, 50);
        setTimeout(() => { flashEl.style.opacity = '0.63'; }, 80);
        setTimeout(() => { flashEl.style.opacity = '0.1'; }, 120);
        setTimeout(() => { flashEl.style.opacity = '0.49'; }, 150);
        setTimeout(() => {
            flashEl.style.transition = 'opacity 0.5s ease';
            flashEl.style.opacity = '0';
        }, 200);

        // Background flash
        document.body.style.transition = 'background 0.05s';
        document.body.style.background = 'rgba(201,169,78,0.04)';
        setTimeout(() => {
            document.body.style.background = '';
        }, 100);
    }

    function scheduleLightning() {
        const delay = 1200 + Math.random() * 2500; // every 1.2-3.7 seconds
        setTimeout(() => {
            strikeSequence();
            scheduleLightning();
        }, delay);
    }

    setTimeout(() => {
        strikeSequence();
        scheduleLightning();
    }, 800);
})();

// --- PULSING GOLD GLOW on Hero Title Lines ---
(function() {
    const titleLines = document.querySelectorAll('.hero__title-line');
    titleLines.forEach((line, i) => {
        line.classList.add('hero__title-pulse');
        line.style.animationDelay = `${i * 0.3}s`;
    });
})();
