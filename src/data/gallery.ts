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

const douggaTitle = (de: string, en: string, fr: string) => ({ de, en, fr });

export const MOCK_GALLERY: GalleryImage[] = [
  {
    id: 'dougga-3953',
    url: '/gallery/dougga/IMG_3953.jpg',
    title: douggaTitle('Olivenbaum, etwa 1000 Jahre alt', 'Olive tree, around 1000 years old', 'Olivier, environ 1000 ans'),
    category: 'tradition',
  },
  {
    id: 'dougga-3986',
    url: '/gallery/dougga/IMG_3986.jpg',
    title: douggaTitle('Zwischen den Bäumen', 'Among the trees', 'Entre les arbres'),
    category: 'nature',
  },
  {
    id: 'dougga-3903',
    url: '/gallery/dougga/IMG_3903.jpg',
    title: douggaTitle('Weite Olivenhaine', 'Wide olive groves', 'Oliveraies ouvertes'),
    category: 'nature',
  },
  {
    id: 'dougga-3964',
    url: '/gallery/dougga/IMG_3964.jpg',
    title: douggaTitle('Dougga in der Ferne', 'Dougga in the distance', 'Dougga au loin'),
    category: 'tradition',
  },
  {
    id: 'dougga-3920',
    url: '/gallery/dougga/IMG_3920.jpg',
    title: douggaTitle('Hügel von Dougga', 'Hills of Dougga', 'Collines de Dougga'),
    category: 'nature',
  },
  {
    id: 'dougga-4055',
    url: '/gallery/dougga/IMG_4055.jpg',
    title: douggaTitle('Olivenbäume aus alter Zeit', 'Olive trees from ancient times', 'Oliviers d’autrefois'),
    category: 'nature',
  },
  {
    id: 'dougga-3944',
    url: '/gallery/dougga/IMG_3944.jpg',
    title: douggaTitle('Landschaft und Erbe', 'Landscape and heritage', 'Paysage et héritage'),
    category: 'tradition',
  },
  {
    id: 'dougga-3837',
    url: '/gallery/dougga/IMG_3837.jpg',
    title: douggaTitle('Olivenhain im Licht', 'Olive grove in light', 'Oliveraie dans la lumière'),
    category: 'nature',
  },
  {
    id: 'dougga-3841',
    url: '/gallery/dougga/IMG_3841.jpg',
    title: douggaTitle('Mondas Hain', 'Mondas grove', 'Oliveraie Mondas'),
    category: 'nature',
  },
  {
    id: 'dougga-3843',
    url: '/gallery/dougga/IMG_3843.jpg',
    title: douggaTitle('Stille Wege', 'Quiet paths', 'Chemins calmes'),
    category: 'lifestyle',
  },
  {
    id: 'dougga-3850',
    url: '/gallery/dougga/IMG_3850.jpg',
    title: douggaTitle('Pfad zur Ernte', 'Path to harvest', 'Chemin vers la récolte'),
    category: 'lifestyle',
  },
  {
    id: 'dougga-3852',
    url: '/gallery/dougga/IMG_3852.jpg',
    title: douggaTitle('Oliven am Zweig', 'Olives on the branch', 'Olives sur la branche'),
    category: 'product',
  },
  {
    id: 'dougga-3858',
    url: '/gallery/dougga/IMG_3858.jpg',
    title: douggaTitle('Nah am Baum', 'Close to the tree', 'Près de l’arbre'),
    category: 'nature',
  },
  {
    id: 'dougga-3864',
    url: '/gallery/dougga/IMG_3864.jpg',
    title: douggaTitle('Silbergrüne Blätter', 'Silver-green leaves', 'Feuilles vert argent'),
    category: 'product',
  },
  {
    id: 'dougga-3918',
    url: '/gallery/dougga/IMG_3918.jpg',
    title: douggaTitle('Blick über den Hain', 'View over the grove', 'Vue sur l’oliveraie'),
    category: 'nature',
  },
  {
    id: 'dougga-3922',
    url: '/gallery/dougga/IMG_3922.jpg',
    title: douggaTitle('Grüne Terrassen', 'Green terraces', 'Terrasses vertes'),
    category: 'nature',
  },
  {
    id: 'dougga-3933',
    url: '/gallery/dougga/IMG_3933.jpg',
    title: douggaTitle('Frühlingslicht', 'Spring light', 'Lumière de printemps'),
    category: 'lifestyle',
  },
  {
    id: 'dougga-3939',
    url: '/gallery/dougga/IMG_3939.jpg',
    title: douggaTitle('Hain und Hügel', 'Grove and hills', 'Oliveraie et collines'),
    category: 'nature',
  },
  {
    id: 'dougga-3941',
    url: '/gallery/dougga/IMG_3941.jpg',
    title: douggaTitle('Linien der Landschaft', 'Lines of the landscape', 'Lignes du paysage'),
    category: 'nature',
  },
  {
    id: 'dougga-3946',
    url: '/gallery/dougga/IMG_3946.jpg',
    title: douggaTitle('Ruinen und Oliven', 'Ruins and olives', 'Ruines et oliviers'),
    category: 'tradition',
  },
  {
    id: 'dougga-3980',
    url: '/gallery/dougga/IMG_3980.jpg',
    title: douggaTitle('Leben im Hain', 'Life in the grove', 'Vie dans l’oliveraie'),
    category: 'lifestyle',
  },
  {
    id: 'dougga-3997',
    url: '/gallery/dougga/IMG_3997.jpg',
    title: douggaTitle('Olivenbaum Detail', 'Olive tree detail', 'Détail d’olivier'),
    category: 'product',
  },
  {
    id: 'dougga-4045',
    url: '/gallery/dougga/IMG_4045.jpg',
    title: douggaTitle('Stamm und Schatten', 'Trunk and shadow', 'Tronc et ombre'),
    category: 'tradition',
  },
];
