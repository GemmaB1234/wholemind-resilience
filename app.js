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
  ['involved', 'Get Involved'],
  ['participants', 'Course Participants'],
  ['contact', 'Contact'],
];

function Nav({ route }) {
  const isProgrammes = route.startsWith('programmes');
  const isAbout = route === 'about' || route === 'projects';
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
                className={(route === key || (key === 'programmes-individuals' && isProgrammes) || (key === 'about' && isAbout)) ? 'active' : ''}
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
        <SiteImage className="wide" src="img/badge-mindfulnessuk-cmr.png" alt="MindfulnessUK CMR Teacher, accredited for teaching" caption="MindfulnessUK CMR Teacher badge" />
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
          <p className="safety-note">We're a non-clinical, preventative service and do not offer crisis support. For urgent help, contact your GP or call NHS 111 (option 2). In an emergency, please call 999.</p>
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
    photo: { src: 'img/founder.jpg', caption: 'Photo of Annamarie', portrait: true }
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
    icon: 'logos/icon-public-mindful-sessions.svg',
    intro: `Running on empty, or watching your team run on empty? You're not alone, and you don't have to wait until it all gets too much. Whether you're carrying stress yourself or carrying it for the people you lead, our programmes offer practical, evidence-based support that fits real life, before pressure becomes crisis.`,
    introLast: 'Choose the path that fits below:',
    items: [
      { title: 'Mindfulness Tuition', icon: 'logos/icon-cmr.svg', text: 'The Compassionate Mindful Resilience (CMR) Programme is an 8-hour, trauma-informed mindfulness and compassion course developed by MindfulnessUK. Four 2-hour workshops over 4 weeks, teaching you how to use accessible mindfulness in everyday life.\n\nAvailable online & in Norfolk venues.', stat: 'img/stat-99-public.png', statAlt: '99% of people surveyed said they, or someone close to them, had experienced high stress, burnout or mental difficulty in the past year (public survey, 88 respondents)' },
      { title: 'Mindfulness & Meditation Sessions', icon: 'logos/icon-public-mindful-sessions.svg', text: 'Join gentle, purposeful mindfulness sessions designed to help you pause, regulate and reconnect. Regular opportunities to practice, and take time for your wellbeing. No experience necessary. Available online and in Norfolk-based venues.' },
      { title: 'Mindfulness Coaching', icon: 'logos/icon-coaching-dialogue.svg', text: '1:1 mindfulness coaching offers a quiet, personal space to explore how mindfulness can support you in the context of your own life.', cta: 'Get in touch', ctaTo: 'contact' },
      { title: 'Community Wellbeing Workshops', icon: 'logos/icon-public-workshops.svg', text: 'A gentle, accessible, trauma-informed space to learn, explore and practise tools and activities that support positive mental wellbeing, and community connection.', stat: 'img/stat-88-would-use.png', statAlt: '88% of people surveyed said they would use one or more of the services we proposed (public survey, 88 respondents)' },
    ],
    bottomButton: { label: 'See dates and book', to: 'events' },
    outro: `Not sure which is right for you? Contact us to talk it through.`,
    outroCta: 'Start a conversation',
  },
  professionals: {
    heading: 'For Professionals & Teams',
    icon: 'logos/icon-teams-reflective-practice.svg',
    intro: `Designed specifically for people in high-demand roles, these trauma-informed preventative trainings and services are delivered by facilitators who bring lived experience, and public service knowledge.`,
    bulletsIntro: 'Effective solutions for professionals and teams across:',
    bullets: ['Health', 'Social care', 'Care homes and community care', 'Councils', 'Blue light services', 'Education', 'VCSE sector'],
    alignNote: 'Aligns with NICE guidance NG212, NG13 & QS147 & the 2026 NHS Staff Standards Framework',
    items: [
      { title: 'CMR for Teams', icon: 'logos/icon-cmr.svg', text: 'An 8-hour, research-backed, trauma-informed mindfulness and compassion training for staff experiencing pressure, emotional load and compassion fatigue. Developed by MindfulnessUK, the Compassionate and Mindful Resilience (CMR) programme teaches accessible, short, realistic practices which can be used in high-demand roles to reduce stress, vicarious trauma and burnout.\n\nDelivered to teams of up to 15: online or in person as 4 × 2-hour or 2 × 4-hour workshops, over 4–6 weeks.', stat: 'img/stat-95-professionals.png', statAlt: '95% of public service professionals surveyed said they or their team had shown signs of prolonged stress, exhaustion, vicarious trauma or burnout in the past year (professional survey, 122 respondents)' },
      { title: 'Compassion Based Reflective Practice', icon: 'logos/icon-teams-reflective-practice.svg', text: `A trauma-informed, facilitated space for teams to prioritise wellbeing — pausing to reflect, with compassion for themselves and others, on the human impact of their work. Designed to work with small or large groups as a single CPD session or an ongoing space to build resilience and strengthen wellbeing over time.\n\nAvailable for groups:\n• Online — nationally\n• In person — Norfolk only` },
      { title: 'Workshops: Stress, Burnout & Vicarious Trauma', icon: 'logos/icon-workshops-windingpath.svg', text: `A gentle, practical space for staff to learn about stress, burnout and vicarious trauma in a way that feels human and relatable. Engaging workshops shaped around your team's specific needs, built to fit naturally into CPD days, and grounded in real lived experience.\n\nAvailable for small or large groups.` },
    ],
    outroHeading: 'Ready to shift towards prevention for your team?',
    outro: `Not sure yet what that looks like? That's a good place to start. Tell us what's happening for your team and we'll talk it through together, with no pressure. If we're the right fit, we'll shape support around your team's time and your budget, online or in person.\n\nHow it works: a short conversation about what your team needs → a proposal built around your capacity and budget → flexible delivery, online or in person.`,
    outroCta: 'Start a conversation',
  },
  systems: {
    heading: 'For Systems & Providers',
    icon: 'logos/icon-system-scalable-prevention.svg',
    intro: `Prevention at scale, for your workforce and the people you serve.\n\nWe support providers and larger systems in two ways: staff wellbeing programmes for your workforce, and flexible, bespoke prevention programmes for patients and communities, shaped around what your organisation or neighbourhood needs.`,
    alignNote: 'Mapped to NICE guidance NG212, NG13 and QS147, the NHS Staff Standards (2026) and the HSE Management Standards.',
    items: [
      { title: 'CMR for Phased Return', icon: 'logos/icon-cmr.svg', text: 'An 8-hour, research-backed, trauma-informed mindfulness and compassion programme for staff on, or recently returned from, a phased return — designed to reduce the risk of burnout during one of the highest-risk periods for staff wellbeing. Developed by MindfulnessUK, the Compassionate & Mindful Resilience (CMR) programme teaches accessible, short, realistic practices that help staff rebuild confidence and regulate pressure as they re-enter demanding roles.\n\nAligned with NICE guidance for staff wellbeing and the new NHS staff standards, which require organisations to take a preventative, evidence-based approach to staff health and wellbeing.\n\nDelivered online as 4 × 2-hour workshops, over 4–6 weeks. Each cohort can accommodate up to 15 participants — a scalable way for large organisations to support staff consistently across teams, departments or sites.' },
      { title: 'Safe Leader Space', icon: 'logos/icon-safe-leader-space.svg', text: `Leaders often carry as much strain as the teams they support, with far less room to show it. When people look to you for confidence and direction, being open about the pressure can feel impossible.\n\nSafe Leader Space is a protected, trauma-informed space for leaders to put their own wellbeing first. Facilitated, themed sessions give you time to pause, reflect and be honest about the weight you carry, away from your own team. Along the way, you'll build compassion for yourself and learn to hold compassionate spaces for others.\n\nOnline, in blocks of at least five sessions.`, stat: 'img/stat-96-long-term-conditions.png', statAlt: '96% of people living with a long-term condition said they would use courses designed around their condition (public survey, 88 respondents)' },
      { title: 'Scalable Neighbourhood Prevention', icon: 'logos/icon-system-scalable-prevention.svg', text: `A flexible, non-clinical prevention offer, shaped around what your organisation and the people you serve need. This isn't a fixed package.\n\nIt can sit wherever prevention is needed: group courses for people on waiting lists, courses for specific long-term conditions, ongoing support in Neighbourhood Health Centres, or programmes commissioned by GP practices or social care for their patients and clients.\n\nWholeMind Resilience coordinates a network of accredited practitioners, so delivery can grow with your community's capacity, from a single course to an ongoing programme of practice groups.\n\nEvery version stays practical, trauma-informed and grounded in real life. It isn't therapy or a mental health service. It's preventative support for people who don't yet need specialist care.\n\nLet's talk through what this could look like for you.` },
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
        <div className="eyebrow">Programmes</div>
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
        <div className="eyebrow">Events &amp; Courses</div>
        <h1>Find and book your place on our upcoming public events</h1>
        <p>New courses, sessions and workshops are added regularly. If you can't find what you're looking for, or you'd like to book 1-2-1 support, <a href="#/contact" className="text-plum">get in touch</a> and we'll let you know when new dates are added.</p>
        <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>We take bookings and payments through Zeffy, which helps keep costs low for non-profits like us. At checkout, Zeffy will suggest an optional contribution to support their platform. It isn't required, and you can change it to £0 if you'd prefer.</p>
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

/* ---------- OUR IMPACT (sub-page of About Us; route stays #/projects) ----------
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
        <button className="back-link" onClick={() => go('about')}>&larr; Back to About Us</button>
        <div className="eyebrow-plum">ABOUT US &middot; OUR IMPACT</div>
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
    <SimplePage eyebrow="Get Involved" title="Support us to support communities">
      <p>If you or your organisation are passionate about supporting people in the community, or you have experienced your own difficulty and would like to help others, there are several ways you can get involved:</p>

      <p><b>Volunteering</b> — As WholeMind Resilience grows, volunteers will help us reach more people, more often. Whether it's an hour, a single task, or ongoing support at events, offering your time, expertise or skills — from community activities to fundraising — helps us reinvest more into the programmes that need it.</p>

      <p><b>Donations</b> — Your donations go straight into local community work, creating impact in people's lives. Every £15 raised funds a place on one of our mindfulness sessions for someone who couldn't otherwise afford it. Every £200 raised funds a full course for an individual, or a workshop for a community or volunteer group. Every contribution — whatever the size — directly enables sessions for individuals and voluntary organisations who would otherwise go without. Give once, or set up a regular donation to help us plan further ahead.</p>

      <div style={{ textAlign: 'center', margin: '28px 0' }}>
        <ZeffyEmbed zeffyUrl={ZEFFY_CAMPAIGNS.donate} label="Donate Now" />
      </div>

      <p><b>Corporate Sponsorship</b> — Corporate partners could help us reach more people across the region, at scale. Sponsorship doesn't have to mean funding — it can also mean rooms to deliver classes closer to communities, equipment, training places for staff and volunteers, or refreshments for events. In return, all corporate sponsors receive: logo placement on our website, a public thank-you mention in our blog, social media acknowledgement, and — for support over £1000 in value — an impact report showing exactly how your contribution strengthened wellbeing in local communities.</p>

      <p><b>Fundraising</b> — If you choose to fundraise for WholeMind Resilience, you're directly impacting the lives of people in the community who need support the most. Every pound raised helps us deliver accessible wellbeing programmes to individuals and groups facing disadvantage, pressure or limited access to services. We'd love to hear your ideas — a personal challenge, a whip-round at an event, or help putting a fundraiser together. WholeMind will thank our fundraisers publicly, and share how their contribution made a difference.</p>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <p><a href="#/contact" className="text-plum">Contact us to discuss supporting WholeMind Resilience</a></p>
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
    <SimplePage eyebrow="Course Participants" title={heading} icon={icon}>
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
  return <CourseContentWelcome heading="Welcome to the CMR course online portal" icon="logos/icon-cmr.svg" />;
}

function WholeMindCourseParticipants() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) {
    return <PasswordGate which="wholemind" onSuccess={() => setUnlocked(true)} label="WholeMind Course Participants" />;
  }
  return <CourseContentWelcome heading="Welcome to your WholeMind Mindfulness Course" icon="logos/logo-mark-only.svg" />;
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
