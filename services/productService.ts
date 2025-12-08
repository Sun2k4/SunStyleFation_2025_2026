import { Product } from '../types';
import { mockDb } from './mockDb';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    await delay(600);
    return mockDb.products.getAll();
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    await delay(300);
    return mockDb.products.getAll().find(p => p.id === id);
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    await delay(300);
    return mockDb.products.getAll().find(p => p.slug === slug);
  },

  // Admin Only Methods
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await delay(800);
    const newProduct = {
      ...product,
      id: Date.now(), // Generate a simple ID
      rating: 0,
      reviews: 0,
      stock: product.stock || 0
    };
    return mockDb.products.add(newProduct);
  },

  updateProduct: async (id: number, updates: Partial<Product>): Promise<Product | null> => {
    await delay(500);
    return mockDb.products.update(id, updates);
  },

  deleteProduct: async (id: number): Promise<void> => {
    await delay(500);
    mockDb.products.delete(id);
  }
};
