// ImprintPage.jsx — Legal disclosure page (§ 5 TMG)
const ImprintPage = ({ go }) => {
  const eyebrow = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 36,
  };

  const sectionLabel = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 14,
  };

  const body = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    lineHeight: 1.7,
    color: '#e0e0e0',
    margin: 0,
  };

  const divider = {
    borderTop: '1px solid #1a1a1a',
    margin: '48px 0',
  };

  const Row = ({ label, children }) => (
    <div>
      <div style={sectionLabel}>{label}</div>
      <div style={body}>{children}</div>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section
        data-screen-label="01 Imprint Hero"
        style={{
          background: '#000',
          color: '#fff',
          padding: '220px 48px 96px',
        }}
      >
        <div style={{ maxWidth: 1720, margin: '0 auto' }}>
          <div style={eyebrow}>· Legal</div>
          <h1 style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 'clamp(72px, 12vw, 200px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 400,
          }}>
            Imprint
          </h1>
        </div>
      </section>

      {/* Content */}
      <section
        data-screen-label="02 Imprint Content"
        style={{
          background: '#000',
          color: '#fff',
          padding: '32px 48px 160px',
        }}
      >
        <div style={{
          maxWidth: 860,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}>
          <Row label="Information in accordance with § 5 of the German Telemedia Act (TMG)">
            Brinell Group GmbH & Co KG<br/>
            Karlstraße 47<br/>
            80333 Munich
          </Row>

          <div style={divider}/>

          <Row label="Contact">
            contact (at) brinell-group.com
          </Row>

          <div style={divider}/>

          <Row label="Managing Directors">
            Adrian Kapsalis<br/>
            Philipp Merk
          </Row>

          <div style={divider}/>

          <Row label="Responsible for content pursuant to § 55 para. 2 RStV">
            Brinell Group GmbH & Co KG<br/>
            Karlstraße 47<br/>
            80333 Munich
          </Row>
        </div>
      </section>
    </>
  );
};

window.ImprintPage = ImprintPage;
