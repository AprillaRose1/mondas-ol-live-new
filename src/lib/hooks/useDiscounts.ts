import { useCallback, useEffect, useState } from 'react';
import { fetchDiscounts, type Discount } from '../api/discounts';

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchDiscounts()
      .then((d) => setDiscounts(d))
      .catch(() => setError('Failed to fetch discounts'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { discounts, loading, error, refetch: load };
};
