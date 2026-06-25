import { useEffect, useState } from 'react';
import { fetchDashboard, type AnalyticsDashboard } from '../api/analytics';

interface UseAnalyticsResult {
  data: AnalyticsDashboard | null;
  loading: boolean;
  error: string | null;
}

export const useAnalytics = (): UseAnalyticsResult => {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchDashboard()
      .then((d) => setData(d))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
