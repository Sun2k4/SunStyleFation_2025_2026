import { MOCK_PRODUCTS, MOCK_ORDERS } from '../utils/constants';
import { Product, Order } from '../types';

const KEYS = {
  PRODUCTS: 'sunstyle_products',
  ORDERS: 'sunstyle_orders',
  CATEGORIES: 'sunstyle_categories',
};

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Men', slug: 'men', description: 'Men\'s Fashion', created_at: new Date().toISOString() },
  { id: 2, name: 'Women', slug: 'women', description: 'Women\'s Fashion', created_at: new Date().toISOString() },
  { id: 3, name: 'Accessories', slug: 'accessories', description: 'Bags, Jewelry, etc.', created_at: new Date().toISOString() },
  { id: 4, name: 'Summer Collection', slug: 'summer-collection', description: 'Seasonal specials', created_at: new Date().toISOString() },
];

const init = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
};

init();

export const mockDb = {
  products: {
    getAll: (): Product[] => {
      try {
        return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]');
      } catch {
        return MOCK_PRODUCTS;
      }
    },
    save: (products: Product[]) => {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    },
    add: (product: Product) => {
      const products = mockDb.products.getAll();
      products.push(product);
      mockDb.products.save(products);
      return product;
    },
    update: (id: number, updates: Partial<Product>) => {
      const products = mockDb.products.getAll();
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        mockDb.products.save(products);
        return products[index];
      }
      return null;
    },
    delete: (id: number) => {
      const products = mockDb.products.getAll();
      const filtered = products.filter(p => p.id !== id);
      mockDb.products.save(filtered);
    }
  },
  orders: {
    getAll: (): Order[] => {
      try {
        return JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]');
      } catch {
        return MOCK_ORDERS;
      }
    },
    save: (orders: Order[]) => {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    },
    add: (order: Order) => {
      const orders = mockDb.orders.getAll();
      orders.unshift(order);
      mockDb.orders.save(orders);
      return order;
    }
  },
  categories: {
    getAll: (): any[] => {
      try {
        return JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
      } catch {
        return DEFAULT_CATEGORIES;
      }
    },
    save: (categories: any[]) => {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    },
    add: (category: any) => {
      const categories = mockDb.categories.getAll();
      const newCategory = { ...category, id: Date.now() };
      categories.push(newCategory);
      mockDb.categories.save(categories);
      return newCategory;
    },
    update: (id: number, updates: any) => {
      const categories = mockDb.categories.getAll();
      const index = categories.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updates };
        mockDb.categories.save(categories);
        return categories[index];
      }
      return null;
    },
    delete: (id: number) => {
      const categories = mockDb.categories.getAll();
      const filtered = categories.filter((c: any) => c.id !== id);
      mockDb.categories.save(filtered);
    }
  }
};