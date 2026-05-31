import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Order } from '@ecommerce/shared';
import { getOrder } from '../api/order.api';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const data = await getOrder(id);
        setOrder(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mt-6" />
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mt-2" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-green-600 text-3xl">✓</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mt-6">Order Confirmed!</h1>
      <p className="text-gray-500 mt-2">Order ID: {order.id}</p>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-8 text-left">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              {item.productName} × {item.quantity}
            </span>
            <span className="text-sm font-medium">${((item.unitPrice * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
        {order.discountAmount > 0 && (
          <div className="flex justify-between py-2 text-sm text-green-600">
            <span>Discount ({order.discountCode})</span>
            <span>-${(order.discountAmount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">${(order.total / 100).toFixed(2)}</span>
        </div>
      </div>

      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
