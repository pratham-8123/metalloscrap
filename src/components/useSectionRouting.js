import { useCallback, useEffect, useRef, useState } from 'react';

// The site is one page with four sections, and each section has its own URL.
// public/.htaccess makes the server answer every one of these paths with
// index.html. This hook then scrolls to the matching section on load, keeps the
// address bar in step while the visitor scrolls, and handles back/forward.
export const SECTIONS = [
  { id: 'home', path: '/', label: 'Home' },
  { id: 'about', path: '/about', label: 'About' },
  { id: 'products', path: '/products', label: 'Products' },
  { id: 'contact', path: '/contact', label: 'Contact' },
];

const PATH_ALIASES = {
  '/home': 'home',
  '/vision': 'about',
  '/mission': 'about',
  '/contact-us': 'contact',
  '/contactus': 'contact',
};

// Older links used #anchors, including the first QR code (#contact-info).
const HASH_ALIASES = {
  home: 'home',
  about: 'about',
  vision: 'about',
  products: 'products',
  contact: 'contact',
  'contact-info': 'contact',
};

export const sectionById = (id) => SECTIONS.find((s) => s.id === id) || SECTIONS[0];

export function sectionFromLocation({ pathname, hash }) {
  let anchor = '';
  try {
    anchor = decodeURIComponent(hash.slice(1)).toLowerCase();
  } catch (e) {
    anchor = '';
  }
  if (HASH_ALIASES[anchor]) return HASH_ALIASES[anchor];
  const path = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const match = SECTIONS.find((s) => s.path === path);
  return match ? match.id : PATH_ALIASES[path] || 'home';
}

export const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToSection(id, smooth) {
  const behavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto';
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: 'start' });
}

export default function useSectionRouting() {
  const [active, setActive] = useState(() => sectionFromLocation(window.location));
  const syncUrl = useRef(false); // rewrite the URL only once the visitor scrolls themselves
  const navTarget = useRef(null); // section being smooth-scrolled to after a click
  const navTimer = useRef(0);

  const holdFor = useCallback((id) => {
    navTarget.current = id;
    window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => {
      navTarget.current = null;
    }, 1400);
  }, []);

  // Landing: jump straight to the section named in the URL. Old #anchor links
  // are rewritten to their clean path, e.g. /#contact-info becomes /contact.
  useEffect(() => {
    const target = sectionFromLocation(window.location);
    const canonical = sectionById(target).path;
    if (window.location.pathname !== canonical || window.location.hash) {
      window.history.replaceState(null, '', canonical + window.location.search);
    }
    if (target === 'home') return undefined;

    let cancelled = false;
    let userMoved = false;
    const jump = () => {
      if (!cancelled && !userMoved) scrollToSection(target, false);
    };
    const onUser = () => {
      userMoved = true;
    };
    const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    userEvents.forEach((evt) => window.addEventListener(evt, onUser, { passive: true }));

    jump();
    // Web fonts and images can shift the layout after first paint, so align again.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump);
    window.addEventListener('load', jump);
    const late = window.setTimeout(jump, 700);

    return () => {
      cancelled = true;
      window.clearTimeout(late);
      window.removeEventListener('load', jump);
      userEvents.forEach((evt) => window.removeEventListener(evt, onUser));
    };
  }, []);

  // Scroll spy: highlight the section in the middle of the screen and, once the
  // visitor is scrolling, show its URL in the address bar.
  useEffect(() => {
    const enable = () => {
      syncUrl.current = true;
      navTarget.current = null;
    };
    const userEvents = ['wheel', 'touchmove', 'keydown'];
    userEvents.forEach((evt) => window.addEventListener(evt, enable, { passive: true }));

    if (!('IntersectionObserver' in window)) {
      return () => userEvents.forEach((evt) => window.removeEventListener(evt, enable));
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const { id } = entry.target;
          if (navTarget.current && navTarget.current !== id) return;
          setActive(id);
          if (syncUrl.current) {
            const { path } = sectionById(id);
            if (window.location.pathname !== path) window.history.replaceState(null, '', path);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      observer.disconnect();
      userEvents.forEach((evt) => window.removeEventListener(evt, enable));
    };
  }, []);

  // Back/forward buttons, and #anchor links opened in a tab that already shows the site.
  useEffect(() => {
    const follow = () => {
      const id = sectionFromLocation(window.location);
      if (window.location.hash) window.history.replaceState(null, '', sectionById(id).path);
      holdFor(id);
      setActive(id);
      scrollToSection(id, true);
    };
    window.addEventListener('popstate', follow);
    window.addEventListener('hashchange', follow);
    const timer = navTimer;
    return () => {
      window.removeEventListener('popstate', follow);
      window.removeEventListener('hashchange', follow);
      window.clearTimeout(timer.current);
    };
  }, [holdFor]);

  // Click handler for links to a section. Modified clicks (new tab etc.) are left alone.
  const navigate = useCallback(
    (id) => (event) => {
      if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) {
        return;
      }
      if (event) event.preventDefault();
      const { path } = sectionById(id);
      if (window.location.pathname !== path || window.location.hash) {
        window.history.pushState(null, '', path);
      }
      syncUrl.current = true;
      holdFor(id);
      setActive(id);
      scrollToSection(id, true);
    },
    [holdFor]
  );

  return { active, navigate };
}
