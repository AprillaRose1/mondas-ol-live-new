'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, UploadCloud, Trash2, Copy, ExternalLink, Loader2, HardDrive,
} from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import {
  fetchMediaList,
  uploadMediaBatch,
  deleteMedia,
  type MediaObject,
} from '@/lib/api/media';
import { ApiError } from '@/lib/api/http';
import { cn } from '@/lib/utils';
import { AppImage } from '@/components/ui/app-image';

const fmtSize = (b: number) =>
  b < 1024
    ? b + ' B'
    : b < 1048576
      ? (b / 1024).toFixed(1) + ' KB'
      : (b / 1048576).toFixed(1) + ' MB';

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

export default function MediaLibraryAdmin() {
  const [items, setItems] = useState<MediaObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMediaList();
      setItems(res.data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load media (is MinIO running?)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      await uploadMediaBatch(files);
      toast.success(files.length + (files.length === 1 ? ' file uploaded' : ' files uploaded'));
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [load]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) upload(Array.from(e.target.files));
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) { toast.error('Only image files are allowed'); return; }
    upload(files);
  };

  const handleDelete = async (obj: MediaObject) => {
    if (!confirm('Delete "' + obj.name + '" from the bucket? This cannot be undone.')) return;
    setDeleting(obj.key);
    try {
      await deleteMedia(obj.key);
      toast.success('Deleted ' + obj.name);
      setItems((prev) => prev.filter((i) => i.key !== obj.key));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch {
      toast.error('Could not copy URL');
    }
  };

  const totalBytes = items.reduce((sum, i) => sum + i.size, 0);

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-10">
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">Object Storage</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter flex items-center gap-3">
                Media <span className="text-primary italic font-serif font-normal">Library</span>
              </h1>
            </div>
            {!loading && (
              <div className="flex items-center gap-6 text-sm text-text-muted">
                <span className="flex items-center gap-2"><FolderOpen size={16} className="text-primary" />{items.length} objects</span>
                <span className="flex items-center gap-2"><HardDrive size={16} className="text-primary" />{fmtSize(totalBytes)}</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Dropzone */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'mb-10 flex flex-col items-center justify-center gap-3 border border-dashed px-6 py-12 text-center cursor-pointer transition-colors',
            dragOver ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50',
            uploading && 'pointer-events-none opacity-60',
          )}
        >
          {uploading ? <Loader2 size={28} className="animate-spin text-primary" /> : <UploadCloud size={28} className="text-primary" />}
          <p className="text-sm font-medium">
            {uploading ? 'Uploading…' : 'Drag & drop images here, or click to browse'}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-text-muted">JPEG / PNG / WebP · max 11 MB each</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={onInput} />
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-bg-card border border-border-subtle" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-text-muted">
            <FolderOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Bucket is empty. Upload your first image above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((obj) => (
              <div key={obj.key}
                className="group relative bg-bg-card border border-border-subtle overflow-hidden hover:border-primary/40 transition-all"
              >
                <div className="aspect-square bg-bg-page overflow-hidden">
                  <AppImage src={obj.url} alt={obj.name} sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold truncate" title={obj.name}>{obj.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{fmtSize(obj.size)} · {fmtDate(obj.lastModified)}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyUrl(obj.url)} title="Copy URL"
                    className="p-1.5 bg-black/60 text-white hover:bg-primary transition-colors rounded">
                    <Copy size={13} />
                  </button>
                  <a href={obj.url} target="_blank" rel="noopener noreferrer" title="Open in new tab"
                    className="p-1.5 bg-black/60 text-white hover:bg-primary transition-colors rounded">
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => handleDelete(obj)} disabled={deleting === obj.key} title="Delete"
                    className="p-1.5 bg-black/60 text-white hover:bg-rose-500 transition-colors rounded disabled:opacity-50">
                    {deleting === obj.key ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
