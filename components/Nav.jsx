// Nav.jsx — Top bar that becomes a floating pill on scroll
const Nav = ({ route, go, scrolled }) => {
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
          <NavLink to="home">Home</NavLink>
          <NavLink to="careers">Careers</NavLink>
        </div>
      </nav>
    </div>
  );
};

window.Nav = Nav;
