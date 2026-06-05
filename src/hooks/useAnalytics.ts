import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analytics.service';
import { getErrorMessage } from '@/services/api';
import type { EconomicInsights } from '@/types/analytics';

export function useAnalytics() {
  const [data, setData] = useState<EconomicInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getDashboard();
      setData(res.data?.data || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}