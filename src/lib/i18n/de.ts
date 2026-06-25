import { homeLocales } from './home-locales';
import { brandLocales } from './brand-locales';
import { faqLocales } from './faq-locales';

const brand = brandLocales.de;

export const de = {
  nav: {
    home: 'Startseite',
    shop: 'Shop',
    story: 'Geschichte',
    recipes: 'Rezepte',
    contact: 'Kontakt',
    faq: 'FAQ',
    wishlist: 'Wunschliste'
  },
  header: {
    Themes: 'Themes',
    lang: 'Sprachen',
  },
  hero: brand.hero,
  home: homeLocales.de,
  story: {
    badge: 'Unser Erbe',
    title: 'Das ewige Erbe von Dougga',
    subtitle: 'Eine Reise durch drei Jahrtausende Olivenöl-Meisterschaft im Herzen des antiken Tunesiens.',
    content: 'Seit Generationen pflegen wir unsere Olivenhaine mit Liebe und Respekt für die Natur. Jedes Jahr im Herbst wählen wir sorgfältig die besten Oliven aus, um dieses flüssige Gold zu kreieren.',
    more: 'Mehr lesen',
    heritage: {
      title: 'Die Hüter der Haine',
      description: brand.story.heritage.description,
      image_alt: 'Lokale Bauern in den Olivenhainen'
    },
    history: {
      title: 'Ein numidisches Vermächtnis',
      description: 'Die antike Stadt Dougga, oder Thugga, die majestätisch auf einem Hügel im Norden Tunesiens thront, steht als stiller Zeuge der goldenen Ära des Olivenanbaus. Unter numidischer Herrschaft wurde diese Region zur Olivenöl-Kornkammer des Imperiums. Der fruchtbare Boden und das gemäßigte Klima boten die perfekten Bedingungen für das Gedeihen der Sorte Chemlali.',
      image_alt: 'Antike numidische Ruinen von Dougga'
    },
    process: {
      title: 'Jahrtausende alte Meisterschaft',
      description: 'Noch heute findet man in den Ruinen von Dougga die kreisförmigen Basalt-Mühlsteine, die von antiken Handwerkern verwendet wurden. Wir kombinieren diese überlieferten Techniken mit moderner Nachhaltigkeit – Kaltpressung der Oliven innerhalb weniger Stunden nach der Ernte, um die Polyphenole zu bewahren.',
      image_alt: 'Traditionelle Olivenpressung'
    },
    terroir: {
      title: 'Der heilige Boden',
      description: 'Das einzigartige Terroir von Dougga – kalkhaltiger Boden und mediterrane Sonne – erschafft ein nährstoffreiches Öl mit einem Profil, das nicht kopiert werden kann. Es ist ein Geschmack, der von Geschichte geprägt und von Tradition geschützt ist. Unsere Haine liegen nur einen Steinwurf vom Kapitol von Dougga entfernt.',
      image_alt: 'Olivenhaine bei Sonnenuntergang'
    }
  },
  common: {
    logo_slogan: "L'ORO DEL MONDA'S",
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt kaufen',
    addedToCart: 'Zum Warenkorb hinzugefÃ¼gt!',
    addedToWishlist: 'Zur Wunschliste hinzugefÃ¼gt!',
    cart: 'Warenkorb',
    checkout: 'Kasse',
    login: 'Anmelden',
    sign_in: 'Anmelden',
    logout: 'Abmelden',
    loading: 'LÃ¤dt...',
    location: 'Standort',
    phone: 'Telefon',
    email: 'E-Mail',
    read_more: 'Mehr lesen',
    continue: 'Weiter'
  },
  shop: {
    badge: 'Die Kollektion',
    title: 'Gold der Erde',
    search: 'Suche Oliven...',
    categories: {
      all: 'Alle',
      premium: 'Premium',
      'extra-virgin': 'Extra Vergine',
      infusions: 'Infusionen',
      sets: 'Sets'
    },
    sortBy: 'Sortieren nach',
    sortOptions: {
      featured: 'AusgewÃ¤hlt',
      price_asc: 'Preis (aufsteigend)',
      price_desc: 'Preis (absteigend)'
    },
    no_results: 'Keine Produkte gefunden.',
    reset_filters: 'Filter zurÃ¼cksetzen'
  },
  cart: {
    empty: 'Dein Warenkorb ist leer',
    empty_desc: 'Es sieht so aus, als hÃ¤ttest du noch kein flÃ¼ssiges Gold hinzugefÃ¼gt. Entdecke unsere Kollektion!',
    continue_shopping: 'Zum Shop',
    summary: 'BestellÃ¼bersicht',
    subtotal: 'Zwischensumme',
    shipping: 'Versand',
    free: 'Kostenlos',
    total: 'Gesamtsumme',
    tax_notice: 'Inklusive MwSt. und Versandkosten'
  },
  auth: {
    club: brand.auth.club,
    welcome: 'Willkommen zurÃ¼ck',
    create_account: 'Konto erstellen',
    login_desc: 'Bitte melden Sie sich an, um fortzufahren.',
    register_desc: 'Werden Sie Teil unserer exklusiven Gemeinschaft.',
    name: 'Name',
    email: 'E-Mail Adresse',
    password: 'Passwort',
    confirm_password: 'Passwort bestätigen',
    register: 'Registrieren',
    no_account: 'Noch kein Mitglied?',
    has_account: 'Bereits Mitglied?',
    forgot_password: 'Passwort vergessen?',
    or_with: 'Oder weiter mit',
    register_now: 'Jetzt registrieren',
    social_coming_soon: 'Anmeldung demnächst',
    welcome_back: 'Willkommen zurück!',
    account_created: 'Konto erstellt!',
    error_generic: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    error_email_taken: 'Diese E-Mail ist bereits registriert.',
    login_now: 'Jetzt anmelden',
    placeholders: {
      name: 'VollstÃ¤ndiger Name',
      email: 'name@email.com'
    }
  },
  profile: {
    title: 'Mein Konto',
    logout: 'Abmelden',
    orders: 'Bestellungen',
    details: 'Profil Details',
    since: 'Mitglied seit',
    addresses: 'Adressen',
    discounts: 'Premium Rabatte',
    recent_orders: 'Letzte Bestellungen',
    order_id: 'Bestellnummer',
    date: 'Datum',
    total: 'Gesamt',
    status: 'Status',
    premium_status: 'Olea Premium Status',
    premium_desc: 'Als registriertes Mitglied haben Sie Zugriff auf einen exklusiven Rabatt von 10% auf alle saisonalen Sets.',
    discount_value: '10% RABATT',
    last_name: 'Nachname'
  },
  wishlist: {
    empty: 'Deine Wunschliste ist leer',
    empty_desc: 'Speichere deine Favoriten fÃ¼r spÃ¤ter.',
    find_favorites: 'Favoriten finden'
  },
  faq: faqLocales.de,
  contact: {
    badge: brand.contact.badge,
    title: brand.contact.title,
    subtitle: brand.contact.subtitle,
    form_title: 'Senden Sie uns eine Nachricht',
    info: {
      location: 'Standort',
      location_detail: brand.contact.info.location_detail,
      email_value: brand.contact.info.email,
      phone_value: brand.contact.info.phone,
      email: 'E-Mail',
      phone: 'Telefon'
    },
    form: {
      subject: 'Betreff',
      message: 'Nachricht',
      send: 'Absenden',
      success: 'Nachricht gesendet â€” wir melden uns bald.',
      error: 'Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.',
      subjects: {
        general: 'Allgemeine Anfrage',
        wholesale: 'Wholesale / GeschÃ¤ftskunden',
        order: 'Bestellung & Versand',
        feedback: 'Feedback',
      },
    },
    still_questions: 'Noch Fragen?',
    still_questions_desc: 'Unser Expertenteam hilft Ihnen gerne bei speziellen Fragen zu Sorten oder Kooperationen.',
    map_eyebrow: 'Besuchen Sie uns',
    map_title: 'Dougga, Tunesien',
    open_maps: 'In Karten Öffnen',
  },
  checkout: {
    title: 'Sichere Kasse',
    steps: {
      shipping: 'Versand',
      payment: 'Bezahlung',
      confirmation: 'BestÃ¤tigung',
    },
    buttons: {
      next: 'Weiter zur Zahlung',
      confirm: 'Bestellung abschlieÃŸen',
      back_to_shipping: 'ZurÃ¼ck zum Versand',
      back_to_cart: 'ZurÃ¼ck zum Warenkorb',
    },
    date: 'Datum',
    status: 'Status',
    guest_notice: 'Melden Sie sich an, um auf Ihre Bestellhistorie, Wunschliste und exklusive Mitgliederrabatte zuzugreifen!',
    success: 'Bestellung erfolgreich aufgegeben!',
    address_title: 'Lieferadresse',
    payment_title: 'Zahlungsmethode',
    city: 'Stadt',
    zip: 'PLZ',
    country: 'Land',
    payment_options: {
      card: 'Kreditkarte',
      paypal: 'PayPal'
    },
    secure_connection: 'Sichere Verbindung',
    gdpr_notice: 'Ihre Daten werden sicher verschlÃ¼sselt und nicht auf unseren Servern gespeichert. Wir halten uns strikt an die DSGVO-Vorschriften.',
    invoice_title: 'Rechnung',
    invoice_desc: 'Sie erhalten nach der Bestellung eine BestÃ¤tigung und Rechnung per E-Mail.',
    fast_shipping: 'Schneller Versand',
    secure_payment: 'Sichere Zahlung',
    returns: '30 Tage RÃ¼ckgaberecht',
    first_name: 'Vorname',
    phone: 'Telefon',
    shipping_note: 'Kostenloser Versand innerhalb Tunesiens.',
    card_details: 'Kartendaten',
    card: {
      holder: 'Name auf der Karte',
      number: 'Kartennummer',
      expiry: 'Ablauf',
      cvc: 'CVC',
    },
    demo_notice: 'Demo-Kasse â€” keine echte Zahlung.',
    coming_soon: 'Bald',
    empty_title: 'Nichts zu bezahlen',
    empty_desc: 'Legen Sie Mondas OL in den Warenkorb, bevor Sie bestellen.',
    continue_shopping: 'Weiter einkaufen',
    success_title: 'Vielen Dank fÃ¼r Ihre Bestellung',
    success_desc: 'Eine BestÃ¤tigung wird in KÃ¼rze an {{email}} gesendet.',
    order_number: 'Bestellung',
    error: 'Kasse fehlgeschlagen. Bitte erneut versuchen.',
    payment_pending: 'Zahlungsanbieter wird in KÃ¼rze angebunden.',
  },
  product: {
    specs_title: 'Produkteigenschaften',
    reviews_label: 'Bewertungen',
    no_reviews: 'Noch keine Bewertungen.',
    related: 'Das kÃ¶nnte Ihnen auch gefallen',
    specs: {
      origin: 'Herkunft',
      variety: 'Olivensorte',
      acidity: 'SÃ¤uregehalt',
      harvest: 'Erntezeitpunkt'
    },
    tabs: {
      description: 'Beschreibung',
      specs: 'Eigenschaften',
      reviews: 'Bewertungen'
    },
    not_found: 'Produkt nicht gefunden'
  },
  recipes: {
    badge: 'KÃ¼che & Hain',
    subtitle: 'Rezepte, Techniken und Begleitungen mit Mondas OL â€” natives Oliven l extra aus Dougga, Tunesien.',
    filters: {
      all: 'Alle Rezepte',
      technique: 'Technik',
      knowledge: 'Olivenwissen',
      pairing: 'Pairings',
    },
  },
  chat: {
    welcome: 'Hallo! Wie kann ich Ihnen heute bei Ihrer OlivenÃ¶l-Wahl helfen?',
    support_title: brand.chat.support_title,
    support_subtitle: 'Antwortet in wenigen Sekunden',
    placeholder: 'Wie kann ich helfen?',
    default_response: brand.chat.default_response,
  },
  whatsapp: {
    aria_label: brand.whatsapp.aria_label,
    default_message: brand.whatsapp.default_message,
  },
  notifications: {
    recipe: {
      title: 'Neues Rezept!',
      desc: 'Entdecken Sie unsere neue Lemon-Vinaigrette.'
    },
    order: {
      title: 'Bestell-Update',
      desc: 'Ihre letzte Bestellung wurde in den Versand gegeben.'
    },
    promo: {
      title: 'Promotion',
      desc: '10% Rabatt auf alle Sets mit dem Code OLEA10.'
    }
  },
  footer: {
    description: brand.footer.description,
    navigation: 'Navigation',
    support: 'Support',
    shipping: 'Versandinfo',
    privacy: 'Datenschutz',
    rights: brand.footer.rights,
    designed_by: brand.footer.designed_by,
    newsletter: {
      title: 'Neugkeiten erhalten',
      subtitle: 'Erhalten Sie exklusive Angebote und Rezepte.',
      button: 'Abonnieren'
    }
  }
};


