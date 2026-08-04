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
  ['about', 'About Us'],
  ['programmes-individuals', 'Programmes'],
  ['events', 'Events'],
  ['news', 'News'],
  ['projects', 'Projects & Impact'],
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
   "Mindfulness. Straight to your inbox." heading removed per the July
   content map. Now shown ONLY on Home and the Individuals & Communities
   programme page (thin variant), not site-wide.
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
    <div className="subscribe-band thin">
      <p>Get updates on courses, events and wellbeing resources for the public.</p>
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

/* ---------- TRUSTED BY BAND ----------
   Logos + (later) testimonial gallery. Testimonial gallery intentionally
   not built yet — no testimonials exist yet per the content map; add
   that section when copy/quotes are ready.
*/
function TrustedByBand() {
  return (
    <div className="trusted-band">
      <h3>Trusted and supported by</h3>
      <div className="trusted-logos">
        <SiteImage
          src="img/fuse-network-logo.png"
          alt="FUSE Network"
          caption="FUSE Network logo — save as img/fuse-network-logo.png"
        />
      </div>
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-badges">
        <SiteImage src="img/badge-trauma-informed.png" alt="Trauma-Informed Certified" caption="Trauma-Informed badge" />
        <SiteImage src="img/badge-mindfulnessuk-cmr.png" alt="MindfulnessUK CMR Teacher" caption="MindfulnessUK CMR Teacher badge" />
        {/* BAMBA badge to be added once available */}
      </div>
      <div className="foot-links">
        <a href="#/policy-privacy">Privacy</a>
        <a href="#/policy-safeguarding">Safeguarding</a>
        <a href="#/policy-terms">Terms &amp; Conditions</a>
        <a href="#/policy-accessibility">Accessibility</a>
        <a href="#/policy-complaints">Complaints</a>
        <a href="#/policy-whistleblowing">Whistleblowing</a>
        <a href="#/policy-volunteer">Volunteer Policy</a>
      </div>
      <p className="footer-address">WholeMind Resilience CIC, Carrow House, 301 King Street, Norwich, NR1 2TG</p>
      <p>WHOLEMIND RESILIENCE CIC · Company number: 17367582 · © {new Date().getFullYear()}</p>
      <p style={{ marginTop: 6 }}>Registered with the Information Commissioner's Office (ICO) · Registration number to follow</p>
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
        <div className="eyebrow">WholeMind Resilience CIC</div>
        <h1>Helping people, teams and communities reduce stress, prevent burnout and build lasting resilience.</h1>

        <p className="hero-line text-plum">We help the people, and the people who help the people.</p>
        <p className="hero-line sub">Evidence-based approaches that support mental wellbeing.</p>
        <p className="hero-line text-plum">WholeMind Resilience is a not-for-profit company, built on a social promise to reinvest profit back into our communities.</p>
        <p className="hero-line text-green">We're a non-clinical, preventative service and do not offer therapy or crisis support. For urgent help, contact your GP or call NHS 111 (option 2). In an emergency, please call 999.</p>
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
              <p>Preventative resilience training for people in high-demand roles. CMR for teams, reflective practice, &amp; stress and burnout workshops.</p>
            </div>
            <div className="audience-card" onClick={() => go('programmes-systems')}>
              <h3>For Systems &amp; Providers</h3>
              <p>Scalable, evidence-based prevention for the wider health and care system — CMR for phased return, spaces for leadership wellbeing, and scalable neighbourhood prevention.</p>
            </div>
          </div>
        </div>
      </div>

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
    body: `WholeMind Resilience is a not-for-profit company. We have made a social promise to reinvest our profits to make our courses and workshops more accessible — supporting people facing barriers such as inequality, deprivation or rural isolation, and the volunteers who give their own time to our communities.

Our founder and board bring lived experience, professional training and system knowledge together, to help at every level.`
  },
  {
    title: 'Our Approach',
    body: `Every service we deliver is grounded in evidence-based, trauma-informed practice — because how support is delivered matters just as much as what's delivered.

Our mindfulness approaches are taught through a BAMBA-accredited training route, shaped by lived experience, alongside a real understanding of the pressures facing ICS workforces. We work at a non-clinical, preventative level, with safeguards in place so everyone can take part safely.

For organisations, our work aligns with multiple criteria across NICE guidance NG212, NG13 & QS147, the 2026 NHS Staff Standards Framework and the NHS's wider ambition — from sickness to prevention. Our board understands the journey ICS partners are on toward Neighbourhood Health, and can act as a trusted partner in that space, supporting new Integrated Neighbourhood Teams and Health Hubs to deliver prevention for their staff and their populations.`
  },
  {
    title: 'About the Founder',
    header: 'Annamarie Gammage — Founder & Executive Director',
    body: `I founded WholeMind Resilience because I kept seeing how stress and pressure were affecting people in everyday life, my friends, family, neighbours, community groups, and people I worked with in demanding public-facing roles. And, I lost people very close to me who should still be here. The need for practical, preventative support was clear, and I wanted to create something that genuinely helped people build emotional resilience and stay well.

I've worked in highly demanding roles, spending more than ten years in education leadership working with children who have social, emotional and behavioural challenges, and six years within the NHS — including the ambulance service during the pandemic — and across the Integrated Care System. These roles gave me a close view of the pressures faced by people, teams and whole communities. They also showed me the impact that demanding roles and difficult life situations can have on health and wellbeing. Through this work, I have learnt that a huge percentage of sickness is avoidable, and that stress is one of the main contributors to poor health outcomes and to the high rates of absence from vital roles that support our communities. It's a cycle, and breaking it starts with prevention.

My own lived experience has shaped my commitment to approaches that genuinely help. Mindfulness had a significant personal impact on rebuilding my wellbeing, and I went on to train formally as a mindfulness instructor, following a BAMBA-accredited route to ensure that what I deliver is backed by research. Everything I do started with my own lived experience of trauma recovery, vicarious trauma, and becoming chronically burnt out working in the 'system'. As well as education and NHS leadership experience, I'm a qualified coach, NLP practitioner, and have previously run an award-winning family support business.

Outside my work, I'm a hobby artist with a few exhibitions and sales under my belt, a motorbike rider, and someone often found nose-deep in a book, cooking to classical music, dancing to a beat, or enjoying time with family and friends. I'm human, imperfect, gentle, fierce, kind, and committed to doing what I can to make the world a better place for people.

WholeMind Resilience is a not-for-profit because I wanted the organisation's purpose — supporting people, communities, and public service teams — to guide every decision. Being structured this way means we can focus on impact, stay aligned with our values, and reach more people who need preventative support.`,
    photo: { src: 'img/founder.jpg', caption: 'Photo of Annamarie — to follow. Save as img/founder.jpg' }
  },
  {
    title: 'Meet the Directors',
    header: 'Tim Winters — Non-Executive Director',
    body: `Tim has joined WholeMind Resilience from the very beginning, supporting the formation phase and helping to shape an organisation grounded in integrity from day one.

Driven by the belief that there is no health without mental health, Tim saw the social value at the heart of WholeMind Resilience clearly aligning with his own values. That alignment prompted him to offer his time and expertise to the team.

Tim brings a strong public-service ethos and deep expertise in public health and analytics. His professional journey spans an Oceanography PhD, insurance financial modelling, and leading health and care analytical teams — a combination that gives him a unique perspective on how to address complex community challenges.

Working across the ICB, councils and the wider ICS, Tim has mapped pandemic projections, evaluated complex population data to understand health needs, inequality, and resourcing, and contributed to improving health outcomes for the population of Norfolk.

He brings this expertise in evidence evaluation and resource allocation to WholeMind Resilience, ensuring impactful, targeted support reaches the communities and organisations that need it most.

Personally committed to wellbeing, Tim stays active and connected through running, cycling and occasional dad dancing.

WholeMind Resilience is deeply grateful for the experience and clarity Tim brings to the team, and for the way his perspective and integrity will help shape our work, and our impact.`,
    photo: { src: 'img/director-tim.jpg', caption: 'Photo of Tim — to follow. Save as img/director-tim.jpg' },
    note: 'Note: a second director bio and photo will be added here later.'
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
              {s.photo && <SiteImage className="about-image" src={s.photo.src} alt={s.header || s.title} caption={s.photo.caption} />}
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
    </div>
  );
}

/* ---------- PROGRAMMES ----------
   Per the July content map: Individuals items keep their own booking
   buttons. Professionals & Systems items no longer have per-item
   buttons — a single "Book a meeting" sits at the bottom of each page
   instead.

   NOTE: "Mindfulness Tuition", "CMR for Teams" and "CMR for Phased
   Return" were each marked "add logo to match other placements" but no
   specific icon file was given for them — left as icon:null rather than
   guessing. Let me know which of the uploaded icons (or a new one)
   should go here.
*/
const PROGRAMMES = {
  individuals: {
    heading: 'For Individuals & Communities',
    icon: 'logos/icon-public-mindful-sessions.svg',
    intro: `If you've reached a point where stress, overwhelm or burnout have felt harder to carry, you are not alone — and that's true whether you're carrying it yourself, or carrying it for your team or organisation. Everything we offer is built on the same evidence-based, preventative approach.`,
    introLast: 'Choose the path that fits:',
    items: [
      { title: 'Mindfulness Tuition', icon: null, text: 'The Compassionate Mindful Resilience (CMR) Programme is an 8-hour, trauma-informed mindfulness and compassion course developed by MindfulnessUK. Four 2-hour workshops over 4 weeks, teaching you how to use accessible mindfulness in everyday life.', cta: 'View Course Dates' },
      { title: 'Mindfulness & Meditation Sessions', icon: 'logos/icon-public-mindful-sessions.svg', text: 'Join gentle, purposeful mindfulness sessions designed to help you pause, regulate and reconnect. Regular opportunities to practice, and take time for your wellbeing. No experience necessary. Available online and in Norfolk-based venues.', cta: 'Book sessions' },
      { title: 'Mindfulness Coaching', icon: 'logos/icon-coaching-dialogue.svg', text: '1:1 mindfulness coaching offers a quiet, personal space to explore how mindfulness can support you in the context of your own life.', cta: 'Book a Chat' },
      { title: 'Community Wellbeing Workshops', icon: 'logos/icon-public-workshops.svg', text: 'A gentle, accessible, trauma-informed space to learn, explore and practise tools and activities that support positive mental wellbeing, and community connection.', cta: 'Find a workshop' },
    ],
    outro: `If you'd like to talk about services, or you're unsure which is right for you, please feel free to book a time to chat, or send us a message.`,
    outroCta: 'Book a call',
    showSubscribe: true,
  },
  professionals: {
    heading: 'For Professionals & Teams',
    icon: 'logos/icon-teams-reflective-practice.svg',
    intro: `Designed specifically for people in high-demand roles, these trauma-informed preventative trainings and services are delivered by facilitators who bring lived experience, and public service knowledge.`,
    bulletsIntro: 'Effective solutions for professionals and teams across:',
    bullets: ['Health', 'Social care', 'Care homes and community care', 'Councils', 'Blue light services', 'Education', 'VCSE sector'],
    alignNote: 'Aligns with NICE guidance NG212, NG13 & QS147 & the 2026 NHS Staff Standards Framework',
    items: [
      { title: 'CMR for Teams', icon: null, text: 'An 8-hour, research-backed, trauma-informed mindfulness and compassion training for staff experiencing pressure, emotional load and compassion fatigue. Developed by MindfulnessUK, the Compassionate and Mindful Resilience (CMR) programme teaches accessible, short, realistic practices which can be used in high-demand roles to reduce stress, vicarious trauma and burnout.\n\nDelivered online or in person as 4 × 2-hour or 2 × 4-hour workshops, over 4–6 weeks.' },
      { title: 'Compassion Based Reflective Practice', icon: 'logos/icon-teams-reflective-practice.svg', text: `A trauma-informed, facilitated space for teams to prioritise wellbeing — pausing to reflect, with compassion for themselves and others, on the human impact of their work. Designed to work as a single CPD session or an ongoing space to build resilience and strengthen wellbeing over time.\n\nAvailable for groups:\n• Online — nationally\n• In person — Norfolk only` },
      { title: 'Workshops: Stress, Burnout & Vicarious Trauma', icon: 'logos/icon-workshops-windingpath.svg', text: `A gentle, practical space for staff to learn about stress, burnout and vicarious trauma in a way that feels human and relatable — engaging workshops shaped around your team's specific needs, built to fit naturally into CPD days, and grounded in real lived experience.` },
    ],
    outroHeading: 'Prefer to talk first?',
    outro: `How it works: a short conversation about what your team needs → a proposal built around your capacity and budget → flexible delivery, online or in person.\n\nBook a meeting to get started.`,
    outroCta: 'Book a meeting',
  },
  systems: {
    heading: 'For Systems & Providers',
    icon: 'logos/icon-system-scalable-prevention.svg',
    intro: `Providers and larger systems can offer prevention at scale — for workforces, through staff wellbeing services aligned with NICE guidance, and for patients and communities, through flexible, bespoke prevention programmes shaped around what your organisation or neighbourhood needs.`,
    alignNote: 'Aligns with NICE guidance NG212, NG13 & QS147 & the 2026 NHS Staff Standards Framework',
    items: [
      { title: 'CMR for Phased Return', icon: null, text: 'An 8-hour, research-backed, trauma-informed mindfulness and compassion programme for staff on, or recently returned from, a phased return — designed to reduce the risk of burnout during one of the highest-risk periods for staff wellbeing. Developed by MindfulnessUK, the Compassionate & Mindful Resilience (CMR) programme teaches accessible, short, realistic practices that help staff rebuild confidence and regulate pressure as they re-enter demanding roles.\n\nAligned with NICE guidance for staff wellbeing and the new NHS staff standards, which require organisations to take a preventative, evidence-based approach to staff health and wellbeing.\n\nDelivered online as 4 × 2-hour workshops, over 4–6 weeks. Each cohort can accommodate up to 15 participants — a scalable way for large organisations to support staff consistently across teams, departments or sites.' },
      { title: 'Safe Leader Space', icon: 'logos/icon-safe-leader-space.svg', text: `A protected, trauma-informed space for leaders to prioritise their own wellbeing, built specifically around the particular pressures of leadership, and the difficulty of being open about them.\n\nLeaders often carry as much strain as the teams they support, with far less room to show it — vulnerability at the top can read as instability to the people relying on leaders for confidence and direction.\n\nSafe Leader Space gives leaders a facilitated, thematic place to pause, reflect and be honest about that weight, without it touching how their team sees them. Sessions support the development of compassion — for self and others.\n\nAvailable online only, in no less than 5 session blocks.` },
      { title: 'Scalable Neighbourhood Prevention', icon: 'logos/icon-system-scalable-prevention.svg', text: `A flexible, non-clinical prevention offer for organisations who want to reach people before pressures reach crisis point — shaped around what your organisation and the people you serve actually need, not a fixed package.\n\nIt can sit wherever prevention is needed: group courses for people on waiting lists, ongoing support within neighbourhood health hubs, or bespoke programmes commissioned by GP practices or social care for their clients and patients. Delivered in partnership with BAMBA-accredited mindfulness practitioners, every version stays practical, trauma-informed and grounded in real life — not therapy, not a mental health service, but a genuine widening of access to preventative support for people who aren't yet in need of specialist care.\n\nBecause it's built to scale, WholeMind coordinates practitioners and delivery around your community's actual capacity — from a single course to an ongoing pathway of practice groups. Get in touch to talk through what this could look like for your organisation.` },
    ],
    outroHeading: 'Ready to talk about prevention at scale?',
    outro: `Book a meeting or send us a message.`,
    outroCta: 'Book a meeting',
    socialValueBanner: `WholeMind Resilience is a Community Interest Company (CIC) — a structure that carries weight in NHS and public sector procurement. Since 2021, UK government contracts have applied a minimum 10% Social Value weighting in procurement scoring, with many NHS trusts and local authorities weighting it considerably higher. Commissioning WholeMind Resilience is a values-aligned choice that can also directly support your organisation's own Social Value commitments.`,
  }
};

function ProgrammePage({ audience }) {
  const data = PROGRAMMES[audience];
  const tabs = [
    ['individuals', 'Individuals & Communities'],
    ['professionals', 'Professionals & Teams'],
    ['systems', 'Systems & Providers'],
  ];
  const showButtons = audience === 'individuals';

  return (
    <div className="page">
      <div className="page-header">
        {data.icon && <img className="hub-icon" src={data.icon} alt="" />}
        <div className="eyebrow">Programmes</div>
        <h1>{data.heading}</h1>
        <p>{data.intro}</p>
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
        <div className="prog-block" key={item.title}>
          {item.icon && <img className="item-icon" src={item.icon} alt="" />}
          <h2>{item.title}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{item.text}</p>
          {showButtons && <button className="cta-btn" onClick={() => go('events')}>{item.cta}</button>}
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: 40, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
        {data.outroHeading && <h3 style={{ fontSize: 18, color: 'var(--sage-deep)', marginBottom: 10 }}>{data.outroHeading}</h3>}
        <p style={{ color: 'var(--muted)', fontSize: 14.5, whiteSpace: 'pre-line', marginBottom: 16 }}>{data.outro}</p>
        {/* Replace this placeholder with your real Microsoft Bookings embed/link once the M365 licence is active */}
        <button className="cta-btn outline" onClick={() => alert('Microsoft Bookings integration on hold — pending M365 licence')}>
          {data.outroCta}
        </button>
      </div>
      {data.socialValueBanner && (
        <div style={{ maxWidth: 700, margin: '40px auto 0', background: 'var(--sage-tint)', borderRadius: 16, padding: '22px 26px', fontSize: 14, color: 'var(--ink)' }}>
          {data.socialValueBanner}
        </div>
      )}
      {data.showSubscribe && <SubscribeBanner />}
    </div>
  );
}

/* ---------- EVENTS / COURSES ----------
   Some sessions are prepared in Zeffy but marked "not published" in the
   content map — kept here with published:false so they're a one-line
   flip to go live rather than needing to be rebuilt later.
*/
const SESSIONS = [
  {
    title: 'CMR — Online 4×2hr Course', mode: 'online', note: 'Individuals',
    text: 'Choose dates and book your place on upcoming courses.',
    cta: 'Book a course', zeffyKey: 'cmr-online-courses', published: true,
  },
  {
    title: 'CMR — In-Person 4×2hr Course (Norfolk)', mode: 'in-person', note: 'Individuals',
    text: 'Find upcoming courses in Norfolk and book your place.',
    cta: 'Book a course', zeffyKey: 'cmr-norfolk-courses', published: false,
  },
  {
    title: 'Mindfulness & Meditation Sessions — Online', mode: 'online', note: 'Individuals',
    text: 'Regular thematic sessions to regulate, recalibrate and practice in a small group online setting.',
    cta: 'Book Sessions', zeffyKey: 'mindfulness-sessions-online', published: true,
  },
  {
    title: 'Mindfulness & Meditation Practice Sessions — Norfolk', mode: 'in-person', note: 'Individuals',
    text: 'Find upcoming locations and dates and book your place.',
    cta: 'Book Norfolk Sessions', zeffyKey: 'mindfulness-sessions-norfolk', published: true,
  },
  {
    title: 'Mindfulness Classes — 10 Week Course', mode: 'in-person', note: 'Individuals',
    text: 'Weekly in-person lessons. Find upcoming courses in Norfolk and book your place.',
    cta: 'Book a course', zeffyKey: null, published: false,
  },
  {
    title: 'Community Wellbeing Workshops', mode: 'in-person', note: 'Individuals',
    text: 'Find Norfolk based community wellbeing workshops and book your place. Different topics available.',
    cta: 'Find a workshop', zeffyKey: 'community-workshops-norfolk', published: false,
  },
];

function Events() {
  const visible = SESSIONS.filter(s => s.published);
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">Events &amp; Courses</div>
        <h1>Find and book your place on our upcoming public events</h1>
        <p>Courses are updated regularly — if you can't find what you're looking for today, <a href="#/contact" className="text-plum">get in touch</a>, we're happy to let you know when new dates are added.</p>
        <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>We process payments through Zeffy, which keeps costs low for non-profits like us. During checkout, Zeffy will suggest an optional donation to support their platform — this isn't mandatory, and you can adjust it to £0 if you'd prefer.</p>
      </div>
      <div className="session-list">
        {visible.map(s => (
          <div className={'session-card' + (s.mode === 'online' ? ' online' : '')} key={s.title} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h4>{s.title}</h4>
                <div className="meta">{s.mode === 'online' ? 'Online' : 'In-person'} · {s.note}</div>
                <div className="session-note">{s.text}</div>
              </div>
              <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS[s.zeffyKey]} label={s.cta} />
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

/* ---------- NEWS ----------
   Collapsible sections + image galleries per post — built as a simple
   expandable list, ready for content. Empty for now.
*/
const NEWS_POSTS = [
  // { title: 'First post title', date: 'Aug 2026', body: '...', images: [] },
];

function News() {
  const [open, setOpen] = useState(null);
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
              {open === i && <div className="acc-body">{post.body}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- PROJECTS & IMPACT (new page) ----------
   Collapsible project boxes, same accordion style as About. Each box
   can hold text, logos/images/video and report links — extend the
   PROJECTS array below as real projects are added.

   Need Analysis reports: large PDFs/reports are better hosted outside
   the code repo (e.g. Supabase Storage, or a Google Drive folder with
   shareable links) and linked from here, rather than pasted as page
   text — keeps the site fast and the repo small.
*/
const PROJECTS = [
  // { title: 'Project name', summary: '...', links: [{label:'Read the report', url:'...'}] }
];

function Projects() {
  const [open, setOpen] = useState(null);
  return (
    <div className="page">
      <div className="projects-header">
        <div className="eyebrow-plum">PROJECTS AND IMPACTS</div>
        <h1 className="text-green" style={{ fontFamily: "'Playfair Display', serif" }}>What we've delivered and where your support goes</h1>
        <p>Learn about the projects we're involved in, or have completed. Every project on this page started with a real need, and ended with an honest reflection of our impact.</p>
        <p>This page will grow, one project at a time, as our work does.</p>
      </div>

      {PROJECTS.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Projects will appear here as they're added.</p>
      ) : (
        PROJECTS.map((p, i) => (
          <div className="project-card" key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            {p.links && p.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-plum">{l.label}</a>)}
          </div>
        ))
      )}

      <div className="project-card" style={{ marginTop: 40 }}>
        <h3>Need Analysis</h3>
        <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Need analysis reports/PDFs will be linked here once hosted (Supabase Storage or a shared Drive folder works well for large documents — ask if you'd like this set up).</p>
      </div>
    </div>
  );
}

function GetInvolved() {
  return (
    <SimplePage eyebrow="Get Involved" title="Support WholeMind Resilience, and your communities">
      <p>If you or your organisation are passionate about supporting people in the community, or you have experienced your own difficulty and would like to help others, there are several ways you can get involved:</p>

      <p><b>Volunteering</b> — As WholeMind Resilience grows, volunteers will help us reach more people, more often. Whether it's an hour, a single task, or ongoing support at events, offering your time, expertise or skills — from community activities to fundraising — helps us reinvest more into the programmes that need it.</p>

      <p><b>Donations</b> — Your donations go straight into local community work, creating impact in people's lives. Every £15 raised funds a place on one of our mindfulness sessions for someone who couldn't otherwise afford it. Every £200 raised funds a full course for an individual, or a workshop for a community or volunteer group. Every contribution — whatever the size — directly enables sessions for individuals and voluntary organisations who would otherwise go without. Give once, or set up a regular donation to help us plan further ahead.</p>

      <p><b>Corporate Sponsorship</b> — Corporate partners could help us reach more people across the region, at scale. Sponsorship doesn't have to mean funding — it can also mean rooms to deliver classes closer to communities, equipment, training places for staff and volunteers, or refreshments for events. In return, all corporate sponsors receive: logo placement on our website, a public thank-you mention in our blog, social media acknowledgement, and — for support over £1000 in value — an impact report showing exactly how your contribution strengthened wellbeing in local communities.</p>

      <p><b>Fundraising</b> — If you choose to fundraise for WholeMind Resilience, you're directly impacting the lives of people in the community who need support the most. Every pound raised helps us deliver accessible wellbeing programmes to individuals and groups facing disadvantage, pressure or limited access to services. We'd love to hear your ideas — a personal challenge, a whip-round at an event, or help putting a fundraiser together. WholeMind will thank our fundraisers publicly, and share how their contribution made a difference.</p>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS.donate} label="Donate Now" />
        <p style={{ marginTop: 14 }}><a href="#/contact" className="text-plum">Contact us to discuss supporting WholeMind Resilience</a></p>
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

/* ---------- COURSE PARTICIPANTS ----------
   Split into two separate password-protected areas per the content
   map: CMR Course Participants and WholeMind Course Participants.
   Each checks its password via its own serverless endpoint field —
   see api/check-password.js (now accepts a "which" value).
*/
function PasswordGate({ which, onSuccess, label }) {
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
        body: JSON.stringify({ password: value, which }),
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

function CourseContentWelcome({ heading }) {
  return (
    <SimplePage eyebrow="Course Participants" title={heading}>
      <p>This is your space to use as we work through your program and for you to revisit, whenever you need it — recordings, practices and materials, all in one place, for as long as you need them.</p>
      <p><b>How to use this page:</b> Whilst on your course, use only the sections taught — your teacher will make sure you know which ones you are working on each week. Once your course is finished, you can continue to use these materials — there's no right or wrong way to practise. You choose the practices that work best for you in the moment.</p>
      <p>We advise practising at least 3 times per week, ideally 5, to get the full benefit.</p>
      <p>Should you have any technical difficulties with this page, please contact <a href="mailto:info@wholemindresilience.co.uk" className="text-plum">info@wholemindresilience.co.uk</a> for support.</p>
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
  return <CourseContentWelcome heading="CMR Course — Welcome to the CMR course online portal" />;
}

function WholeMindCourseParticipants() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) {
    return <PasswordGate which="wholemind" onSuccess={() => setUnlocked(true)} label="WholeMind Course Participants" />;
  }
  return <CourseContentWelcome heading="Welcome to your WholeMind Mindfulness Course" />;
}

function CourseParticipantsHub() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">Course Participants</div>
        <h1>Course Materials</h1>
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
