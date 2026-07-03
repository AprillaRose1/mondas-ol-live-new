export interface GalleryImage {
  id: string;
  url: string;
  title: {
    de: string;
    en: string;
    fr: string;
  };
  category: string;
}

export const MOCK_GALLERY: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000',
    title: { de: 'Olivenhain bei Sonnenaufgang', en: 'Olive Grove at Sunrise', fr: 'Oliveraie au lever du soleil' },
    category: 'nature',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?auto=format&fit=crop&q=80&w=1000',
    title: { de: 'Frisch gepresstes Öl', en: 'Freshly Pressed Oil', fr: 'Huile fraîchement pressée' },
    category: 'product',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1464306311035-642136709731?auto=format&fit=crop&q=80&w=1000',
    title: { de: 'Traditionelle Ernte', en: 'Traditional Harvest', fr: 'Récolte traditionnelle' },
    category: 'tradition',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=1000',
    title: { de: 'Goldene Oliven', en: 'Golden Olives', fr: 'Olives dorées' },
    category: 'nature',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1502472545331-db0df3019865?auto=format&fit=crop&q=80&w=1000',
    title: { de: 'Küchen-Ästhetik', en: 'Kitchen Aesthetics', fr: 'Esthétique de la cuisine' },
    category: 'lifestyle',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=1000',
    title: { de: 'Die Kunst des Öls', en: 'The Art of Oil', fr: "L'art de l'huile" },
    category: 'product',
  },
];
