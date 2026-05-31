import { useState } from 'react';
import { generateDiscountCode } from '../../api/admin.api';

interface DiscountCodeManagerProps {
  adminKey: string;
  pendingCount: number;
  discountCodes: Array<{ code: string; isUsed: boolean; usedInOrderId?: string }>;
  onRefresh: () => void;
}

export default function DiscountCodeManager({ adminKey, pendingCount, discountCodes, onRefresh }: DiscountCodeManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await generateDiscountCode(adminKey);
      onRefresh();
    } catch {
      setError('No pending discount codes to generate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Discount Codes</h2>
        <button
          onClick={handleGenerate}
          disabled={isLoading || pendingCount === 0}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title={pendingCount === 0 ? 'No pending codes available' : 'Generate discount code'}
        >
          {isLoading ? 'Generating...' : 'Generate Code'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {discountCodes.length === 0 ? (
        <p className="text-sm text-gray-500">No discount codes generated yet</p>
      ) : (
        <div className="space-y-2">
          {discountCodes.map((code) => (
            <div
              key={code.code}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <span className="font-mono text-sm font-medium">{code.code}</span>
                {code.usedInOrderId && (
                  <span className="ml-2 text-xs text-gray-500">Used in {code.usedInOrderId}</span>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  code.isUsed
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {code.isUsed ? 'Used' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
