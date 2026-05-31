import { useState, useEffect } from 'react';
import type { Product } from '@ecommerce/shared';
import { getProducts } from '../api/product.api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
