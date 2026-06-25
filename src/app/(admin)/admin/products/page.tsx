'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Package, Plus, Edit3, Trash2, Search, X, Save, CheckCircle2, XCircle, Upload, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useProducts } from '@/lib/hooks/useProducts';
import { createProduct, deleteProduct, updateProduct } from '@/lib/api/products';
import { uploadMediaBatch } from '@/lib/api/media';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';
import type { Product } from '@/lib/types';
import { ApiError } from '@/lib/api/http';

interface ProductForm {
  nameEn: string;
  nameDe: string;
  nameFr: string;
  nameAr: string;
  descEn: string;
  price: string;
  stock: string;
  category: string;
  images: string;
  isFeatured: boolean;
}

const EMPTY_FORM: ProductForm = { nameEn: '', nameDe: '', nameFr: '', nameAr: '', descEn: '', price: '', stock: '', category: 'premium', images: '', isFeatured: false };

function toPayload(form: ProductForm) {
  return {
    name: { en: form.nameEn, de: form.nameDe || form.nameEn, fr: form.nameFr || form.nameEn, ar: form.nameAr || form.nameEn },
    description: { en: form.descEn, de: form.descEn, fr: form.descEn, ar: form.descEn },
    price: parseFloat(form.price),
    stock: parseInt(form.stock),
    category: form.category as Product['category'],
    images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    isFeatured: form.isFeatured,
  };
}

export default function ProductManagement() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2) as 'de' | 'en' | 'fr' | 'ar';
  const { products, loading, refetch } = useProducts({ limit: 50 });

  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; product?: Product } | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const imageList = form.images.split(',').map((s) => s.trim()).filter(Boolean);

  const setImages = (urls: string[]) => setForm((f) => ({ ...f, images: urls.join(', ') }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = await uploadMediaBatch(Array.from(files));
      setImages([...imageList, ...results.map((r) => r.url)]);
      toast.success(results.length + ' image' + (results.length > 1 ? 's' : '') + ' uploaded');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Upload failed (is MinIO running?)');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url: string) => setImages(imageList.filter((u) => u !== url));

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.en.toLowerCase().includes(q) || p.name.de.toLowerCase().includes(q) || p.category.includes(q);
  });

  const openCreate = () => { setForm(EMPTY_FORM); setModal({ mode: 'create' }); };
  const openEdit = (p: Product) => {
    setForm({
      nameEn: p.name.en, nameDe: p.name.de, nameFr: p.name.fr, nameAr: p.name.ar,
      descEn: p.description.en, price: String(p.price), stock: String(p.stock),
      category: p.category, images: p.images.join(', '), isFeatured: p.isFeatured,
    });
    setModal({ mode: 'edit', product: p });
  };

  const handleSave = async () => {
    if (!form.nameEn || !form.price || !form.stock) { toast.error('Name, price and stock are required'); return; }
    setSaving(true);
    try {
      if (modal?.mode === 'edit' && modal.product) {
        await updateProduct(modal.product.id, toPayload(form));
        toast.success('Product updated');
      } else {
        await createProduct(toPayload(form));
        toast.success('Product created');
      }
      setModal(null);
      refetch(); // re-pull the list in place — keeps the success toast on screen
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Delete ' + name + '?')) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success(name + ' deleted');
      refetch();
    } catch (err) {
      // Surfaces the backend 409 ("deactivate instead") and any other message
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete');
    } finally { setDeletingId(null); }
  };

  const F = (key: keyof ProductForm) => ({
    value: String(form[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Inventory Control</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Product <span className="text-primary italic font-serif font-normal">Catalog</span>
            </h1>
          </motion.div>
          <motion.button variants={fadeInUp} onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-xl shadow-primary/20"
          >
            <Plus size={16} /> Add New Product
          </motion.button>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full bg-bg-card border border-border-subtle pl-12 pr-4 py-4 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="bg-bg-card border border-border-subtle overflow-hidden"
        >
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-bg-page border-b border-border-subtle text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">
                  <th className="px-8 py-5">Product</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Stock</th>
                  <th className="px-8 py-5">Featured</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr><td colSpan={6} className="px-8 py-12 text-center text-text-muted">Loading...</td></tr>
                ) : filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bg-page border border-border-subtle overflow-hidden shrink-0">
                          <AppImage src={product.images[0]} alt={product.name.en} sizes="48px" className="grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{product.name[lang] || product.name.en}</p>
                          <p className="text-[10px] text-text-muted font-mono uppercase">DG-{product.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6"><span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">{product.category}</span></td>
                    <td className="px-8 py-6 font-bold text-sm">€{product.price.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className={cn('text-xs font-bold', product.stock < 10 ? 'text-rose-500' : 'text-text-main')}>{product.stock} units</span>
                    </td>
                    <td className="px-8 py-6">
                      {product.isFeatured ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <XCircle size={16} className="text-text-muted opacity-30" />
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(product)} className="p-2 hover:bg-primary/10 text-text-muted hover:text-primary rounded-full transition-all" title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id, product.name.en)} disabled={deletingId === product.id}
                          className="p-2 hover:bg-rose-500/10 text-text-muted hover:text-rose-500 rounded-full transition-all disabled:opacity-50" title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 border-t border-border-subtle bg-bg-page/30">
            <p className="text-xs text-text-muted">Showing <span className="font-bold text-text-main">{filtered.length}</span> products</p>
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-bg-card border border-border-subtle w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between p-8 border-b border-border-subtle">
              <h2 className="text-lg font-bold uppercase tracking-tighter">
                {modal.mode === 'create' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 hover:text-primary transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Name (EN) *</label>
                  <input {...F('nameEn')} className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Name (DE)</label>
                  <input {...F('nameDe')} placeholder="Defaults to EN" className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Name (FR)</label>
                  <input {...F('nameFr')} placeholder="Defaults to EN" className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Description (EN)</label>
                <textarea {...F('descEn')} rows={3} className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Price (€) *</label>
                  <input {...F('price')} type="number" step="0.01" min="0" className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Stock *</label>
                  <input {...F('stock')} type="number" min="0" className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Category</label>
                  <select {...F('category')} className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary">
                    {['extra-virgin','infusions','premium','sets'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Images</label>

                {/* Thumbnails */}
                {imageList.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {imageList.map((url) => (
                      <div key={url} className="relative w-20 h-20 border border-border-subtle bg-bg-page overflow-hidden group/thumb">
                        <AppImage src={url} alt="" sizes="80px" />
                        <button type="button" onClick={() => removeImage(url)}
                          className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                          title="Remove">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {imageList.length === 0 && (
                  <div className="flex items-center gap-2 text-text-muted text-xs py-2">
                    <ImageOff size={14} /> No images yet
                  </div>
                )}

                {/* Upload + manual URL entry */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className={cn(
                    'flex items-center gap-2 px-4 py-2 border border-border-subtle text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:border-primary transition-colors',
                    uploading && 'opacity-50 pointer-events-none',
                  )}>
                    <Upload size={14} />{uploading ? 'Uploading…' : 'Upload images'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleUpload} />
                  </label>
                  <span className="text-[10px] text-text-muted">JPEG / PNG / WebP, max 11MB</span>
                </div>
                <input {...F('images')} placeholder="Or paste URLs, comma-separated"
                  className="w-full bg-bg-page border border-border-subtle px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Featured on homepage</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-8 border-t border-border-subtle">
              <button onClick={() => setModal(null)} className="px-6 py-2.5 border border-border-subtle text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? <Save size={14} className="animate-pulse" /> : <Save size={14} />}
                {modal.mode === 'create' ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

