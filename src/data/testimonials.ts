import { Testimonial } from '@/lib/types';

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Sophie Müller',
    userRole: 'Verified Customer',
    text: 'Das beste Olivenöl, das ich je probiert habe. Man schmeckt die Sonne Tunesiens in jedem Tropfen.',
    rating: 5,
    date: '2024-03-15'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Marc Lefebvre',
    userRole: 'Food Critic',
    text: 'Ein Muss für jede Küche. Die Qualität ist unübertroffen und die Lieferung war extrem schnell.',
    rating: 5,
    date: '2024-03-12'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Elena Rossi',
    userRole: 'Gourmet Chef',
    text: 'Die Infusionen sind göttlich. Besonders das Zitronenöl passt perfekt zu Fischgerichten.',
    rating: 5,
    date: '2024-03-10'
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Julian Baker',
    userRole: 'Health Enthusiast',
    text: 'I use the early harvest oil for its high polyphenol content. Great taste and health benefits.',
    rating: 4,
    date: '2024-03-05'
  }
];
