import { useState, useCallback, useEffect } from 'react';
import StatsPanel from '../components/admin/StatsPanel';
import DiscountCodeManager from '../components/admin/DiscountCodeManager';
import { getStats } from '../api/admin.api';
import type { AdminStats } from '../api/admin.api';

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>(() => sessionStorage.getItem('admin_key') ?? '');
  const [isValidKey, setIsValidKey] = useState<boolean>(!!adminKey);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (adminKey) {
      fetchStats();
    }
  }, []);
  
  const fetchStats = useCallback(async () => {
    console.log('Fetching stats with admin key:', adminKey);
    if (!adminKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStats(adminKey);
      setStats(data);
      setIsValidKey(true);
      sessionStorage.setItem('admin_key', adminKey);
    } catch {
      setIsValidKey(false);
      setError('Invalid admin key');
      sessionStorage.removeItem('admin_key');
    } finally {
      setIsLoading(false);
    }
  }, [adminKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats();
  };

  const handleRefresh = () => {
    fetchStats();
  };

  if (!isValidKey) {
    return (
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Access</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Admin API Key
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="x-admin-key value"
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !adminKey}
            className="w-full mt-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    );
  }

  if (isLoading && !stats) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      {stats && <StatsPanel stats={stats} />}
      {stats && (
        <DiscountCodeManager
          adminKey={adminKey}
          pendingCount={0}
          discountCodes={stats.discountCodes}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}
