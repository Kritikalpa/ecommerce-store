import type { AdminStats } from '../../api/admin.api';

interface StatsPanelProps {
  stats: AdminStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-gray-500">Total Orders</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-gray-500">Items Purchased</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItemsPurchased}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-gray-500">Revenue</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">${(stats.totalRevenue / 100).toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-gray-500">Discounts Given</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">${(stats.totalDiscountGiven / 100).toFixed(2)}</p>
      </div>
    </div>
  );
}
