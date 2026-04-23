// i18n/dict.jsx — Dictionary + Provider + useT/useLang hooks
// All user-visible strings live here. Components read them via `const t = useT();`
// and render `t('home.hero.title.line1')` etc.
//
// Language is persisted in localStorage('brinell.lang'); defaults to 'en'.

const DICT = {
  en: {
    // —— Nav ——
    'nav.home': 'Home',
    'nav.careers': 'Careers',
    'nav.lang.en': 'EN',
    'nav.lang.de': 'DE',
    'nav.lang.label': 'Language',

    // —— Home · Hero ——
    'home.hero.line1': 'Infrastructure to',
    'home.hero.line2': "shape Europe's",
    'home.hero.line3': 'Future.',

    // —— Home · Intro / Mandate ——
    'home.intro.eyebrow': '· 01 Our Mandate',
    'home.intro.title.a': 'We build for the ',
    'home.intro.title.em': 'next generation',
    'home.intro.title.b': ', investing our own capital',
    'home.intro.body1': "We operate as an entrepreneur-led platform that founds, acquires, and transforms infrastructure businesses across Europe — driven by the belief that entrepreneurship is the most powerful force to create prosperity and solve real-world problems.",
    'home.intro.body2': 'We are not a traditional fund. We invest our own capital. This allows us to build companies over decades — not quarters.',
    'home.intro.cta': 'Careers',

    // —— Home · Stats ——
    'home.stats.eyebrow': '· 02 Track Record',
    'home.stats.title.a': 'A track record in building ',
    'home.stats.title.em': 'infrastructure',
    'home.stats.title.b': ' companies.',
    'home.stats.1.label': 'The founding partners have been starting and scaling ventures for a decade.',
    'home.stats.1.unit': 'yr',
    'home.stats.2.label': 'Infrastructure developments in Europe across energy and digital infrastructure.',
    'home.stats.2.unit': 'gw',
    'home.stats.3.label': 'The team has initiated billions in infrastructure investments across Europe.',
    'home.stats.3.unit': 'bn',

    // —— Home · Pillars ——
    'home.pillars.eyebrow': '· 03 Areas of Focus',
    'home.pillars.title.a': 'Entrepreneurship for a ',
    'home.pillars.title.em': 'prosperous',
    'home.pillars.title.b': ' future.',
    'home.pillars.1.title': 'Digital Infrastructure',
    'home.pillars.1.body': "Build and invest in next-gen digital infrastructure that strengthens Europe's connectivity to foster digital resilience and growth.",
    'home.pillars.2.title': 'Energy Infrastructure',
    'home.pillars.2.body': 'Build and transform energy infrastructure for a sovereign and robust energy supply to power economic growth.',
    'home.pillars.3.title': 'Properties and Land',
    'home.pillars.3.body': 'Focus on properties and land assets, creating long-term value, focusing on stability and strategic spaces.',
    'home.pillars.4.title': 'Succession & Buyouts',
    'home.pillars.4.body': 'Take on businesses with succession needs and untapped potential, focusing on sustainable growth through entrepreneurial reinvention.',

    // —— Home · Closing ——
    'home.closing.eyebrow': '· 05 Careers',
    'home.closing.title.a': 'If you want to shape Europe — ',
    'home.closing.title.em': 'join our team',
    'home.closing.title.b': '.',
    'home.closing.cta': 'Careers',

    // —— Careers · Hero ——
    'careers.hero.line1': 'Growth through',
    'careers.hero.line2': 'entrepreneurship',
    'careers.hero.sub': 'We are small by choice. We hire operators, engineers, and investors who want to build and execute. If that sounds like you, read on.',

    // —— Careers · Principles ——
    'careers.principles.eyebrow': '· 01 Principles',
    'careers.principles.title.a': 'The principles',
    'careers.principles.title.b': ' we ',
    'careers.principles.title.em': 'live',
    'careers.principles.title.c': ' by.',
    'careers.principles.intro': 'Eight non-negotiables that shape how we work, how we hire, and how we hold each other to standard. Read them carefully - they are the best preview of what life at Brinell Group actually feels like.',
    'careers.principles.1.title': 'Agency is the baseline',
    'careers.principles.1.body': "You see a problem → you own it. We don't assign responsibility. We expect you to take it — without asking, without waiting. If you need constant direction, repeated follow-up, or permission to move, this is the wrong place.",
    'careers.principles.2.title': "If it matters, it's urgent",
    'careers.principles.2.body': 'There is no comfortable pace here. The moment something matters, we move. Fast. Urgency is not stress for the sake of stress — it is respect for momentum, for opportunities, and for the importance of the work itself.',
    'careers.principles.3.title': 'Ownership means outcome',
    'careers.principles.3.body': 'Every topic has an owner. You are responsible for the result, not the appearance of effort. No hiding behind process, no ambiguity, no shared accountability that leads to no accountability.',
    'careers.principles.4.title': 'Prioritize independently',
    'careers.principles.4.body': 'We expect people to think clearly and prioritize without being managed through every decision. There will always be multiple important projects. Your job is to identify what matters most, sequence it correctly, and keep moving without constant escalation.',
    'careers.principles.5.title': 'Understand the problem before you act',
    'careers.principles.5.body': 'Most bad decisions come from acting too early. 90% of the solution lies in understanding the problem properly — going back to first principles, questioning assumptions, and getting to the root cause instead of reacting to noise. We value people who think clearly enough to find the solution others miss.',
    'careers.principles.6.title': 'Go beyond your role',
    'careers.principles.6.body': 'Your job is not your title. You will step into problems that are not "yours" on paper, because they still need to be solved. If you need clean boundaries and a fixed lane, you will struggle here.',
    'careers.principles.7.title': 'Intensity is part of the job',
    'careers.principles.7.body': 'This is not a 9–5. We expect commitment, energy, and the willingness to go further when the situation demands it. If you are looking for comfort, routine, or a low-pressure environment, this is not it.',
    'careers.principles.8.title': 'This is not for everyone',
    'careers.principles.8.body': 'Some people want structure, predictability, and clearly defined rules. We want people who are energized by ownership, urgency, steep learning curves, and real responsibility. For the right person, this is the best environment possible. For most people, it is not.',

    // —— Careers · Roles ——
    'careers.roles.eyebrow': '· 02 Open Roles',
    'careers.roles.title.a': 'Positions',
    'careers.roles.title.b': ' we are ',
    'careers.roles.title.em': 'hiring',
    'careers.roles.title.c': '.',
    'careers.roles.details': 'Details →',
    'careers.roles.footnote': "Don't see your role? Write to us anyway — we hire ahead of need for people we believe in.",
    'careers.roles.1': 'Head of Energy Investments',
    'careers.roles.2': 'Head of Project Development - Energy',
    'careers.roles.3': 'Business Development Manager - Grid',
    'careers.roles.4': 'Founder Associate (Internship)',
    'careers.roles.5': 'Executive Assistant (Part-Time)',

    // —— Careers · Process ——
    'careers.process.eyebrow': '· 03 Process',
    'careers.process.title.a': 'Four steps,',
    'careers.process.title.em': 'no theatre',
    'careers.process.title.b': '.',
    'careers.process.intro': 'A short, deliberate process — designed to give both sides enough signal to make a real decision. Typically four weeks from first application to offer.',
    'careers.process.1.title': 'Online application',
    'careers.process.1.body': 'Submit your CV and a short note on what draws you to this work. No cover-letter theatre — we want to understand your thinking and your trajectory.',
    'careers.process.2.title': 'First conversation online',
    'careers.process.2.body': 'A 45-minute call with a partner. No deck, no behavioural grid — we hear what you have done, what you are looking for, and where we might fit.',
    'careers.process.3.title': 'On-site meeting & case study',
    'careers.process.3.body': 'A day with the team in Munich, including a deep-dive on a live question in your discipline. We work on it together; references are taken in parallel.',
    'careers.process.4.title': 'Offer',
    'careers.process.4.body': 'Decision and offer usually within ten days of the on-site. Clear terms, clear expectations, clear ownership from day one.',

    // —— Careers · Apply ——
    'careers.apply.eyebrow': '· 04 Apply',
    'careers.apply.title.a': 'Get in ',
    'careers.apply.title.em': 'touch',
    'careers.apply.title.b': '.',
    'careers.apply.body': 'No portals. A partner reads every inbound message. A reply — yes or no — within seven days.',
    'careers.apply.cta': 'talent (at) brinell-group.com →',

    // —— Imprint ——
    'imprint.eyebrow': '· Legal',
    'imprint.title': 'Imprint',
    'imprint.tmg.label': 'Information in accordance with § 5 of the German Telemedia Act (TMG)',
    'imprint.contact.label': 'Contact',
    'imprint.contact.value': 'contact (at) brinell-group.com',
    'imprint.directors.label': 'Managing Directors',
    'imprint.responsible.label': 'Responsible for content pursuant to § 55 para. 2 RStV',

    // —— Footer ——
    'footer.col.company': 'Company',
    'footer.col.contact': 'Contact',
    'footer.copyright': '© 2026 Brinell Group GmbH & Co KG · All rights reserved',
    'footer.imprint': 'Imprint',
    'footer.linkedin': 'LinkedIn',
  },

  de: {
    // —— Nav ——
    'nav.home': 'Home',
    'nav.careers': 'Karriere',
    'nav.lang.en': 'EN',
    'nav.lang.de': 'DE',
    'nav.lang.label': 'Sprache',

    // —— Home · Hero ——
    'home.hero.line1': 'Infrastruktur,',
    'home.hero.line2': 'die Europas',
    'home.hero.line3': 'Zukunft gestaltet.',

    // —— Home · Intro / Mandate ——
    'home.intro.eyebrow': '· 01 Unsere Mission',
    'home.intro.title.a': 'Wir bauen für die ',
    'home.intro.title.em': 'nächste Generation',
    'home.intro.title.b': '.',
    'home.intro.body1': 'Digitale und Energie-Infrastrukturprojekte in Europa.',
    'home.intro.body2': 'Wir sind kein klassischer Fonds. Wir investieren unser eigenes Kapital. Das erlaubt es uns, Unternehmen über Jahrzehnte aufzubauen — nicht über Quartale.',
    'home.intro.cta': 'Karriere',

    // —— Home · Stats ——
    'home.stats.eyebrow': '· 02 Track Record',
    'home.stats.title.a': 'Ein Track Record im Aufbau von ',
    'home.stats.title.em': 'Infrastruktur',
    'home.stats.title.b': '-Unternehmen.',
    'home.stats.1.label': 'Die Gründungspartner bauen und skalieren seit einem Jahrzehnt Unternehmen.',
    'home.stats.1.unit': 'Jahre',
    'home.stats.2.label': 'Das Team verantwortet >3 GW an Infrastrukturprojekten in Europa.',
    'home.stats.2.unit': 'GW',
    'home.stats.3.label': 'Das Team hat Milliarden an Infrastruktur-Investitionen in Europa initiiert.',
    'home.stats.3.unit': 'Mrd.',

    // —— Home · Pillars ——
    'home.pillars.eyebrow': '· 02 Track Record',
    'home.pillars.title.a': 'Wir investieren für eine ',
    'home.pillars.title.em': 'starke',
    'home.pillars.title.b': '\nZukunft.',
    'home.pillars.1.title': 'Digitale Infrastruktur',
    'home.pillars.1.body': 'Aufbau und Investitionen in digitale Infrastruktur der nächsten Generation, die Europas Konnektivität stärkt und digitale Resilienz und Wachstum fördert.',
    'home.pillars.2.title': 'Energie-Infrastruktur',
    'home.pillars.2.body': 'Aufbau und Transformation von Energie-Infrastruktur für eine souveräne und robuste Energieversorgung als Grundlage wirtschaftlichen Wachstums.',
    'home.pillars.3.title': 'Liegenschaften',
    'home.pillars.3.body': 'Fokus auf Liegenschaften und Grundstücksanlagen für langfristigen Werterhalt und Stabilität.',
    'home.pillars.4.title': 'Nachfolge & Buyouts',
    'home.pillars.4.body': 'Übernahme von Unternehmen mit Nachfolgebedarf und ungenutztem Potenzial — nachhaltiges Wachstum durch unternehmerische Neuausrichtung.',

    // —— Home · Closing ——
    'home.closing.eyebrow': '· 05 Karriere',
    'home.closing.title.a': 'Du willst Europa gestalten?\n',
    'home.closing.title.em': 'Jetzt bewerben',
    'home.closing.title.b': '.',
    'home.closing.cta': 'Karriere',

    // —— Careers · Hero ——
    'careers.hero.line1': 'Wachstum durch',
    'careers.hero.line2': 'Unternehmertum',
    'careers.hero.sub': 'Wir sind bewusst klein. Wir sind Macher, die die Zukunft bauen und umsetzen wollen. Wenn Dich das anspricht, lies weiter.',

    // —— Careers · Principles ——
    'careers.principles.eyebrow': '· 01 Prinzipien',
    'careers.principles.title.a': 'Die Prinzipien,',
    'careers.principles.title.b': ' nach denen wir ',
    'careers.principles.title.em': 'arbeiten',
    'careers.principles.title.c': '.',
    'careers.principles.intro': 'Acht nicht verhandelbare Prinzipien, die prägen, wie wir arbeiten und wie wir uns gegenseitig in die Verantwortung nehmen. Lies sie genau — sie sind die beste Vorschau darauf, was dich bei Brinell Group erwartet.',
    'careers.principles.1.title': 'Eigeninitiative ist Grundvoraussetzung',
    'careers.principles.1.body': 'Du siehst ein Problem → Du übernimmst es. Wir verteilen keine Verantwortung. Wir erwarten, dass Du sie übernimmst — ohne zu fragen, ohne zu warten. Wenn Du ständige Anleitung, wiederholte Nachfragen oder Erlaubnis brauchst, um zu handeln, ist das der falsche Ort.',
    'careers.principles.2.title': 'Wenn es wichtig ist, ist es dringend',
    'careers.principles.2.body': 'Hier gibt es kein bequemes Tempo. Sobald etwas zählt, bewegen wir uns. Schnell. Dringlichkeit ist kein Stress um des Stresses willen — sie ist Respekt vor Momentum, vor Chancen und vor der Bedeutung der Arbeit selbst.',
    'careers.principles.3.title': 'Verantwortung heißt Ergebnis',
    'careers.principles.3.body': 'Jedes Thema hat einen Verantwortlichen. Du bist für das Ergebnis verantwortlich, nicht für den Anschein von Einsatz. Kein Verstecken hinter Prozessen, keine Unklarheit, keine geteilte Verantwortung, die in keiner Verantwortung endet.',
    'careers.principles.4.title': 'Eigenständig priorisieren',
    'careers.principles.4.body': 'Wir erwarten, dass Menschen klar denken und priorisieren, ohne durch jede Entscheidung geführt zu werden. Es wird immer mehrere wichtige Projekte geben. Deine Aufgabe ist es, das Wichtigste zu erkennen, richtig zu sequenzieren und weiterzumachen — ohne ständige Eskalation.',
    'careers.principles.5.title': 'Verstehe das Problem, bevor Du handelst',
    'careers.principles.5.body': 'Die meisten schlechten Entscheidungen entstehen durch zu frühes Handeln. 90 % der Lösung liegen darin, das Problem richtig zu verstehen — zurück zu First Principles, Annahmen hinterfragen, die Ursache finden, statt auf Rauschen zu reagieren. Wir schätzen Menschen, die klar genug denken, um die Lösung zu finden, die andere übersehen.',
    'careers.principles.6.title': 'Über Deine Rolle hinausgehen',
    'careers.principles.6.body': 'Dein Job ist nicht Dein Titel. Du wirst in Probleme einsteigen, die auf dem Papier nicht „Deine" sind, weil sie trotzdem gelöst werden müssen. Wenn Du klare Grenzen und eine feste Spur brauchst, wirst Du hier Schwierigkeiten haben.',
    'careers.principles.7.title': 'Intensität gehört zum Job',
    'careers.principles.7.body': 'Das ist kein 9-bis-5. Wir erwarten Einsatz, Energie und die Bereitschaft, weiter zu gehen, wenn es die Situation verlangt. Wenn Du Komfort, Routine oder ein Umfeld mit wenig Druck suchst, ist das hier nicht das Richtige.',
    'careers.principles.8.title': 'Das ist nicht für jeden',
    'careers.principles.8.body': 'Manche Menschen wollen Struktur, Planbarkeit und klar definierte Regeln. Wir wollen Menschen, die von Verantwortung, Dringlichkeit, steilen Lernkurven und echter Eigenverantwortung angetrieben werden. Für den richtigen Menschen ist das das beste Umfeld, das es gibt. Für die meisten ist es das nicht.',

    // —— Careers · Roles ——
    'careers.roles.eyebrow': '· 02 Offene Positionen',
    'careers.roles.title.a': 'Offene',
    'careers.roles.title.b': ' ',
    'careers.roles.title.em': 'Positionen',
    'careers.roles.title.c': '.',
    'careers.roles.details': 'Details →',
    'careers.roles.footnote': 'Deine Rolle ist nicht dabei? Schreib uns trotzdem — wir stellen vorausschauend für Menschen ein, an die wir glauben.',
    'careers.roles.1': 'Head of Energy Investments',
    'careers.roles.2': 'Head of Project Development — Energy',
    'careers.roles.3': 'Business Development Manager — Grid',
    'careers.roles.4': 'Founder Associate (Praktikum)',
    'careers.roles.5': 'Executive Assistant (Teilzeit)',

    // —— Careers · Process ——
    'careers.process.eyebrow': '· 03 Prozess',
    'careers.process.title.a': 'Vier Schritte,',
    'careers.process.title.em': 'kein Theater',
    'careers.process.title.b': '.',
    'careers.process.intro': 'Ein kurzer Prozess — so gestaltet, dass beide Seiten genug Eindrücke haben, um eine echte Entscheidung zu treffen. Typischerweise vier Wochen von der ersten Bewerbung bis zum Angebot.',
    'careers.process.1.title': 'Online-Bewerbung',
    'careers.process.1.body': 'Sende Deinen CV und ein kurzes Wort dazu, was Dich an dieser Stelle und Brinell Group reizt. Kein Anschreiben-Theater — wir wollen Dein Denken und Deinen Werdegang verstehen.',
    'careers.process.2.title': 'Erstes Online-Gespräch',
    'careers.process.2.body': 'Ein 45-minütiges Gespräch mit einem Partner. Kein Deck, keine Verhaltensmatrix — wir hören, was Du gemacht hast, was Du suchst und wo wir zusammenpassen könnten.',
    'careers.process.3.title': 'Vor-Ort-Termin & Case Study',
    'careers.process.3.body': 'Ein Tag mit dem Team in München, inklusive eines Deep-Dive auf eine reale Fragestellung in Deiner Disziplin. Wir arbeiten gemeinsam daran; Referenzen werden parallel eingeholt.',
    'careers.process.4.title': 'Angebot',
    'careers.process.4.body': 'Entscheidung und Angebot üblicherweise innerhalb von zehn Tagen nach dem Vor-Ort-Termin. Klare Konditionen, klare Erwartungen, klare Verantwortung ab Tag eins.',

    // —— Careers · Apply ——
    'careers.apply.eyebrow': '· 04 Bewerben',
    'careers.apply.title.a': 'Kontaktiere ',
    'careers.apply.title.em': 'uns',
    'careers.apply.title.b': '.',
    'careers.apply.body': 'Eine Antwort — Ja oder Nein — innerhalb von sieben Tagen.',
    'careers.apply.cta': 'talent (at) brinell-group.com →',

    // —— Imprint ——
    'imprint.eyebrow': '· Impressum',
    'imprint.title': 'Impressum',
    'imprint.tmg.label': 'Angaben gemäß § 5 TMG',
    'imprint.contact.label': 'Kontakt',
    'imprint.contact.value': 'contact (at) brinell-group.com',
    'imprint.directors.label': 'Geschäftsführer',
    'imprint.responsible.label': 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',

    // —— Footer ——
    'footer.col.company': 'Unternehmen',
    'footer.col.contact': 'Kontakt',
    'footer.copyright': '© 2026 Brinell Group GmbH & Co KG · Alle Rechte vorbehalten',
    'footer.imprint': 'Impressum',
    'footer.linkedin': 'LinkedIn',
  },
};

const LangContext = React.createContext({ lang: 'en', setLang: () => {} });

const LangProvider = ({ children }) => {
  const [lang, setLangState] = React.useState(() => {
    // 1) Explicit user choice wins — once the dropdown has been used, always respect it.
    try {
      const saved = localStorage.getItem('brinell.lang');
      if (saved === 'en' || saved === 'de') return saved;
    } catch (e) {}
    // 2) First visit: auto-detect from the browser. German locales → DE, everything else → EN.
    try {
      const candidates = [];
      if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
      if (navigator.language) candidates.push(navigator.language);
      for (const c of candidates) {
        if (typeof c === 'string' && c.toLowerCase().startsWith('de')) return 'de';
      }
    } catch (e) {}
    return 'en';
  });
  const setLang = React.useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem('brinell.lang', next); } catch (e) {}
    try { document.documentElement.lang = next; } catch (e) {}
  }, []);
  React.useEffect(() => { try { document.documentElement.lang = lang; } catch (e) {} }, [lang]);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

const useLang = () => React.useContext(LangContext);

const useT = () => {
  const { lang } = useLang();
  const table = DICT[lang] || DICT.en;
  return React.useCallback((key) => {
    if (key in table) return table[key];
    // fall back to English if a key is missing in the current lang
    if (key in DICT.en) return DICT.en[key];
    return key;
  }, [table]);
};

Object.assign(window, { DICT, LangContext, LangProvider, useLang, useT });
