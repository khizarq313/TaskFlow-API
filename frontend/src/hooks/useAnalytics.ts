import { useState, useEffect, useCallback } from 'react';
import { Analytics } from '../types/user';
import analyticsService from '../services/analyticsService';
import { mockAnalytics } from '../mocks/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface UseAnalyticsReturn {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        setAnalytics(mockAnalytics);
      } else {
        const data = await analyticsService.getAnalytics();
        setAnalytics(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = async (): Promise<void> => {
    await fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refetch,
  };
};

export default useAnalytics;
