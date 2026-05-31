import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import CartDrawer from '../cart/CartDrawer';

export default function Header() {
  const cart = useCartStore((state) => state.cart);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Ecommerce Store
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <button
              onClick={openDrawer}
              className="relative text-gray-600 hover:text-gray-900"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
