import { homeLocales } from './home-locales';
import { brandLocales } from './brand-locales';
import { faqLocales } from './faq-locales';

const brand = brandLocales.fr;

export const fr = {
  nav: {
    home: 'Accueil',
    shop: 'Boutique',
    story: 'Histoire',
    recipes: 'Recettes',
    contact: 'Contact',
    faq: 'FAQ',
    wishlist: 'Liste de souhaits'
  },
  header: {
    Themes: 'ThÃ¨mes',
    lang: 'Langues',
  },
  hero: brand.hero,
  home: homeLocales.fr,
  story: {
    badge: 'Notre HÃ©ritage',
    title: 'L\'HÃ©ritage Ã‰ternel de Dougga',
    subtitle: 'Voyagez Ã  travers trois millÃ©naires de maÃ®trise de l\'huile d\'olive au cÅ“ur de la Tunisie antique.',
    content: 'Depuis des gÃ©nÃ©rations, nous entretenons nos oliveraies avec amour et respect pour la nature. Chaque automne, nous sÃ©lectionnons soigneusement les meilleures olives pour crÃ©er cet or liquide.',
    more: 'Lire la suite',
    history: {
      title: 'Un HÃ©ritage Numide',
      description: 'L\'ancienne citÃ© de Dougga, ou Thugga, perchÃ©e majestueusement sur une colline du nord de la Tunisie, est le tÃ©moin silencieux de l\'Ã¢ge d\'or de l\'olÃ©iculture. Sous la domination numide, cette rÃ©gion est devenue le grenier Ã  huile d\'olive de l\'Empire. Le sol fertile et le climat tempÃ©rÃ© ont offert les conditions idÃ©ales pour que la variÃ©tÃ© Chemlali prospÃ¨re.',
      image_alt: 'Ruines numides antiques de Dougga'
    },
    heritage: {
      title: 'Les Gardiens du Domaine',
      description: brand.story.heritage.description,
      image_alt: 'Agriculteurs locaux dans les oliveraies'
    },
    process: {
      title: 'MaÃ®trise MillÃ©naire',
      description: 'Aujourd\'hui encore, en marchant dans les ruines de Dougga, on peut trouver les meules circulaires en basalte utilisÃ©es par les artisans d\'autrefois. Nous combinons ces techniques ancestrales avec la durabilitÃ© moderne â€” pressage Ã  froid des olives quelques heures aprÃ¨s la rÃ©colte.',
      image_alt: 'Pressage traditionnel des olives'
    },
    terroir: {
      title: 'Le Sol SacrÃ©',
      description: 'Le terroir unique de Dougga â€” un sol riche en calcaire et le soleil de la MÃ©diterranÃ©e â€” crÃ©e une huile riche en nutriments avec un profil inimitable. C\'est une saveur faÃ§onnÃ©e par l\'histoire et protÃ©gÃ©e par la tradition. Nos oliveraies sont situÃ©es Ã  deux pas du Capitole de Dougga.',
      image_alt: 'Oliveraies au coucher du soleil'
    }
  },
  common: {
    logo_slogan: "L'ORO DEL MONDA'S",
    addToCart: 'Ajouter au panier',
    buyNow: 'Acheter maintenant',
    addedToCart: 'AjoutÃ© au panier !',
    addedToWishlist: 'AjoutÃ© Ã  la liste de souhaits !',
    cart: 'Panier',
    checkout: 'Paiement',
    login: 'Connexion',
    sign_in: 'Se connecter',
    logout: 'DÃ©connexion',
    loading: 'Chargement...',
    location: 'Emplacement',
    phone: 'TÃ©lÃ©phone',
    email: 'E-mail',
    read_more: 'Lire la suite',
    continue: 'Continuer'
  },
  shop: {
    badge: 'La Collection',
    title: 'L\'Or de la Terre',
    search: 'Rechercher de l\'huile d\'olive...',
    categories: {
      all: 'Tout',
      premium: 'Premium',
      'extra-virgin': 'Extra Vierge',
      infusions: 'Infusions',
      sets: 'Coffrets'
    },
    sortBy: 'Trier par',
    sortOptions: {
      featured: 'SÃ©lection',
      price_asc: 'Prix (croissant)',
      price_desc: 'Prix (dÃ©croissant)'
    },
    no_results: 'Aucun produit trouvÃ©.',
    reset_filters: 'RÃ©initialiser les filtres'
  },
  cart: {
    empty: 'Votre panier est vide',
    empty_desc: 'Il semble que vous n\'ayez pas encore ajoutÃ© d\'or liquide. Explorez notre collection !',
    continue_shopping: 'Vers la boutique',
    summary: 'RÃ©sumÃ© de la commande',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    free: 'Gratuit',
    total: 'Total',
    tax_notice: 'TVA et frais de port inclus'
  },
  auth: {
    club: brand.auth.club,
    welcome: 'Bon retour',
    create_account: 'CrÃ©er un compte',
    login_desc: 'Veuillez vous connecter pour continuer.',
    register_desc: 'Rejoignez notre communautÃ© exclusive.',
    name: 'Nom',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    confirm_password: 'Confirmer le mot de passe',
    register: 'S\'inscrire',
    no_account: 'Pas encore membre ?',
    has_account: 'DÃ©jÃ  membre ?',
    forgot_password: 'Mot de passe oubliÃ© ?',
    or_with: 'Ou continuer avec',
    register_now: 'S\'inscrire maintenant',
    login_now: 'Se connecter maintenant',
    placeholders: {
      name: 'Nom complet',
      email: 'nom@email.com'
    }
  },
  profile: {
    title: 'Mon Compte',
    logout: 'DÃ©connexion',
    orders: 'Commandes',
    details: 'DÃ©tails du profil',
    since: 'Membre depuis',
    addresses: 'Adresses',
    discounts: 'Remises Premium',
    recent_orders: 'Commandes rÃ©centes',
    order_id: 'ID Commande',
    date: 'Date',
    total: 'Total',
    status: 'Statut',
    premium_status: 'Statut Premium Olea',
    premium_desc: 'En tant que membre inscrit, vous bÃ©nÃ©ficiez d\'une remise exclusive de 10 % sur tous les coffrets saisonniers.',
    discount_value: '10% DE RÃ‰DUCTION',
    last_name: 'Nom de famille'
  },
  wishlist: {
    empty: 'Votre liste de souhaits est vide',
    empty_desc: 'Enregistrez vos favoris pour plus tard.',
    find_favorites: 'Trouver des favoris'
  },
  faq: faqLocales.fr,
  contact: {
    badge: brand.contact.badge,
    title: brand.contact.title,
    subtitle: brand.contact.subtitle,
    form_title: 'Envoyez-nous un message',
    info: {
      location: 'Emplacement',
      location_detail: brand.contact.info.location_detail,
      email_value: brand.contact.info.email,
      phone_value: brand.contact.info.phone,
      email: 'E-mail',
      phone: 'TÃ©lÃ©phone'
    },
    form: {
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      success: 'Message envoyÃ© â€” nous vous rÃ©pondrons bientÃ´t.',
      error: 'Impossible d\'envoyer votre message. Veuillez rÃ©essayer.',
      subjects: {
        general: 'Demande gÃ©nÃ©rale',
        wholesale: 'Vente en gros / Entreprises',
        order: 'Commande & Livraison',
        feedback: 'Commentaires',
      },
    },
    still_questions: 'Encore des questions ?',
    still_questions_desc: 'Notre Ã©quipe d\'experts se fera un plaisir de rÃ©pondre Ã  vos questions spÃ©cifiques sur les variÃ©tÃ©s ou les coopÃ©rations.',
    map_eyebrow: 'Nous rendre visite',
    map_title: 'Dougga, Tunisie',
    open_maps: 'Ouvrir dans Maps',
  },
  checkout: {
    title: 'Paiement SÃ©curisÃ©',
    steps: {
      shipping: 'Livraison',
      payment: 'Paiement',
      confirmation: 'Confirmation',
    },
    buttons: {
      next: 'Continuer vers le paiement',
      confirm: 'Finaliser la commande',
      back_to_shipping: 'Retour Ã  la livraison',
      back_to_cart: 'Retour au panier',
    },
    date: 'Date',
    status: 'Statut',
    guest_notice: 'Connectez-vous pour accÃ©der Ã  votre historique de commandes, votre liste de souhaits et vos remises exclusives de membre !',
    success: 'Commande passÃ©e avec succÃ¨s !',
    address_title: 'Adresse de livraison',
    payment_title: 'Mode de paiement',
    city: 'Ville',
    zip: 'Code postal',
    country: 'Pays',
    payment_options: {
      card: 'Carte de crÃ©dit',
      paypal: 'PayPal'
    },
    secure_connection: 'Connexion sÃ©curisÃ©e',
    gdpr_notice: 'Vos donnÃ©es sont cryptÃ©es en toute sÃ©curitÃ© et ne sont pas stockÃ©es sur nos serveurs. Nous respectons strictement les rÃ©glementations RGPD.',
    invoice_title: 'Facture',
    invoice_desc: 'Vous recevrez une confirmation et une facture par e-mail aprÃ¨s votre commande.',
    fast_shipping: 'Livraison Rapide',
    secure_payment: 'Paiement SÃ©curisÃ©',
    returns: 'Retours sous 30 jours',
    first_name: 'PrÃ©nom',
    phone: 'TÃ©lÃ©phone',
    shipping_note: 'Livraison offerte en Tunisie.',
    card_details: 'CoordonnÃ©es de la carte',
    card: {
      holder: 'Nom sur la carte',
      number: 'NumÃ©ro de carte',
      expiry: 'Expiration',
      cvc: 'CVC',
    },
    demo_notice: 'Paiement dÃ©mo â€” aucun prÃ©lÃ¨vement rÃ©el.',
    coming_soon: 'BientÃ´t',
    empty_title: 'Rien Ã  payer',
    empty_desc: 'Ajoutez Mondas OL au panier avant de commander.',
    continue_shopping: 'Continuer vos achats',
    success_title: 'Merci pour votre commande',
    success_desc: 'Une confirmation sera envoyÃ©e Ã  {{email}} sous peu.',
    order_number: 'Commande',
    error: 'Ã‰chec du paiement. Veuillez rÃ©essayer.',
    payment_pending: 'Le prestataire de paiement sera connectÃ© prochainement.',
  },
  product: {
    specs_title: 'SpÃ©cifications du produit',
    reviews_label: 'avis',
    no_reviews: 'Pas encore d\'avis.',
    related: 'Vous pourriez aussi aimer',
    specs: {
      origin: 'Origine',
      variety: 'VariÃ©tÃ© d\'olive',
      acidity: 'AciditÃ©',
      harvest: 'RÃ©colte'
    },
    tabs: {
      description: 'Description',
      specs: 'SpÃ©cifications',
      reviews: 'Avis'
    },
    not_found: 'Produit non trouvÃ©'
  },
  recipes: {
    badge: 'Cuisine & oliveraie',
    subtitle: 'Recettes, techniques et accords avec Mondas OL â€” huile d\'olive extra vierge de Dougga, Tunisie.',
    filters: {
      all: 'Toutes les recettes',
      technique: 'Technique',
      knowledge: 'Savoir olive',
      pairing: 'Accords',
    },
  },
  chat: {
    welcome: 'Bonjour ! Comment puis-je vous aider Ã  choisir votre huile d\'olive aujourd\'hui ?',
    support_title: brand.chat.support_title,
    support_subtitle: 'Temps de rÃ©ponse typique : secondes',
    placeholder: 'Comment puis-je aider ?',
    default_response: brand.chat.default_response,
  },
  whatsapp: {
    aria_label: brand.whatsapp.aria_label,
    default_message: brand.whatsapp.default_message,
  },
  notifications: {
    recipe: {
      title: 'Nouvelle Recette !',
      desc: 'DÃ©couvrez notre nouvelle vinaigrette au citron.'
    },
    order: {
      title: 'Mise Ã  jour de commande',
      desc: 'Votre commande rÃ©cente a Ã©tÃ© expÃ©diÃ©e.'
    },
    promo: {
      title: 'Promotion',
      desc: '10 % de rÃ©duction sur tous les coffrets avec le code OLEA10.'
    }
  },
  footer: {
    description: brand.footer.description,
    navigation: 'Navigation',
    support: 'Support',
    shipping: 'Infos livraison',
    privacy: 'ConfidentialitÃ©',
    rights: brand.footer.rights,
    designed_by: brand.footer.designed_by,
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Recevez des offres exclusives et des recettes.',
      button: 'S\'inscrire'
    }
  }
};


