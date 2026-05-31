import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotal = cart?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={closeDrawer}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={closeDrawer}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            cart.items.map((item) => (
              <CartItem key={item.productId} item={item} productName={`Product ${item.productId}`} />
            ))
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">${(subtotal / 100).toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="w-full block text-center bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
