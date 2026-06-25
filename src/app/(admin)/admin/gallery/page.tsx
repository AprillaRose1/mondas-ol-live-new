'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Edit3, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { uploadMediaBatch } from '@/lib/api/media';
import {
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/lib/api/gallery';
import { ApiError } from '@/lib/api/http';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';
import type { GalleryImage } from '@/data/gallery';

interface GalleryForm {
  url: string;
  titleDe: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  category: string;
}

const EMPTY_FORM: GalleryForm = {
  url: '',
  titleDe: '',
  titleEn: '',
  titleFr: '',
  titleAr: '',
  category: 'nature',
};

const CATEGORIES = ['nature', 'product', 'tradition', 'lifestyle'];

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: GalleryImage } | null>(null);
  const [form, setForm] = useState<GalleryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchGallery(1, 100);
      setItems(result.data);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ mode: 'create' }); };

  const openEdit = (item: GalleryImage) => {
    setForm({
      url: item.url,
      titleDe: item.title.de,
      titleEn: item.title.en,
      titleFr: item.title.fr,
      titleAr: item.title.ar,
      category: item.category,
    });
    setModal({ mode: 'edit', item });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = await uploadMediaBatch(Array.from(files));
      setForm((f) => ({ ...f, url: results[0].url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Upload failed (is MinIO running?)');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.titleEn) { toast.error('English title is required'); return; }
    if (!form.url) { toast.error('Image is required (upload or paste URL)'); return; }
    setSaving(true);
    try {
      const payload = {
        url: form.url,
        title: { de: form.titleDe || form.titleEn, en: form.titleEn, fr: form.titleFr || form.titleEn, ar: form.titleAr || form.titleEn },
        category: form.category,
      };
      if (modal?.mode === 'edit' && modal.item) {
        await updateGalleryItem(modal.item.id, payload);
        toast.success('Gallery item updated');
      } else {
        await createGalleryItem(payload);
        toast.success('Gallery item created');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryImage) => {
    if (!confirm('Delete "' + item.title.en + '"?')) return;
    try {
      await deleteGalleryItem(item.id);
      toast.success('Gallery item deleted');
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  };

  const F = (key: keyof GalleryForm) => ({
    value: String(form[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const inputCls = 'w-full bg-bg-page border border-border-subtle px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none';

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="mb-12">
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Media Management</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter flex items-center gap-3">
                Gallery <span className="text-primary italic font-serif font-normal">Items</span>
              </h1>
            </div>
            <button onClick={openCreate}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-xl shadow-primary/20">
              <Plus size={16} /> Add New Item
            </button>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading && (
            <div className="col-span-full text-center py-20 text-text-muted">Loading...</div>
          )}
          {!loading && items.length === 0 && (
            <div className="col-span-full text-center py-20 text-text-muted">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">No gallery items yet. Add your first one.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id}
              className="group relative bg-bg-card border border-border-subtle overflow-hidden hover:border-primary/30 transition-all"
            >
              <div className="aspect-[4/3] bg-bg-page overflow-hidden">
                <AppImage src={item.url} alt={item.title.en} sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-4">
                <span className="text-[9px] uppercase tracking-widest font-bold text-primary">{item.category}</span>
                <p className="text-sm font-bold mt-1 truncate">{item.title.en}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)}
                  className="p-1.5 bg-black/60 text-white hover:bg-primary transition-colors rounded" title="Edit">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(item)}
                  className="p-1.5 bg-black/60 text-white hover:bg-rose-500 transition-colors rounded" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-bg-card border border-border-subtle w-full max-w-lg max-h-[90vh] overflow-y-auto z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="text-lg font-bold uppercase tracking-tighter">
                {modal.mode === 'create' ? 'New Gallery Item' : 'Edit Gallery Item'}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 hover:text-primary transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Image preview + upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Image</label>
                {form.url && (
                  <div className="relative w-full aspect-video bg-bg-page border border-border-subtle overflow-hidden mb-2">
                    <AppImage src={form.url} alt="" sizes="500px" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <label className={cn(
                    'flex items-center gap-2 px-4 py-2 border border-border-subtle text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:border-primary transition-colors',
                    uploading && 'opacity-50 pointer-events-none',
                  )}>
                    <Upload size={14} />{uploading ? 'Uploading…' : 'Upload image'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
                  </label>
                  <span className="text-[10px] text-text-muted">JPEG / PNG / WebP</span>
                </div>
                <input {...F('url')} placeholder="Or paste image URL"
                  className={inputCls} />
              </div>

              {/* Localized titles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Title (EN) *</label>
                  <input {...F('titleEn')} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Title (DE)</label>
                  <input {...F('titleDe')} placeholder="Defaults to EN" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Title (FR)</label>
                  <input {...F('titleFr')} placeholder="Defaults to EN" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Title (AR)</label>
                  <input {...F('titleAr')} placeholder="Defaults to EN" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Category</label>
                  <select {...F('category')} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-border-subtle">
              <button onClick={() => setModal(null)}
                className="px-6 py-2.5 border border-border-subtle text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50">
                {modal.mode === 'create' ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
