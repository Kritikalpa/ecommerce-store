import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Ecommerce Store
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Products
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-900">
            Cart
          </Link>
          <Link to="/admin" className="text-gray-600 hover:text-gray-900">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
