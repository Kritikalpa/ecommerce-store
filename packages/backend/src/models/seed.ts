import type { Product } from '@ecommerce/shared';

export function seedProducts(): Map<string, Product> {
  const products: Product[] = [
    {
      id: 'p1',
      name: 'Minimalist Watch',
      description: 'Clean design analog watch with leather strap',
      price: 12999,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400',
      stock: 50,
    },
    {
      id: 'p2',
      name: 'Leather Backpack',
      description: 'Handcrafted genuine leather backpack with laptop compartment',
      price: 8999,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400',
      stock: 30,
    },
    {
      id: 'p3',
      name: 'Wireless Earbuds',
      description: 'Premium sound quality with active noise cancellation',
      price: 15999,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=400',
      stock: 100,
    },
    {
      id: 'p4',
      name: 'Ceramic Mug Set',
      description: 'Set of 4 handmade ceramic mugs in earth tones',
      price: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400',
      stock: 75,
    },
    {
      id: 'p5',
      name: 'Desk Lamp',
      description: 'Adjustable LED desk lamp with wireless charging base',
      price: 6999,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400',
      stock: 40,
    },
    {
      id: 'p6',
      name: 'Canvas Sneakers',
      description: 'Classic low-top canvas sneakers in multiple colors',
      price: 5499,
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400',
      stock: 60,
    },
    {
      id: 'p7',
      name: 'Notebook Bundle',
      description: 'Pack of 3 dotted-grid notebooks with hardcover',
      price: 2999,
      imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20880e17?auto=format&fit=crop&w=400',
      stock: 200,
    },
    {
      id: 'p8',
      name: 'Sunglasses',
      description: 'Polarized UV400 sunglasses with titanium frame',
      price: 9999,
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400',
      stock: 45,
    },
  ];

  return new Map(products.map((p) => [p.id, p]));
}
