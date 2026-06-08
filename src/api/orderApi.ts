import api from './api';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CheckoutPayload {
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  discount?: number;
  items: OrderItem[];
}

export const checkout = async (payload: CheckoutPayload) => {
  return await api.post('/api/Sales/checkout', payload);
};

export const getMyOrders = async () => {
  return await api.get('/api/Sales/my-orders');
};

export const getOrderDetail = async (orderId: string) => {
  return await api.get(`/api/Sales/order/${orderId}`);
};

export const cancelOrder = async (orderId: string) => {
  return await api.post(`/api/Sales/cancel/${orderId}`);
};
