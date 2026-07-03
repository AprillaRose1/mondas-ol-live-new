'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, Globe, Menu, X, MoreHorizontal } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks/redux';
import { cn } from '@/lib/utils';
import { BRAND_ACCENTS, applyBrandAccent } from '@/lib/brand-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const Header = () => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  const isNavActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const langTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLangEnter = () => {
    if (langTimeout.current) clearTimeout(langTimeout.current);
    setIsLangOpen(true);
  };

  const handleLangLeave = () => {
    langTimeout.current = setTimeout(() => {
      setIsLangOpen(false);
    }, 300);
  };

  const handleMoreEnter = () => {
    if (moreTimeout.current) clearTimeout(moreTimeout.current);
    setIsMoreOpen(true);
  };

  const handleMoreLeave = () => {
    moreTimeout.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 300);
  };
  
  const cartCount = useAppSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistCount = useAppSelector(state => state.wishlist.itemIds.length);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/story', label: t('nav.story') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const moreLinks = [
    { to: '/gallery', label: t('nav.gallery', 'Gallery') },
    { to: '/recipes', label: t('nav.recipes') },
    { to: '/faq', label: t('nav.faq') },
  ];

  const mobileNavLinks = [...navLinks, ...moreLinks];

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isFullBleedHero = pathname === '/' || pathname === '/story';
  const headerOverHero = isFullBleedHero && !isScrolled;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b font-sans transition-all duration-300 px-5 lg:px-10',
          headerOverHero
            ? 'border-transparent bg-transparent py-5 shadow-none backdrop-blur-none'
            : isScrolled
              ? 'border-border-subtle bg-bg-nav/95 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md'
              : 'border-border-subtle bg-bg-nav/95 py-5 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="group flex items-center">
            <Logo />
          </Link>
  
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  href={link.to}
                  className={cn(
                    'label-caps relative py-1.5 transition-all hover:text-primary group',
                    isNavActive(link.to)
                      ? 'text-primary'
                      : 'text-text-main opacity-80 hover:opacity-100',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-700 group-hover:w-full',
                      isNavActive(link.to) ? 'w-full' : 'w-0',
                    )}
                  />
                </Link>
              </motion.div>
            ))}

            {/* 3 Dots More Menu */}
            <div 
              className="relative"
              onMouseEnter={handleMoreEnter}
              onMouseLeave={handleMoreLeave}
            >
              <button 
                className={cn(
                  "p-2 text-text-main hover:text-primary transition-colors flex items-center group",
                  isMoreOpen && "text-primary shadow-sm"
                )}
              >
                <MoreHorizontal size={20} strokeWidth={1.5} className="transition-transform duration-500" />
              </button>
              
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute right-0 top-full pt-2 z-50"
                  >
                    <div className="bg-bg-nav border border-border-subtle rounded-sm shadow-2xl overflow-hidden py-1 min-w-[160px] backdrop-blur-md">
                      {moreLinks.map((link) => (
                        <Link
                          key={link.to}
                          href={link.to}
                          className={cn(
                            'nav-label w-full px-4 py-3 text-left text-text-main transition-all hover:bg-primary hover:text-primary-foreground flex items-center justify-between group/item',
                            isNavActive(link.to) ? 'text-primary bg-primary/5' : '',
                          )}
                        >
                          {link.label}
                          {isNavActive(link.to) && (
                            <div className="w-1 h-1 rounded-full bg-primary" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
  
          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            <div 
              className="relative hidden sm:block"
              onMouseEnter={handleLangEnter}
              onMouseLeave={handleLangLeave}
            >
              <button 
                className={cn(
                  "p-2 text-text-main hover:text-primary transition-colors flex items-center gap-1 group",
                  isLangOpen && "text-primary"
                )}
              >
                <Globe size={18} strokeWidth={1.5} className={cn("transition-transform duration-500", isLangOpen && "rotate-12")} />
                <span className="nav-label">{i18n.language.slice(0, 2)}</span>
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute right-0 top-full pt-2 z-50"
                  >
                    <div className="bg-bg-nav border border-border-subtle rounded-sm shadow-2xl overflow-hidden py-1 min-w-[140px] backdrop-blur-md">
                      {['de', 'en', 'fr'].map((lng) => (
                        <button
                          key={lng}
                          onClick={() => {
                            changeLanguage(lng);
                            setIsLangOpen(false);
                          }}
                          className={cn(
                            'nav-label w-full px-4 py-2.5 text-left text-text-main transition-all hover:bg-primary hover:text-primary-foreground flex items-center justify-between group/item',
                            i18n.language.startsWith(lng) && "text-primary bg-primary/5"
                          )}
                        >
                          {lng}
                          {i18n.language.startsWith(lng) && <div className="w-1 h-1 rounded-full bg-primary" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
  
            <Link href="/wishlist" className="p-2 text-text-main hover:text-primary transition-colors relative hidden md:block group">
              <Heart size={18} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-12" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
  
            <Link href="/cart" className="p-2 text-text-main hover:text-primary transition-colors relative group">
              <ShoppingCart size={18} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-12" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
  
            <button className="lg:hidden p-2 text-text-main" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
  
      {/* Mobile Menu - Outside the header to avoid stacking context issues with backdrop-blur */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[100] flex h-[100dvh] flex-col bg-bg-nav text-text-main"
          >
            <div className="flex shrink-0 items-center justify-between p-8">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="group inline-flex">
                <Logo />
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-3 bg-bg-card rounded-full text-text-main shadow-sm"
              >
                <X size={24} />
              </button>
            </div>
  
            <div className="min-h-0 flex-1 overflow-y-auto px-8">
              <nav className="mb-12 flex flex-col gap-4">
                {mobileNavLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Link
                      href={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="nav-label block py-1 text-2xl text-text-main transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
  
              <div className="space-y-10 pb-8">
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/wishlist" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="nav-label relative flex items-center justify-center gap-2 border border-border-subtle bg-bg-card py-4 text-text-main"
                  >
                    <Heart size={16} />
                    {t('nav.wishlist')}
                    {wishlistCount > 0 && (
                      <span className="ml-1 bg-primary text-primary-foreground text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="nav-label relative flex items-center justify-center gap-2 border border-border-subtle bg-bg-card py-4 text-text-main"
                  >
                    <ShoppingCart size={16} />
                    {t('common.cart')}
                    {cartCount > 0 && (
                      <span className="ml-1 bg-primary text-primary-foreground text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
  
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="label-caps">{t('header.lang')}</span>
                    <div className="flex gap-2">
                      {['de', 'en', 'fr'].map((lng) => (
                        <button
                          key={lng}
                          onClick={() => changeLanguage(lng)}
                          className={cn(
                            'flex size-8 items-center justify-center rounded-full border text-[10px] font-bold uppercase transition-all',
                            i18n.language.startsWith(lng)
                              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                              : 'border-border-subtle bg-bg-card text-text-muted',
                          )}
                        >
                          {lng}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="label-caps">Accent</span>
                    <div className="flex gap-4">
                      {BRAND_ACCENTS.map((accent) => (
                        <motion.button
                          key={accent.color}
                          type="button"
                          onClick={() => applyBrandAccent(accent)}
                          whileTap={{ scale: 0.8, rotate: -15 }}
                          className={cn(
                            'size-5 rounded-full shadow-sm',
                            accent.bordered && 'ring-1 ring-border-strong ring-offset-1 ring-offset-bg-page',
                          )}
                          style={{ backgroundColor: accent.color }}
                          aria-label={accent.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border-subtle px-8 py-6">
              <p className="label-caps text-center text-text-muted">
                Â© {new Date().getFullYear()} {t('footer.rights')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

