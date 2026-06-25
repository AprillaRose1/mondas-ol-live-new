'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Trash2, Shield, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useUsers } from '@/lib/hooks/useUsers';
import { deleteUser, updateUser } from '@/lib/api/users';
import { UserRole } from '@/lib/types/user';
import { cn } from '@/lib/utils';

export default function UserManagement() {
  const { users, loading, refetch } = useUsers();
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, email: string) => {
    if (!confirm('Delete user ' + email + '? This cannot be undone.')) return;
    setActionId(id);
    try {
      await deleteUser(id);
      toast.success('User deleted');
      refetch();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setActionId(null);
    }
  };

  const handleRoleChange = async (id: string, role: UserRole) => {
    setActionId(id);
    try {
      await updateUser(id, { role });
      toast.success('Role updated');
      refetch();
    } catch {
      toast.error('Failed to update role');
    } finally {
      setActionId(null);
    }
  };

  const roleIcon = (role: UserRole) => {
    if (role === UserRole.ADMIN)     return <ShieldCheck size={14} className="text-primary" />;
    if (role === UserRole.MODERATOR) return <Shield size={14} className="text-blue-500" />;
    return <ShieldOff size={14} className="text-text-muted" />;
  };

  return (
    <div className="min-h-screen bg-bg-page pt-32 pb-24 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2 block">
              <Users size={10} className="inline mr-1" />User Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              User <span className="text-primary italic font-serif font-normal">Management</span>
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="text-sm text-text-muted">
            {users.length} accounts total
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-bg-card border border-border-subtle pl-12 pr-4 py-4 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate"
          className="bg-bg-card border border-border-subtle overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted bg-bg-page">
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Joined</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {loading ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-text-muted text-sm">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-text-muted text-sm">No users found</td></tr>
                ) : filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-bg-page border border-border-subtle flex items-center justify-center font-serif text-primary text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-[11px] text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {roleIcon(user.role)}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          disabled={actionId === user.id}
                          className="text-[10px] font-bold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer disabled:opacity-50"
                        >
                          {Object.values(UserRole).map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[11px] text-text-muted">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={actionId === user.id}
                          className="p-2 hover:bg-rose-500/10 text-text-muted hover:text-rose-500 rounded-full transition-all disabled:opacity-50"
                          title="Delete user"
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
          <div className="px-8 py-5 border-t border-border-subtle bg-bg-page/30">
            <p className="text-xs text-text-muted">
              Showing <span className="font-bold text-text-main">{filtered.length}</span> of{' '}
              <span className="font-bold text-text-main">{users.length}</span> users
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
