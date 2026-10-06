import React, { useEffect, useState } from 'react';
import useSectionRouting, { SECTIONS } from './useSectionRouting';
import ContactForm from './ContactForm';
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  EyeIcon,
  FileIcon,
  GlobeIcon,
  LinkIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  ShieldIcon,
  TargetIcon,
} from './Icons';
import './BusinessWebsite.css';

const asset = (file) => `${process.env.PUBLIC_URL}/images/${file}`;

const PHONES = [
  { display: '+49 176 68554158', href: 'tel:+4917668554158' },
  { display: '+91 91489 71493', href: 'tel:+919148971493' },
];
const EMAILS = ['info@metalloscrap.com', 'purchasing@metalloscrap.com'];

const HIGHLIGHTS = [
  { icon: LinkIcon, title: 'Direct sourcing', text: 'No intermediaries between vetted suppliers and your mill.' },
  { icon: ShieldIcon, title: 'Verified quality', text: 'XRF-verified, inspected and traceable lots.' },
  { icon: FileIcon, title: 'Full documentation', text: 'Compliance paperwork and logistics support.' },
  { icon: GlobeIcon, title: 'India & Europe', text: 'A network of international and domestic partners.' },
];

// Tiles are drawn in CSS like periodic-table squares, so they stay sharp on any screen.
const PRODUCTS = [
  {
    key: 'brass',
    metal: 'Brass',
    symbol: 'Cu·Zn',
    number: 'Alloy',
    name: 'Brass Scrap',
    text: 'Sourced from certified European and domestic suppliers, our brass scrap meets stringent metallurgical standards. We offer consistent supply for foundries and mills requiring reliable, specification-compliant material for high-performance applications.',
    tags: ['Certified suppliers', 'Europe & India', 'Foundries & mills'],
  },
  {
    key: 'copper',
    metal: 'Copper',
    symbol: 'Cu',
    number: '29',
    name: 'Copper Scrap',
    text: 'Our copper scrap portfolio includes Berry, Birch/Cliff, and Cobra grades, suitable for electrical, construction, and manufacturing sectors. All lots are XRF-verified and traceable, ensuring compliance with international quality benchmarks.',
    tags: ['Berry', 'Birch / Cliff', 'Cobra', 'XRF-verified'],
  },
  {
    key: 'iron',
    metal: 'Iron',
    symbol: 'Fe',
    number: '26',
    name: 'Iron Scrap',
    text: 'We supply HMS 1 & 2 iron scrap with full documentation and logistics support. Our iron scrap is sourced from audited yards, ensuring consistent sizing and minimal impurities for efficient melting and processing.',
    tags: ['HMS 1', 'HMS 2', 'Audited yards'],
  },
  {
    key: 'aluminium',
    metal: 'Aluminium',
    symbol: 'Al',
    number: '13',
    name: 'Aluminium Scrap',
    text: 'Our aluminium scrap includes wire, shredded (E40/ISRI 201:211), and UBC. Each batch is inspected for alloy content and contamination, supporting clients in automotive, packaging, and extrusion industries.',
    tags: ['Wire', 'Shredded E40', 'UBC'],
  },
];

const PRINCIPLES = [
  'Regulatory compliance',
  'Supply chain transparency',
  'Long-term value creation',
  'Rigorous due diligence',
  'Ethical sourcing',
  'Proactive risk management',
];

// Fade content in as it scrolls into view. index.js only enables this when the
// browser supports it and the visitor has not asked for reduced motion.
function useReveal() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('motion-ok')) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useScrolled(offset) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [offset]);
  return scrolled;
}

const BusinessWebsite = () => {
  const { active, navigate } = useSectionRouting();
  const scrolled = useScrolled(12);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  // Close the mobile menu with Escape, or when the window grows to desktop width.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 861px)');
    const onResize = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    if (desktop.addEventListener) desktop.addEventListener('change', onResize);
    else desktop.addListener(onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (desktop.removeEventListener) desktop.removeEventListener('change', onResize);
      else desktop.removeListener(onResize);
    };
  }, [menuOpen]);

  const go = (id) => (event) => {
    setMenuOpen(false);
    navigate(id)(event);
  };
  const current = (id) => (active === id ? 'true' : undefined);
  const year = new Date().getFullYear();

  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`nav${scrolled || menuOpen ? ' nav--solid' : ''}${menuOpen ? ' nav--open' : ''}`}>
        <div className="container nav__inner">
          <a href="/" className="brand" onClick={go('home')} aria-label="Shreela Group home">
            <img src={asset('sg_icon.png')} alt="" width="40" height="40" />
            <span className="brand__name">Shreela Group</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={s.path} onClick={go(s.id)} aria-current={current(s.id)}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="/contact" className="btn btn--primary btn--sm nav__cta" onClick={go('contact')}>
            Send inquiry
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="nav__panel">
            <nav className="container" aria-label="Mobile">
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={s.path} onClick={go(s.id)} aria-current={current(s.id)}>
                      {s.label}
                      <ArrowRightIcon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/contact" className="btn btn--primary btn--block" onClick={go('contact')}>
                Send inquiry
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="main">
        {/* Home */}
        <section id="home" className="hero" aria-labelledby="hero-title">
          <div className="hero__bg" aria-hidden="true" />
          <div className="hero__grid" aria-hidden="true" />
          <div className="container hero__inner">
            <div className="hero__copy">
              <p className="chip">Formerly MetalloScrap</p>
              <h1 id="hero-title">
                Strategic <span className="text-metal">metal scrap</span> sourcing for industrial clients
              </h1>
              <p className="hero__lead">
                Direct supply chain solutions for rolling mills and manufacturers. Trusted by industry
                leaders for reliability and compliance.
              </p>
              <div className="hero__ctas">
                <a href="/products" className="btn btn--primary" onClick={go('products')}>
                  Explore products <ArrowRightIcon size={18} />
                </a>
                <a href="/contact" className="btn btn--ghost" onClick={go('contact')}>
                  Contact us
                </a>
              </div>
              <ul className="metal-list" aria-label="Metals we supply">
                {PRODUCTS.map((p) => (
                  <li key={p.key}>
                    <span className={`dot dot--${p.key}`} aria-hidden="true" />
                    {p.metal}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero__visual">
              <div className="plate">
                <picture>
                  <source srcSet={asset('sg_logo_plate.webp')} type="image/webp" />
                  <img
                    src={asset('sg_logo_plate.jpg')}
                    alt="Shreela Group logo with the tagline Strength from recycling"
                    width="1044"
                    height="610"
                    fetchpriority="high"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        <section className="highlights" aria-label="Why Shreela Group">
          <div className="container highlights__grid">
            {HIGHLIGHTS.map(({ icon: HighlightIcon, title, text }) => (
              <div className="highlight reveal" key={title}>
                <span className="highlight__icon"><HighlightIcon size={22} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="section" aria-labelledby="about-title">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">About us</p>
              <h2 id="about-title">Vision &amp; Mission</h2>
              <p className="section-lead">
                Shreela Group (formerly MetalloScrap) delivers compliant, specification-driven metal scrap
                sourcing for industrial clients. Our expertise spans direct procurement, quality assurance,
                and logistics for rolling mills and manufacturers.
              </p>
            </div>
            <div className="about-grid">
              <article className="card reveal">
                <span className="icon-badge"><EyeIcon /></span>
                <h3>Our Vision</h3>
                <p>
                  To set the benchmark for transparent, compliant, and efficient metal scrap procurement in
                  India and Europe. We aim to empower rolling mills and manufacturers by providing direct
                  access to vetted sources, minimizing risk and maximizing operational continuity.
                </p>
              </article>
              <article className="card reveal">
                <span className="icon-badge"><TargetIcon /></span>
                <h3>Our Mission</h3>
                <p>
                  Our mission is to deliver consistent, specification-driven metal scrap supply, leveraging a
                  robust network of international and domestic partners. We focus on quality assurance,
                  regulatory adherence, and tailored logistics, as demonstrated by our successful direct brass
                  scrap deliveries to Mayank Rolling Mill (Farrukhabad, UP) and other industrial clients.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="section section--alt" aria-labelledby="products-title">
          <div className="container">
            <div className="section-head section-head--center reveal">
              <p className="eyebrow">What we supply</p>
              <h2 id="products-title">Products &amp; Services</h2>
              <p className="section-lead">
                We specialize in the procurement and supply of high-grade brass, iron, aluminium, and copper
                scrap, serving the evolving needs of rolling mills and industrial manufacturers across India
                and Europe.
              </p>
            </div>

            <div className="products-grid">
              {PRODUCTS.map((p) => (
                <article className="product reveal" key={p.key}>
                  <div className={`tile tile--${p.key}`} aria-hidden="true">
                    <span className="tile__number">{p.number}</span>
                    <span className="tile__symbol">{p.symbol}</span>
                    <span className="tile__name">{p.metal}</span>
                  </div>
                  <div className="product__body">
                    <h3>{p.name}</h3>
                    <p>{p.text}</p>
                    <ul className="tags" aria-label={`${p.name} grades and features`}>
                      {p.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="philosophy reveal">
              <div className="philosophy__copy">
                <p className="eyebrow">How we work</p>
                <h3>Our business philosophy</h3>
                <p>
                  We operate with a commitment to regulatory compliance, supply chain transparency, and
                  long-term value creation for our partners. Our business is built on rigorous due diligence,
                  ethical sourcing, and a proactive approach to risk management.
                </p>
                <p>
                  For tailored procurement solutions or to discuss your technical requirements, contact us
                  directly or submit a detailed inquiry. Our team is ready to provide expert guidance and
                  responsive service.
                </p>
                <a href="/contact" className="btn btn--primary" onClick={go('contact')}>
                  Discuss your requirements <ArrowRightIcon size={18} />
                </a>
              </div>
              <ul className="checklist">
                {PRINCIPLES.map((item) => (
                  <li key={item}>
                    <span className="checklist__icon"><CheckIcon size={16} strokeWidth={2.25} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Get in touch</h2>
              <p className="section-lead">
                For procurement partnerships, technical consultations, or compliance documentation, please
                contact our team. We serve industrial clients across India and Europe with end-to-end
                sourcing solutions.
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-methods">
                <div className="method reveal">
                  <span className="method__icon"><PhoneIcon /></span>
                  <div>
                    <h3>Phone</h3>
                    <ul>
                      {PHONES.map((p) => (
                        <li key={p.href}><a href={p.href}>{p.display}</a></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="method reveal">
                  <span className="method__icon"><MailIcon /></span>
                  <div>
                    <h3>Email</h3>
                    <ul>
                      {EMAILS.map((email) => (
                        <li key={email}><a href={`mailto:${email}`}>{email}</a></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="method reveal">
                  <span className="method__icon"><PinIcon /></span>
                  <div>
                    <h3>Location</h3>
                    <p>Serving rolling mills across India</p>
                  </div>
                </div>
              </div>

              <div className="reveal">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a href="/" className="brand" onClick={go('home')} aria-label="Shreela Group home">
                <img src={asset('sg_icon.png')} alt="" width="40" height="40" loading="lazy" />
                <span className="brand__name">Shreela Group</span>
              </a>
              <p className="footer__tagline">Strength from recycling</p>
              <p>
                Shreela Group (formerly MetalloScrap) delivers compliant, specification-driven metal scrap
                sourcing for industrial clients.
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                {SECTIONS.map((s) => (
                  <li key={s.id}><a href={s.path} onClick={go(s.id)}>{s.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Products</h4>
              <ul>
                {PRODUCTS.map((p) => (
                  <li key={p.key}><a href="/products" onClick={go('products')}>{p.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                {PHONES.map((p) => (
                  <li key={p.href}><a href={p.href}>{p.display}</a></li>
                ))}
                {EMAILS.map((email) => (
                  <li key={email}><a href={`mailto:${email}`}>{email}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <p>&copy; {year} Shreela Group. All rights reserved.</p>
            <p>Direct Metal Procurement Solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessWebsite;
