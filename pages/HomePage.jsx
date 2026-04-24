// HomePage.jsx — Follows reference screenshot layout
const HomeHero = () => {
  const t = useT();
  return (
    <section
      data-screen-label="01 Home Hero"
      className="bg-hero"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh + 10px)',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_065651_e4d80803-26f4-433d-bda4-1b745a53430e.mp4"
        autoPlay loop muted playsInline preload="auto"
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
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 220,
        background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '30vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 80%, #000 100%)',
        pointerEvents: 'none',
      }}/>

      <div className="bg-hero-inner" style={{
        position: 'relative',
        maxWidth: 1720, width: '100%', margin: '0 auto',
      }}>
        <h1 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(40px, 8.5vw, 132px)',
          lineHeight: 0.98,
          textTransform: 'none',
          letterSpacing: '-0.02em',
          margin: 0,
          maxWidth: '16ch',
          fontWeight: 400,
        }}>
          {t('home.hero.line1')}<br/>
          {t('home.hero.line2')}<br/>
          <span style={{ fontStyle: 'italic', fontFamily: "'Archivo Black', sans-serif" }}>{t('home.hero.line3')}</span>
        </h1>
      </div>
    </section>
  );
};

const HomeIntro = ({ go }) => {
  const t = useT();
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8';
    let hls;
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') === 'probably';
    const tryPlay = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (nativeHls) {
      video.src = src;
      video.addEventListener('loadedmetadata', tryPlay, { once: true });
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ lowLatencyMode: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, tryPlay);
    } else {
      video.src = src;
      video.addEventListener('loadedmetadata', tryPlay, { once: true });
    }
    video.addEventListener('canplay', tryPlay);
    return () => {
      video.removeEventListener('canplay', tryPlay);
      if (hls) hls.destroy();
    };
  }, []);
  return (
    <section
      data-screen-label="02 Home Intro"
      className="bg-section bg-section-tall"
      style={{
        position: 'relative', overflow: 'hidden', background: '#000', color: '#fff',
      }}
    >
      <video
        ref={videoRef} autoPlay loop muted playsInline preload="auto" aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.65)',
        }}
      />
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 420,
        background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 480,
        background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}/>

      <div className="bg-split-12" style={{
        position: 'relative', maxWidth: 1720, margin: '0 auto',
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
            color: '#999', marginBottom: 36,
          }}>
            {t('home.intro.eyebrow')}
          </div>
          <h2 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 'clamp(32px, 5vw, 76px)',
            lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
            maxWidth: '14ch', fontWeight: 400,
          }}>
            {t('home.intro.title.a')}<span style={{ fontStyle: 'italic' }}>{t('home.intro.title.em')}</span>{t('home.intro.title.b')}
          </h2>
        </div>
        <div>
          <div aria-hidden style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
            color: 'transparent', marginBottom: 36, userSelect: 'none',
          }}>&nbsp;</div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.6,
            color: '#999', margin: 0, maxWidth: '46ch',
          }}>
            {t('home.intro.body1')}
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 17, lineHeight: 1.6,
            color: '#999', margin: '24px 0 48px', maxWidth: '46ch',
          }}>
            {t('home.intro.body2')}
          </p>
          <Button variant="secondary" onClick={() => go('careers')}>{t('home.intro.cta')}</Button>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ s, i }) => {
  const [hover, setHover] = React.useState(false);
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '48px 36px 48px 0',
        borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
        paddingLeft: i > 0 ? 48 : 0,
        transformOrigin: i === 0 ? 'left center' : (i === 2 ? 'right center' : 'center center'),
        transform: hover ? 'scale(1.06)' : 'scale(1)',
        transition: `transform 480ms ${EASE}`,
        cursor: 'default',
      }}
    >
      <div style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 'clamp(56px, 7vw, 112px)',
        lineHeight: 1.0, letterSpacing: '-0.02em', color: '#fff', fontWeight: 400,
        display: 'flex', alignItems: 'baseline', gap: 10,
        transition: `color 320ms ${EASE}`,
      }}>
        {s.v}<span style={{ fontStyle: 'italic', fontSize: '0.55em', color: hover ? '#fff' : '#999', fontFamily: "'Archivo Black', sans-serif", transition: `color 320ms ${EASE}` }}>{s.unit}</span>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.5,
        color: hover ? '#cfcfcf' : '#999',
        margin: '24px 0 0', maxWidth: '32ch',
        transition: `color 320ms ${EASE}`,
      }}>
        {s.label}
      </p>
    </div>
  );
};

const HomeStats = () => {
  const t = useT();
  const stats = [
    { v: '10', unit: t('home.stats.1.unit'), label: t('home.stats.1.label') },
    { v: '>3', unit: t('home.stats.2.unit'), label: t('home.stats.2.label') },
    { v: '>3€', unit: t('home.stats.3.unit'), label: t('home.stats.3.label') },
  ];
  return (
    <section
      data-screen-label="03 Home Stats"
      className="bg-section bg-section-tall"
      style={{
        position: 'relative', overflow: 'hidden', background: '#000', color: '#fff',
      }}
    >
      <div style={{ position: 'relative', maxWidth: 1720, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 96, alignItems: 'start', marginBottom: 96 }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: '#999', marginBottom: 36,
            }}>
              {t('home.stats.eyebrow')}
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(30px, 4.2vw, 64px)',
              lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
              maxWidth: '17ch', fontWeight: 400,
            }}>
              {t('home.stats.title.a')}<span style={{ fontStyle: 'italic' }}>{t('home.stats.title.em')}</span>{t('home.stats.title.b')}
            </h2>
          </div>
        </div>

        <div className="bg-stats-grid">
          {stats.map((s, i) => <StatCard key={i} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
};

// Image placeholder tile — cinematic monochrome wash (no real imagery)
// Optionally takes a video URL to render an autoplaying muted loop instead of the static gradient.
const ImageTile = ({ tone = 'dark', label, video }) => {
  const videoRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  React.useEffect(() => {
    const v = videoRef.current;
    if (!video || !v) return;
    if (hover) {
      v.play().catch(() => {});
    } else {
      v.pause();
      try { v.currentTime = 0; } catch (e) {}
    }
  }, [hover, video]);
  const edgeFadeMask = 'radial-gradient(ellipse 78% 75% at 50% 50%, #000 38%, rgba(0,0,0,0.85) 62%, transparent 100%)';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden',
        background: 'transparent', cursor: video ? 'pointer' : 'default',
      }}
    >
      {video && (
        <video
          ref={videoRef} src={video} loop muted playsInline preload="metadata" aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            filter: 'grayscale(1) contrast(1.08) brightness(0.78)',
            transition: 'filter 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            transform: hover ? 'scale(1.03)' : 'scale(1)',
            maskImage: edgeFadeMask, WebkitMaskImage: edgeFadeMask,
          }}
        />
      )}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 3px)`,
        mixBlendMode: 'overlay', pointerEvents: 'none',
        maskImage: edgeFadeMask, WebkitMaskImage: edgeFadeMask,
      }}/>
    </div>
  );
};

const HomePillars = () => {
  const t = useT();
  const tiles = [
    { tone: 'cream', title: t('home.pillars.1.title'), body: t('home.pillars.1.body'), video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_184455_60ec9b18-54fb-4008-b11f-27be67433362.mp4' },
    { tone: 'deepgreen', title: t('home.pillars.2.title'), body: t('home.pillars.2.body'), video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_181905_512716c8-db65-4a32-a6c6-39915e457d5b.mp4' },
    { tone: 'steel', title: t('home.pillars.3.title'), body: t('home.pillars.3.body'), video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_181927_11722aca-d4b4-45bd-af2b-dd9184c37746.mp4' },
    { tone: 'silver', title: t('home.pillars.4.title'), body: t('home.pillars.4.body'), video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_181816_5d5e2a66-dd13-42cc-867d-0f256da0490e.mp4' },
  ];
  return (
    <section
      data-screen-label="04 Home Pillars"
      className="bg-section bg-section-tall"
      style={{ background: '#000', color: '#fff' }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div className="bg-split-12" style={{ marginBottom: 72 }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: '#999', marginBottom: 36,
            }}>
              {t('home.pillars.eyebrow')}
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(36px, 5vw, 76px)',
              lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
              maxWidth: '20ch', fontWeight: 400,
            }}>
              {t('home.pillars.title.a')}<span style={{ fontStyle: 'italic' }}>{t('home.pillars.title.em')}</span>{t('home.pillars.title.b')}
            </h2>
          </div>
          <p className="bg-hide-mobile" style={{
            fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.6,
            color: '#999', margin: 0, maxWidth: '46ch',
          }}>{"\n"}</p>
        </div>

        <div className="bg-tiles-2">
          {tiles.map((tile, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const padTop = row === 0 ? 48 : 56;
            const padSide = 48;
            const tileOutset = {
              marginTop: -padTop,
              marginRight: col === 0 ? -padSide : 0,
              marginLeft: col === 1 ? -padSide : 0,
              marginBottom: 0,
            };
            return (
              <article
                key={i}
                style={{
                  padding: row === 0
                    ? (col === 0 ? `${padTop}px ${padSide}px 56px 0` : `${padTop}px 0 56px ${padSide}px`)
                    : (col === 0 ? `${padTop}px ${padSide}px 0 0` : `${padTop}px 0 0 ${padSide}px`),
                  borderRight: col === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  borderBottom: row === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}
              >
                <div className="bg-tile-outset" style={tileOutset}>
                  <ImageTile tone={tile.tone} video={tile.video}/>
                </div>
                <div style={{
                  fontFamily: "'Archivo Black', sans-serif", fontSize: 28,
                  letterSpacing: '-0.005em', color: '#fff', fontWeight: 400,
                  margin: '32px 0 18px', lineHeight: 1.08,
                }}>
                  {tile.title}
                </div>
                <div aria-hidden style={{
                  width: '100%', maxWidth: 520, height: 1,
                  background: 'rgba(255,255,255,0.12)', margin: '0 0 20px',
                }}/>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.55,
                  color: '#999', margin: 0, maxWidth: '52ch',
                }}>
                  {tile.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HomeClosing = ({ go }) => {
  const t = useT();
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8';
    let hls;
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') === 'probably';
    const tryPlay = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (nativeHls) {
      video.src = src;
      video.addEventListener('loadedmetadata', tryPlay, { once: true });
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ lowLatencyMode: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, tryPlay);
    } else {
      video.src = src;
      video.addEventListener('canplay', tryPlay, { once: true });
    }
    return () => {
      video.removeEventListener('canplay', tryPlay);
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <section
      data-screen-label="06 Home Closing"
      className="bg-hero"
      style={{
        position: 'relative', minHeight: '92vh', overflow: 'hidden',
        background: '#000', color: '#fff',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <video
        ref={videoRef} autoPlay loop muted playsInline preload="auto" aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.65)',
        }}
      />
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 220,
        background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}/>

      <div className="bg-split-13" style={{
        position: 'relative', padding: '0 0 160px',
        maxWidth: 1720, width: '100%', margin: '0 auto',
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, letterSpacing: '1.4px', textTransform: 'uppercase',
            color: '#4a4a4a', marginBottom: 36,
          }}>
            {t('home.closing.eyebrow')}
          </div>
          <h2 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 'clamp(32px, 5vw, 88px)',
            lineHeight: 1.02, letterSpacing: '-0.015em', margin: 0,
            maxWidth: '16ch', fontWeight: 400, whiteSpace: 'pre-line',
          }}>
            {t('home.closing.title.a')}<span style={{ fontStyle: 'italic' }}>{t('home.closing.title.em')}</span>{t('home.closing.title.b')}
          </h2>
        </div>
        <div className="bg-align-right-desktop" style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 6 }}>
          <Button onClick={() => go('careers')}>{t('home.closing.cta')}</Button>
        </div>
      </div>
    </section>
  );
};

const HomePage = ({ go }) => {
  return (
    <>
      <HomeHero/>
      <HomeIntro go={go}/>
      <HomeStats/>
      <HomePillars/>
      <HomeClosing go={go}/>
    </>
  );
};

window.HomePage = HomePage;
