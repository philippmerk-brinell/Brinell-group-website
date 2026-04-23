// Footer.jsx — Shared across all pages
const Footer = ({ go }) => {
  const t = useT();
  const colTitle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 18,
  };
  const linkStyle = {
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
    textAlign: 'left',
    transition: 'opacity 250ms',
  };
  const NavBtn = ({ to, children }) => (
    <button
      onClick={() => go(to)}
      onMouseOver={e => e.currentTarget.style.opacity = '0.6'}
      onMouseOut={e => e.currentTarget.style.opacity = '1'}
      style={linkStyle}
    >
      {children}
    </button>
  );

  return (
    <footer
      id="contact"
      data-screen-label="Footer"
      style={{
        background: '#000',
        color: '#fff',
        padding: '140px 48px 36px',
        borderTop: '1px solid #1a1a1a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr',
          gap: 48,
          paddingBottom: 64,
          borderBottom: '1px solid #1a1a1a',
        }}>
          <div>
            <img src="assets/brinell-icon-white.png" alt="" style={{ height: 40, marginBottom: 24 }}/>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#999',
              lineHeight: 1.7,
            }}>
              Brinell Group GmbH & Co KG<br/>
              Karlstraße 47 · 80333 Munich<br/>
            </div>
          </div>
          <div>
            <div style={colTitle}>{t('footer.col.company')}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><NavBtn to="home">{t('nav.home')}</NavBtn></li>
              <li><NavBtn to="careers">{t('nav.careers')}</NavBtn></li>
            </ul>
          </div>
          <div>
            <div style={colTitle}>{t('footer.col.contact')}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '0.6px', color: '#fff', lineHeight: 1.7 }}>
              contact (at) brinell-group.com<br/>
            </div>
          </div>
        </div>

        {/* Monumental wordmark — infinite marquee, right→left */}
        <div style={{
          margin: '64px 0 48px',
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
        }}>
          <style>{`
            @keyframes footerWordmarkMarquee {
              0%   { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
          `}</style>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            animation: 'footerWordmarkMarquee 38s linear infinite',
            willChange: 'transform',
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(80px, 16vw, 260px)',
                  lineHeight: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  color: 'transparent',
                  WebkitTextStroke: '1px #e0e0e0',
                  userSelect: 'none',
                }}>
                  Brinell Group
                </span>
                <img
                  src="assets/brinell-icon-white.png"
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  style={{
                    height: 'clamp(24px, 3.2vw, 52px)',
                    width: 'auto',
                    margin: '0 clamp(36px, 4.5vw, 96px)',
                    opacity: 0.55,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    flexShrink: 0,
                  }}
                />
              </span>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          borderTop: '1px solid #1a1a1a',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: '#999',
        }}>
          <div>{t('footer.copyright')}</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <button
              onClick={() => go('imprint')}
              style={{
                color: '#999',
                textDecoration: 'none',
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                letterSpacing: 'inherit',
                textTransform: 'inherit',
              }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = '#999'}
            >{t('footer.imprint')}</button>
            <a href="#" style={{ color: '#999', textDecoration: 'none' }}>{t('footer.linkedin')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

window.Footer = Footer;
