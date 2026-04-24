// CareersPage.jsx
const CareersHero = () => {
  const t = useT();
  return (
    <section
      data-screen-label="01 Careers Hero"
      className="r-sec-h"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh + 10px)',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 48px',
      }}
    >
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_065651_e4d80803-26f4-433d-bda4-1b745a53430e.mp4"
        autoPlay loop muted playsInline preload="auto" aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.8)',
        }}
      />
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.45) 100%)',
      }}/>
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '30vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 80%, #000 100%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        position: 'relative', padding: '0 0 96px',
        maxWidth: 1720, width: '100%', margin: '0 auto', marginTop: 160,
      }}>
        <h1 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(45px, 6.4vw, 106px)',
          lineHeight: 0.98, letterSpacing: '-0.02em', margin: 0,
          maxWidth: '14ch', fontWeight: 400,
        }}>
          {t('careers.hero.line1')}<br/>
          <span style={{ fontStyle: 'italic' }}>{t('careers.hero.line2')}</span>
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.5,
          color: '#cfcfcf', margin: '40px 0 0', maxWidth: '52ch',
        }}>
          {t('careers.hero.sub')}
        </p>
      </div>
    </section>
  );
};

const PrincipleCard = ({ num, index, label, body, total }) => {
  const ref = React.useRef(null);
  const videoRef = React.useRef(null);
  const hlsRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [videoReady, setVideoReady] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ensureVideo = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || hlsRef.current || video.src || videoReady) return;
    const src = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8';
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') === 'probably' ||
                      video.canPlayType('application/vnd.apple.mpegurl') === 'maybe';
    if (nativeHls) {
      video.src = src;
      setVideoReady(true);
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => setVideoReady(true));
      hlsRef.current = hls;
    } else {
      video.src = src;
      setVideoReady(true);
    }
  }, [videoReady]);

  React.useEffect(() => () => {
    if (hlsRef.current) { try { hlsRef.current.destroy(); } catch(e){} hlsRef.current = null; }
  }, []);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hover) {
      ensureVideo();
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [hover, ensureVideo]);

  const col = index % 2;
  const row = Math.floor(index / 2);
  const isLastRow = row === Math.floor((total - 1) / 2);

  return (
    <article
      ref={ref}
      className="r-principle-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '44px 40px 48px', minHeight: 260,
        borderRight: col === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
        borderBottom: !isLastRow ? '1px solid rgba(255,255,255,0.08)' : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
    >
      <video
        ref={videoRef} muted loop playsInline preload="none" aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          opacity: hover && videoReady ? 0.55 : 0,
          transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
          filter: 'grayscale(0.3) contrast(1.05) brightness(0.85)',
        }}
      />
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)',
        opacity: hover && videoReady ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }}/>

      <div aria-hidden style={{
        position: 'absolute', top: 28, right: 32,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 'clamp(72px, 8vw, 128px)',
        lineHeight: 0.9, letterSpacing: '-0.04em', fontWeight: 400, color: 'transparent',
        WebkitTextStroke: hover ? '1px rgba(255,255,255,0.55)' : '1px rgba(255,255,255,0.14)',
        pointerEvents: 'none', userSelect: 'none',
        transition: '-webkit-text-stroke 400ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      }}>{num}</div>

      <h3 style={{
        position: 'relative',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 'clamp(20px, 1.6vw, 26px)',
        lineHeight: 1.15, letterSpacing: '-0.005em', margin: 0,
        marginTop: 28, marginBottom: 20, color: '#fff', fontWeight: 400, maxWidth: '18ch',
      }}>
        {label}
      </h3>

      <p style={{
        position: 'relative',
        fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.65,
        color: hover ? '#d8d8d8' : '#9a9a9a',
        margin: 0, maxWidth: '52ch',
        transition: 'color 400ms ease',
      }}>
        {body}
      </p>
    </article>
  );
};

const CareersWhy = () => {
  const t = useT();
  const items = [
    { label: t('careers.principles.1.title'), body: t('careers.principles.1.body') },
    { label: t('careers.principles.2.title'), body: t('careers.principles.2.body') },
    { label: t('careers.principles.3.title'), body: t('careers.principles.3.body') },
    { label: t('careers.principles.4.title'), body: t('careers.principles.4.body') },
    { label: t('careers.principles.5.title'), body: t('careers.principles.5.body') },
    { label: t('careers.principles.6.title'), body: t('careers.principles.6.body') },
    { label: t('careers.principles.7.title'), body: t('careers.principles.7.body') },
    { label: t('careers.principles.8.title'), body: t('careers.principles.8.body') },
  ];
  return (
    <section
      data-screen-label="02 Principles"
      className="r-sec-h r-sec-v-lg"
      style={{ background: '#000', color: '#fff', padding: '140px 48px' }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div className="r-grid-split" style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96,
          alignItems: 'end', marginBottom: 80,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: '#999', marginBottom: 36,
            }}>
              {t('careers.principles.eyebrow')}
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(40px, 5vw, 76px)',
              lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
              maxWidth: '16ch', fontWeight: 400,
            }}>
              {t('careers.principles.title.a')}<br/>{t('careers.principles.title.b')}<span style={{ fontStyle: 'italic' }}>{t('careers.principles.title.em')}</span>{t('careers.principles.title.c')}
            </h2>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.6,
            color: '#999', margin: 0, maxWidth: '46ch',
          }}>
            {t('careers.principles.intro')}
          </p>
        </div>

        <div className="r-grid-2" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {items.map((it, i) => {
            const num = String(i + 1);
            return <PrincipleCard key={num} num={num} index={i} label={it.label} body={it.body} total={items.length}/>;
          })}
        </div>
      </div>
    </section>
  );
};

const CareersRoles = () => {
  const t = useT();
  const roles = [
    { title: t('careers.roles.1'), id: 'R-01', href: 'https://scythe-pint-825.notion.site/Head-of-Energy-Investments-347a781a4c68804aa6b9cc4a89c08fc9?pvs=74' },
    { title: t('careers.roles.2'), id: 'R-02', href: 'https://scythe-pint-825.notion.site/Head-of-Energy-Project-Development-347a781a4c68800c8cacf1a40a209b6a' },
    { title: t('careers.roles.3'), id: 'R-03', href: 'https://scythe-pint-825.notion.site/Business-Development-Manager-Grid-347a781a4c6880c2992cc6d623276e5f?pvs=73' },
    { title: t('careers.roles.4'), id: 'R-04', href: 'https://scythe-pint-825.notion.site/Founder-Associate-Intern-347a781a4c688080acddf67b69d70a12?pvs=73' },
    { title: t('careers.roles.5'), id: 'R-05', href: 'https://scythe-pint-825.notion.site/executive-assistant?pvs=73' },
  ];

  return (
    <section
      data-screen-label="03 Open Roles"
      className="r-sec-h r-sec-v-lg"
      style={{
        background: '#000', color: '#fff', padding: '140px 48px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr', gap: 96,
          alignItems: 'end', marginBottom: 64,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: '#999', marginBottom: 36,
            }}>
              {t('careers.roles.eyebrow')}
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(40px, 5vw, 76px)',
              lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
              maxWidth: '14ch', fontWeight: 400,
            }}>
              {t('careers.roles.title.a')}<br/>{t('careers.roles.title.b')}<span style={{ fontStyle: 'italic' }}>{t('careers.roles.title.em')}</span>{t('careers.roles.title.c')}
            </h2>
          </div>
        </div>

        <div>
          {roles.map((r, i) => (
            <a
              key={r.id}
              href={r.href || '#'}
              target={r.href ? '_blank' : undefined}
              rel={r.href ? 'noopener noreferrer' : undefined}
              className="r-roles-row"
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                alignItems: 'center', gap: 36, padding: '28px 0',
                borderTop: '1px solid #1a1a1a',
                borderBottom: i === roles.length - 1 ? '1px solid #1a1a1a' : 'none',
                color: '#fff', textDecoration: 'none',
                transition: 'padding-left 250ms',
              }}
              onMouseOver={e => { e.currentTarget.style.paddingLeft = '16px'; }}
              onMouseOut={e => { e.currentTarget.style.paddingLeft = '0'; }}
            >
              <div style={{
                fontFamily: "'Archivo Black', sans-serif", fontSize: 22,
                letterSpacing: '-0.005em', lineHeight: 1.1, color: '#fff', fontWeight: 400,
              }}>{r.title}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#fff',
              }}>{t('careers.roles.details')}</div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14,
            color: '#999', maxWidth: '42ch', textAlign: 'right',
          }}>
            {t('careers.roles.footnote')}
          </div>
        </div>
      </div>
    </section>
  );
};

const CareersProcess = () => {
  const t = useT();
  const steps = [
    { title: t('careers.process.1.title'), body: t('careers.process.1.body') },
    { title: t('careers.process.2.title'), body: t('careers.process.2.body') },
    { title: t('careers.process.3.title'), body: t('careers.process.3.body') },
    { title: t('careers.process.4.title'), body: t('careers.process.4.body') },
  ];
  return (
    <section
      data-screen-label="04 Process"
      className="r-sec-h r-sec-v-lg"
      style={{
        background: '#000', color: '#fff', padding: '140px 48px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div className="r-grid-split" style={{
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96,
          alignItems: 'end', marginBottom: 80,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: '#999', marginBottom: 36,
            }}>
              {t('careers.process.eyebrow')}
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(40px, 5vw, 76px)',
              lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
              maxWidth: '16ch', fontWeight: 400,
            }}>
              {t('careers.process.title.a')}<br/><span style={{ fontStyle: 'italic' }}>{t('careers.process.title.em')}</span>{t('careers.process.title.b')}
            </h2>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.6,
            color: '#999', margin: 0, maxWidth: '46ch',
          }}>
            {t('careers.process.intro')}
          </p>
        </div>

        <div className="r-grid-2" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {steps.map((s, i) => {
            const num = String(i + 1);
            return <PrincipleCard key={num} num={num} index={i} label={s.title} body={s.body} total={steps.length}/>;
          })}
        </div>
      </div>
    </section>
  );
};

const CareersApply = () => {
  const t = useT();
  return (
    <section
      data-screen-label="05 Apply"
      className="r-apply"
      style={{
        position: 'relative', overflow: 'hidden',
        background: '#000', color: '#fff', padding: '160px 48px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(60% 80% at 85% 20%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(135deg, #0a0a0a 0%, #000 100%)',
      }}/>

      <div style={{
        position: 'relative', maxWidth: 1100, margin: '0 auto', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
          color: '#999', marginBottom: 36,
        }}>
          {t('careers.apply.eyebrow')}
        </div>
        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(40px, 5vw, 76px)',
          lineHeight: 1.02, letterSpacing: '-0.015em', margin: '0 auto',
          maxWidth: '18ch', fontWeight: 400,
        }}>
          {t('careers.apply.title.a')}<span style={{ fontStyle: 'italic' }}>{t('careers.apply.title.em')}</span>{t('careers.apply.title.b')}
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.6,
          color: '#bfbfbf', margin: '36px auto 0', maxWidth: '52ch',
        }}>
          {t('careers.apply.body')}
        </p>
        <a
          href="mailto:talent@brinell-group.com"
          style={{
            display: 'inline-block', marginTop: 56, padding: '20px 32px',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            borderBottom: '1px solid rgba(255,255,255,0.14)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14, letterSpacing: '1.6px', textTransform: 'uppercase',
            color: '#fff', textDecoration: 'none',
            transition: 'border-color 250ms, letter-spacing 250ms',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.letterSpacing = '2.4px'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.letterSpacing = '1.6px'; }}
        >
          {t('careers.apply.cta')}
        </a>
      </div>
    </section>
  );
};

const CareersPage = ({ go }) => {
  return (
    <>
      <CareersHero/>
      <CareersWhy/>
      <CareersRoles/>
      <CareersProcess/>
      <CareersApply/>
    </>
  );
};

window.CareersPage = CareersPage;
