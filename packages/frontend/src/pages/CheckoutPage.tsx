import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart.store';
import { checkout } from '../api/order.api';
import { validateDiscountCode } from '../api/discount.api';
import DiscountInput from '../components/checkout/DiscountInput';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = appliedCode ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async (code: string) => {
    setIsLoading(true);
    setIsValid(null);
    try {
      await validateDiscountCode(code);
      setAppliedCode(code);
      setIsValid(true);
    } catch {
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedCode(null);
    setIsValid(null);
  };

  const handlePlaceOrder = async () => {
    setIsCheckingOut(true);
    try {
      const order = await checkout({ discountCode: appliedCode ?? undefined });
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              {item.productName} × {item.quantity}
            </span>
            <span className="text-sm font-medium">${((item.unitPrice * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Discount Code</h2>
        <DiscountInput
          onApply={handleApplyDiscount}
          onRemove={handleRemoveDiscount}
          isValid={isValid}
          isLoading={isLoading}
          appliedCode={appliedCode}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${(subtotal / 100).toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between py-2 text-sm text-green-600">
            <span>Discount</span>
            <span>-${(discountAmount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">${(total / 100).toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isCheckingOut}
          className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
