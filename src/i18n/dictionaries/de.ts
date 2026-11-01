/**
 * German UI strings.
 *
 * AI draft (Claude), not yet proofread. A native speaker at Growth Stats should review
 * every string before `de` is enabled in production; remove this note once that is done.
 */
import type { Dictionary } from './en'

const de = {
  common: {
    skipToContent: 'Zum Inhalt springen',
    loading: 'Wird geladen …',
    clickToCopy: 'Zum Kopieren klicken',
    toggleNavigation: 'Navigation ein- oder ausblenden',
    breadcrumbs: 'Brotkrümelnavigation',
    showMore: 'Mehr anzeigen',
    showLess: 'Weniger anzeigen',
    faq: 'Häufig gestellte Fragen',
  },
  pagination: {
    prev: 'Zurück',
    next: 'Weiter',
    page: '{page} von {total}',
  },
  about: {
    badge: 'Über GrowthStats',
    imageAlt: 'Über GrowthStats',
    headingLine1: 'Eine Agentur mit klassischen',
    headingLine2: 'und revolutionären Fähigkeiten',
    missionTitle: 'Ihr Wachstum, unsere Mission',
    missionText:
      'Wir setzen auf messbaren Erfolg. Unser Team arbeitet partnerschaftlich mit Ihnen zusammen, um Chancen zu erschließen und nachhaltige Wirkung zu erzielen.',
    partnershipTitle: 'Erfolg durch Partnerschaft',
    partnershipText:
      'Ihr Wachstum hat für uns Priorität. Mit fundierter Beratung, Innovation und Teamarbeit helfen wir Ihnen, digitale Exzellenz zu erreichen.',
  },
  brandHero: {
    headingLine1: 'Das Wachstum,',
    headingLine2: 'das Ihre Marke',
    headingLine3: 'verdient',
    intro:
      'Wir gestalten digitale Erlebnisse, die Ihre Marke widerspiegeln, begleiten Ihre Aktionen, entwerfen herausragende Visuals und liefern Content, Branding und Marketing, die Ihr Unternehmen online voranbringen.',
    cta: 'Lassen Sie uns zusammenarbeiten',
    services: {
      keywordResearch: 'Keyword-Recherche',
      technicalSeo: 'Technisches SEO',
      localSeo: 'Lokales SEO',
      campaignManagement: 'Kampagnenmanagement',
      uiUx: 'UI/UX',
      webDevelopment: 'Webentwicklung',
      emailMarketing: 'E-Mail-Marketing',
      performanceMarketing: 'Performance-Marketing',
    },
  },
  joinUs: {
    badge: 'Jetzt starten',
    headingLine1: 'Jedes Projekt, das wir übernehmen,',
    headingLine2: 'ist eine einzigartige Chance.',
    text: 'Bereit für den nächsten Schritt? Starten Sie jetzt mit uns und verwandeln Sie Ihre Vision mit kompetenter Unterstützung in Wirklichkeit.',
    cta: 'Termin vereinbaren',
  },
  letsTalk: {
    heading: 'Sprechen wir',
  },
  team: {
    label: 'Unsere Stärken',
    cards: {
      expertise: {
        title: 'Expertise',
        description:
          'Unser erfahrenes Team vereint Fachwissen, Kreativität und technologische Kompetenz, um Ihr Wachstum online zu beschleunigen',
      },
      clientCentric: {
        title: 'Kundenorientierter Ansatz',
        description:
          'Unsere Kunden stehen im Mittelpunkt: Wir entwickeln maßgeschneiderte Strategien für individuelle Ziele, Herausforderungen und Chancen',
      },
      results: {
        title: 'Ergebnisorientierte Lösungen',
        description:
          'Wir konzentrieren uns auf messbare Ergebnisse und verbinden Innovation, technische Exzellenz und strategischen Weitblick für nachhaltige Entwicklung',
      },
    },
  },
  contact: {
    formHeading: 'Kontakt aufnehmen',
    infoHeading: 'Kontakt',
    mapTitle: 'Google Maps',
    location: 'Standort',
    addressLine1: '1. Etage,',
    addressLine2: 'Citadel Commercial Complex,',
    addressLine3: 'Pune, Maharashtra 411001, Indien',
    generalInquiries: 'Allgemeine Anfragen',
    social: 'Social Media',
  },
  contactForm: {
    labels: {
      name: 'Name',
      phone: 'Telefonnummer',
      email: 'E-Mail',
      website: 'Website',
      optional: '(optional)',
      message: 'Nachricht',
    },
    placeholders: {
      name: 'Ihr Name',
      phone: '+49 XXX XXXXXXX',
      email: 'beispiel@gmail.com',
      website: 'ihrefirma.de',
    },
    submit: 'Absenden',
    submitting: 'Wird gesendet …',
    success: 'Vielen Dank! Ihre Nachricht wurde gesendet.',
    error: 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    errors: {
      nameRequired: 'Bitte geben Sie Ihren Namen ein',
      phoneRequired: 'Bitte geben Sie Ihre Telefonnummer ein',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      websiteInvalid: 'Bitte geben Sie eine gültige Website ein',
      messageRequired: 'Bitte geben Sie eine Nachricht ein',
      tooLong: 'Maximal {max} Zeichen',
    },
  },
  blog: {
    readTime: {
      one: 'Lesezeit: {count} Minute',
      other: 'Lesezeit: {count} Minuten',
    },
    featured: 'Empfohlen',
    allCategories: 'Alle',
    filterByCategory: 'Nach Kategorie filtern',
    categories: 'Blog-Kategorien',
    noPosts: 'Keine Beiträge gefunden.',
  },
  search: {
    placeholder: {
      all: 'Suchen',
      pages: 'Seiten durchsuchen',
      blogPosts: 'Blogbeiträge durchsuchen',
    },
    searching: 'Suche läuft …',
    resultsFor: {
      one: '{count} Ergebnis für',
      other: '{count} Ergebnisse für',
    },
    typeBlog: 'Blog',
    typePage: 'Seite',
    google: 'Auf Google suchen',
  },
} satisfies Dictionary

export default de
