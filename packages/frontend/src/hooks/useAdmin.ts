import { useState, useEffect } from 'react';
import type { AdminStats } from '../api/admin.api';
import { getStats } from '../api/admin.api';

export function useAdmin(adminKey: string) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats(adminKey);
        setStats(data);
      } catch {
        setError('Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [adminKey]);

  return { stats, isLoading, error };
}
