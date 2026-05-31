import type { CartItem as CartItemType } from '@ecommerce/shared';
import { useCartStore } from '../../store/cart.store';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
        <p className="text-sm text-gray-500">${(item.unitPrice / 100).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
        >
          -
        </button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeFromCart(item.productId)}
        className="text-gray-400 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
}
