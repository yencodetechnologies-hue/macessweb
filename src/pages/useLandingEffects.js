import { useCallback, useEffect, useRef, useState } from 'react';

const SLIDE_COUNT = 2;
const NAV_SECTIONS = ['home', 'solutions', 'features', 'roles', 'how', 'contact-us', 'testimonials', 'download'];

export function useLandingEffects() {
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeNav, setActiveNav] = useState('#home');

  const navInnerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navCtaRef = useRef(null);
  const heroCarouselRef = useRef(null);
  const scrollLockY = useRef(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const autoplayPaused = useRef(false);

  useEffect(() => {
    const hide = () => setLoaderHidden(true);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    return () => window.removeEventListener('load', hide);
  }, []);

  useEffect(() => {
    const navInner = navInnerRef.current;
    const navLinks = navLinksRef.current;
    const navCta = navCtaRef.current;
    if (!navInner || !navLinks || !navCta) return undefined;

    const placeNavLinks = () => {
      if (window.innerWidth <= 768) {
        if (navLinks.parentElement !== document.body) {
          document.body.appendChild(navLinks);
        }
      } else if (navLinks.parentElement !== navInner) {
        navInner.insertBefore(navLinks, navCta);
      }
    };

    placeNavLinks();
    window.addEventListener('resize', placeNavLinks);

    return () => {
      window.removeEventListener('resize', placeNavLinks);
      if (navLinks.parentElement === document.body && navInner.contains(navCta)) {
        navInner.insertBefore(navLinks, navCta);
      }
    };
  }, []);

  useEffect(() => {
    if (navOpen) {
      scrollLockY.current = window.scrollY;
      document.body.classList.add('landing-nav-open');
      document.body.style.top = `-${scrollLockY.current}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else if (document.body.style.position === 'fixed') {
      document.body.classList.remove('landing-nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollLockY.current);
    }

    return () => {
      document.body.classList.remove('landing-nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [navOpen]);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = heroCarouselRef.current;
    if (!el) return undefined;

    const pause = () => {
      autoplayPaused.current = true;
    };
    const resume = () => {
      if (!isDragging.current) autoplayPaused.current = false;
    };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    return () => {
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || SLIDE_COUNT <= 1) return undefined;

    const tick = () => {
      if (!autoplayPaused.current) {
        setActiveSlide((s) => (s + 1) % SLIDE_COUNT);
      }
    };

    const timer = setInterval(tick, 4500);
    const onVisibility = () => {
      autoplayPaused.current = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector('.landing-page');
    if (!root) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = root.querySelectorAll('.reveal');

    if (reduceMotion) {
      reveals.forEach((el) => el.classList.add('active'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.querySelector('.landing-page');
    if (!root) return undefined;

    const sections = NAV_SECTIONS.map((id) => root.querySelector(`#${id}`)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveNav(`#${entry.target.id}`);
        });
      },
      { threshold: 0.25, rootMargin: '-20% 0px -45% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      if (window.scrollY < 80) setActiveNav('#home');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && navOpen) setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const closeNav = useCallback(() => setNavOpen(false), []);
  const toggleNav = useCallback(() => setNavOpen((open) => !open), []);

  const goToSlide = useCallback((index) => {
    setActiveSlide((index + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const onCarouselPointerDown = useCallback((e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    autoplayPaused.current = true;
    heroCarouselRef.current?.classList.add('dragging');
  }, []);

  const onCarouselPointerUp = useCallback(
    (e) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      heroCarouselRef.current?.classList.remove('dragging');
      const delta = e.clientX - dragStartX.current;
      if (Math.abs(delta) > 40) {
        goToSlide(delta < 0 ? activeSlide + 1 : activeSlide - 1);
      }
      autoplayPaused.current = false;
    },
    [activeSlide, goToSlide]
  );

  const onCarouselPointerCancel = useCallback(() => {
    isDragging.current = false;
    heroCarouselRef.current?.classList.remove('dragging');
    autoplayPaused.current = false;
  }, []);

  const navLinkClass = useCallback(
    (hash) => (activeNav === hash ? 'active' : undefined),
    [activeNav]
  );

  return {
    loaderHidden,
    navOpen,
    headerScrolled,
    activeSlide,
    navInnerRef,
    navLinksRef,
    navCtaRef,
    heroCarouselRef,
    closeNav,
    toggleNav,
    goToSlide,
    navLinkClass,
    onCarouselPointerDown,
    onCarouselPointerUp,
    onCarouselPointerCancel,
  };
}
