import { homeLocales } from './home-locales';
import { brandLocales } from './brand-locales';
import { faqLocales } from './faq-locales';

const brand = brandLocales.en;

export const en = {
  nav: {
    home: 'Home',
    shop: 'Shop',
    story: 'Story',
    recipes: 'Recipes',
    contact: 'Contact',
    faq: 'FAQ',
    wishlist: 'Wishlist'
  },
  header: {
    Themes: 'Themes',
    lang: 'Languages',
  },
  hero: brand.hero,
  home: homeLocales.en,
  story: {
    badge: 'Our Heritage',
    title: 'The Eternal Legacy of Dougga',
    subtitle: 'Journey through three millennia of olive oil mastery in the heart of ancient Tunisia.',
    content: 'For generations, we have tended our olive groves with love and respect for nature. Every autumn, we carefully select the best olives to create this liquid gold.',
    more: 'Read more',
    history: {
      title: 'A Numidian Legacy',
      description: 'The ancient city of Dougga, or Thugga, perched majestically on a hill in northern Tunisia, stands as a silent witness to the golden age of olive cultivation. Under Numidian rule, this region became the olive oil granary of the Empire. The fertile soil and temperate climate provided the perfect conditions for the Chemlali variety to thrive, producing an oil prized across the Mediterranean.',
      image_alt: 'Ancient Numidian ruins of Dougga'
    },
    heritage: {
      title: 'Guardians of the Grove',
      description: brand.story.heritage.description,
      image_alt: 'Local farmers in the olive groves'
    },
    process: {
      title: 'Millennia-Old Mastery',
      description: brand.story.process.description,
      image_alt: 'Traditional olive pressing'
    },
    terroir: {
      title: 'The Sacred Soil',
      description: 'The unique terroir of Douggaâ€”limestone-rich soil and Mediterranean sunâ€”creates a nutrient-dense oil with a profile that cannot be replicated. It is a flavor shaped by history and protected by tradition. Our groves are located just a stone\'s throw from the Capitol of Dougga, absorbing the spirit of this UNESCO World Heritage site.',
      image_alt: 'Olive groves at sunset'
    }
  },
  common: {
    logo_slogan: brand.common.logo_slogan,
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    addedToCart: 'Added to cart!',
    addedToWishlist: 'Added to wishlist!',
    cart: 'Cart',
    checkout: 'Checkout',
    login: 'Login',
    sign_in: 'Sign in',
    logout: 'Logout',
    loading: 'Loading...',
    location: 'Location',
    phone: 'Phone',
    email: 'Email',
    read_more: 'Read more',
    continue: 'Continue'
  },
  shop: {
    badge: 'The Collection',
    title: 'Earth\'s Gold',
    search: 'Search olive oil...',
    categories: {
      all: 'All',
      premium: 'Premium',
      'extra-virgin': 'Extra Virgin',
      infusions: 'Infusions',
      sets: 'Sets'
    },
    sortBy: 'Sort By',
    sortOptions: {
      featured: 'Featured',
      price_asc: 'Price (Low to High)',
      price_desc: 'Price (High to Low)'
    },
    no_results: 'No products found.',
    reset_filters: 'Reset Filters'
  },
  cart: {
    empty: 'Your cart is empty',
    empty_desc: 'It looks like you haven\'t added any liquid gold yet. Explore our collection!',
    continue_shopping: 'Continue Shopping',
    summary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    tax_notice: 'Including VAT and shipping'
  },
  auth: {
    club: brand.auth.club,
    welcome: 'Welcome back',
    create_account: 'Create Account',
    login_desc: 'Please login to continue.',
    register_desc: 'Join our exclusive community.',
    name: 'Name',
    email: 'Email Address',
    password: 'Password',
    confirm_password: 'Confirm password',
    register: 'Register',
    no_account: 'Not a member yet?',
    has_account: 'Already a member?',
    forgot_password: 'Forgot Password?',
    or_with: 'Or continue with',
    register_now: 'Register now',
    social_coming_soon: 'login coming soon',
    welcome_back: 'Welcome back!',
    account_created: 'Account created!',
    error_generic: 'Something went wrong. Please try again.',
    error_email_taken: 'This email is already registered.',
    login_now: 'Login now',
    placeholders: {
      name: 'Full Name',
      email: 'name@email.com'
    }
  },
  profile: {
    title: 'My Account',
    logout: 'Logout',
    orders: 'Orders',
    details: 'Profile Details',
    since: 'Member since',
    addresses: 'Addresses',
    discounts: 'Premium Discounts',
    recent_orders: 'Recent Orders',
    order_id: 'Order ID',
    date: 'Date',
    total: 'Total',
    status: 'Status',
    premium_status: 'Mondas OL member',
    premium_desc: 'As a registered member, you have access to an exclusive 10% discount on all seasonal sets.',
    discount_value: '10% OFF',
    last_name: 'Last Name'
  },
  wishlist: {
    empty: 'Your wishlist is empty',
    empty_desc: 'Save your favorites for later.',
    find_favorites: 'Find Favorites'
  },
  faq: faqLocales.en,
  contact: {
    badge: brand.contact.badge,
    title: brand.contact.title,
    subtitle: brand.contact.subtitle,
    form_title: 'Send us a message',
    info: {
      location: 'Location',
      location_detail: brand.contact.info.location_detail,
      email_value: brand.contact.info.email,
      phone_value: brand.contact.info.phone,
      email: 'Email',
      phone: 'Phone'
    },
    form: {
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      success: 'Message sent â€” we will reply soon.',
      error: 'Could not send your message. Please try again.',
      subjects: {
        general: 'General Inquiry',
        wholesale: 'Wholesale / Business',
        order: 'Order & Shipping',
        feedback: 'Feedback',
      },
    },
    still_questions: 'Still have questions?',
    still_questions_desc: 'Our expert team is happy to help with specific questions about varieties or cooperations.',
    map_eyebrow: 'Visit us',
    map_title: 'Dougga, Tunisia',
    open_maps: 'Open in Maps',
  },
  checkout: {
    title: 'Secure Checkout',
    steps: {
      shipping: 'Shipping',
      payment: 'Payment',
      confirmation: 'Confirmation',
    },
    buttons: {
      next: 'Continue to payment',
      confirm: 'Complete order',
      back_to_shipping: 'Back to shipping',
      back_to_cart: 'Back to cart',
    },
    date: 'Date',
    status: 'Status',
    guest_notice: 'Sign in to access your order history, wishlist and exclusive member discounts!',
    success: 'Order placed successfully!',
    address_title: 'Shipping Address',
    payment_title: 'Payment Method',
    city: 'City',
    zip: 'ZIP',
    country: 'Country',
    payment_options: {
      card: 'Credit Card',
      paypal: 'PayPal'
    },
    secure_connection: 'Secure Connection',
    gdpr_notice: 'Your data is securely encrypted and not stored on our servers. We strictly adhere to GDPR regulations.',
    invoice_title: 'Invoice',
    invoice_desc: 'You will receive a confirmation and invoice via email after ordering.',
    fast_shipping: 'Fast Shipping',
    secure_payment: 'Secure Payment',
    returns: '30 Day Returns',
    first_name: 'First name',
    phone: 'Phone',
    shipping_note: 'Complimentary shipping on all orders within Tunisia.',
    card_details: 'Card details',
    card: {
      holder: 'Name on card',
      number: 'Card number',
      expiry: 'Expiry',
      cvc: 'CVC',
    },
    demo_notice: 'Demo checkout â€” no real payment is processed.',
    coming_soon: 'Soon',
    empty_title: 'Nothing to checkout',
    empty_desc: 'Add Mondas OL to your cart before completing your order.',
    continue_shopping: 'Continue shopping',
    success_title: 'Thank you for your order',
    success_desc: 'A confirmation will be sent to {{email}} shortly.',
    order_number: 'Order',
    error: 'Checkout failed. Please try again.',
    payment_pending: 'Payment provider will be connected soon.',
  },
  product: {
    specs_title: 'Product Specifications',
    reviews_label: 'reviews',
    no_reviews: 'No reviews yet.',
    related: 'You Might Also Like',
    specs: {
      origin: 'Origin',
      variety: 'Olive Variety',
      acidity: 'Acidity',
      harvest: 'Harvest'
    },
    tabs: {
      description: 'Description',
      specs: 'Specifications',
      reviews: 'Reviews'
    },
    not_found: 'Product not found'
  },
  recipes: {
    badge: 'Kitchen & grove',
    subtitle: 'Recipes, techniques, and pairings with Mondas OL â€” extra virgin olive oil from Dougga, Tunisia.',
    filters: {
      all: 'All recipes',
      technique: 'Technique',
      knowledge: 'Olive wisdom',
      pairing: 'Pairings',
    },
  },
  chat: {
    welcome: 'Hello! How can I help you choose your olive oil today?',
    support_title: brand.chat.support_title,
    support_subtitle: 'Typical response time: seconds',
    placeholder: 'How can I help?',
    default_response: brand.chat.default_response,
  },
  whatsapp: {
    aria_label: brand.whatsapp.aria_label,
    default_message: brand.whatsapp.default_message,
  },
  notifications: {
    recipe: {
      title: 'New Recipe!',
      desc: 'Discover our new lemon vinaigrette.'
    },
    order: {
      title: 'Order Update',
      desc: 'Your recent order has been shipped.'
    },
    promo: {
      title: 'Promotion',
      desc: '10% discount on all sets with code OLEA10.'
    }
  },
  footer: {
    description: brand.footer.description,
    navigation: 'Navigation',
    support: 'Support',
    shipping: 'Shipping Info',
    privacy: 'Privacy',
    rights: brand.footer.rights,
    designed_by: brand.footer.designed_by,
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Get exclusive offers and recipes.',
      button: 'Sign Up'
    }
  }
};

