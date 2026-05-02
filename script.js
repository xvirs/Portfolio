/* =========================================================
   Xavier Rosales — Portfolio
   Vanilla JS · No dependencies
   ========================================================= */

(function () {
    'use strict';

    const STORAGE_LANG = 'xr-lang';
    const DEFAULT_LANG = 'es';
    const EMAIL = 'rosales.xavier.eloy@gmail.com';

    /* ------------------ i18n ------------------ */

    const root = document.documentElement;

    function applyLang(lang) {
        root.setAttribute('lang', lang);
        root.setAttribute('data-lang', lang);
        document.querySelectorAll('[data-lang]').forEach((el) => {
            const match = el.getAttribute('data-lang') === lang;
            if (match) el.removeAttribute('hidden');
            else el.setAttribute('hidden', '');
        });
    }

    function initLang() {
        const saved = localStorage.getItem(STORAGE_LANG);
        const lang = saved === 'en' || saved === 'es' ? saved : DEFAULT_LANG;
        applyLang(lang);

        const toggle = document.getElementById('lang-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = root.getAttribute('data-lang') || DEFAULT_LANG;
                const next = current === 'es' ? 'en' : 'es';
                applyLang(next);
                localStorage.setItem(STORAGE_LANG, next);
            });
        }
    }

    /* ------------------ Navbar ------------------ */

    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const burger = document.getElementById('nav-burger');
        const links = document.getElementById('nav-links');

        const onScroll = () => {
            if (window.scrollY > 16) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        if (burger && links) {
            const close = () => {
                burger.classList.remove('open');
                links.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            };
            burger.addEventListener('click', () => {
                const isOpen = burger.classList.toggle('open');
                links.classList.toggle('open', isOpen);
                burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
            links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
        }
    }

    /* ------------------ Reveal on scroll ------------------ */

    function initReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    }

    /* ------------------ Project filters ------------------ */

    function initFilters() {
        const buttons = document.querySelectorAll('.filter');
        const cards = document.querySelectorAll('.project');
        if (!buttons.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                buttons.forEach((b) => b.classList.toggle('active', b === btn));
                cards.forEach((card) => {
                    const cat = card.dataset.category;
                    const show = filter === 'all' || cat === filter;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }

    /* ------------------ Email copy ------------------ */

    function initEmail() {
        const targets = document.querySelectorAll('#email-link, #email-link-footer');
        const toast = document.getElementById('toast');
        const lang = () => root.getAttribute('data-lang') || DEFAULT_LANG;

        const showToast = (msg) => {
            if (!toast) return;
            toast.textContent = msg;
            toast.classList.add('show');
            clearTimeout(toast._t);
            toast._t = setTimeout(() => toast.classList.remove('show'), 2400);
        };

        targets.forEach((el) => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await navigator.clipboard.writeText(EMAIL);
                    showToast(lang() === 'es' ? `📋 Email copiado: ${EMAIL}` : `📋 Email copied: ${EMAIL}`);
                } catch (err) {
                    window.location.href = `mailto:${EMAIL}`;
                }
            });
        });
    }

    /* ------------------ Back to top ------------------ */

    function initBackTop() {
        const btn = document.getElementById('back-top');
        if (!btn) return;
        const onScroll = () => btn.classList.toggle('show', window.scrollY > 600);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ------------------ Hero typing rotator ------------------ */

    function initTyping() {
        const target = document.getElementById('typing');
        if (!target) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const phrases = [
            'Flutter & Dart · Fintech LATAM · AI-Augmented Development',
            'Clean Architecture · BLoC · Production-grade apps',
            'Mobile · Automation · MCP · n8n',
        ];

        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;

        const tick = () => {
            const phrase = phrases[phraseIdx];
            charIdx += deleting ? -1 : 1;
            target.textContent = phrase.slice(0, charIdx);

            let delay = deleting ? 28 : 55;
            if (!deleting && charIdx === phrase.length) {
                deleting = true;
                delay = 2200;
            } else if (deleting && charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(tick, delay);
        };

        target.textContent = '';
        setTimeout(tick, 600);
    }

    /* ------------------ Boot ------------------ */

    document.addEventListener('DOMContentLoaded', () => {
        initLang();
        initNavbar();
        initReveal();
        initFilters();
        initEmail();
        initBackTop();
        initTyping();
    });
})();
