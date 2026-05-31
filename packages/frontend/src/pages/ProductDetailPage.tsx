import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '@ecommerce/shared';
import { getProduct } from '../api/product.api';
import { useCartStore } from '../store/cart.store';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cart = useCartStore((state) => state.cart);

  const cartItem = cart?.items.find((item) => item.productId === id);
  const cartCount = cartItem?.quantity ?? 0;

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch {
        setError('Product not found');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleIncrease = () => {
    addToCart(id!, 1);
  };

  const handleDecrease = () => {
    if (cartCount <= 1) {
      updateQuantity(id!, 0);
    } else {
      updateQuantity(id!, cartCount - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">{error ?? 'Product not found'}</h2>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Products
      </Link>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-4">{product.description}</p>
            <p className="text-4xl font-bold text-gray-900 mt-6">
              ${(product.price / 100).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            <div className="mt-8">
              {cartCount > 0 ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrease}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 text-lg"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg font-medium">{cartCount}</span>
                  <button
                    onClick={handleIncrease}
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 text-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleIncrease}
                  disabled={product.stock === 0}
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
