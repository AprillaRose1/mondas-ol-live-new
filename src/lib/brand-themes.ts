export type BrandAccent = {
  color: string;
  name: string;
  /** Button / label text on accent surfaces */
  foreground?: string;
  /** Visible ring on dark UI (e.g. white swatch) */
  bordered?: boolean;
};

export const BRAND_ACCENTS: BrandAccent[] = [
  { color: '#b8944f', name: 'Gold' },
  { color: '#c5a059', name: 'Golden' },
  { color: '#36482d', name: 'Olive' },
  { color: '#8c7355', name: 'Earth' },
  { color: '#f5f5f4', name: 'White', foreground: '#0a0a0a', bordered: true },
];

export function applyBrandAccent(accent: BrandAccent | string) {
  const resolved =
    typeof accent === 'string'
      ? BRAND_ACCENTS.find((a) => a.color === accent) ?? { color: accent, name: 'Custom', foreground: '#0a0a0a' }
      : accent;

  document.documentElement.style.setProperty('--brand-primary', resolved.color);
  document.documentElement.style.setProperty('--btn-primary', resolved.color);
  document.documentElement.style.setProperty('--btn-text', resolved.foreground ?? '#0a0a0a');
}
