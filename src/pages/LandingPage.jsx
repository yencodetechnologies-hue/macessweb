import { Link } from 'react-router-dom';
import ReviewMarquee from '../components/ReviewMarquee';
import { REVIEWS } from '../data/reviews';
import { useLandingEffects } from './useLandingEffects';
import './LandingPage.css';

const NAV_ITEMS = [
  { href: '#home', label: 'Home' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#contact-us', label: 'Contact' },
  { href: '#download', label: 'Download' },
];

export default function LandingPage() {
  const {
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
  } = useLandingEffects();

  const year = new Date().getFullYear();

  return (
    <div className="landing-page">
      <div className="page-bg" aria-hidden="true" />

      <div className={`loader${loaderHidden ? ' hide' : ''}`} aria-hidden="true">
        <div className="loader-mark" />
      </div>

      <header className={`site-header${headerScrolled ? ' scrolled' : ''}`}>
        <div className="nav-blur" aria-hidden="true" />
        <div className="nav-inner" ref={navInnerRef}>
          <a href="#home" className="logo-wrapper">
            <img src="/logo.png" alt="M Access logo" width={42} height={42} />
            <span>M Access</span>
          </a>
          <button
            className="mobile-nav-toggle"
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="nav-menu"
            onClick={toggleNav}
          >
            <i className={`fa-solid ${navOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
          </button>
          <ul
            className={`nav-links${navOpen ? ' active' : ''}`}
            id="nav-menu"
            ref={navLinksRef}
            aria-hidden={navOpen ? undefined : 'true'}
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={navLinkClass(item.href)}
                  onClick={closeNav}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-mobile-cta">
              <a href="#download" className="btn btn-primary" onClick={closeNav}>
                Get the app
              </a>
            </li>
          </ul>
          <a href="#download" className="btn btn-primary nav-cta" ref={navCtaRef}>
            Get the app
          </a>
        </div>
      </header>

      <div
        className={`nav-backdrop${navOpen ? ' active' : ''}`}
        hidden={!navOpen}
        onClick={closeNav}
        aria-hidden="true"
      />

      <main>
        <section id="home" className="hero">
          <div className="hero-inner">
            <div className="hero-content reveal">
              <p className="hero-brand">
                <span>Yencode Technologies</span>M Access
              </p>
              <p className="hero-tag">Resident &amp; admin access</p>
              <h1>One platform for apartments, hostels, companies &amp; colleges</h1>
              <p className="hero-lead">
                Visitor QR entry, out-pass control, maintenance payments, and secure gate operations
                — built for residential societies, hostels, workplaces, and campuses.
              </p>
              <div className="hero-buttons">
                <a href="#download" className="btn btn-accent">
                  Download app
                </a>
                <Link to="/login" className="btn btn-primary">
                  Management Login
                </Link>
                <a href="#solutions" className="btn btn-outline">
                  Explore solutions
                </a>
              </div>
            </div>
            <div className="hero-visual reveal delay-1">
              <div className="hero-visual-frame">
                <div
                  className="hero-carousel"
                  id="hero-carousel"
                  ref={heroCarouselRef}
                  aria-roledescription="carousel"
                  aria-label="Product screenshots"
                  onPointerDown={onCarouselPointerDown}
                  onPointerUp={onCarouselPointerUp}
                  onPointerCancel={onCarouselPointerCancel}
                >
                  <div
                    className="hero-carousel-track"
                    style={{ '--slide': activeSlide }}
                  >
                    <div className="hero-slide">
                      <img
                        src="/dashboard.png"
                        alt="M Access apartment dashboard"
                        className="hero-shot"
                        width={715}
                        height={480}
                        loading="eager"
                      />
                    </div>
                    <div className="hero-slide">
                      <img
                        src="/imeg.jpeg"
                        alt="M Access hostel rooms dashboard"
                        className="hero-shot"
                        width={715}
                        height={480}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="hero-carousel-dots"
                role="tablist"
                aria-label="Slide selector"
              >
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    type="button"
                    className={`hero-carousel-dot${activeSlide === i ? ' active' : ''}`}
                    role="tab"
                    aria-selected={activeSlide === i}
                    aria-label={`Show slide ${i + 1}`}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="section solutions">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Solutions</p>
              <h2>Built for every property you manage</h2>
              <p>
                Choose your property type in M Access and unlock workflows tailored for apartments,
                hostels, companies, and colleges.
              </p>
            </div>

            <div className="solution-grid">
              <article className="solution-card apartment reveal">
                <div className="solution-icon">
                  <i className="fa-solid fa-building" />
                </div>
                <h3>Apartment</h3>
                <p className="audience">For RWAs, residents &amp; society security</p>
                <ul>
                  <li>
                    <i className="fa-solid fa-check" /> Smart visitor approval with QR gate entry
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Maintenance payments &amp; amenity booking
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Family, vehicles, daily help &amp; kid exit
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Notices, complaints, events &amp; community feed
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Delivery, cab control &amp; secure dialing
                  </li>
                </ul>
                <a
                  className="solution-pdf"
                  href="/appartment.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-file-pdf" /> View apartment brochure
                </a>
              </article>

              <article className="solution-card hostel reveal delay-1">
                <div className="solution-icon">
                  <i className="fa-solid fa-bed" />
                </div>
                <h3>Hostel</h3>
                <p className="audience">For owners, wardens &amp; students</p>
                <ul>
                  <li>
                    <i className="fa-solid fa-check" /> Beds &amp; sharing (single to six sharing)
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Out-pass requests with gate-pass QR
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Warden controls &amp; vacancy tracking
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Boys, girls, co-living &amp; other hostels
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Hostel ID, help desk &amp; visitor logs
                  </li>
                </ul>
                <a
                  className="solution-pdf"
                  href="/hostel.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-file-pdf" /> View hostel brochure
                </a>
              </article>

              <article className="solution-card company reveal delay-2">
                <div className="solution-icon">
                  <i className="fa-solid fa-briefcase" />
                </div>
                <h3>Company</h3>
                <p className="audience">For offices, campuses &amp; corporate sites</p>
                <ul>
                  <li>
                    <i className="fa-solid fa-check" /> Staff &amp; guest access with QR verification
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Security operations &amp; visitor subtypes
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Notices, documents &amp; support workflows
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Secure dialing without exposing numbers
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Management overview for multi-block sites
                  </li>
                </ul>
                <a
                  className="solution-pdf"
                  href="/company.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-file-pdf" /> View company brochure
                </a>
              </article>

              <article className="solution-card college reveal delay-3">
                <div className="solution-icon">
                  <i className="fa-solid fa-graduation-cap" />
                </div>
                <h3>College</h3>
                <p className="audience">For colleges, universities &amp; campus administration</p>
                <ul>
                  <li>
                    <i className="fa-solid fa-check" /> QR code check-in with digital visitor pass
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Real-time visitor tracking &amp; live dashboard
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Student &amp; staff approval with instant alerts
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Paperless registration &amp; ID proof capture
                  </li>
                  <li>
                    <i className="fa-solid fa-check" /> Visit history, reports &amp; secure cloud storage
                  </li>
                </ul>
                <a
                  className="solution-pdf"
                  href="/college.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-file-pdf" /> View college brochure
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="features" className="section features">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Platform</p>
              <h2>Everything your gate and office need</h2>
              <p>
                Shared capabilities across apartments, hostels, companies, and colleges — so
                operations stay consistent and secure.
              </p>
            </div>

            <div className="feature-grid">
              {[
                ['fa-qrcode', 'QR visitor flow', 'Approve digitally and generate entry codes that security can scan at the gate.'],
                ['fa-phone-slash', 'Secure dialing', 'Connect guards and residents without exposing personal mobile numbers.'],
                ['fa-credit-card', 'Payments', 'Collect maintenance and facility dues with tracked payment history.'],
                ['fa-bell', 'Notices & push', 'Broadcast announcements and timely alerts to every registered user.'],
                ['fa-headset', 'Complaints & support', 'Raise issues, track status, and close the loop with management teams.'],
                ['fa-shield-halved', 'Security monitoring', 'Visitor logs, QR scans, kid exit, and guard messaging in one ops view.'],
                ['fa-folder-open', 'Documents', 'Store and share property documents with authorized management roles.'],
                ['fa-screwdriver-wrench', 'Facility ops', 'Track assets, lifts, and day-to-day society facility operations.'],
              ].map(([icon, title, text], idx) => (
                <article
                  key={title}
                  className={`feature-item reveal${idx % 4 ? ` delay-${idx % 4}` : ''}`}
                >
                  <i className={`fa-solid ${icon}`} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="section">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Who uses it</p>
              <h2>Roles built into the same app</h2>
              <p>
                Management, residents, security, and wardens each get the tools they need — without
                switching platforms.
              </p>
            </div>

            <div className="roles-grid">
              {[
                ['fa-user-tie', 'Management', 'Blocks, rooms, users, billing, ads, subscriptions, and full property oversight.'],
                ['fa-house-user', 'Resident / Tenant', 'Approvals, payments, amenities or out-pass, notices, and everyday self-service.'],
                ['fa-user-shield', 'Security', 'QR scan, visitor subtypes, kid exits, dialing, and guard–tenant messaging.'],
                ['fa-clipboard-user', 'Warden', 'Hostel leave requests, facility access, and student out-pass supervision.'],
              ].map(([icon, title, text], idx) => (
                <article key={title} className={`role-card reveal${idx ? ` delay-${idx}` : ''}`}>
                  <div className="role-icon">
                    <i className={`fa-solid ${icon}`} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="section how">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">How it works</p>
              <h2>Live in four clear steps</h2>
              <p>From property setup to daily gate control — M Access keeps the workflow simple.</p>
            </div>

            <div className="steps">
              {[
                ['Create property', 'Set type as apartment, hostel, company, or college and configure blocks, rooms, or beds.'],
                ['Invite users', 'Onboard residents, staff, wardens, and security with role-based access.'],
                ['Control the gate', 'Approve visitors or out-passes and let security verify entry with QR.'],
                ['Run operations', 'Collect dues, post notices, handle complaints, and monitor day-to-day ops.'],
              ].map(([title, text], idx) => (
                <article key={title} className={`step reveal${idx ? ` delay-${idx}` : ''}`}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact-us" className="section contact">
          <div className="container">
            <div className="contact-panel reveal">
              <div>
                <p className="eyebrow contact-eyebrow">Plans &amp; setup</p>
                <h2>Talk to us for plans that fit your property</h2>
                <p className="lead">
                  Whether you run an apartment society, hostel, company campus, or college — share
                  your requirements and we&apos;ll help you choose the right M Access plan and get set up.
                </p>
                <div className="contact-actions">
                  <a href="tel:+918925033533" className="btn btn-primary">
                    <i className="fa-solid fa-phone" /> Call us
                  </a>
                  <a
                    href="mailto:info@yencodetechnologies.com?subject=M%20Access%20plan%20enquiry"
                    className="btn btn-outline"
                  >
                    <i className="fa-solid fa-envelope" /> Email us
                  </a>
                </div>
              </div>
              <div className="contact-cards">
                <a className="contact-card" href="tel:+918925033533">
                  <i className="fa-solid fa-phone" />
                  <div>
                    <strong>Phone</strong>
                    <span>89250 33533</span>
                  </div>
                </a>
                <a
                  className="contact-card"
                  href="mailto:info@yencodetechnologies.com?subject=M%20Access%20plan%20enquiry"
                >
                  <i className="fa-solid fa-envelope" />
                  <div>
                    <strong>Email</strong>
                    <span>info@yencodetechnologies.com</span>
                  </div>
                </a>
                <div className="contact-card">
                  <i className="fa-solid fa-location-dot" />
                  <div>
                    <strong>Office</strong>
                    <span>No.1, Jeganathapuram, Velachery, Chennai – 600042</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="section reviews">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Reviews</p>
              <h2>Trusted across communities &amp; campuses</h2>
              <p>
                Property teams use M Access to run safer gates and smoother daily operations — hear
                from apartments, hostels, companies, and colleges.
              </p>
            </div>
          </div>

          <ReviewMarquee reviews={REVIEWS} speed={50} />
        </section>

        <section id="download" className="section download">
          <div className="container">
            <div className="download-panel reveal">
              <img src="/logo.png" alt="M Access" width={72} height={72} />
              <h2>Download M Access</h2>
              <p>Run apartments, hostels, companies, and colleges from one secure access platform.</p>
              <div className="store-row">
                <a
                  className="store-btn"
                  href="https://apps.apple.com/in/app/maccess-smart-access-control/id6770438435"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-apple" /> App Store
                </a>
                <a
                  className="store-btn"
                  href="https://play.google.com/store/apps/details?id=com.yencode.macess"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-google-play" /> Google Play
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <img src="/logo.png" alt="" width={40} height={40} />
                <strong>M Access</strong>
              </div>
              <p>
                Smart property and access management by Yencode Technologies — for apartments,
                hostels, companies, and colleges.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="#solutions">Solutions</a>
              <a href="#features">Features</a>
              <a href="#contact-us">Contact</a>
              <a href="#download">Download</a>
              <Link to="/login">Login</Link>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>
                  <i className="fa-solid fa-phone" /> 89250 33533
                </li>
                <li>
                  <a href="mailto:info@yencodetechnologies.com">
                    <i className="fa-solid fa-envelope" /> info@yencodetechnologies.com
                  </a>
                </li>
                <li>
                  <i className="fa-solid fa-location-dot" /> No.1, Jeganathapuram, Velachery,
                  Chennai – 600042
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {year} Yencode Technologies. All rights reserved.</span>
            <span>M Access · Smart access control</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
