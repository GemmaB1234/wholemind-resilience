const { useState, useEffect } = React;

/* ---------- SIMPLE HASH ROUTER ---------- */
function useRoute() {
  const [route, setRoute] = useState(window.location.hash.replace('#/', '') || 'home');
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash.replace('#/', '') || 'home');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
function go(page) { window.location.hash = '/' + page; window.scrollTo(0, 0); }

/* ---------- SITE IMAGE ----------
   Drop real photo/logo files into the repo using the filenames below.
   Until a file exists at that path, a soft placeholder shows instead.
*/
function SiteImage({ src, alt, caption, className }) {
  const [errored, setErrored] = useState(false);
  if (errored || !src) {
    return (
      <div className={'img-placeholder ' + (className || '')}>
        <span>{caption || 'Image goes here'}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={'site-image ' + (className || '')}
      onError={() => setErrored(true)}
    />
  );
}

/* ---------- ZEFFY EMBED ----------
   Renders the Zeffy form inline, in place, when clicked — stays on the
   same page, no new tab, and no dependency on Zeffy's own script
   (which didn't reliably trigger on this site's single-page-app
   navigation — see project notes). Just needs the campaign's embed URL.
*/
function ZeffyEmbed({ zeffyUrl, label }) {
  const [open, setOpen] = useState(false);

  if (!zeffyUrl) {
    return (
      <div style={{ padding: 16, border: '1px dashed var(--line)', borderRadius: 8, fontSize: 13, color: 'var(--muted)' }}>
        Zeffy link not set yet for this item.
      </div>
    );
  }

  if (!open) {
    return (
      <button className="cta-btn" onClick={() => setOpen(true)}>{label || 'Book Now'}</button>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <iframe
        title="Zeffy booking form"
        src={zeffyUrl}
        style={{ width: '100%', minHeight: 640, border: 'none', borderRadius: 12 }}
        allow="payment"
      />
    </div>
  );
}

/* Real Zeffy campaign links, from the July content map.
   (Stripped of the ?modal=true param, since that's only used by
   Zeffy's own script method — not needed for a direct iframe embed.) */
const ZEFFY_CAMPAIGNS = {
  donate: 'https://www.zeffy.com/embed/donation-form/donate-now-119',
  'cmr-online-courses': 'https://www.zeffy.com/embed/ticketing/cmr-online-courses',
  'mindfulness-sessions-online': 'https://www.zeffy.com/embed/ticketing/online-mindfulness-practice-sessions-2',
  'mindfulness-sessions-norfolk': 'https://www.zeffy.com/embed/ticketing/norfolk-mindfulness-practice-sessions',
  'cmr-norfolk-courses': 'https://www.zeffy.com/embed/ticketing/cmr-norfolk-based-courses',
  'community-workshops-norfolk': 'https://www.zeffy.com/embed/ticketing/community-workshops-norfolk',
};

/* ---------- NAV ---------- */
const NAV_ITEMS = [
  ['home', 'Home'],
  ['about', 'About Us', [['about', 'About Us'], ['projects', 'Our Impact']]],
  ['programmes-individuals', 'What we do', [['programmes-individuals', 'Individuals & Communities'], ['programmes-professionals', 'Professionals & Teams'], ['programmes-systems', 'Systems & Providers'], ['events', 'Find a course']]],
  ['news', 'News'],
  ['involved', 'Get Involved'],
  ['participants', 'My Course'],
  ['contact', 'Contact'],
];

/* ---------- SOCIAL LINKS (small icons) ---------- */
const SOCIALS = [
  { name: 'Facebook', url: 'https://www.facebook.com/wholemindresilience/', path: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z' },
  { name: 'Instagram', url: 'https://www.instagram.com/wholemindresilience', stroke: true },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/wholemindresilience', path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z' },
];

function SocialLinks({ size = 18, labels = false }) {
  return (
    <span className="social-links">
      {SOCIALS.map(sc => (
        <a key={sc.name} href={sc.url} target="_blank" rel="noopener noreferrer" aria-label={sc.name + ' (opens in a new tab)'} title={sc.name}>
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
            fill={sc.stroke ? 'none' : 'currentColor'} stroke={sc.stroke ? 'currentColor' : 'none'} strokeWidth="1.8">
            {sc.stroke
              ? <React.Fragment><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" /></React.Fragment>
              : <path d={sc.path} />}
          </svg>
          {labels && <span>{sc.name}</span>}
        </a>
      ))}
    </span>
  );
}

/* Navigation styles live here (not only in index.html) so the top bar
   always lays out correctly, even if index.html is an older copy. */
const NAV_CSS = `
.nav-inner{ display:flex; align-items:center; justify-content:space-between; max-width:1180px; margin:0 auto; padding:6px 24px; gap:12px; }
.nav-links{ display:flex; align-items:center; gap:clamp(12px,1.7vw,24px); list-style:none; margin:0; padding:0; flex-wrap:nowrap; }
.nav-links > li{ position:relative; display:flex; align-items:center; }
.nav-links > li > button{ white-space:nowrap; line-height:1.2; padding:6px 0; }
.nav-links .nav-social{ margin-left:4px; padding-left:clamp(10px,1.4vw,18px); border-left:1px solid var(--line); }
.social-links{ display:inline-flex; align-items:center; gap:12px; }
.social-links a{ display:inline-flex; align-items:center; gap:6px; color:var(--sage-deep); opacity:.8; transition:opacity .15s, transform .15s; text-decoration:none; font-size:14px; font-weight:600; }
.social-links a:hover{ opacity:1; transform:translateY(-1px); }
.impact-article{ max-width:760px; margin:0 auto; background:var(--card,#fff); border:1px solid var(--line); border-radius:22px; padding:34px clamp(20px,4vw,44px); }
.impact-article h2{ font-size:clamp(22px,3vw,28px); color:var(--sage-deep); margin:10px 0 12px; }
.impact-article h3{ font-size:19px; color:var(--sage-deep); margin:30px 0 8px; }
.impact-article p.lead{ font-family:'Playfair Display',serif; font-size:18px; color:var(--plum); margin:0 0 6px; }
.impact-article p{ margin:0 0 12px; font-size:15px; }
.impact-article ul{ padding-left:22px; margin:0 0 12px; font-size:15px; }
.impact-article li{ margin:0 0 7px; }
.status-pill{ display:inline-block; background:var(--sage-tint); color:var(--sage-deep); font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:5px 12px; border-radius:999px; }
.findings{ display:flex; flex-direction:column; gap:18px; margin:14px 0 6px; }
.finding{ display:flex; align-items:center; gap:22px; }
.finding.flip{ flex-direction:row-reverse; }
.finding img{ width:300px; max-width:46%; height:auto; border-radius:8px; box-shadow:0 5px 16px rgba(43,42,36,.08); flex:0 0 auto; }
.finding p{ margin:0; font-size:14.5px; color:var(--ink); }
@media (max-width:640px){ .finding, .finding.flip{ flex-direction:column; align-items:flex-start; } .finding img{ max-width:100%; width:320px; } }
.report-list{ list-style:none; padding-left:0 !important; }
.report-list li{ padding:10px 14px; background:var(--sage-tint); border-radius:12px; }
.soon{ color:var(--muted); font-size:13px; }
.thanks{ margin-top:22px !important; font-family:'Playfair Display',serif; font-size:17px !important; color:var(--sage-deep); text-align:center; }
.news-logo{ width:110px !important; max-width:110px !important; height:auto !important; margin:4px 0 8px !important; opacity:.95; }
.gi-section{ margin:0 0 30px; padding:0 0 26px; border-bottom:1px solid var(--line); }
.gi-section:last-of-type{ border-bottom:none; }
.gi-section h2{ font-size:22px; color:var(--sage-deep); margin:0 0 10px; }
.gi-section p{ margin:0 0 12px; }
.gi-section ul{ margin:0 0 14px; padding-left:22px; }
.gi-section li{ margin:0 0 6px; }
@media (max-width:1060px){
  .nav-inner{ flex-direction:column; padding:6px 16px 10px; }
  .nav-links{ flex-wrap:wrap; justify-content:center; row-gap:4px; }
  .nav-links .nav-social{ border-left:none; padding-left:0; margin-left:0; }
}
`;

function NavItem({ item, route, activeKey }) {
  const [key, label, sub] = item;
  const [open, setOpen] = useState(false);
  const timer = React.useRef(null);
  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = () => { clearTimeout(timer.current); if (sub) setOpen(true); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 180); };
  const choose = (k) => { clearTimeout(timer.current); setOpen(false); if (document.activeElement) document.activeElement.blur(); go(k); };
  return (
    <li className={sub ? 'has-sub' : ''} onMouseEnter={show} onMouseLeave={hide}>
      <button className={activeKey === key ? 'active' : ''} onClick={() => choose(key)}>
        {label}{sub ? <span className="caret"> &#9662;</span> : null}
      </button>
      {sub && (
        <ul
          className="sub-menu"
          style={{
            position: 'absolute', top: 'calc(100% + 2px)', left: -12, minWidth: 200, margin: 0, padding: 6,
            listStyle: 'none', background: '#fff', border: '1px solid var(--line)', borderRadius: 14,
            boxShadow: '0 8px 22px rgba(43,42,36,.09)', zIndex: 60, display: 'block',
            opacity: open ? 1 : 0,
            visibility: open ? 'visible' : 'hidden',
            pointerEvents: open ? 'auto' : 'none',
            transform: open ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity .2s ease, transform .2s ease, visibility .2s',
          }}
        >
          {sub.map(([k, l]) => (
            <li key={k} style={{ display: 'block' }}><button className={route === k ? 'active' : ''} onClick={() => choose(k)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: route === k ? 700 : 500, whiteSpace: 'nowrap' }}>{l}</button></li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Nav({ route }) {
  let activeKey = route;
  if (route.startsWith('programmes') || route === 'events') activeKey = 'programmes-individuals';
  else if (route === 'projects') activeKey = 'about';
  else if (route.startsWith('participants')) activeKey = 'participants';
  return (
    <nav className="site-nav">
      <style>{NAV_CSS}</style>
      <div className="nav-inner">
        <button className="logo" onClick={() => go('home')}>
          <img className="woodmark" src="logo-woodmark.svg" alt="WholeMind Resilience" />
        </button>
        <ul className="nav-links">
          {NAV_ITEMS.map(item => <NavItem key={item[0]} item={item} route={route} activeKey={activeKey} />)}
          <li className="nav-social"><SocialLinks size={17} /></li>
        </ul>
      </div>
    </nav>
  );
}

/* ---------- SUBSCRIBE BANNER ----------
   Now uses Zeffy's real newsletter signup embed rather than a custom
   form. Won't actually submit until Zeffy's bank account is linked —
   same as the booking/donation embeds — but it's wired up and ready.

   Button/background colours come from Zeffy's own campaign settings
   (Zeffy dashboard > this campaign > Design/Customize), not from this
   code — edit them there once you're ready to match the brand palette.
*/
function SubscribeBanner() {
  return (
    <div className="subscribe-band thin">
      <p>Join our community for updates on courses, events and wellbeing resources</p>
      <div className="zeffy-subscribe-frame">
        <iframe
          title="Signup form powered by Zeffy"
          style={{ position: 'absolute', border: 0, top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}
          src="https://www.zeffy.com/en-GB/embed/newsletter-form/subscribe-for-updates-2"
          allowTransparency="true"
        />
      </div>
    </div>
  );
}

/* NCSUN logo is embedded directly in the code so it can never go missing from the repo. */
const NCSUN_LOGO = 'data:image/png;base64,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';

/* ---------- TESTIMONIALS ----------
   To add a testimonial, copy one line inside the list below, keeping the
   quote marks and commas. While the list is empty, nothing shows on the
   site at all. Always get the person's permission before quoting them.
   Example:
   { quote: 'This course changed how I handle a hard day.', name: 'Course participant', role: 'Norwich, 2026' },
*/
const TESTIMONIALS = [
  { quote: 'I would use the service again, for myself or my team, because it enabled me to take a step back from the emotions of the situation and change what we would do in the future', name: 'Charli', role: 'NCSUN' },
];

function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIALS.length;
  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(n => (n + 1) % count), 7000);
    return () => clearInterval(t);
  }, [count, paused]);
  if (count === 0) return null;
  const t = TESTIMONIALS[i % count];
  return (
    <div className="testimonials" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-live="polite">
      <blockquote key={i}>
        <p>&ldquo;{t.quote}&rdquo;</p>
        <footer>{t.name}{t.role ? ', ' + t.role : ''}</footer>
      </blockquote>
      {count > 1 && (
        <div className="t-dots">
          {TESTIMONIALS.map((_, n) => (
            <button key={n} className={n === i ? 'on' : ''} aria-label={'Show testimonial ' + (n + 1)} onClick={() => setI(n)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- TRUSTED BY BAND ----------
   Shown on Home, News and Our Impact. Logos plus the testimonial
   carousel (hidden until TESTIMONIALS above has something in it).
*/
function TrustedByBand() {
  return (
    <div className="trusted-band">
      <h3>Trusted and supported by</h3>
      <div className="trusted-logos">
        <SiteImage src="fuse-network-logo.png" alt="FUSE Network" caption="FUSE Network logo" />
        <SiteImage src={NCSUN_LOGO} alt="NCSUN CIC" caption="NCSUN CIC logo" />
      </div>
      <TestimonialCarousel />
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-badges">
        <SiteImage src="badge-trauma-informed.png" alt="Trauma-Informed Certified" caption="Trauma-Informed badge" />
        <SiteImage className="wide" src="badge-mindfulnessuk-cmr.png" alt="MindfulnessUK CMR Teacher, accredited for teaching" caption="MindfulnessUK CMR Teacher badge" />
        {/* BAMBA badge to be added once available */}
      </div>
      <div style={{ marginBottom: 16 }}><SocialLinks size={20} /></div>
      <div className="foot-links">

        <a href="#/policy-privacy">Privacy</a>
        <a href="#/policy-safeguarding">Safeguarding</a>
        <a href="#/policy-terms">Terms &amp; Conditions</a>
        <a href="#/policy-accessibility">Accessibility</a>
        <a href="#/policy-complaints">Complaints</a>
        <a href="#/policy-whistleblowing">Whistleblowing</a>
        <a href="#/policy-volunteer">Volunteer Policy</a>
      </div>
      <p>WholeMind Resilience CIC · Registered in England and Wales · Company number 17367582</p>
      <p className="footer-address">Registered office: Carrow House, 301 King Street, Norwich, NR1 2TG · © {new Date().getFullYear()}</p>
      <p style={{ marginTop: 6 }}>Registered with the Information Commissioner's Office (ICO): ZC209741</p>
    </footer>
  );
}

/* ---------- HOME ---------- */
function Home() {
  return (
    <div>
      <div className="hero">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="eyebrow">WholeMind Resilience CIC &ndash; A not-for-profit organisation</div>
        <h1>Helping people, teams and communities reduce stress, prevent burnout and build lasting resilience.</h1>

        <p className="hero-line sub">Evidence-based approaches that support mental wellbeing.</p>
        <p className="hero-line text-plum">We help the people, and the people who help the people.</p>
      </div>

      <div className="band band-sage">
        <div className="band-inner">
          <div className="audience-grid">
            <div className="audience-card" onClick={() => go('programmes-individuals')}>
              <h3>For Individuals &amp; Communities</h3>
              <p>Practical tools to manage stress, build resilience and improve mental wellbeing. Mindfulness courses, meditation and mindfulness sessions, coaching and community workshops.</p>
            </div>
            <div className="audience-card" onClick={() => go('programmes-professionals')}>
              <h3>For Professionals &amp; Teams</h3>
              <p>Preventative wellbeing approaches for people in high demand roles. Evidence-based mindfulness team courses, reflective practice, workshops. Grounded in lived experience, and there before an EAP is needed.</p>
            </div>
            <div className="audience-card" onClick={() => go('programmes-systems')}>
              <h3>For Systems &amp; Providers</h3>
              <p>Evidence-based prevention for the wider health and care system: support for phased return to work, space for leaders' wellbeing, and prevention that can grow across neighbourhoods.</p>
            </div>
          </div>
          <p className="safety-note" style={{ maxWidth: 700, margin: '34px auto 0', whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.55, fontSize: 13.5, textWrap: 'balance' }}>We're a non-clinical, preventative service and do not offer crisis support. For urgent help, contact your GP or call NHS 111 (option 2). In an emergency, please call 999.</p>
        </div>
      </div>

      {/* Testimonial banner will go here once quotes are ready */}
      <SubscribeBanner />
      <TrustedByBand />
    </div>
  );
}

/* ---------- ABOUT (accordion) ---------- */
const ABOUT_SECTIONS = [
  {
    title: 'Our Mission',
    body: `WholeMind Resilience exists to equip people in communities, and the people who support them, with practical, evidence-based tools to build resilience before pressure becomes crisis, easing pressure on the wider health and care system in the process.

We believe prevention is vital — because when people are supported early, both they and the systems around them are stronger for it.`
  },
  {
    title: 'About WholeMind Resilience',
    body: `WholeMind Resilience is a Community Interest Company (CIC), which means our profits are committed to community benefit. We reinvest them to make our courses and workshops more accessible, supporting people facing barriers such as inequality, deprivation or isolation, and the volunteers who give their own time to our communities.

Our founder and board bring together lived experience, professional training and extensive system knowledge, so we can help individuals, teams and the wider health and care system.`
  },
  {
    title: 'Our Approach',
    body: `How support is delivered matters just as much as what's delivered.

Trauma-informed, always. We understand how sustained pressure affects people, whether you're holding everything together at home or at work. Every session is a safe space to slow down and take part at your own pace.

Evidence-based, not trend-led. Our work is grounded in current research, not in what's fashionable in the wellbeing world. Our mindfulness teaching follows a BAMBA-recognised teacher training pathway, and every mindfulness course is measured so we know the difference it makes.

Co-designed with the people we serve. We asked the public what would help first, listened to what the workforce data told us, and built our services around the answers.

Shaped by lived experience. We've worked in these services ourselves, and that shapes everything we offer. Our practical tools fit into real, busy lives and can be adapted for long-term health conditions, neurodivergence and other access needs.

We work at a non-clinical, preventative level, with safeguards in place so people can take part safely.

For organisations: we know the pressure your teams are under, because we've been part of it. Our work is mapped to the standards you're working to:
• NICE guidance
• the NHS Staff Standards (2026)
• the HSE Management Standards
• the 10 Year Health Plan's shift from sickness to prevention

We understand the journey ICS partners are on toward Neighbourhood Health. We'd welcome the chance to help Integrated Neighbourhood Teams and Neighbourhood Health Centres deliver prevention for their staff and the people they serve, as part of how you support your people, not an add-on.`
  },
  {
    title: 'About the Founder',
    header: 'Annamarie Gammage — Founder & Executive Director',
    body: `I founded WholeMind Resilience because I kept seeing what stress and pressure were doing to the people around me: friends, family, neighbours, community groups, and colleagues in demanding public-facing roles. I also lost people very close to me who should still be here.

I spent more than ten years in education leadership, working with children with social, emotional and behavioural challenges, and six years in the NHS, including the ambulance service during the pandemic and the Integrated Care System. I've seen how pressure builds in people, teams and whole communities. And I've lived it: trauma recovery, vicarious trauma, and burning out while working in the system myself.

I decided to do something which genuinely worked to support people's wellbeing, and prevent harm.

Outside work, I'm a hobby artist, a motorbike rider, and usually found nose-deep in a book, cooking to classical music or dancing to a beat. I'm human, imperfect, gentle, fierce and kind, and I believe we all deserve the chance to stay well.`,
    photo: { src: 'founder.jpg', caption: 'Photo of Annamarie', portrait: true }
  },
  {
    title: 'Meet the Directors',
    header: 'Tim Winters — Non-Executive Director',
    body: `Tim has joined WholeMind Resilience from the very beginning, supporting the formation phase and helping to shape an organisation grounded in integrity from day one.

Driven by the belief that there is no health without mental health, Tim saw the social impact ambitions at the heart of WholeMind Resilience clearly aligning with his own values. That alignment prompted him to offer his time and expertise to the team.

Tim brings a strong public-service ethos and deep expertise in public health and analytics. His professional journey spans an Oceanography PhD, insurance financial modelling, and leading health and care analytical teams — a combination that gives him a unique perspective on how to address complex community challenges.

Working across the ICB, councils and the wider ICS, Tim has mapped pandemic projections, evaluated complex population data to understand health needs, inequality, and resourcing, and contributed to improving health outcomes for the population of Norfolk.

He brings this expertise in evidence evaluation and resource allocation to WholeMind Resilience, ensuring impactful, targeted support reaches the communities and organisations that need it most.

Personally committed to wellbeing, Tim stays active and connected through running, cycling and occasional dad dancing.

WholeMind Resilience is deeply grateful for the experience and clarity Tim brings to the team, and for the way his perspective and integrity will help shape our work, and our impact.`,
    photo: { src: 'director-tim.jpg', caption: 'Photo of Tim — to follow. Save as director-tim.jpg' },
  },
];

function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {ABOUT_SECTIONS.map((s, i) => (
        <div className="acc-item" key={s.title}>
          <button className="acc-head" onClick={() => setOpen(open === i ? -1 : i)}>
            {s.title} <span className="plus">{open === i ? '–' : '+'}</span>
          </button>
          {open === i && (
            <div className="acc-body">
              {s.header && <p className="text-plum" style={{ fontWeight: 700, marginBottom: 10 }}>{s.header}</p>}
              {s.photo && <SiteImage className={s.photo.portrait ? 'portrait-image' : 'about-image'} src={s.photo.src} alt={s.header || s.title} caption={s.photo.caption} />}
              {s.body}
              {s.note && <p style={{ marginTop: 14, fontStyle: 'italic', color: 'var(--muted)', fontSize: 13.5 }}>{s.note}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">About Us</div>
        <h1>A compassionate space for people, and a strong preventative partner for organisations.</h1>
        <p className="text-plum" style={{ fontWeight: 600 }}>We help the people, and the people who help the people.</p>
      </div>
      <Accordion />
      <div className="impact-link">
        <p>Want to see what we've delivered and where support goes?</p>
        <button className="cta-btn outline" onClick={() => go('projects')}>Our Impact</button>
      </div>
    </div>
  );
}

/* ---------- PROGRAMMES ----------
   V.3 changes: one "See dates and book" button at the bottom of the
   Individuals page (no per-course buttons); every "talk to us" button
   is now "Start a conversation" and goes to the Contact page rather
   than a calendar booking; the survey stat graphics sit between items.
*/
const PROGRAMMES = {
  individuals: {
    heading: 'For Individuals & Communities',
    icon: 'icon-public-mindful-sessions.svg',
    intro: `Running on empty, or watching your team run on empty? You're not alone, and you don't have to wait until it all gets too much. Whether you're carrying stress yourself or carrying it for the people you lead, our programmes offer practical, evidence-based support that fits real life, before pressure becomes crisis.`,
    introLast: 'Choose the path that fits below:',
    items: [
      { title: 'Mindfulness Tuition', icon: 'icon-cmr.svg', text: 'The Compassionate Mindful Resilience (CMR) Programme is an 8-hour, trauma-informed mindfulness and compassion course developed by MindfulnessUK. Four 2-hour workshops over 4 weeks, teaching you how to use accessible mindfulness in everyday life.\n\nAvailable online & in Norfolk venues.' },
      { title: 'Mindfulness & Meditation Sessions', icon: 'icon-public-mindful-sessions.svg', text: 'Join gentle, purposeful mindfulness sessions designed to help you pause, regulate and reconnect. Regular opportunities to practice, and take time for your wellbeing. No experience necessary. Available online and in Norfolk-based venues.' },
      { title: 'Mindfulness Coaching', icon: 'icon-coaching-dialogue.svg', text: '1:1 mindfulness coaching offers a quiet, personal space to explore how mindfulness can support you in the context of your own life.' },
      { title: 'Community Wellbeing Workshops', icon: 'icon-public-workshops.svg', text: 'A gentle, accessible, trauma-informed space to learn, explore and practise tools and activities that support positive mental wellbeing, and community connection.' },
    ],
    bottomButton: { label: 'Find a course', to: 'events' },
    outro: `Not sure which is right for you? Contact us to talk it through.`,
    outroCta: 'Start a conversation',
  },
  professionals: {
    heading: 'For Professionals & Teams',
    icon: 'icon-teams-reflective-practice.svg',
    intro: `Designed specifically for people in high-demand roles, these trauma-informed preventative trainings and services are delivered by facilitators who bring lived experience, and public service knowledge.`,
    bulletsIntro: 'Effective solutions for professionals and teams across:',
    bullets: ['Health', 'Social care', 'Care homes and community care', 'Councils', 'Blue light services', 'Education', 'VCSE sector'],
    alignNote: 'Aligns with NICE guidance NG212, NG13 & QS147 & the 2026 NHS Staff Standards Framework',
    items: [
      { title: 'CMR for Teams', icon: 'icon-cmr.svg', text: 'An 8-hour, research-backed, trauma-informed mindfulness and compassion training for staff experiencing pressure, emotional load and compassion fatigue. Developed by MindfulnessUK, the Compassionate and Mindful Resilience (CMR) programme teaches accessible, short, realistic practices which can be used in high-demand roles to reduce stress, vicarious trauma and burnout.\n\nDelivered to teams of up to 15: online or in person as 4 × 2-hour or 2 × 4-hour workshops, over 4–6 weeks.' },
      { title: 'Compassion Based Reflective Practice', icon: 'icon-teams-reflective-practice.svg', text: `A trauma-informed, facilitated space for teams to prioritise wellbeing — pausing to reflect, with compassion for themselves and others, on the human impact of their work. Designed to work with small or large groups as a single CPD session or an ongoing space to build resilience and strengthen wellbeing over time.\n\nAvailable for groups:\n• Online — nationally\n• In person — Norfolk only` },
      { title: 'Workshops: Stress, Burnout & Vicarious Trauma', icon: 'icon-workshops-windingpath.svg', text: `A gentle, practical space for staff to learn about stress, burnout and vicarious trauma in a way that feels human and relatable. Engaging workshops shaped around your team's specific needs, built to fit naturally into CPD days, and grounded in real lived experience.\n\nAvailable for small or large groups.` },
    ],
    outroHeading: 'Ready to shift towards prevention for your team?',
    outro: `Not sure yet what that looks like? That's a good place to start. Tell us what's happening for your team and we'll talk it through together, with no pressure. If we're the right fit, we'll shape support around your team's time and your budget, online or in person.\n\nHow it works: a short conversation about what your team needs → a proposal built around your capacity and budget → flexible delivery, online or in person.`,
    outroCta: 'Start a conversation',
  },
  systems: {
    heading: 'For Systems & Providers',
    icon: 'icon-system-scalable-prevention.svg',
    intro: `Prevention at scale, for your workforce and the people you serve.\n\nWe support providers and larger systems in two ways: staff wellbeing programmes for your workforce, and flexible, bespoke prevention programmes for patients and communities, shaped around what your organisation or neighbourhood needs.`,
    alignNote: 'Mapped to NICE guidance NG212, NG13 and QS147, the NHS Staff Standards (2026) and the HSE Management Standards.',
    items: [
      { title: 'CMR for Phased Return', icon: 'icon-cmr.svg', text: 'An 8-hour, research-backed, trauma-informed mindfulness and compassion programme for staff on, or recently returned from, a phased return — designed to reduce the risk of burnout during one of the highest-risk periods for staff wellbeing. Developed by MindfulnessUK, the Compassionate & Mindful Resilience (CMR) programme teaches accessible, short, realistic practices that help staff rebuild confidence and regulate pressure as they re-enter demanding roles.\n\nAligned with NICE guidance for staff wellbeing and the new NHS staff standards, which require organisations to take a preventative, evidence-based approach to staff health and wellbeing.\n\nDelivered online as 4 × 2-hour workshops, over 4–6 weeks. Each cohort can accommodate up to 15 participants — a scalable way for large organisations to support staff consistently across teams, departments or sites.' },
      { title: 'Safe Leader Space', icon: 'icon-safe-leader-space.svg', text: `Leaders often carry as much strain as the teams they support, with far less room to show it. When people look to you for confidence and direction, being open about the pressure can feel impossible.\n\nSafe Leader Space is a protected, trauma-informed space for leaders to put their own wellbeing first. Facilitated, themed sessions give you time to pause, reflect and be honest about the weight you carry, away from your own team. Along the way, you'll build compassion for yourself and learn to hold compassionate spaces for others.\n\nOnline, in blocks of at least five sessions.` },
      { title: 'Scalable Neighbourhood Prevention', icon: 'icon-system-scalable-prevention.svg', text: `A flexible, non-clinical prevention offer, shaped around what your organisation and the people you serve need. This isn't a fixed package.\n\nIt can sit wherever prevention is needed: group courses for people on waiting lists, courses for specific long-term conditions, ongoing support in Neighbourhood Health Centres, or programmes commissioned by GP practices or social care for their patients and clients.\n\nWholeMind Resilience coordinates a network of accredited practitioners, so delivery can grow with your community's capacity, from a single course to an ongoing programme of practice groups.\n\nEvery version stays practical, trauma-informed and grounded in real life. It isn't therapy or a mental health service. It's preventative support for people who don't yet need specialist care.\n\nLet's talk through what this could look like for you.` },
    ],
    outroHeading: 'Ready to talk about prevention for your organisation or population?',
    outro: '',
    outroCta: 'Start a conversation',
    socialValueBanner: `WholeMind Resilience is a Community Interest Company (CIC), so our profits are committed to community benefit. We reinvest them to widen access for people facing inequality, deprivation or isolation, and to support the volunteers who strengthen our communities. Social value remains part of how NHS and public sector organisations choose who they work with, and commissioning WholeMind Resilience is a values-aligned choice that can support your organisation's own social value commitments.`,
  }
};

function ProgrammePage({ audience }) {
  const data = PROGRAMMES[audience];
  const tabs = [
    ['individuals', 'Individuals & Communities'],
    ['professionals', 'Professionals & Teams'],
    ['systems', 'Systems & Providers'],
  ];

  return (
    <div className="page">
      <div className="page-header">
        {data.icon && <img className="hub-icon" src={data.icon} alt="" />}
        <div className="eyebrow">What we do</div>
        <h1>{data.heading}</h1>
        <p style={{ whiteSpace: 'pre-line' }}>{data.intro}</p>
        {data.bulletsIntro && (
          <div style={{ textAlign: 'left', maxWidth: 420, margin: '14px auto 0', fontSize: 15 }}>
            <p style={{ marginBottom: 6 }}>{data.bulletsIntro}</p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {data.bullets.map(b => <li key={b}>{b}</li>)}
            </ul>
          </div>
        )}
        {data.alignNote && <p style={{ fontSize: 13.5, color: 'var(--muted)', fontStyle: 'italic', marginTop: 10 }}>{data.alignNote}</p>}
        {data.introLast && <p className="text-plum" style={{ marginTop: 12 }}>{data.introLast}</p>}
      </div>
      <div className="toggle-row">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={'toggle-btn' + (key === audience ? ' active' : '')}
            onClick={() => go('programmes-' + key)}
          >{label}</button>
        ))}
      </div>
      {data.items.map(item => (
        <React.Fragment key={item.title}>
          <div className="prog-block">
            {item.icon && <img className="item-icon" src={item.icon} alt="" />}
            <h2>{item.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{item.text}</p>
            {item.cta && <button className="cta-btn" onClick={() => go(item.ctaTo || 'contact')}>{item.cta}</button>}
          </div>
          {item.stat && <img className="stat-graphic" src={item.stat} alt={item.statAlt} />}
        </React.Fragment>
      ))}
      {data.bottomButton && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button className="cta-btn" onClick={() => go(data.bottomButton.to)}>{data.bottomButton.label}</button>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: 40, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
        {data.outroHeading && <h3 style={{ fontSize: 18, color: 'var(--sage-deep)', marginBottom: 10 }}>{data.outroHeading}</h3>}
        {data.outro && <p style={{ color: 'var(--muted)', fontSize: 14.5, whiteSpace: 'pre-line', marginBottom: 16 }}>{data.outro}</p>}
        <button className="cta-btn outline" onClick={() => go('contact')}>{data.outroCta}</button>
      </div>
      {data.socialValueBanner && (
        <div style={{ maxWidth: 700, margin: '40px auto 0', background: 'var(--sage-tint)', borderRadius: 16, padding: '22px 26px', fontSize: 14, color: 'var(--ink)' }}>
          {data.socialValueBanner}
        </div>
      )}
    </div>
  );
}

/* ---------- EVENTS / COURSES ----------
   V.3: split into two columns so it's obvious where to go — Online on
   the left, Norfolk on the right. One card per Zeffy campaign. The
   10-week classes have no Zeffy link yet, so they're left out until
   one exists (add a card + link below when ready).
*/
const EVENT_COLUMNS = [
  {
    heading: 'Online Courses',
    cards: [
      { title: 'Mindfulness Courses Online', text: 'Find a course to suit you', zeffyKey: 'cmr-online-courses' },
      { title: 'Mindfulness & Meditation Sessions Online', text: 'A regular space for you to put yourself first', zeffyKey: 'mindfulness-sessions-online' },
    ],
  },
  {
    heading: 'Norfolk Courses',
    cards: [
      { title: 'Mindfulness Courses in Norfolk', text: 'Find a course near you', zeffyKey: 'cmr-norfolk-courses' },
      { title: 'Mindfulness & Meditation Sessions in Norfolk', text: 'A place to practice within the community', zeffyKey: 'mindfulness-sessions-norfolk' },
      { title: 'Norfolk Community Workshops', text: 'See if we have wellbeing workshops coming up near you', zeffyKey: 'community-workshops-norfolk' },
    ],
  },
];

function Events() {
  return (
    <div className="page wide">
      <div className="page-header">
        <div className="eyebrow">Find a course</div>
        <h1>Find and book your place on our upcoming public events</h1>
        <p>New courses, sessions and workshops are added regularly. If you can't find what you're looking for, or you'd like to book 1-2-1 support, <a href="#/contact" className="text-plum">get in touch</a> and we'll let you know when new dates are added.</p>
        <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>We take bookings and payments through Zeffy, which helps keep costs low for non-profits like us. At checkout, Zeffy will suggest an optional contribution to support their platform. This cost is not mandatory and you may reduce it to £0 if you wish.</p>
      </div>
      <div className="events-columns">
        {EVENT_COLUMNS.map(col => (
          <div className="events-col" key={col.heading}>
            <h2>{col.heading}</h2>
            {col.cards.map(c => (
              <div className="session-card events-card" key={c.title}>
                <h4>{c.title}</h4>
                <div className="session-note">{c.text}</div>
                <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS[c.zeffyKey]} label="See dates and book" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- SIMPLE PAGES ---------- */
function SimplePage({ eyebrow, title, icon, children }) {
  return (
    <div className="page">
      <div className="page-header">
        {icon && <img className="hub-icon" src={icon} alt="" />}
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      <div style={{ maxWidth: 680, margin: '0 auto', fontSize: 15 }}>{children}</div>
    </div>
  );
}

/* ---------- NEWS ----------
   Collapsible sections + image galleries per post — built as a simple
   expandable list, ready for content. Empty for now.
*/
const NEWS_POSTS = [
  {
    title: 'WholeMind Resilience launches on 19 November',
    date: 'November 2026',
    body: (
      <div className="news-body">
        <p>After months of listening, planning and preparing, WholeMind Resilience opens its doors on Thursday 19 November.</p>

        <h4>Why we&rsquo;re here</h4>
        <p>Stress and burnout have quietly become part of everyday life, for people trying to hold everything together and for the professionals working hard to support them. We believe much of this can be prevented, if people have the right support early enough. That&rsquo;s what we&rsquo;re here to offer.</p>

        <h4>Built on what you told us</h4>
        <p>Before we designed a single course, we asked. 88 people answered our public survey, and 122 public service professionals told us about wellbeing in their teams. We also researched what&rsquo;s happening across public sector workforce wellbeing. Everything we offer, and how we offer it, has been shaped by what we heard.</p>
        <p>To everyone who took the time to answer: thank you. This launch belongs to you as much as to us.</p>

        <h4>Come and meet us</h4>
        <p>We&rsquo;re launching at the Social Enterprise Showcase Day at Carrow House, Norwich, on 19 November. The event is run by FUSE Network, a Community Interest Company that supports the not-for-profit sector in our area. As members, we&rsquo;ve had their support to set up and run well from the very start.</p>
        <p>Come and find our stand, say hello, and pick up a welcome card with 25% off any of our services, right through to June 2027!</p>
        <p><a className="cta-btn" href="https://www.eventbrite.co.uk/e/social-enterprise-day-showcase-2026-public-event-tickets-1985935085300" target="_blank" rel="noopener noreferrer">Get your tickets</a></p>
        <img src="fuse-network-logo.png" alt="FUSE Network" style={{ display: 'block', width: 120, height: 'auto', maxWidth: '100%', objectFit: 'contain', borderRadius: 0, margin: '6px 0 10px', mixBlendMode: 'multiply' }} />

        <h4>Our big launch offer</h4>
        <p>Our first two online mindfulness courses being delivered in Winter &amp; Spring are 60% off, limited to 24 places in total. Use code <b>BAMBA</b> at checkout to take advantage of our offer.</p>
        <p><button className="cta-btn" onClick={() => go('events')}>See courses and book</button></p>
        <p>Can&rsquo;t join us on 19th November? <a href="#/home" className="text-plum">Join our mailing list</a> or <a href="#/contact" className="text-plum">get in touch</a> and we&rsquo;ll send you a 25% welcome card.</p>

        <h4>Help us build a community</h4>
        <p>We&rsquo;re just getting started on <a href="https://www.facebook.com/wholemindresilience/" target="_blank" rel="noopener noreferrer" className="text-plum">Facebook</a>, <a href="https://www.instagram.com/wholemindresilience" target="_blank" rel="noopener noreferrer" className="text-plum">Instagram</a> and <a href="https://www.linkedin.com/company/wholemindresilience" target="_blank" rel="noopener noreferrer" className="text-plum">LinkedIn</a>, and we&rsquo;d love you to be part of it. Follow us at /wholemindresilience, say hello, and share us with anyone you think we could help.</p>
      </div>
    ),
  },
];

function News() {
  const [open, setOpen] = useState(0);
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">News</div>
        <h1>Insights, announcements &amp; updates from WholeMind Resilience</h1>
      </div>
      {NEWS_POSTS.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No posts yet — check back soon.</p>
      ) : (
        <div className="accordion">
          {NEWS_POSTS.map((post, i) => (
            <div className="acc-item" key={post.title}>
              <button className="acc-head" onClick={() => setOpen(open === i ? -1 : i)}>
                {post.title} <span className="plus">{open === i ? '–' : '+'}</span>
              </button>
              {open === i && <div className="acc-body">{post.date && <p className="news-date">{post.date}</p>}{post.body}</div>}
            </div>
          ))}
        </div>
      )}
      <div style={{ margin: '60px -24px -100px' }}><TrustedByBand /></div>
    </div>
  );
}

/* ---------- OUR IMPACT (sub-page of About Us; route stays #/projects) ----------
   Collapsible project boxes, same accordion style as About. Each box
   can hold text, images/video and report links — extend the
   PROJECTS array below as real projects are added.

   Need Analysis reports: large PDFs/reports are better hosted outside
   the code repo (e.g. Supabase Storage, or a Google Drive folder with
   shareable links) and linked from here, rather than pasted as page
   text — keeps the site fast and the repo small.
*/
const PROJECTS = [
  // Extra projects later: { title: 'Project name', summary: '...', links: [{label:'Read the report', url:'...'}] }
];

/* The three research reports. The PDFs sit in the repo next to app.js,
   so `url` is just the file name. Swap in a full web address if they
   are ever moved elsewhere. A blank url shows "link coming soon". */
const REPORTS = [
  { title: 'Evidence of Community Need', url: 'evidence-of-community-need.pdf' },
  { title: 'Evidence of Professional Need', url: 'evidence-of-professional-need.pdf' },
  { title: 'Standards & Regulatory Alignment Report', url: 'standards-regulatory-alignment-report.pdf', note: 'how we checked that our services meet the standards health and public sector organisations work to.' },
];

const FINDINGS = [
  { img: 'stat-99-public.png', alt: '99% said they, or someone close to them, had experienced high stress, burnout or mental difficulty in the past year (public survey, 88 respondents)', text: '99% of people we asked said they, or someone close to them, had experienced high stress, burnout or mental difficulty in the past year.' },
  { img: 'stat-95-professionals.png', alt: '95% of public service professionals said they or their team had shown signs of prolonged stress, exhaustion, vicarious trauma or burnout in the past year (professional survey, 122 respondents)', text: '95% of public service professionals said they, or someone in their team, had shown signs of prolonged stress, exhaustion, vicarious trauma or burnout.' },
  { img: 'stat-88-would-use.png', alt: '88% said they would use one or more of the services we proposed (public survey, 88 respondents)', text: '88% said they would use one or more of the services we proposed.' },
  { img: 'stat-96-long-term-conditions.png', alt: '96% of people living with a long-term condition said they would use courses designed around their condition (public survey, 88 respondents)', text: '96% of people living with a long-term condition said they would use courses designed around their condition.' },
];

function ImpactResearch() {
  return (
    <article className="impact-article">
      <span className="status-pill">Status: Complete</span>
      <h2>Listening first: the research behind WholeMind Resilience</h2>
      <p className="lead">Before we designed a single course, we asked one question: what would actually help?</p>

      <h3>What we did</h3>
      <p>We chose to co-design our services with the people they&rsquo;re for. We ran an open public survey across Norfolk, which people chose to take part in, and 88 people answered. We then asked the people who support our communities, and 122 public service professionals told us what&rsquo;s happening to wellbeing in their teams. We set their answers against national research on public sector workforce wellbeing.</p>
      <p>Because people chose to take part, the results reflect those who wanted their voice heard rather than everyone in Norfolk. That&rsquo;s exactly what co-design needs: people who care enough to shape what comes next.</p>
      <p>We were genuinely moved by the response. More than 200 people gave their time, and many shared personal experiences, so that others might get support sooner than they did.</p>

      <h3>What we found</h3>
      <div className="findings">
        {FINDINGS.map((f, n) => (
          <div className={'finding' + (n % 2 ? ' flip' : '')} key={f.img}>
            <img src={f.img} alt={f.alt} />
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      <h3>Meeting need, and meeting standards</h3>
      <p>Need was only half the picture. We made an early decision to offer only evidence-based approaches, grounded in current research rather than wellbeing trends. We then mapped every service against the standards health and public sector employers work to: NICE guidance, the NHS Staff Standards and the HSE Management Standards. That way, what we offer answers what people asked for and meets what services are expected to provide.</p>

      <h3>Outcomes</h3>
      <ul>
        <li>Three published reports, setting out community need, professional need and how our services align with national standards.</li>
        <li>A range of services co-designed with the public and shaped by workforce evidence.</li>
        <li>Evidence-based practice built in as a standard, not an option.</li>
        <li>Every mindfulness course measured using the Warwick-Edinburgh Mental Wellbeing Scale, so we can show the difference it makes.</li>
        <li>WholeMind Resilience launched on 19 November 2026, ready to deliver.</li>
      </ul>

      <h3>Read the reports</h3>
      <ul className="report-list">
        {REPORTS.map(r => (
          <li key={r.title}>
            {r.url
              ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-plum">{r.title}</a>
              : <span><b>{r.title}</b> <em className="soon">(link coming soon)</em></span>}
            {r.note ? <span>: {r.note}</span> : null}
          </li>
        ))}
      </ul>

      <p className="thanks">Thank you to everyone who took part. This work is yours as much as ours.</p>
    </article>
  );
}

function Projects() {
  return (
    <div className="page">
      <div className="projects-header">
        <button className="back-link" onClick={() => go('about')}>&larr; Back to About Us</button>
        <div className="eyebrow-plum">ABOUT US &middot; OUR IMPACT</div>
        <h1 className="text-green" style={{ fontFamily: "'Playfair Display', serif" }}>What we've delivered and where your support goes</h1>
        <p>Learn about the projects we're involved in, or have completed. Every project on this page started with a real need, and ended with an honest reflection of our impact.</p>
        <p>This page will grow, one project at a time, as our work does.</p>
      </div>

      <ImpactResearch />

      {PROJECTS.map(p => (
        <div className="project-card" key={p.title}>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          {p.links && p.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-plum">{l.label}</a>)}
        </div>
      ))}
      <div style={{ margin: '60px -24px -100px' }}><TrustedByBand /></div>
    </div>
  );
}

function GetInvolved() {
  return (
    <SimplePage eyebrow="Get Involved" title="Get involved">
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 16, maxWidth: 620, margin: '0 auto 34px' }}>Whether you want to support people in your community, or you&rsquo;ve been through your own difficult times and want to help others, there are lots of ways to be part of WholeMind Resilience.</p>

      <div className="gi-section">
        <h2>Volunteering</h2>
        <p>As we grow, volunteers will help us reach more people, more often. You might give an hour, help with a single task, or support us at events. Every skill counts, from community activities, to helping us with tasks, to fundraising, and the time you give means more of our income goes back into our programmes.</p>
      </div>

      <div className="gi-section">
        <h2>Donations</h2>
        <p>Your donations fund local community work.</p>
        <ul>
          <li><b>£15</b> funds a place on a mindfulness session for someone who couldn&rsquo;t otherwise afford it.</li>
          <li><b>£200</b> funds a full course for one person.</li>
          <li><b>£500</b> funds a workshop for up to 30 people in a community or volunteer group.</li>
        </ul>
        <p>Every amount helps. Give once, or set up a regular donation to help us plan ahead.</p>
        <div style={{ textAlign: 'center', margin: '22px 0 4px' }}>
          <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS.donate} label="Donate now" />
        </div>
      </div>

      <div className="gi-section">
        <h2>Corporate sponsorship</h2>
        <p>Corporate partners can help us reach more people across the region. Sponsorship doesn&rsquo;t have to mean money: it can be a room to run classes closer to communities, equipment, training places for staff and volunteers, or refreshments for events.</p>
        <p>All sponsors receive:</p>
        <ul>
          <li>your logo on our website</li>
          <li>a thank-you in our news posts</li>
          <li>recognition on our social media</li>
          <li>for support worth over £1,500, an impact report showing how your contribution strengthened wellbeing in local communities</li>
        </ul>
      </div>

      <div className="gi-section">
        <h2>Fundraising</h2>
        <p>Do you like to raise funds for organisations like ours? Every pound you raise helps us bring wellbeing support to people facing disadvantage. It could be a personal challenge, a whip-round at an event, a company pledge or a fundraiser we help you put together. We&rsquo;ll thank our fundraisers publicly and share the difference they&rsquo;ve made.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <button className="cta-btn outline" onClick={() => go('contact')}>Talk to us about getting involved</button>
      </div>
    </SimplePage>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <SimplePage eyebrow="Contact" title="Get in touch">
      {sent ? (
        <p>Thanks — your message has been sent. We'll be in touch soon.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Name" required style={{ padding: 12, borderRadius: 8, border: '1px solid var(--line)' }} />
          <input placeholder="Email" type="email" required style={{ padding: 12, borderRadius: 8, border: '1px solid var(--line)' }} />
          <textarea placeholder="Message" required rows={5} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--line)', fontFamily: 'inherit' }} />
          <button className="cta-btn" type="submit">Send Message</button>
        </form>
      )}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 10 }}>Or find us on social media</p>
        <SocialLinks size={22} labels />
      </div>
    </SimplePage>
  );
}

function PolicyPage({ name }) {
  return (
    <SimplePage eyebrow="Policy" title={name}>
      <p>Content to follow.</p>
    </SimplePage>
  );
}

/* ---------- COURSE PARTICIPANTS ----------
   Split into two separate password-protected areas per the content
   map: CMR Course Participants and WholeMind Course Participants.
   Each checks its password via its own serverless endpoint field —
   see api/check-password.js (now accepts a "which" value).
*/
function PasswordGate({ which, onSuccess, label }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [notSetUp, setNotSetUp] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit() {
    setChecking(true);
    setError(false);
    setNotSetUp(false);
    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value, which }),
      });
      if (res.status === 500) { setNotSetUp(true); setChecking(false); return; }
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    }
    setChecking(false);
  }

  return (
    <div className="gate">
      <h2>{label}</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Enter the password you were given to access this content.</p>
      <input
        type="password"
        value={value}
        onChange={e => { setValue(e.target.value); setError(false); }}
        placeholder="Password"
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
      />
      {notSetUp && <p className="error">This area isn't switched on yet — please email info@wholemindresilience.co.uk and we'll sort it.</p>}
      {error && <p className="error">That password isn't right — please check and try again.</p>}
      <button className="cta-btn" onClick={handleSubmit} disabled={checking}>
        {checking ? 'Checking…' : 'Unlock'}
      </button>
    </div>
  );
}

function CourseContentWelcome({ heading, icon }) {
  return (
    <SimplePage eyebrow="My Course" title={heading} icon={icon}>
      <p>This is your space to use during your course and to come back to whenever you need it. Recordings, practices and materials are all in one place, for as long as you need them.</p>
      <p><b>How to use this page</b><br />While you're on your course, use only the sections you've been taught. Your teacher will let you know which ones you're working on each week. Once your course has finished, you can keep using these materials. There's no right or wrong way to practise, so choose the practices that work best for you in the moment.</p>
      <p>To get the full benefit, we recommend practising at least three times a week, and ideally five.</p>
      <p>Be gentle with yourself. If a practice brings up something difficult, it's fine to stop, take a break or adapt it, and you can talk it through with your teacher. If you need urgent help, contact your GP or call NHS 111 (option 2). In an emergency, call 999.</p>
      <p>If you have any technical problems with this page, email <a href="mailto:info@wholemindresilience.co.uk" className="text-plum">info@wholemindresilience.co.uk</a> for support.</p>
      <div style={{ marginTop: 30, padding: 20, border: '1px dashed var(--line)', borderRadius: 12, color: 'var(--muted)', fontSize: 14 }}>
        Course content (audio, video and text sections) goes here.
      </div>
    </SimplePage>
  );
}

function CMRCourseParticipants() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) {
    return <PasswordGate which="cmr" onSuccess={() => setUnlocked(true)} label="CMR Course Participants" />;
  }
  return <CourseContentWelcome heading="Welcome to the CMR course online portal" icon="icon-cmr.svg" />;
}

function WholeMindCourseParticipants() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) {
    return <PasswordGate which="wholemind" onSuccess={() => setUnlocked(true)} label="WholeMind Course Participants" />;
  }
  return <CourseContentWelcome heading="Welcome to your WholeMind Mindfulness Course" icon="logo-mark-only.svg" />;
}

function CourseParticipantsHub() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">My Course</div>
        <h1>My Course</h1>
        <p>Choose your course below.</p>
      </div>
      <div className="cp-hub">
        <div className="cp-hub-card" onClick={() => go('participants-cmr')}>
          <h3>CMR Course Participants</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Password protected</p>
        </div>
        <div className="cp-hub-card" onClick={() => go('participants-wholemind')}>
          <h3>WholeMind Course Participants</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Password protected</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- ROOT APP ---------- */
function App() {
  const route = useRoute();

  let page;
  if (route === 'home') page = <Home />;
  else if (route === 'about') page = <About />;
  else if (route === 'programmes-individuals') page = <ProgrammePage audience="individuals" />;
  else if (route === 'programmes-professionals') page = <ProgrammePage audience="professionals" />;
  else if (route === 'programmes-systems') page = <ProgrammePage audience="systems" />;
  else if (route === 'events') page = <Events />;
  else if (route === 'news') page = <News />;
  else if (route === 'projects') page = <Projects />;
  else if (route === 'involved') page = <GetInvolved />;
  else if (route === 'contact') page = <Contact />;
  else if (route === 'participants') page = <CourseParticipantsHub />;
  else if (route === 'participants-cmr') page = <CMRCourseParticipants />;
  else if (route === 'participants-wholemind') page = <WholeMindCourseParticipants />;
  else if (route === 'policy-privacy') page = <PolicyPage name="Privacy" />;
  else if (route === 'policy-safeguarding') page = <PolicyPage name="Safeguarding" />;
  else if (route === 'policy-terms') page = <PolicyPage name="Terms & Conditions" />;
  else if (route === 'policy-accessibility') page = <PolicyPage name="Accessibility Statement" />;
  else if (route === 'policy-complaints') page = <PolicyPage name="Complaints" />;
  else if (route === 'policy-whistleblowing') page = <PolicyPage name="Whistleblowing" />;
  else if (route === 'policy-volunteer') page = <PolicyPage name="Volunteer Policy" />;
  else page = <Home />;

  return (
    <React.Fragment>
      <Nav route={route} />
      {page}
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
