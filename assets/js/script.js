document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const scrollButton = document.getElementById('scroll-top');
    const scrollValue = document.getElementById('scroll-top-value');
    const year = document.getElementById('csyear');

    if (year) year.textContent = new Date().getFullYear();

    const closeMobileNav = () => {
        mobileNav?.classList.remove('is-open');
        mobileNav?.setAttribute('aria-hidden', 'true');
        navToggle?.setAttribute('aria-expanded', 'false');
    };

    navToggle?.addEventListener('click', () => {
        const open = !mobileNav?.classList.contains('is-open');
        mobileNav?.classList.toggle('is-open', open);
        mobileNav?.setAttribute('aria-hidden', String(!open));
        navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));
    window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 40), { passive: true });

    if (scrollButton && scrollValue) {
        const updateScroll = () => {
            const current = window.scrollY || 0;
            const maximum = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maximum > 0 ? Math.min(Math.round((current / maximum) * 100), 100) : 0;
            scrollValue.textContent = `${progress}%`;
            scrollButton.classList.toggle('active', current > 300);
            scrollButton.style.background = `conic-gradient(var(--second-color) ${progress}%, var(--white-color) ${progress}% 100%)`;
        };
        window.addEventListener('scroll', updateScroll, { passive: true });
        scrollButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        updateScroll();
    }

    const faqItems = document.querySelectorAll('.travel-faq__item');
    const faqList = document.querySelector('.travel-faq__list');
    const moreButton = document.querySelector('.travel-faq__more');

    faqItems.forEach(item => {
        const button = item.querySelector('button');
        button?.addEventListener('click', () => {
            const shouldOpen = !item.classList.contains('is-open');
            faqItems.forEach(other => {
                other.classList.remove('is-open');
                other.querySelector('button')?.setAttribute('aria-expanded', 'false');
            });
            item.classList.toggle('is-open', shouldOpen);
            button.setAttribute('aria-expanded', String(shouldOpen));
        });
    });

    moreButton?.addEventListener('click', () => {
        const expanded = faqList?.classList.toggle('show-all') ?? false;
        moreButton.setAttribute('aria-expanded', String(expanded));
    });

    // Expandable Text Blocks (Show More / Show Less)
    document.querySelectorAll('.expandable-text').forEach(wrapper => {
        const button = wrapper.querySelector('.expandable-text__btn');
        const textSpan = button?.querySelector('.btn-text');

        button?.addEventListener('click', () => {
            const isExpanded = wrapper.classList.toggle('is-expanded');
            button.setAttribute('aria-expanded', String(isExpanded));
            if (textSpan) {
                textSpan.textContent = isExpanded ? 'Show Less' : 'Show More';
            }
        });
    });

    if (typeof Swiper !== 'undefined') {
        new Swiper('.partnerSwiper', {
            slidesPerView: 2, spaceBetween: 12, watchOverflow: true, grabCursor: true,
            navigation: { nextEl: '.partners-next', prevEl: '.partners-prev' },
            pagination: { el: '.partners-pagination', clickable: true },
            breakpoints: { 576: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1200: { slidesPerView: 5 } }
        });

        new Swiper('.reviewsSwiper', {
            slidesPerView: 1, spaceBetween: 20, watchOverflow: true, grabCursor: true,
            navigation: { nextEl: '.slider-next', prevEl: '.slider-prev' },
            pagination: { el: '.slider-pagination', clickable: true },
            breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
        });
    }
});
const heroMenuToggle = document.querySelector('.hero-header__toggle');
const heroNavigation = document.querySelector('.hero-mobile-nav');
const heroMenuClose = document.querySelector('.hero-mobile-nav__close');
const heroMenuOverlay = document.querySelector('.hero-mobile-overlay');

if (heroMenuToggle && heroNavigation) {
    const setHeroMenu = (isOpen) => {
        heroNavigation.classList.toggle('is-open', isOpen);
        heroMenuOverlay?.classList.toggle('is-open', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
        heroMenuToggle.setAttribute('aria-expanded', String(isOpen));
        heroNavigation.setAttribute('aria-hidden', String(!isOpen));
    };
    heroMenuToggle.addEventListener('click', () => setHeroMenu(true));
    heroMenuClose?.addEventListener('click', () => setHeroMenu(false));
    heroMenuOverlay?.addEventListener('click', () => setHeroMenu(false));
    heroNavigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setHeroMenu(false)));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setHeroMenu(false); });
}

document.querySelectorAll('.hero-mobile-group > button').forEach((button) => {
    button.addEventListener('click', () => {
        const group = button.parentElement;
        const willOpen = !group.classList.contains('is-open');
        document.querySelectorAll('.hero-mobile-group.is-open').forEach((item) => {
            item.classList.remove('is-open');
            item.querySelector('button')?.setAttribute('aria-expanded', 'false');
        });
        group.classList.toggle('is-open', willOpen);
        button.setAttribute('aria-expanded', String(willOpen));
    });
});

const travelHero = document.querySelector('.travel-hero');
const heroRipples = document.querySelector('.travel-hero__ripples');
const heroMotionToggle = document.querySelector('.travel-hero__motion');
const heroSlides = Array.from(document.querySelectorAll('.travel-hero__image'));
let heroSlideIndex = 0;
let heroSlideTimer;

const showNextHeroSlide = () => {
    if (heroSlides.length < 2 || travelHero?.classList.contains('hero-paused')) return;
    const currentSlide = heroSlides[heroSlideIndex];
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
    const nextSlide = heroSlides[heroSlideIndex];
    currentSlide.classList.remove('is-active');
    currentSlide.classList.add('is-leaving');
    nextSlide.classList.remove('is-leaving');
    nextSlide.classList.add('is-active');
    window.setTimeout(() => currentSlide.classList.remove('is-leaving'), 1500);
};

if (heroSlides.length > 1) {
    heroSlideTimer = window.setInterval(showNextHeroSlide, 3600);
}

if (travelHero && heroMotionToggle) {
    heroMotionToggle.addEventListener('click', () => {
        const isPaused = travelHero.classList.toggle('hero-paused');
        heroMotionToggle.setAttribute('aria-pressed', String(isPaused));
        heroMotionToggle.setAttribute('aria-label', isPaused ? 'Play background motion' : 'Pause background motion');
        heroMotionToggle.innerHTML = `<i class="fas fa-${isPaused ? 'play' : 'pause'}"></i>`;
        if (isPaused) {
            window.clearInterval(heroSlideTimer);
        } else {
            heroSlideTimer = window.setInterval(showNextHeroSlide, 3600);
        }
    });
}

if (travelHero && heroRipples && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let lastRipple = 0;

    travelHero.addEventListener('pointermove', (event) => {
        const rect = travelHero.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xRatio = x / rect.width;
        const yRatio = y / rect.height;

        travelHero.style.setProperty('--water-x', `${xRatio * 100}%`);
        travelHero.style.setProperty('--water-y', `${yRatio * 100}%`);

        const now = performance.now();
        if (now - lastRipple < 90) return;
        lastRipple = now;

        const ripple = document.createElement('span');
        ripple.className = 'travel-hero__ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        heroRipples.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });

}
