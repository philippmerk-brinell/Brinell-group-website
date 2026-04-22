// CareersPage.jsx
const CareersHero = () => {
  return (
    <section
      data-screen-label="01 Careers Hero"
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
      {/* Background video — loops muted, full-bleed (matches home hero) */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_3CYzwbX7W5yOTgYaCr2MJhyVqhM/hf_20260419_065651_e4d80803-26f4-433d-bda4-1b745a53430e.mp4"
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
          filter: 'grayscale(0.4) contrast(1.05) brightness(0.8)',
        }}
      />

      {/* Legibility vignette — bottom-up scrim keeps type readable over video */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.45) 100%)',
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
        marginTop: 160,
      }}>
        <h1 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(45px, 6.4vw, 106px)',
          lineHeight: 0.98,
          letterSpacing: '-0.02em',
          margin: 0,
          maxWidth: '14ch',
          fontWeight: 400,
        }}>
          Growth through<br/>
          <span style={{ fontStyle: 'italic' }}>entrepreneurship</span>
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 18,
          lineHeight: 1.5,
          color: '#cfcfcf',
          margin: '40px 0 0',
          maxWidth: '52ch',
        }}>
          We are small by choice. We hire operators, engineers, and investors who want to build and execute. If that sounds like you, read on.
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
        if (e.isIntersecting) {
          setVisible(true);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lazy-initialise HLS on first hover, then play/pause based on hover state
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '44px 40px 48px',
        minHeight: 260,
        borderRight: col === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
        borderBottom: !isLastRow ? '1px solid rgba(255,255,255,0.08)' : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${index * 80}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`,
      }}
    >
      {/* Hover video background */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: hover && videoReady ? 0.55 : 0,
          transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
          filter: 'grayscale(0.3) contrast(1.05) brightness(0.85)',
        }}
      />
      {/* Legibility scrim over video */}
      <div aria-hidden style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)',
        opacity: hover && videoReady ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }}/>

      {/* Outline numeral — smaller, no leading zero */}
      <div aria-hidden style={{
        position: 'absolute',
        top: 28,
        right: 32,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 'clamp(72px, 8vw, 128px)',
        lineHeight: 0.9,
        letterSpacing: '-0.04em',
        fontWeight: 400,
        color: 'transparent',
        WebkitTextStroke: hover ? '1px rgba(255,255,255,0.55)' : '1px rgba(255,255,255,0.14)',
        pointerEvents: 'none',
        userSelect: 'none',
        transition: '-webkit-text-stroke 400ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      }}>{num}</div>

      <h3 style={{
        position: 'relative',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 'clamp(20px, 1.6vw, 26px)',
        lineHeight: 1.15,
        letterSpacing: '-0.005em',
        margin: 0,
        marginTop: 28,
        marginBottom: 20,
        color: '#fff',
        fontWeight: 400,
        maxWidth: '18ch',
      }}>
        {label}
      </h3>

      <p style={{
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14.5,
        lineHeight: 1.65,
        color: hover ? '#d8d8d8' : '#9a9a9a',
        margin: 0,
        maxWidth: '52ch',
        transition: 'color 400ms ease',
      }}>
        {body}
      </p>
    </article>
  );
};

const CareersWhy = () => {
  const items = [
    { label: 'Agency is the baseline', body: 'You see a problem → you own it. We don\u2019t assign responsibility. We expect you to take it \u2014 without asking, without waiting. If you need constant direction, repeated follow-up, or permission to move, this is the wrong place.' },
    { label: 'If it matters, it\u2019s urgent', body: 'There is no comfortable pace here. The moment something matters, we move. Fast. Urgency is not stress for the sake of stress \u2014 it is respect for momentum, for opportunities, and for the importance of the work itself.' },
    { label: 'Ownership means outcome', body: 'Every topic has an owner. You are responsible for the result, not the appearance of effort. No hiding behind process, no ambiguity, no shared accountability that leads to no accountability.' },
    { label: 'Prioritize independently', body: 'We expect people to think clearly and prioritize without being managed through every decision. There will always be multiple important projects. Your job is to identify what matters most, sequence it correctly, and keep moving without constant escalation.' },
    { label: 'Understand the problem before you act', body: 'Most bad decisions come from acting too early. 90% of the solution lies in understanding the problem properly \u2014 going back to first principles, questioning assumptions, and getting to the root cause instead of reacting to noise. We value people who think clearly enough to find the solution others miss.' },
    { label: 'Go beyond your role', body: 'Your job is not your title. You will step into problems that are not \u201cyours\u201d on paper, because they still need to be solved. If you need clean boundaries and a fixed lane, you will struggle here.' },
    { label: 'Intensity is part of the job', body: 'This is not a 9\u20135. We expect commitment, energy, and the willingness to go further when the situation demands it. If you are looking for comfort, routine, or a low-pressure environment, this is not it.' },
    { label: 'This is not for everyone', body: 'Some people want structure, predictability, and clearly defined rules. We want people who are energized by ownership, urgency, steep learning curves, and real responsibility. For the right person, this is the best environment possible. For most people, it is not.' },
  ];
  return (
    <section
      data-screen-label="02 Principles"
      style={{
        background: '#000',
        color: '#fff',
        padding: '140px 48px',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 96,
          alignItems: 'end',
          marginBottom: 80,
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
              · 01 Principles
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(40px, 5vw, 76px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              margin: 0,
              maxWidth: '16ch',
              fontWeight: 400,
            }}>
              The principles<br/>we <span style={{ fontStyle: 'italic' }}>live</span> by.
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
            Eight non-negotiables that shape how we work, how we hire, and how we hold each other to standard. Read them carefully - they are the best preview of what life at Brinell Group actually feels like.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 0,
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
  const roles = [
    { title: 'Head of Energy Investments', id: 'R-01', href: 'https://scythe-pint-825.notion.site/Head-of-Energy-Investments-347a781a4c68804aa6b9cc4a89c08fc9?pvs=74' },
    { title: 'Head of Project Development - Energy', id: 'R-02', href: 'https://scythe-pint-825.notion.site/Head-of-Energy-Project-Development-347a781a4c68800c8cacf1a40a209b6a' },
    { title: 'Business Development Manager - Grid', id: 'R-03', href: 'https://scythe-pint-825.notion.site/Business-Development-Manager-Grid-347a781a4c6880c2992cc6d623276e5f?pvs=73' },
    { title: 'Founder Associate (Internship)', id: 'R-04', href: 'https://scythe-pint-825.notion.site/Founder-Associate-Intern-347a781a4c688080acddf67b69d70a12?pvs=73' },
    { title: 'Executive Assistant (Part-Time)', id: 'R-05', href: 'https://scythe-pint-825.notion.site/executive-assistant?pvs=73' },
  ];
  const filtered = roles;

  return (
    <section
      data-screen-label="03 Open Roles"
      style={{
        background: '#000',
        color: '#fff',
        padding: '140px 48px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 96,
          alignItems: 'end',
          marginBottom: 64,
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
              · 02 Open Roles
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
              Positions<br/>we are <span style={{ fontStyle: 'italic' }}>hiring</span>.
            </h2>
          </div>
        </div>

        <div>
          {filtered.map((r, i) => (
            <a
              key={r.id}
              href={r.href || '#'}
              target={r.href ? '_blank' : undefined}
              rel={r.href ? 'noopener noreferrer' : undefined}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: 36,
                padding: '28px 0',
                borderTop: '1px solid #1a1a1a',
                borderBottom: i === filtered.length - 1 ? '1px solid #1a1a1a' : 'none',
                color: '#fff',
                textDecoration: 'none',
                transition: 'padding-left 250ms',
              }}
              onMouseOver={e => { e.currentTarget.style.paddingLeft = '16px'; }}
              onMouseOut={e => { e.currentTarget.style.paddingLeft = '0'; }}
            >
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: 22,
                letterSpacing: '-0.005em',
                lineHeight: 1.1,
                color: '#fff',
                fontWeight: 400,
              }}>{r.title}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: '#fff',
              }}>Details →</div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#999',
            maxWidth: '42ch',
            textAlign: 'right',
          }}>
            Don't see your role? Write to us anyway — we hire ahead of need for people we believe in.
          </div>
        </div>
      </div>
    </section>
  );
};

const CareersProcess = () => {
  const steps = [
    { title: 'Online application', body: 'Submit your CV and a short note on what draws you to this work. No cover-letter theatre — we want to understand your thinking and your trajectory.' },
    { title: 'First conversation online', body: 'A 45-minute call with a partner. No deck, no behavioural grid — we hear what you have done, what you are looking for, and where we might fit.' },
    { title: 'On-site meeting & case study', body: 'A day with the team in Munich, including a deep-dive on a live question in your discipline. We work on it together; references are taken in parallel.' },
    { title: 'Offer', body: 'Decision and offer usually within ten days of the on-site. Clear terms, clear expectations, clear ownership from day one.' },
  ];
  return (
    <section
      data-screen-label="04 Process"
      style={{
        background: '#000',
        color: '#fff',
        padding: '140px 48px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{ maxWidth: 1720, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 96,
          alignItems: 'end',
          marginBottom: 80,
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
              · 03 Process
            </div>
            <h2 style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: 'clamp(40px, 5vw, 76px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              margin: 0,
              maxWidth: '16ch',
              fontWeight: 400,
            }}>
              Four steps,<br/><span style={{ fontStyle: 'italic' }}>no theatre</span>.
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
            A short, deliberate process — designed to give both sides enough signal to make a real decision. Typically four weeks from first application to offer.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 0,
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
  return (
    <section
      data-screen-label="05 Apply"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
        color: '#fff',
        padding: '160px 48px',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(60% 80% at 85% 20%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(135deg, #0a0a0a 0%, #000 100%)',
      }}/>

      <div style={{
        position: 'relative',
        maxWidth: 1100,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: '1.4px',
          textTransform: 'uppercase',
          color: '#999',
          marginBottom: 36,
        }}>
          · 04 Apply
        </div>
        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(40px, 5vw, 76px)',
          lineHeight: 1.02,
          letterSpacing: '-0.015em',
          margin: '0 auto',
          maxWidth: '18ch',
          fontWeight: 400,
        }}>
          Get in <span style={{ fontStyle: 'italic' }}>touch</span>.
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 17,
          lineHeight: 1.6,
          color: '#bfbfbf',
          margin: '36px auto 0',
          maxWidth: '52ch',
        }}>
          No portals. A partner reads every inbound message. A reply — yes or no — within seven days.
        </p>
        <a
          href="mailto:talent@brinell-group.com"
          style={{
            display: 'inline-block',
            marginTop: 56,
            padding: '20px 32px',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            borderBottom: '1px solid rgba(255,255,255,0.14)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            letterSpacing: '1.6px',
            textTransform: 'uppercase',
            color: '#fff',
            textDecoration: 'none',
            transition: 'border-color 250ms, letter-spacing 250ms',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.letterSpacing = '2.4px'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.letterSpacing = '1.6px'; }}
        >
          talent (at) brinell-group.com →
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
