import { MOCK_PRODUCTS, MOCK_ORDERS } from '../utils/constants';
import { Product, Order } from '../types';

const KEYS = {
  PRODUCTS: 'sunstyle_products',
  ORDERS: 'sunstyle_orders',
};

const init = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
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
  }
};