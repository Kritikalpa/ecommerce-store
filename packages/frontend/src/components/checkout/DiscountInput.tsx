import { useState } from 'react';

interface DiscountInputProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  isValid: boolean | null;
  isLoading: boolean;
  appliedCode: string | null;
}

export default function DiscountInput({ onApply, onRemove, isValid, isLoading, appliedCode }: DiscountInputProps) {
  const [code, setCode] = useState('');

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="text-sm font-medium text-green-800">{appliedCode}</span>
        </div>
        <button
          onClick={onRemove}
          className="text-sm text-green-600 hover:text-green-800"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Discount code"
        className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
          isValid === false
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
      <button
        onClick={() => onApply(code)}
        disabled={isLoading || !code}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
}
