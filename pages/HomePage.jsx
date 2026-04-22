// HomePage.jsx — Follows reference screenshot layout
const HomeHero = () => {
  return (
    <section
      data-screen-label="01 Home Hero"
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
      {/* Background video — loops muted, full-bleed */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_065651_e4d80803-26f4-433d-bda4-1b745a53430e.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.8)',
        }}
      />

      {/* Legibility vignette — bottom-up scrim keeps type readable over video */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.45) 100%)',
      }}/>
      {/* Bottom edge fade — bleed to pure #000 so the hero morphs into the black Intro section without a visible cut */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 220,
        background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* Morph scrim — pure #000 at the very bottom so the hero dissolves into the next section */}
      <div aria-hidden style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: '30vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 80%, #000 100%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        position: 'relative',
        padding: '0 0 96px',
        maxWidth: 1720,
        width: '100%',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(56px, 8.5vw, 132px)',
          lineHeight: 0.98,
          textTransform: 'none',
          letterSpacing: '-0.02em',
          margin: 0,
          maxWidth: '16ch',
          fontWeight: 400,
        }}>
          Entrepreneurship<br/>
          to shape Europe's<br/>
          <span style={{ fontStyle: 'italic', fontFamily: "'Archivo Black', sans-serif" }}>Future.</span>
        </h1>
        <div style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        </div>
      </div>
    </section>
  );
};

const HomeIntro = ({ go }) => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8';
    let hls;
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') === 'probably';
    const tryPlay = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
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
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        padding: '220px 48px',
      }}
    >
      {/* Background video — HLS, full-bleed, muted loop (shared with Track Record) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.65)',
        }}
      />

      {/* Legibility scrim */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }}/>
      {/* Edge fades — bleed to pure #000 so the section seams against the neighbouring black sections without a visible cut */}
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

      <div style={{
        position: 'relative',
        maxWidth: 1720,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 96,
        alignItems: 'start',
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: 36,
          }}>
            · 01 Our Mandate
          </div>
          <h2 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 'clamp(40px, 5vw, 76px)',
            lineHeight: 1.02,
            letterSpacing: '-0.015em',
            margin: 0,
            maxWidth: '14ch',
            fontWeight: 400,
          }}>
            We build for the <span style={{ fontStyle: 'italic' }}>next generation</span>, investing our own capital
          </h2>
        </div>
        <div>
          <div aria-hidden style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: 'transparent',
            marginBottom: 36,
            userSelect: 'none',
          }}>
            &nbsp;
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            lineHeight: 1.6,
            color: '#999',
            margin: 0,
            maxWidth: '46ch',
          }}>
            We operate as an entrepreneur-led platform that founds, acquires, and transforms businesses across Europe — driven by the belief that entrepreneurship is the most powerful force to create prosperity and solve real-world problems.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            lineHeight: 1.6,
            color: '#999',
            margin: '24px 0 48px',
            maxWidth: '46ch',
          }}>
            We are not a traditional fund. We invest our own capital. This allows us to build companies over decades — not quarters.
          </p>
          <Button variant="secondary" onClick={() => go('careers')}>Careers</Button>
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
        lineHeight: 1.0,
        letterSpacing: '-0.02em',
        color: '#fff',
        fontWeight: 400,
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        transition: `color 320ms ${EASE}`,
      }}>
        {s.v}<span style={{ fontStyle: 'italic', fontSize: '0.55em', color: hover ? '#fff' : '#999', fontFamily: "'Archivo Black', sans-serif", transition: `color 320ms ${EASE}` }}>{s.unit}</span>
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        lineHeight: 1.5,
        color: hover ? '#cfcfcf' : '#999',
        margin: '24px 0 0',
        maxWidth: '32ch',
        transition: `color 320ms ${EASE}`,
      }}>
        {s.label}
      </p>
    </div>
  );
};

const HomeStats = () => {
  const stats = [
    { v: '10', unit: 'yr', label: 'The founding partners have been starting and scaling ventures for a decade.' },
    { v: '>3', unit: 'gw', label: 'Infrastructure developments in Europe across energy and digital infrastructure.' },
    { v: '>3€', unit: 'bn', label: 'The team has initiated billions in infrastructure investments across Europe.' },
  ];
  return (
    <section
      data-screen-label="03 Home Stats"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        padding: '220px 48px',
      }}
    >
      <div style={{ position: 'relative', maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 96,
          alignItems: 'start',
          marginBottom: 96,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: 36,
            }}>
              · 02 Track Record
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(36px, 4.2vw, 64px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              margin: 0,
              maxWidth: '17ch',
              fontWeight: 400,
            }}>
              A track record in building <span style={{ fontStyle: 'italic' }}>infrastructure</span> companies.
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
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

  // Hover-driven playback: play on mouseEnter, pause + reset on mouseLeave.
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
  const variants = {
    cream: {
      background: 'linear-gradient(135deg, #e6e1d4 0%, #d9d2c1 60%, #cfc7b4 100%)',
      texture: 'radial-gradient(120% 90% at 20% 10%, rgba(0,0,0,0.6), transparent 60%)',
    },
    deepgreen: {
      background: 'linear-gradient(160deg, #0e1f1b 0%, #071311 50%, #030807 100%)',
      texture: 'radial-gradient(90% 70% at 85% 15%, rgba(120,180,160,0.18), transparent 60%)',
    },
    steel: {
      background: 'linear-gradient(180deg, #2d2f31 0%, #1c1e20 50%, #0e0f10 100%)',
      texture: 'radial-gradient(80% 60% at 30% 80%, rgba(0,0,0,0.12), transparent 60%)',
    },
    silver: {
      background: 'linear-gradient(180deg, #d5d3cc 0%, #bfbdb5 50%, #9b988f 100%)',
      texture: 'radial-gradient(100% 80% at 70% 20%, rgba(0,0,0,0.5), transparent 60%)',
    },
  };
  const v = variants[tone] || variants.steel;
  const edgeFadeMask = 'radial-gradient(ellipse 78% 75% at 50% 50%, #000 38%, rgba(0,0,0,0.85) 62%, transparent 100%)';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        background: 'transparent',
        cursor: video ? 'pointer' : 'default',
      }}
    >
      {video && (
        <video
          ref={videoRef}
          src={video}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Unified monochrome grade — pulls all four clips into the same visual register.
            filter: 'grayscale(1) contrast(1.08) brightness(0.78)',
            transition: 'filter 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
            transform: hover ? 'scale(1.03)' : 'scale(1)',
            maskImage: edgeFadeMask,
            WebkitMaskImage: edgeFadeMask,
          }}
        />
      )}
      {/* subtle grain — masked to match so it fades out at the edges together with the video */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 3px)`,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        maskImage: edgeFadeMask,
        WebkitMaskImage: edgeFadeMask,
      }}/>
    </div>
  );
};

const HomePillars = () => {
  const tiles = [
    { tone: 'cream', tag: 'Build · 01', title: 'Digital Infrastructure', body: 'Build and invest in next-gen digital infrastructure that strengthens Europe´s connectivity to foster digital resilience and growth.', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_184455_60ec9b18-54fb-4008-b11f-27be67433362.mp4' },
    { tone: 'deepgreen', tag: 'Energy · 02', title: 'Energy Infrastructure', body: 'Build and transform energy infrastructure for a sovereign and robust energy supply to power economic growth.', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_181905_512716c8-db65-4a32-a6c6-39915e457d5b.mp4' },
    { tone: 'steel', tag: 'Mittelstand · 03', title: 'Properties and Land', body: 'Focus on properties and land assets, creating long-term value, focusing on stability and strategic spaces.', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_181927_11722aca-d4b4-45bd-af2b-dd9184c37746.mp4' },
    { tone: 'silver', tag: 'Growth · 04', title: 'Succession & Buyouts', body: 'Take on businesses with succession needs and untapped potential, focusing on sustainable growth through entrepreneurial reinvention.', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_181816_5d5e2a66-dd13-42cc-867d-0f256da0490e.mp4' },
  ];
  return (
    <section
      data-screen-label="04 Home Pillars"
      style={{
        background: '#000',
        color: '#fff',
        padding: '220px 48px',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 96,
          alignItems: 'end',
          marginBottom: 72,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: 36,
            }}>
              · 03 Areas of Focus
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: '76px',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              margin: 0,
              maxWidth: '20ch',
              fontWeight: 400,
            }}>
              Entrepreneurship for a <span style={{ fontStyle: 'italic' }}>prosperous</span> future.
            </h2>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: '#999',
            margin: 0,
            maxWidth: '46ch',
          }}>
            {"\n"}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 0,
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
          {tiles.map((t, i) => {
            const col = i % 2;         // 0 = left, 1 = right
            const row = Math.floor(i / 2); // 0 = top, 1 = bottom
            const padTop = row === 0 ? 48 : 56;
            const padSide = 48;
            // Outset the video so it sits flush against the surrounding hairlines:
            //   top edge (container borderTop or inter-row hairline),
            //   and the vertical hairline between columns.
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
                <div style={tileOutset}>
                  <ImageTile tone={t.tone} label={t.tag} video={t.video}/>
                </div>

                <div style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: 28,
                  letterSpacing: '-0.005em',
                  color: '#fff',
                  fontWeight: 400,
                  margin: '32px 0 18px',
                  lineHeight: 1.08,
                }}>
                  {t.title}
                </div>

                {/* Hairline separating the title from the body copy */}
                <div aria-hidden style={{
                  width: '100%',
                  maxWidth: 520,
                  height: 1,
                  background: 'rgba(255,255,255,0.12)',
                  margin: '0 0 20px',
                }}/>

                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: '#999',
                  margin: 0,
                  maxWidth: '52ch',
                }}>
                  {t.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HomeNotes = () => {
  const notes = [
    { date: '24 · 03 · 26', read: '5 min read', title: 'The Mittelstand succession gap is Europe\u2019s most under-priced asset class.' },
    { date: '12 · 02 · 26', read: '7 min read', title: 'Why we only invest our own capital — a note on governance and patience.' },
    { date: '28 · 11 · 25', read: '4 min read', title: 'Infrastructure is not a sector. It\u2019s the condition of every other sector.' },
  ];
  return (
    <section
      data-screen-label="05 Home Notes"
      style={{
        background: '#000',
        color: '#fff',
        padding: '220px 48px',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 96,
          alignItems: 'start',
          marginBottom: 72,
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: '#999',
              marginBottom: 36,
            }}>
              · 04 Journal
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(36px, 4.2vw, 64px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              margin: 0,
              maxWidth: '14ch',
              fontWeight: 400,
            }}>
              Notes from<br/>the firm.
            </h2>
          </div>
          <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary">All Writing</Button>
          </div>
        </div>

        <div>
          {notes.map((n, i) => (
            <a
              key={i}
              href="#"
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 140px 1fr auto',
                alignItems: 'center',
                gap: 36,
                padding: '32px 0',
                borderTop: '1px solid #1a1a1a',
                borderBottom: i === notes.length - 1 ? '1px solid #1a1a1a' : 'none',
                color: '#fff',
                textDecoration: 'none',
                transition: 'background 250ms, padding-left 250ms',
              }}
              onMouseOver={e => { e.currentTarget.style.paddingLeft = '16px'; }}
              onMouseOut={e => { e.currentTarget.style.paddingLeft = '0'; }}
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: '1.4px',
                color: '#999',
              }}>{n.date}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: '#999',
              }}>{n.read}</div>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                lineHeight: 1.4,
                color: '#fff',
                maxWidth: '56ch',
              }}>{n.title}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: '#fff',
              }}>Read →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeClosing = ({ go }) => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8';
    let hls;
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') === 'probably';
    const tryPlay = () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    };
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
      style={{
        position: 'relative',
        minHeight: '92vh',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 48px',
      }}
    >
      {/* Background video — HLS, full-bleed, muted loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.65)',
        }}
      />
      {/* Legibility scrim — darker at the bottom so white type + button stay readable */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }}/>
      {/* Top edge fade — bleed to pure #000 so the section morphs out of the preceding black Notes section without a visible cut */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: 220,
        background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        position: 'relative',
        padding: '0 0 160px',
        maxWidth: 1720,
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.3fr 1fr',
        gap: 96,
        alignItems: 'end',
      }}>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: '#4a4a4a',
            marginBottom: 36,
          }}>
            · 05 Careers
          </div>
          <h2 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 'clamp(40px, 5vw, 88px)',
            lineHeight: 1.02,
            letterSpacing: '-0.015em',
            margin: 0,
            maxWidth: '16ch',
            fontWeight: 400,
          }}>
            If you want to shape Europe — we'd <span style={{ fontStyle: 'italic' }}>love to hear<br/>from you.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 6 }}>
          <Button onClick={() => go('careers')}>Careers</Button>
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
