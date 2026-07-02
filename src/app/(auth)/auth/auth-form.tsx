'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { login, register } from '@/lib/api/auth';
import type { SessionUser } from '@/lib/auth/types';
import { ApiError } from '@/lib/api/http';
import { toReduxUser } from '@/lib/auth/credentials';
import { ROUTES } from '@/lib/auth/constants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { setUser } from '@/store/slices/authSlice';
import { MondasButton } from '@/components/ui/mondas-button';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types/user';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '@/lib/schemas';
import { FormLabel } from '@/components/ui/typography';

// ── Password input with show/hide toggle ──────────────────────────────────────
function PasswordInput({ id, placeholder, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted/50" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className="h-[50px] w-full rounded-sm border border-border-subtle bg-bg-page pl-12 pr-12 py-3 text-sm focus:ring-1 focus:ring-primary"
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-primary transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-[10px] font-bold uppercase text-red-500">{error}</p>}
    </div>
  );
}

// ── Login form ─────────────────────────────────────────────────────────────────
function LoginFormBody({ loading, onSubmit }: { loading: boolean; onSubmit: (d: LoginFormData) => void }) {
  const { t } = useTranslation();
  const { register: rf, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('auth.email')}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted/50" />
          <input
            {...rf('email')}
            type="email"
            autoComplete="email"
            className="h-[50px] w-full rounded-sm border border-border-subtle bg-bg-page px-12 py-3 text-sm focus:ring-1 focus:ring-primary"
            placeholder="name@email.com"
          />
        </div>
        {errors.email && <p className="text-[10px] font-bold uppercase text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <FormLabel>{t('auth.password')}</FormLabel>
        <PasswordInput {...rf('password')} autoComplete="current-password" placeholder="••••••••" error={errors.password?.message} />
      </div>
      <MondasButton type="submit" loading={loading} className="w-full justify-center gap-3 mt-2">
        {t('common.login')} <ArrowRight size={18} />
      </MondasButton>
    </form>
  );
}

// ── Register form ──────────────────────────────────────────────────────────────
function RegisterFormBody({ loading, onSubmit }: { loading: boolean; onSubmit: (d: RegisterFormData) => void }) {
  const { t } = useTranslation();
  const { register: rf, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <FormLabel>{t('auth.name', 'Name')}</FormLabel>
        <div className="relative">
          <UserIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted/50" />
          <input
            {...rf('name')}
            autoComplete="name"
            className="h-[50px] w-full rounded-sm border border-border-subtle bg-bg-page px-12 py-3 text-sm focus:ring-1 focus:ring-primary"
            placeholder={t('auth.placeholders.name', 'Full Name')}
          />
        </div>
        {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{t('auth.email')}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted/50" />
          <input
            {...rf('email')}
            type="email"
            autoComplete="email"
            className="h-[50px] w-full rounded-sm border border-border-subtle bg-bg-page px-12 py-3 text-sm focus:ring-1 focus:ring-primary"
            placeholder="name@email.com"
          />
        </div>
        {errors.email && <p className="text-[10px] font-bold uppercase text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <FormLabel>{t('auth.password')}</FormLabel>
        <PasswordInput {...rf('password')} autoComplete="new-password" placeholder="••••••••" error={errors.password?.message} />
      </div>
      <div className="space-y-1.5">
        <FormLabel>{t('auth.confirm_password', 'Confirm password')}</FormLabel>
        <PasswordInput {...rf('confirmPassword')} autoComplete="new-password" placeholder="••••••••" error={errors.confirmPassword?.message} />
      </div>
      <MondasButton type="submit" loading={loading} className="w-full justify-center gap-3 mt-2">
        {t('auth.register', 'Register')} <ArrowRight size={18} />
      </MondasButton>
    </form>
  );
}

// ── Google SVG icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// ── Meta SVG icon ─────────────────────────────────────────────────────────────
function MetaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#0866FF" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

// ── Social auth buttons ────────────────────────────────────────────────────────
function SocialAuthButtons() {
  const { t } = useTranslation();
  const handleSocial = (_provider: 'google' | 'facebook') => {
    // Standalone build: social OAuth needs the backend and is disabled here.
    toast.info(t('auth.social_coming_soon', 'Social login is unavailable in this demo'));
  };
  return (
    <>
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-bg-card px-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {t('auth.or_with', 'Or continue with')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocial('google')}
          className="flex items-center justify-center gap-2 rounded-sm border border-border-subtle py-3 transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
        >
          <GoogleIcon />
          <span className="text-xs font-bold uppercase tracking-widest">Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocial('facebook')}
          className="flex items-center justify-center gap-2 rounded-sm border border-border-subtle py-3 transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
        >
          <MetaIcon />
          <span className="text-xs font-bold uppercase tracking-widest">Meta</span>
        </button>
      </div>
    </>
  );
}

// ── Main auth page ────────────────────────────────────────────────────────────
export default function AuthPageClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  const finishAuth = (user: SessionUser) => {
    dispatch(setUser(toReduxUser(user)));
    toast.success(mode === 'login' ? t('auth.welcome_back', 'Welcome back!') : t('auth.account_created', 'Account created!'));

    const redirect = searchParams.get('redirect');
    if (redirect) { router.push(redirect); return; }

    if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
      router.push(ROUTES.adminDashboard);
    } else if (cartItems.length > 0) {
      router.push('/cart');
    } else {
      router.push(ROUTES.shop);
    }
  };

  const onLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const { user } = await login({ email: data.email, password: data.password });
      finishAuth(user);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('auth.error_generic', 'Something went wrong. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // confirmPassword is client-side only — not sent to backend
      const { user } = await register({ email: data.email, password: data.password, name: data.name });
      finishAuth(user);
    } catch (err) {
      const msg = err instanceof ApiError
        ? err.status === 409
          ? t('auth.error_email_taken', 'This email is already registered.')
          : err.message
        : t('auth.error_generic', 'Something went wrong. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="border border-border-subtle bg-bg-card p-8 shadow-xl shadow-primary/5 md:p-12">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="eyebrow justify-center">{t('auth.club', 'The Olea Club')}</span>
          <h1 className="page-title mt-4 text-2xl md:text-3xl">
            {mode === 'login' ? t('auth.welcome', 'Welcome back') : t('auth.create_account', 'Create Account')}
          </h1>
          <p className="page-subtitle mt-2 text-sm">
            {mode === 'login' ? t('auth.login_desc') : t('auth.register_desc')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-8 flex border border-border-subtle bg-bg-page p-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all',
                mode === m ? 'bg-text-main text-bg-page' : 'text-text-muted hover:text-text-main',
              )}
            >
              {m === 'login' ? t('common.login') : t('auth.register', 'Register')}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div key="login" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }}>
              <LoginFormBody loading={loading} onSubmit={onLogin} />
            </motion.div>
          ) : (
            <motion.div key="register" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}>
              <RegisterFormBody loading={loading} onSubmit={onRegister} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social */}
        <SocialAuthButtons />

        {/* Switch mode */}
        <p className="mt-6 text-center text-sm text-text-muted">
          {mode === 'login' ? t('auth.no_account', 'Not a member yet?') : t('auth.has_account', 'Already a member?')}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-bold text-primary hover:underline text-xs uppercase tracking-widest"
          >
            {mode === 'login' ? t('auth.register_now', 'Register now') : t('auth.login_now', 'Login now')}
          </button>
        </p>
      </div>
    </div>
  );
}

