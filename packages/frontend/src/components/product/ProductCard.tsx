import type { Product } from '@ecommerce/shared';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cart = useCartStore((state) => state.cart);

  const cartItem = cart?.items.find((item) => item.productId === product.id);
  const cartCount = cartItem?.quantity ?? 0;

  const handleIncrease = () => {
    addToCart(product.id, 1);
  };

  const handleDecrease = () => {
    if (cartCount <= 1) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, cartCount - 1);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${(product.price / 100).toFixed(2)}
          </span>
          {cartCount > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); handleDecrease(); }}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-medium">{cartCount}</span>
              <button
                onClick={(e) => { e.preventDefault(); handleIncrease(); }}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); handleIncrease(); }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
