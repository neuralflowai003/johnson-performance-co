document.addEventListener('DOMContentLoaded', () => {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- CINEMATIC PRELOADER: counter 00→100, then curtain split ---
    const loader = document.getElementById('loader');
    const loaderCount = document.getElementById('loaderCount');
    const finishLoader = () => loader.classList.add('loaded');
    if (loaderCount && !prefersReduced) {
        const t0 = performance.now();
        const DURATION = 1400;
        const tick = (now) => {
            const p = Math.min((now - t0) / DURATION, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            loaderCount.textContent = String(Math.round(eased * 100)).padStart(2, '0');
            if (p < 1) requestAnimationFrame(tick);
            else setTimeout(finishLoader, 250);
        };
        requestAnimationFrame(tick);
    } else {
        window.addEventListener('load', () => setTimeout(finishLoader, 600));
        if (document.readyState === 'complete') setTimeout(finishLoader, 600);
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
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 60);
        // Retreat on scroll down, return on scroll up (never while menu is open)
        const menuOpen = document.body.classList.contains('menu-open');
        nav.classList.toggle('nav--hidden', !menuOpen && y > 500 && y > lastScrollY);
        lastScrollY = y;
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

    // Hero background: scroll parallax + pointer depth in one composed loop
    const heroBg = document.querySelector('.hero__bg-placeholder');
    const heroSection = document.querySelector('.hero');
    if (heroBg && heroSection && window.innerWidth > 768 && !prefersReduced) {
        let tx = 0, ty = 0, hx = 0, hy = 0;
        heroSection.addEventListener('mousemove', (e) => {
            tx = (e.clientX / window.innerWidth - 0.5) * 14;
            ty = (e.clientY / window.innerHeight - 0.5) * 10;
        });
        const heroLoop = () => {
            hx += (tx - hx) * 0.05;
            hy += (ty - hy) * 0.05;
            if (window.scrollY < window.innerHeight) {
                heroBg.style.transform =
                    `scale(1.1) translate(${(-hx).toFixed(2)}px, ${(window.scrollY * 0.2 - hy).toFixed(2)}px)`;
            }
            requestAnimationFrame(heroLoop);
        };
        heroLoop();
    }

    // --- SCROLL-VELOCITY MARQUEE SKEW + INNER IMAGE PARALLAX ---
    const marqueeHalves = document.querySelectorAll('.marquee__half');
    const parallaxPics = (window.innerWidth > 768 && !prefersReduced)
        ? Array.from(document.querySelectorAll('.facility__photo picture, .about__image-frame picture'))
        : [];
    parallaxPics.forEach(p => {
        p.style.display = 'block';
        p.style.height = '100%';
        p.style.willChange = 'transform';
    });
    if ((marqueeHalves.length || parallaxPics.length) && !prefersReduced) {
        let lastY = window.scrollY, vel = 0;
        const motionLoop = () => {
            const y = window.scrollY;
            vel += ((y - lastY) - vel) * 0.12;
            lastY = y;
            if (marqueeHalves.length && window.innerWidth > 768) {
                const skew = Math.max(-9, Math.min(9, vel * 0.32));
                marqueeHalves.forEach(h => { h.style.transform = `skewX(${skew.toFixed(2)}deg)`; });
            }
            parallaxPics.forEach(p => {
                const r = p.getBoundingClientRect();
                if (r.bottom < 0 || r.top > window.innerHeight) return;
                const prog = ((r.top + r.height / 2) - window.innerHeight / 2) / window.innerHeight;
                p.style.transform = `scale(1.08) translateY(${(prog * -22).toFixed(2)}px)`;
            });
            requestAnimationFrame(motionLoop);
        };
        motionLoop();
    }

    // --- LIVE LOCAL TIME (footer) ---
    const localTime = document.getElementById('localTime');
    if (localTime) {
        const updateTime = () => {
            try {
                const t = new Date().toLocaleTimeString('en-US', {
                    timeZone: 'America/Chicago',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short'
                });
                localTime.textContent = 'Gallatin, Tennessee · ' + t;
            } catch { /* keep fallback text */ }
        };
        updateTime();
        setInterval(updateTime, 30000);
    }

    // Hero content drifts up and dims as you scroll away
    const heroContent = document.querySelector('.hero__content');
    if (heroContent && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroContent.style.opacity = Math.max(0, 1 - y / 620);
                heroContent.style.transform = `translateY(${y * 0.18}px)`;
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
        const lightboxCaption = document.getElementById('lightboxCaption');
        document.querySelectorAll('.facility__photo img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                const photo = img.closest('.facility__photo');
                if (lightboxCaption) {
                    lightboxCaption.textContent = (photo && photo.dataset.caption) || '';
                }
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

    // --- MERCH PRE-ORDER CART ---
    // Sizes/prices derive from each card's rendered info; orders submit
    // through the existing Formspree endpoint as an itemized pre-order.
    (function initCart() {
        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartOverlay');
        if (!drawer || !overlay) return;

        const openBtn = document.getElementById('cartOpen');
        const closeBtn = document.getElementById('cartClose');
        const countEl = document.getElementById('cartCount');
        const itemsEl = document.getElementById('cartItems');
        const emptyEl = document.getElementById('cartEmpty');
        const footEl = document.getElementById('cartFoot');
        const subtotalEl = document.getElementById('cartSubtotal');
        const cartForm = document.getElementById('cartForm');
        const successEl = document.getElementById('cartSuccess');

        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('jpcCart') || '[]'); } catch { cart = []; }

        const save = () => { try { localStorage.setItem('jpcCart', JSON.stringify(cart)); } catch { /* private mode */ } };
        const money = (n) => '$' + n.toFixed(n % 1 ? 2 : 0);

        function render() {
            const totalQty = cart.reduce((s, it) => s + it.qty, 0);
            countEl.textContent = totalQty;
            countEl.hidden = totalQty === 0;
            emptyEl.style.display = cart.length ? 'none' : '';
            footEl.hidden = cart.length === 0;
            successEl.hidden = true;
            itemsEl.innerHTML = cart.map((it, i) => `
                <div class="cart__item">
                    <div class="cart__item-info">
                        <span class="cart__item-name">${it.name}</span>
                        <span class="cart__item-meta">${it.size === 'OS' ? 'One size' : 'Size ' + it.size} · ${money(it.price)}</span>
                    </div>
                    <div class="cart__item-qty">
                        <button type="button" data-act="dec" data-i="${i}" aria-label="Decrease quantity">&minus;</button>
                        <span>${it.qty}</span>
                        <button type="button" data-act="inc" data-i="${i}" aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" class="cart__item-remove" data-act="rm" data-i="${i}" aria-label="Remove ${it.name}">&times;</button>
                </div>`).join('');
            subtotalEl.textContent = money(cart.reduce((s, it) => s + it.price * it.qty, 0));
        }

        itemsEl.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-act]');
            if (!btn) return;
            const i = parseInt(btn.dataset.i, 10);
            if (btn.dataset.act === 'inc') cart[i].qty++;
            if (btn.dataset.act === 'dec') { cart[i].qty--; if (cart[i].qty < 1) cart.splice(i, 1); }
            if (btn.dataset.act === 'rm') cart.splice(i, 1);
            save(); render();
        });

        const openCart = () => {
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        };
        const closeCart = () => {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        };
        if (openBtn) openBtn.addEventListener('click', openCart);
        if (closeBtn) closeBtn.addEventListener('click', closeCart);
        overlay.addEventListener('click', closeCart);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart();
        });

        // Inject size pickers + add buttons onto every product card
        document.querySelectorAll('.merch-card').forEach(card => {
            const name = card.querySelector('.merch-card__name').textContent.trim();
            const price = parseFloat(card.querySelector('.merch-card__price').textContent.replace(/[^0-9.]/g, ''));
            const cat = card.querySelector('.merch-card__cat').textContent;
            const sizes = /apparel/i.test(cat) ? ['S', 'M', 'L', 'XL', '2XL'] : ['OS'];

            const row = document.createElement('div');
            row.className = 'merch-card__order';
            row.innerHTML =
                '<div class="merch-card__sizes" role="group" aria-label="Size">' +
                sizes.map((s, i) =>
                    `<button type="button" class="merch-card__size${(sizes.length === 1 || i === 1) ? ' selected' : ''}" data-size="${s}">${s === 'OS' ? 'One Size' : s}</button>`
                ).join('') +
                '</div><button type="button" class="merch-card__add">Add to Order</button>';
            card.appendChild(row);

            row.querySelectorAll('.merch-card__size').forEach(btn => {
                btn.addEventListener('click', () => {
                    row.querySelectorAll('.merch-card__size').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });

            const addBtn = row.querySelector('.merch-card__add');
            addBtn.addEventListener('click', () => {
                const size = row.querySelector('.merch-card__size.selected').dataset.size;
                const existing = cart.find(it => it.name === name && it.size === size);
                if (existing) existing.qty++;
                else cart.push({ name, price, size, qty: 1 });
                save(); render();
                addBtn.textContent = 'Added ✓';
                addBtn.classList.add('added');
                setTimeout(() => {
                    addBtn.textContent = 'Add to Order';
                    addBtn.classList.remove('added');
                }, 1400);
            });
        });

        // Submit pre-order through Formspree
        if (cartForm) {
            cartForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!cart.length) return;
                const btn = cartForm.querySelector('button[type="submit"]');
                const original = btn.textContent;
                btn.textContent = 'Placing order...';
                btn.disabled = true;

                const lines = cart.map(it =>
                    `${it.qty} × ${it.name} (${it.size}) — ${money(it.price * it.qty)}`
                ).join('\n');
                const subtotal = money(cart.reduce((s, it) => s + it.price * it.qty, 0));

                const data = new FormData();
                data.append('_subject', 'NEW MERCH PRE-ORDER — Drop 001');
                data.append('type', 'Merch pre-order');
                data.append('order', lines);
                data.append('subtotal', subtotal);
                data.append('name', document.getElementById('cartName').value);
                data.append('email', document.getElementById('cartEmail').value);
                data.append('phone', document.getElementById('cartPhone').value);

                try {
                    const res = await fetch('https://formspree.io/f/xdapdqdl', {
                        method: 'POST',
                        body: data,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (!res.ok) throw new Error();
                    cart = [];
                    save(); render();
                    itemsEl.innerHTML = '';
                    emptyEl.style.display = 'none';
                    footEl.hidden = true;
                    successEl.hidden = false;
                    btn.textContent = original;
                    btn.disabled = false;
                } catch {
                    btn.textContent = 'Error — Try Again';
                    btn.disabled = false;
                    setTimeout(() => { btn.textContent = original; }, 3000);
                }
            });
        }

        render();
    })();

    // --- FAQ ACCORDION (one open at a time) ---
    const faqItems = document.querySelectorAll('.faq__item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq__question');
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(other => {
                other.classList.remove('open');
                other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- MOBILE STICKY CTA (shows once past hero, hides at lead form) ---
    const mobileCta = document.getElementById('mobileCta');
    const contactSection = document.getElementById('contact');
    if (mobileCta) {
        window.addEventListener('scroll', () => {
            const pastHero = window.scrollY > window.innerHeight * 0.7;
            let beforeForm = true;
            if (contactSection) {
                beforeForm = contactSection.getBoundingClientRect().top > window.innerHeight * 0.5;
            }
            mobileCta.classList.toggle('visible', pastHero && beforeForm);
        }, { passive: true });
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
