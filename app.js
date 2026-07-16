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
   Drop real photo files into an /img folder in the repo (same folder as
   index.html) using the filenames below. Until a file exists at that
   path, a soft placeholder shows instead — nothing breaks either way.

   Photo brief (per the brand guidelines): real people in gentle,
   everyday settings, calm nature, quiet conversation — NOT meditation
   poses, lotus positions, or yoga imagery. Think: someone walking a
   quiet path, two people talking warmly over a table, hands around a
   mug, a countryside or park scene. Good stock sources: Unsplash or
   Pexels, searching things like "quiet countryside walk", "two people
   talking outdoors", "calm morning coffee" rather than "meditation" or
   "mindfulness" (those searches return the exact clichés to avoid).
*/
function SiteImage({ src, alt, caption, className }) {
  const [errored, setErrored] = useState(false);
  if (errored || !src) {
    return (
      <div className={'img-placeholder ' + (className || '')}>
        <span>{caption || 'Photo goes here'}</span>
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
   Replace each zeffyUrl below with the real embed link from your Zeffy
   campaign (Zeffy dashboard > campaign > Share > Embed on my website).
   Embedded Zeffy forms only show payment/booking fields — no logo,
   image or description — so page copy around the embed carries the
   branding and context.
*/
function ZeffyEmbed({ zeffyUrl, label }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button className="cta-btn" onClick={() => setOpen(true)}>{label || 'Book Now'}</button>
    );
  }
  if (!zeffyUrl) {
    return (
      <div style={{ padding: 16, border: '1px dashed var(--line)', borderRadius: 8, fontSize: 13, color: 'var(--muted)' }}>
        Zeffy embed URL not set yet for this item — paste the campaign's embed link into the
        <code> ZEFFY_CAMPAIGNS </code> object in app.js.
      </div>
    );
  }
  return (
    <iframe
      title="Zeffy form"
      src={zeffyUrl}
      style={{ width: '100%', minHeight: 620, border: 'none', borderRadius: 8 }}
      allow="payment"
    />
  );
}

/* Map each session/campaign to its real Zeffy embed URL once created */
const ZEFFY_CAMPAIGNS = {
  'cmr-course': '',
  'mindfulness-dropin': '',
  'community-workshop-norwich': '',
  'cmr-for-teams': '',
  donate: '',
};

/* ---------- NAV ----------
   Logo: drop your SVG file into the project as logo.svg, then swap the
   <span className="logo-mark"> block below for:
   <img src="logo.svg" alt="WholeMind Resilience" />
*/
const NAV_ITEMS = [
  ['home', 'Home'],
  ['about', 'About Us'],
  ['programmes-individuals', 'Programmes'],
  ['events', 'Events'],
  ['news', 'News'],
  ['involved', 'Get Involved'],
  ['participants', 'Course Participants'],
  ['contact', 'Contact'],
];

function Nav({ route }) {
  const isProgrammes = route.startsWith('programmes');
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <button className="logo" onClick={() => go('home')}>
          <img className="woodmark" src="logos/logo-woodmark.svg" alt="WholeMind Resilience" />
        </button>
        <ul className="nav-links">
          {NAV_ITEMS.map(([key, label]) => (
            <li key={key}>
              <button
                className={(route === key || (key === 'programmes-individuals' && isProgrammes)) ? 'active' : ''}
                onClick={() => go(key)}
              >{label}</button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ---------- SUBSCRIBE BANNER ----------
   Shown on every page, just above the footer — same pattern as
   oxfordmindfulness.org. Wire the form's onSubmit up to whichever
   mailing list tool is chosen (Mailchimp, Brevo/Sendinblue, etc.);
   for now it just confirms in the UI without sending anywhere.
*/
function SubscribeBanner() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: replace with a real call to your mailing list provider
    setSent(true);
  }

  return (
    <div className="subscribe-band">
      <h2>Mindfulness. Straight to your inbox.</h2>
      <p>Get updates on courses, events and wellbeing resources.</p>
      {sent ? (
        <p style={{ color: '#fff', fontWeight: 600 }}>Thanks — you're subscribed.</p>
      ) : (
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
      <p className="subscribe-note">No spam — unsubscribe anytime.</p>
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-links">
        <a href="#/policy-privacy">Privacy Policy</a>
        <a href="#/policy-gdpr">GDPR Policy</a>
        <a href="#/policy-safeguarding">Safeguarding</a>
        <a href="#/policy-terms">Terms &amp; Conditions</a>
        <a href="#/policy-accessibility">Accessibility</a>
      </div>
      <p>WholeMind Resilience CIC · Company registration number to follow · © {new Date().getFullYear()}</p>
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
        <div className="eyebrow">WholeMind Resilience</div>
        <h1>Helping people, teams and communities reduce stress, prevent burnout and build lasting resilience.</h1>
        <p className="sub">Evidence-based approaches that support mental wellbeing.</p>
      </div>

      <div className="band band-sage">
        <div className="band-inner">
          <div className="audience-grid">
            <div className="audience-card" onClick={() => go('programmes-individuals')}>
              <h3>For Individuals &amp; Communities</h3>
              <p>Mindfulness courses, sessions, coaching and community workshops.</p>
            </div>
            <div className="audience-card" onClick={() => go('programmes-professionals')}>
              <h3>For Professionals &amp; Teams</h3>
              <p>CMR for teams, reflective practice, and stress &amp; burnout workshops.</p>
            </div>
            <div className="audience-card" onClick={() => go('programmes-systems')}>
              <h3>For Systems &amp; Providers</h3>
              <p>Phased return, safe leader space, and scalable neighbourhood prevention.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ABOUT (accordion) ---------- */
const ABOUT_SECTIONS = [
  {
    title: 'Our Mission',
    body: `WholeMind Resilience exists to support people, teams, communities and systems to stay well, through delivering evidence-based approaches that reduce stress, lower burnout risk, and strengthen mental wellbeing.

We work in partnership with organisations and system leaders to build practical, prevention-focused resilience that fits real lives, difficult situations, and demanding roles.

We help the people, and the people who help the people.

Our pledge is to repurpose profit to deliver programmes to disadvantaged groups and volunteering organisations.`
  },
  {
    title: 'About WholeMind Resilience',
    body: `The organisation runs under a not-for-profit status, enabling us to repurpose profits into delivering services to disadvantaged groups, and make wellbeing workshops and courses more accessible.

Our founder, and board, offer a mix of lived experience, professional training, and system knowledge, making WholeMind a service which truly can help at all levels.`
  },
  {
    title: 'Our Approach',
    body: `WholeMind grounds its services in evidence-based approaches which are backed by research. The organisation delivers Mindfulness approaches developed through a BAMBA accredited training route, and trauma-informed wellbeing activities.

[Links to research — ADD LINKS]`
  },
  {
    title: 'About the Founder',
    body: `I founded WholeMind Resilience because I kept seeing how stress and pressure were affecting people in everyday life — my friends, family, neighbours, community groups, and people I worked with in demanding public-facing roles.

[Full founder story — see content document for complete copy]`
  },
  {
    title: 'Meet the Directors',
    body: `To follow.`
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
          {open === i && <div className="acc-body">{s.body}</div>}
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
        <h1>A preventive wellbeing partner</h1>
      </div>
      <SiteImage
        className="about-image"
        src="img/about.jpg"
        alt="A calm, everyday scene representing the founder's approach"
        caption="Photo: founder or team in a relaxed, real setting — not a posed studio shot. Save as img/about.jpg"
      />
      <Accordion />
    </div>
  );
}

/* ---------- PROGRAMMES ---------- */
const PROGRAMMES = {
  individuals: {
    heading: 'For Individuals & Communities',
    icon: 'logos/icon-public-mindful-sessions.svg',
    intro: `If you've reached a point where stress, overwhelm or burnout have felt harder to carry, you are not alone.`,
    items: [
      { title: 'Mindfulness Tuition', icon: null, text: 'The Compassionate Mindful Resilience (CMR) Programme is an 8-hour, trauma-informed mindfulness and compassion course developed by MindfulnessUK. Four 2-hour workshops, each practice 10 minutes or less.', cta: 'View Course Dates' },
      { title: 'Mindfulness & Meditation Sessions', icon: 'logos/icon-public-mindful-sessions.svg', text: 'Join a gentle, purposeful mindfulness session designed to help you pause, regulate and reconnect. Available online and in Norfolk-based venues.', cta: 'Book Online Group' },
      { title: 'Mindfulness Coaching', icon: 'logos/icon-coaching-dialogue.svg', text: '1:1 mindfulness coaching offers a quiet, personal space to explore how mindfulness can support you in the context of your own life.', cta: 'Book a Chat' },
      { title: 'Community Wellbeing Workshops', icon: 'logos/icon-public-workshops.svg', text: 'A gentle, trauma-informed, accessible space to learn, explore and practise tools that support mental wellbeing — no experience needed.', cta: 'Book a Workshop' },
    ]
  },
  professionals: {
    heading: 'For Professionals & Teams',
    icon: 'logos/icon-teams-reflective-practice.svg',
    intro: `Designed to meet the needs of people in high-demand roles across health, social care, council, blue light, education and the VCSE sector.`,
    items: [
      { title: 'CMR for Teams', icon: null, text: 'An 8-hour, trauma-informed mindfulness and compassion training for staff experiencing pressure, emotional load and compassion fatigue.', cta: 'Get in Touch' },
      { title: 'Compassion Based Reflective Practice', icon: 'logos/icon-teams-reflective-practice.svg', text: 'A facilitated, trauma-informed space for teams to pause, reflect and explore the human impact of their work.', cta: 'Get in Touch' },
      { title: 'Workshops: Stress, Burnout & Vicarious Trauma', icon: 'logos/icon-workshops-windingpath.svg', text: 'A gentle, practical space for staff to learn about stress, burnout and vicarious trauma in a way that feels human and relatable.', cta: 'Get in Touch' },
    ]
  },
  systems: {
    heading: 'For Systems & Providers',
    icon: 'logos/icon-system-scalable-prevention.svg',
    intro: `Providers and larger systems can offer prevention at scale — within workforce and communities.`,
    items: [
      { title: 'CMR for Phased Return', icon: null, text: 'Supports staff returning to work after stress-related absence, burnout risk or vicarious trauma exposure. Cohorts of up to 15 participants.', cta: 'Get in Touch' },
      { title: 'Safe Leader Space', icon: 'logos/icon-safe-leader-space.svg', text: 'A protected, trauma-informed environment for senior leaders to pause, reflect and explore the human impact of leadership.', cta: 'Get in Touch' },
      { title: 'Scalable Neighbourhood Prevention', icon: 'logos/icon-system-scalable-prevention.svg', text: 'An 8-hour trauma-informed group course for communities needing early, preventative wellbeing support — designed to scale across GP practices and Neighbourhood Health Teams.', cta: 'Get in Touch' },
    ]
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
        <div className="eyebrow">Programmes</div>
        <h1>{data.heading}</h1>
        <p>{data.intro}</p>
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
        <div className="prog-block" key={item.title}>
          {item.icon && <img className="item-icon" src={item.icon} alt="" />}
          <h2>{item.title}</h2>
          <p>{item.text}</p>
          <button className="cta-btn" onClick={() => go('events')}>{item.cta}</button>
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Prefer to talk first?</p>
        {/* Replace this placeholder with your real Microsoft Bookings embed/link */}
        <button className="cta-btn outline" onClick={() => alert('Embed Microsoft Bookings link here')}>
          Book a Call (M365)
        </button>
      </div>
    </div>
  );
}

/* ---------- EVENTS / COURSES ---------- */
const SESSIONS = [
  { title: 'CMR — 4×2hr Course', date: 'Starts Mon 3 Aug, 6:00pm', mode: 'online', note: 'Individuals', zeffyKey: 'cmr-course' },
  { title: 'Mindfulness & Meditation Drop-in', date: 'Every Thursday, 12:30pm', mode: 'online', note: 'Individuals', zeffyKey: 'mindfulness-dropin' },
  { title: 'Community Wellbeing Workshop — Norwich', date: 'Sat 15 Aug, 10:00am', mode: 'in-person', note: 'Individuals', zeffyKey: 'community-workshop-norwich' },
  { title: 'CMR for Teams — CPD Day', date: 'Fri 21 Aug, full day', mode: 'in-person', note: 'Professionals', zeffyKey: 'cmr-for-teams' },
];

function Events() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">Events &amp; Courses</div>
        <h1>Book your place</h1>
        <p>Online sessions in plum, in-person sessions in sage. Each session has its own booking button so places stay limited.</p>
      </div>
      <div className="session-list">
        {SESSIONS.map(s => (
          <div className={'session-card' + (s.mode === 'online' ? ' online' : '')} key={s.title} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h4>{s.title}</h4>
                <div className="meta">{s.date} · {s.mode === 'online' ? 'Online' : 'In-person'} · {s.note}</div>
              </div>
              <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS[s.zeffyKey]} label="Book Now" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- SIMPLE PAGES ---------- */
function SimplePage({ eyebrow, title, children }) {
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
      <div style={{ maxWidth: 680, margin: '0 auto', fontSize: 15 }}>{children}</div>
    </div>
  );
}

function News() {
  return (
    <SimplePage eyebrow="News" title="Insights & Updates">
      <p>Impact reports, session photos, case studies and research links will live here. Empty for now — safe to launch without content and fill in over time.</p>
    </SimplePage>
  );
}

function GetInvolved() {
  return (
    <SimplePage eyebrow="Get Involved" title="Support Preventive Wellbeing">
      <p><b>Volunteering</b> — as WholeMind Resilience grows, volunteers play a key role in expanding local impact.</p>
      <p><b>Donations</b> — your donation goes straight into local community work, funding concession or fully-funded places.</p>
      <p><b>Corporate Sponsorship</b> — sponsorship may mean funding, room use, equipment, training places, or refreshments for events.</p>
      <p><b>Fundraising</b> — every pound raised helps us deliver accessible wellbeing programmes to people facing disadvantage.</p>
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS.donate} label="Donate" />
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

/* ---------- HIDDEN / PASSWORD-GATED PAGES ---------- */
/*
  NOTE: This is a client-side placeholder gate for the scaffold only.
  Because this is a static, no-backend site, the real password check
  should happen in a small Vercel serverless function — otherwise the
  password lives in the JS bundle and is not truly private.
  Swap PASSWORD below for a fetch() call to an API route before launch.
*/
/*
  This gate now checks the password via a Vercel serverless function
  (/api/check-password.js), so the real password lives only in Vercel's
  environment variables — never in this file or the browser bundle.
*/
function PasswordGate({ onSuccess, label }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit() {
    setChecking(true);
    setError(false);
    try {
      const res = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      });
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
      />
      {error && <p className="error">That password isn't right — please check and try again.</p>}
      <button className="cta-btn" onClick={handleSubmit} disabled={checking}>
        {checking ? 'Checking…' : 'Unlock'}
      </button>
    </div>
  );
}

function CourseParticipants() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) {
    return <PasswordGate onSuccess={() => setUnlocked(true)} label="Course Participants" />;
  }
  return (
    <SimplePage eyebrow="Course Participants" title="Your course materials">
      <p>Audio, video and PDF materials go here once uploaded.</p>
    </SimplePage>
  );
}

function FundedProgrammes() {
  return (
    <SimplePage eyebrow="Funded Programmes" title="Funded Courses & Workshops">
      <p>Welcome — this page is for people who've been offered a funded or concessionary place on one of our programmes.</p>
      <p>Please only use this page if you've been advised that you qualify for a funded place. If you're unsure, contact us to discuss your needs.</p>
      <p style={{ fontStyle: 'italic', color: 'var(--muted)' }}>
        Each referral partner should get their own link (e.g. /funded?ref=norwich) paired with a unique Zeffy discount code — set to 100% off and tied to a specific session — so different areas' funded places stay separate and limited.
      </p>
    </SimplePage>
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
  else if (route === 'involved') page = <GetInvolved />;
  else if (route === 'contact') page = <Contact />;
  else if (route === 'participants') page = <CourseParticipants />;
  else if (route === 'funded') page = <FundedProgrammes />;
  else if (route === 'policy-privacy') page = <PolicyPage name="Privacy Policy" />;
  else if (route === 'policy-gdpr') page = <PolicyPage name="GDPR Policy" />;
  else if (route === 'policy-safeguarding') page = <PolicyPage name="Safeguarding" />;
  else if (route === 'policy-terms') page = <PolicyPage name="Terms & Conditions" />;
  else if (route === 'policy-accessibility') page = <PolicyPage name="Accessibility Statement" />;
  else page = <Home />;

  return (
    <React.Fragment>
      <Nav route={route} />
      {page}
      <SubscribeBanner />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
