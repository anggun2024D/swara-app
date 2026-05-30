import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analytics.service';
import { getErrorMessage } from '@/services/api';
import type { AnalyticsData } from '@/types';

export function useAnalytics(
  period: 'week' | 'month' | 'year' = 'month',
  isAdmin = false
) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = isAdmin
        ? await analyticsService.getAdminAnalytics(period)
        : await analyticsService.getAnalytics(period);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [period, isAdmin]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}