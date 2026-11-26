/**
 * KENNETH DE VERA - PORTFOLIO INTERACTIVE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPreloader();
    initScrollSpy();
    initMobileMenu();
    initScrollReveal();
    initProjectFilters();
    initKeyboardShortcuts();
});

/* ==========================================================================
   CYBER PRELOADER LOADING ENGINE
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('cyberPreloader');
    const bar = document.getElementById('preloaderBar');
    const status = document.getElementById('preloaderStatus');
    if (!preloader || !bar || !status) return;

    requestAnimationFrame(() => {
        bar.style.transition = 'width 3.2s cubic-bezier(0.25, 1, 0.5, 1)';
        bar.style.width = '100%';
    });

    status.textContent = 'INITIALIZING SYSTEM CORE...';

    setTimeout(() => {
        status.textContent = 'LOADING DEVELOPER MODULES & STACK...';
    }, 1000);

    setTimeout(() => {
        status.textContent = 'SYNCHRONIZING STYLES & DATABASE...';
    }, 2200);

    setTimeout(() => {
        status.textContent = 'SYSTEM READY!';
        preloader.classList.add('fade-out');
    }, 3300);
}

/* ==========================================================================
   MOBILE ANIMATED HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        menu.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            btn.classList.remove('active');
            menu.classList.remove('active');
        }
    });
}

/* ==========================================================================
   SCROLLSPY NAVIGATION
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   PROJECT DETAILS MODAL & GALLERY ENGINE
   ========================================================================== */
function showProjectDetails(id) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody || typeof PROJECTS_DATA === 'undefined') return;

    const proj = PROJECTS_DATA.find(p => p.id === id);
    if (!proj) return;

    const isMobile = (proj.type === 'mobile') || (proj.category && proj.category.toLowerCase().includes('mobile'));
    const galleryCount = (proj.gallery && proj.gallery.length) ? proj.gallery.length : 0;
    const galleryIcon = isMobile ? 'fa-mobile-screen-button' : 'fa-desktop';
    const galleryLabel = isMobile ? `Mobile Screenshots (${galleryCount})` : `System Screenshots (${galleryCount})`;
    const slideClass = isMobile ? 'mobile-slide' : 'desktop-slide';
    const escapedTitle = (proj.title || '').replace(/'/g, "\\'");

    let galleryHTML = '';
    if (galleryCount > 0) {
        galleryHTML = `
            <div class="modal-gallery-wrapper">
                <div class="modal-gallery-head">
                    <h4 class="modal-gallery-title text-${proj.color_theme || 'yellow'}">
                        <i class="fa-solid ${galleryIcon}"></i> ${galleryLabel}
                    </h4>
                    <span class="modal-gallery-swipe-hint">
                        <i class="fa-solid fa-arrows-left-right"></i> Swipe left / right
                    </span>
                </div>
                <div class="swipe-gallery-container theme-${proj.color_theme || 'yellow'}" id="swipeGallery">
                    ${proj.gallery.map((img, idx) => `
                        <div class="swipe-gallery-slide ${slideClass}" onclick="openLightbox('${img}', '${escapedTitle}', ${idx + 1}, ${galleryCount})" title="Click to view full size">
                            <img src="${img}" alt="${proj.title} Screen ${idx + 1}" loading="lazy">
                            <span class="slide-badge">${idx + 1}/${galleryCount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div class="modal-inner-content">
            <div class="modal-header-section">
                <span class="badge-category ${proj.color_theme || 'yellow'}">
                    ${proj.category}
                </span>
                <h2 class="modal-project-title">
                    ${proj.title}
                </h2>
                <p class="modal-project-desc">
                    ${proj.description}
                </p>
            </div>

            ${galleryHTML}

            <div class="modal-tech-box glass-panel">
                <h4 class="modal-box-heading text-${proj.color_theme || 'yellow'}">
                    <i class="fa-solid fa-microchip"></i> TECHNICAL FEATURES &amp; ARCHITECTURE
                </h4>
                <p class="modal-box-text">
                    ${proj.details}
                </p>
            </div>

            <div class="modal-tags-section">
                <h4 class="modal-tags-heading text-blue">
                    <i class="fa-solid fa-tags"></i> TECH STACK &amp; TOOLS
                </h4>
                <div class="modal-tags-list">
                    ${proj.tags.map(t => `<span class="modal-tag-chip">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const swipeGallery = document.getElementById('swipeGallery');
    if (swipeGallery) {
        swipeGallery.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                swipeGallery.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==========================================================================
   IMAGE LIGHTBOX VIEWER
   ========================================================================== */
function openLightbox(imgSrc, title, current, total) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imgSrc;
    if (lightboxCaption) {
        lightboxCaption.textContent = `${title} • Screen ${current} of ${total}`;
    }
    lightbox.classList.add('active');
}

function closeLightbox(e) {
    if (e) e.stopPropagation();
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) lightbox.classList.remove('active');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) closeModal();
});

/* ==========================================================================
   SMART EMAIL APP LAUNCHER WITH FAILSAFE FALLBACKS
   ========================================================================== */
function handleEmailClick(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    const email = 'kennethdv22@gmail.com';
    const subject = encodeURIComponent('Portfolio Inquiry - Kenneth De Vera');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showCyberToast('Email copied to clipboard! 📋');
        }).catch(() => {});
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&to=${email}&su=${subject}&tf=cm`;

    if (isMobile) {
        window.location.href = `mailto:${email}?subject=${subject}`;
    } else {
        const win = window.open(gmailUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = `mailto:${email}?subject=${subject}`;
        }
    }
}

/* ==========================================================================
   SCROLL TO TOP FUNCTIONALITY
   ========================================================================== */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const btn = document.getElementById('backToTopBtn');
            if (btn) {
                if (window.scrollY > 300) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

/* ==========================================================================
   DYNAMIC PROJECT CATEGORY FILTER & SHORTCUTS ENGINES
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterVal = (btn.getAttribute('data-filter') || '').toLowerCase();

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            window.requestAnimationFrame(() => {
                projectCards.forEach(card => {
                    const cardId = card.getAttribute('data-id');
                    const projData = (typeof PROJECTS_DATA !== 'undefined') ? PROJECTS_DATA.find(p => p.id === cardId) : null;

                    let shouldShow = false;
                    if (!projData) {
                        shouldShow = (filterVal === 'all');
                    } else {
                        const cat = (projData.category || '').toLowerCase();
                        const title = (projData.title || '').toLowerCase();
                        const tagsStr = (projData.tags || []).join(' ').toLowerCase();
                        shouldShow = (filterVal === 'all' || cat.includes(filterVal) || title.includes(filterVal) || tagsStr.includes(filterVal));
                    }

                    if (shouldShow) {
                        card.style.display = 'flex';
                        card.classList.add('is-revealed');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    });
}

function showCyberToast(msg) {
    const toast = document.getElementById('cyberToast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'Escape') {
            const lightbox = document.getElementById('imageLightbox');
            if (lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            } else {
                closeModal();
            }
        }
    });
}

/* ==========================================================================
   SCROLL REVEAL ENTRANCE ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealTargets = [
        { selector: '.hero-container', class: 'reveal-fade-up' },
        { selector: '.section-heading-wrapper', class: 'reveal-fade-up' },
        { selector: '.who-am-i-box', class: 'reveal-fade-up' },
        { selector: '.about-card', class: 'reveal-fade-up', stagger: true },
        { selector: '.skills-category-card', class: 'reveal-fade-up', stagger: true },
        { selector: '.timeline-item', class: 'reveal-fade-up' },
        { selector: '.project-filter-bar', class: 'reveal-fade-up' },
        { selector: '.project-card', class: 'reveal-card', stagger: true },
        { selector: '.connect-cards-grid .social-card', class: 'reveal-left', stagger: true },
        { selector: '.get-in-touch-card', class: 'reveal-right' }
    ];

    const elementsToObserve = [];

    revealTargets.forEach(group => {
        const els = document.querySelectorAll(group.selector);
        els.forEach((el, idx) => {
            el.classList.add('scroll-reveal');
            if (group.class) el.classList.add(group.class);
            if (group.stagger) {
                const delay = (idx % 4) * 0.08;
                el.style.transitionDelay = `${delay}s`;
            }
            elementsToObserve.push(el);
        });
    });

    if (!('IntersectionObserver' in window)) {
        elementsToObserve.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
            } else {
                entry.target.classList.remove('is-revealed');
            }
        });
    }, {
        root: null,
        rootMargin: '-30px 0px -30px 0px',
        threshold: 0.08
    });

    elementsToObserve.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   THEME SWITCHER ENGINE (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('kdv_theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');

    applyTheme(initialTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        }, { passive: false });
    }
}

function applyTheme(theme) {
    const icon = document.getElementById('themeToggleIcon');
    const toggleBtn = document.getElementById('themeToggleBtn');

    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.add('light-mode');
        if (document.body) document.body.classList.add('light-mode');
        localStorage.setItem('kdv_theme', 'light');

        if (icon) icon.className = 'fa-solid fa-moon';
        if (toggleBtn) {
            toggleBtn.setAttribute('title', 'Switch to Dark Mode');
            toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.remove('light-mode');
        if (document.body) document.body.classList.remove('light-mode');
        localStorage.setItem('kdv_theme', 'dark');

        if (icon) icon.className = 'fa-solid fa-sun';
        if (toggleBtn) {
            toggleBtn.setAttribute('title', 'Switch to Light Mode');
            toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    }
}
window.applyTheme = applyTheme;