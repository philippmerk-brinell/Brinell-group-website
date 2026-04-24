// Nav.jsx — Top bar that becomes a floating pill on scroll
const Nav = ({ route, go, scrolled }) => {
  const t = useT();
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => { setMobileOpen(false); }, [route]);
  // Lock body scroll while open
  React.useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  const linkBase = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'transparent',
    border: 0,
    padding: 0,
    transition: 'opacity 250ms cubic-bezier(0.4,0,0.2,1)',
  };

  const NavLink = ({ to, children, onClick }) => {
    const active = route === to;
    const [hover, setHover] = React.useState(false);
    return (
      <a
        onClick={(e) => { e.preventDefault(); if (onClick) onClick(); go(to); }}
        href={`#/${to}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...linkBase,
          opacity: active ? 1 : (hover ? 0.75 : 0.85),
          position: 'relative',
          paddingBottom: 4,
          borderBottom: active ? '1px solid #fff' : '1px solid transparent',
        }}
      >
        {children}
      </a>
    );
  };

  // Language dropdown — compact, monospace, opens on click, dismisses on outside click / Esc.
  const LangSwitch = ({ variant = 'inline' }) => {
    const [open, setOpen] = React.useState(false);
    const [hover, setHover] = React.useState(false);
    const wrapRef = React.useRef(null);

    React.useEffect(() => {
      if (!open) return;
      const onDocClick = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
      };
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    const langs = [
      { code: 'en', label: 'EN' },
      { code: 'de', label: 'DE' },
    ];
    const currentLabel = langs.find(l => l.code === lang)?.label || 'EN';

    return (
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t('nav.lang.label')}
          onClick={() => setOpen(o => !o)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            ...linkBase,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.22)',
            opacity: hover ? 1 : 0.9,
            transition: 'opacity 250ms, border-color 250ms, background 250ms',
            background: open ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}
        >
          <span>{currentLabel}</span>
          <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true" style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
          }}>
            <path d="M1 1l3.5 3.5L8 1" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <ul
            role="listbox"
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              minWidth: 96,
              margin: 0,
              padding: 6,
              listStyle: 'none',
              background: 'rgba(18,18,18,0.92)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              boxShadow: '0 18px 48px rgba(0,0,0,0.5)',
              zIndex: 60,
            }}
          >
            {langs.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    style={{
                      ...linkBase,
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 6,
                      opacity: active ? 1 : 0.7,
                      background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {l.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  // Outer wrapper: always fixed full-width, flush at the top. No floating gutters.
  const outerStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    pointerEvents: 'none',
  };

  const innerStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    background: (scrolled || mobileOpen) ? 'rgba(20,20,20,0.55)' : 'transparent',
    borderBottom: (scrolled || mobileOpen) ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
    boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.35)' : 'none',
    backdropFilter: (scrolled || mobileOpen) ? 'blur(20px) saturate(160%)' : 'none',
    WebkitBackdropFilter: (scrolled || mobileOpen) ? 'blur(20px) saturate(160%)' : 'none',
    pointerEvents: 'auto',
    transition: [
      `background 350ms ${EASE}`,
      `border-color 350ms ${EASE}`,
      `box-shadow 350ms ${EASE}`,
      `backdrop-filter 350ms ${EASE}`,
    ].join(', '),
  };

  // Hamburger icon (morphs into X when open)
  const Hamburger = () => (
    <button
      type="button"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen(o => !o)}
      className="bg-nav-hamburger"
      style={{
        width: 44, height: 44, padding: 10,
        background: 'transparent', border: 0, cursor: 'pointer',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      <span aria-hidden="true" style={{
        position: 'relative', display: 'block', width: 22, height: 14,
      }}>
        <span style={{
          position: 'absolute', left: 0, right: 0, height: 1.5, background: '#fff',
          top: mobileOpen ? 6 : 0,
          transform: mobileOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1), top 260ms cubic-bezier(0.4,0,0.2,1), opacity 200ms',
        }}/>
        <span style={{
          position: 'absolute', left: 0, right: 0, top: 6, height: 1.5, background: '#fff',
          opacity: mobileOpen ? 0 : 1,
          transition: 'opacity 160ms',
        }}/>
        <span style={{
          position: 'absolute', left: 0, right: 0, height: 1.5, background: '#fff',
          top: mobileOpen ? 6 : 13,
          transform: mobileOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1), top 260ms cubic-bezier(0.4,0,0.2,1)',
        }}/>
      </span>
    </button>
  );

  return (
    <div style={outerStyle}>
      <nav style={innerStyle} className="bg-nav-inner">
        <a
          onClick={(e) => { e.preventDefault(); go('home'); }}
          href="#/home"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src="assets/brinell-wordmark-white.png"
            alt="Brinell Group"
            className="bg-nav-logo"
            style={{ objectFit: 'contain' }}
          />
        </a>
        <div/>
        <div className="bg-nav-desktop">
          <NavLink to="home">{t('nav.home')}</NavLink>
          <NavLink to="careers">{t('nav.careers')}</NavLink>
          <LangSwitch/>
        </div>
        <Hamburger/>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed', inset: 0, top: 0,
          background: 'rgba(8,8,8,0.96)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? 'visible' : 'hidden',
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 320ms ease, visibility 320ms',
          display: 'flex', flexDirection: 'column',
          paddingTop: 96, paddingLeft: 28, paddingRight: 28, paddingBottom: 48,
          zIndex: 49,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <a
            href="#/home"
            onClick={(e) => { e.preventDefault(); setMobileOpen(false); go('home'); }}
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 44, lineHeight: 1.0, letterSpacing: '-0.02em',
              color: '#fff', textDecoration: 'none', fontWeight: 400,
              opacity: route === 'home' ? 1 : 0.78,
            }}
          >{t('nav.home')}</a>
          <a
            href="#/careers"
            onClick={(e) => { e.preventDefault(); setMobileOpen(false); go('careers'); }}
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 44, lineHeight: 1.0, letterSpacing: '-0.02em',
              color: '#fff', textDecoration: 'none', fontWeight: 400,
              opacity: route === 'careers' ? 1 : 0.78,
            }}
          >{t('nav.careers')}</a>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase',
            color: '#666',
          }}>{t('nav.lang.label')}</div>
          <LangSwitch/>
        </div>
      </div>
    </div>
  );
};

window.Nav = Nav;
