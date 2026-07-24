'use client';

import { Trans } from 'react-i18next';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  titleKey?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

/** Site-wide page hero typography — use instead of hardcoded text-* classes */
export function PageHeader({
  eyebrow,
  title,
  titleKey,
  subtitle,
  align = 'center',
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'page-header',
        align === 'center' && 'page-header--center',
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title">
        {titleKey ? (
          <Trans i18nKey={titleKey} components={{ accent: <span className="text-accent" /> }} />
        ) : (
          title
        )}
      </h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
    </header>
  );
}

type AccentTitleProps = {
  i18nKey: string;
  className?: string;
  accentClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
};

/** Display heading with <accent> span from i18n */
export function AccentTitle({ i18nKey, className, accentClassName, as: Tag = 'h1' }: AccentTitleProps) {
  return (
    <Tag className={cn(Tag === 'h1' ? 'display-title' : 'section-title', className)}>
      <Trans i18nKey={i18nKey} components={{ accent: <span className={cn('text-accent', accentClassName)} /> }} />
    </Tag>
  );
}

export function FormLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={cn('form-label', className)}>{children}</label>;
}

export function LinkCaps({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('link-caps', className)}>{children}</span>;
}
