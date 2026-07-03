import { Product } from '@/lib/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: {
      de: "Goldene Ernte Extra Vergine",
      en: "Golden Harvest Extra Virgin",
      fr: "Récolte d'Or Extra Vierge",    },
    description: {
      de: "Unser Flaggschiff unter den Olivenölen, kalt gepresst aus den feinsten Koroneiki-Oliven.",
      en: "Our flagship olive oil, cold-pressed from the finest Koroneiki olives.",
      fr: "Notre huile d'olive phare, pressée à froid à partir des meilleures olives Koroneiki.",    },
    price: 34.99,
    images: [
      "/products/product1.png",
      "/products/product.png"
    ],
    category: "premium",
    rating: 4.8,
    reviewsCount: 124,
    stock: 50,
    isFeatured: true
  },
  // {
  //   id: "p2",
  //   name: {
  //     de: "Zitroneninfusion",
  //     en: "Lemon Infusion",
  //     fr: "Infusion de Citron",
  //     ar: "تسريب الليمون"
  //   },
  //   description: {
  //     de: "Frische Zitronenschalen, die zusammen mit reifen Oliven gepresst werden.",
  //     en: "Fresh lemon rinds pressed together with ripe olives.",
  //     fr: "Zestes de citron frais pressés avec des olives mûres.",
  //     ar: "قشور الليمون الطازجة معصورة مع الزيتون الناضج."
  //   },
  //   price: 28.50,
  //   images: [
  //     "/products/product2.jpg",
  //   ],
  //   category: "infusions",
  //   rating: 4.5,
  //   reviewsCount: 89,
  //   stock: 30,
  //   isFeatured: true
  // },
  // {
  //   id: "p3",
  //   name: {
  //     de: "Frühe Ernte (Agourelaio)",
  //     en: "Early Harvest (Agourelaio)",
  //     fr: "Récolte Précoce (Agourelaio)",
  //     ar: "الحصاد المبكر (أغوريليو)"
  //   },
  //   description: {
  //     de: "Reich an Polyphenolen, mit einem intensiven grünen Aroma und pfeffrigem Abgang.",
  //     en: "Rich in polyphenols, with an intense green aroma and peppery finish.",
  //     fr: "Riche en polyphénols, avec un arôme vert intense et une finale poivrée.",
  //     ar: "غني بالبوليفينول، مع رائحة خضراء مكثفة ولمسة نهائية فلفلية."
  //   },
  //   price: 42.00,
  //   images: [
  //     "/products/product3.jpg"
  //   ],
  //   category: "extra-virgin",
  //   rating: 4.9,
  //   reviewsCount: 56,
  //   stock: 15,
  //   isFeatured: true
  // },
  // {
  //   id: "p4",
  //   name: {
  //     de: "Bio-Olivenöl Set",
  //     en: "Organic Olive Oil Set",
  //     fr: "Coffret Huile d'Olive Bio",
  //     ar: "مجموعة زيت زيتون عضوي"
  //   },
  //   description: {
  //     de: "Ein Set aus drei verschiedenen Sorten für den anspruchsvollen Gaumen.",
  //     en: "A set of three different varieties for the discerning palate.",
  //     fr: "Un ensemble de trois variétés différentes pour le palais averti.",
  //     ar: "مجموعة من ثلاثة أصناف مختلفة للحنك المتميز."
  //   },
  //   price: 85.00,
  //   images: [
  //     "/products/product5.jpg"
  //   ],
  //   category: "sets",
  //   rating: 4.7,
  //   reviewsCount: 34,
  //   stock: 20,
  //   isFeatured: false
  // }
];
