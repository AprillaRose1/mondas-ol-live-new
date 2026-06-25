'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, scrollViewport } from '@/lib/animations';
import { FormLabel } from '@/components/ui/typography';
import { MondasButton } from '@/components/ui/mondas-button';
import { submitContactMessage } from '@/lib/api/contact';
import { ApiError } from '@/lib/api/http';
import {
  CONTACT_SUBJECTS,
  contactFormSchema,
  type ContactFormData,
  type ContactSubject,
} from '@/lib/schemas';

export function ContactForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: 'general',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactMessage(data);
      toast.success(t('contact.form.success'));
      reset({ name: '', email: '', subject: 'general', message: '' });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t('contact.form.error');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={fadeInUp} className="card-premium relative overflow-hidden p-8 md:p-12" initial="hidden" whileInView="visible" viewport={scrollViewport}>
      <form className="relative z-10 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FormLabel>{t('auth.name')}</FormLabel>
            <input type="text" autoComplete="name" {...register('name')} className="w-full" />
            {errors.name && (
              <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <FormLabel>{t('auth.email')}</FormLabel>
            <input type="email" autoComplete="email" {...register('email')} className="w-full" />
            {errors.email && (
              <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <FormLabel>{t('contact.form.subject')}</FormLabel>
          <select {...register('subject')} className="w-full">
            {CONTACT_SUBJECTS.map((key) => (
              <option key={key} value={key}>
                {t(`contact.form.subjects.${key as ContactSubject}`)}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <FormLabel>{t('contact.form.message')}</FormLabel>
          <textarea rows={5} className="w-full resize-none" {...register('message')} />
          {errors.message && (
            <p className="mt-1 text-[10px] font-semibold uppercase text-red-500">{errors.message.message}</p>
          )}
        </div>

        <MondasButton type="submit" loading={isSubmitting} className="w-full gap-2 py-4">
          {t('contact.form.send')} <Send size={16} />
        </MondasButton>
      </form>
    </motion.div>
  );
}
