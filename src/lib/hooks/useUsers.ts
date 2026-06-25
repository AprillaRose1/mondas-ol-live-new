import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types/user';
import { fetchUsers } from '../api/users';

export const useUsers = (page = 1, limit = 50) => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchUsers(page, limit)
      .then((r) => { setUsers(r.data); setTotal(r.total); })
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  }, [page, limit]);

  useEffect(() => { load(); }, [load]);

  return { users, total, loading, error, refetch: load };
};
