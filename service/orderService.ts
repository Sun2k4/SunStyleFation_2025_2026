import { Order, CartItem } from '../app/types';
import { mockDb } from './mockDb';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    await delay(500);
    return mockDb.orders.getAll();
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    await delay(500);
    return mockDb.orders.getAll().filter(order => order.userId === userId);
  },

  createOrder: async (userId: string, items: CartItem[], total: number): Promise<Order> => {
    await delay(1000);
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      total,
      status: 'Pending',
      items
    };
    return mockDb.orders.add(newOrder);
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order | null> => {
    await delay(500);
    const orders = mockDb.orders.getAll();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      mockDb.orders.save(orders);
      return orders[index];
    }
    return null;
  }
};