import type { Variants, ViewportOptions } from 'framer-motion';

/** Single-phase ease — avoids a slow start with a fast snap at the end */
const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/** App-wide motion timing — keep snappy */
export const motionTransition = { duration: 0.65, ease };

export const motionStagger = {
  staggerChildren: 0.1,
  delayChildren: 0.06,
};

/** Re-animates whenever the element enters the viewport (e.g. on each scroll down) */
export const scrollViewport: ViewportOptions = {
  once: false,
  amount: 0.25,
  margin: '0px 0px -10% 0px',
};

export const footerViewport: ViewportOptions = {
  once: false,
  amount: 0.12,
  margin: '0px 0px -5% 0px',
};

const transition = motionTransition;
const staggeredTransition = motionStagger;

/** Text column first; image column follows (home + story splits) */
export const SPLIT_IMAGE_DELAY = 0.08;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: staggeredTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition },
};

/** Story / hero imagery — subtle zoom in (no horizontal slide) */
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition },
};

/** Image panels — slide only, no opacity fade */
export const slideInRightImage: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { ...transition, delay: SPLIT_IMAGE_DELAY } },
};

export const slideInLeftImage: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { ...transition, delay: SPLIT_IMAGE_DELAY } },
};

/** Split text columns — no delay */
export const storyRevealFromLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition },
};

export const storyRevealFromRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition },
};

/** Split image columns — after text */
export const storyRevealFromLeftDelayed: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { ...transition, delay: SPLIT_IMAGE_DELAY } },
};

export const storyRevealFromRightDelayed: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { ...transition, delay: SPLIT_IMAGE_DELAY } },
};

export const revealText: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.75, ease } },
};
