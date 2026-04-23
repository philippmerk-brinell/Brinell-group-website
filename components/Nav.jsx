// Nav.jsx — Top bar that becomes a floating pill on scroll
const Nav = ({ route, go, scrolled }) => {
  const t = useT();
  const { lang, setLang } = useLang();

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

  const NavLink = ({ to, children }) => {
    const active = route === to;
    const [hover, setHover] = React.useState(false);
    return (
      <a
        onClick={(e) => { e.preventDefault(); go(to); }}
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
  const LangSwitch = () => {
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

  // Inner bar: full-width strip. On scroll, it adopts the glass look in place
  // (no pill, no inset, no max-width) — just a bg + blur fade-in.
  const innerStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    padding: '14px 120px 14px 48px',
    background: scrolled ? 'rgba(20,20,20,0.55)' : 'transparent',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
    boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.35)' : 'none',
    backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
    pointerEvents: 'auto',
    transition: [
      `background 350ms ${EASE}`,
      `border-color 350ms ${EASE}`,
      `box-shadow 350ms ${EASE}`,
      `backdrop-filter 350ms ${EASE}`,
    ].join(', '),
  };

  return (
    <div style={outerStyle}>
      <nav style={innerStyle}>
        <a
          onClick={(e) => { e.preventDefault(); go('home'); }}
          href="#/home"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src="assets/brinell-wordmark-white.png"
            alt="Brinell Group"
            style={{
              height: 60,
              objectFit: 'contain',
            }}
          />
        </a>
        <div/>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', justifyContent: 'flex-end' }}>
          <NavLink to="home">{t('nav.home')}</NavLink>
          <NavLink to="careers">{t('nav.careers')}</NavLink>
          <LangSwitch/>
        </div>
      </nav>
    </div>
  );
};

window.Nav = Nav;
