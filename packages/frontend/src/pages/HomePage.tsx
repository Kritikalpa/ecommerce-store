import ProductCard from '../components/product/ProductCard';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full mt-2" />
              <div className="flex justify-between mt-4">
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
