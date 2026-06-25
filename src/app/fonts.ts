import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

/** Display / editorial — olive-oil boutique heritage */
export const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

/** UI / body — clean, restrained sans */
export const fontBody = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});
