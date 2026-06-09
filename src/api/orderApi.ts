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

export interface AdminOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface AdminOrderDetailItem {
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface AdminOrderDetail {
  orderId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  details: AdminOrderDetailItem[];
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

// Admin APIs
export const getAllOrdersAdmin = async () => {
  return await api.get('/api/admin/orders');
};

export const getOrderDetailAdmin = async (orderId: string) => {
  return await api.get(`/api/admin/orders/${orderId}`);
};

export const updateOrderStatusAdmin = async (orderId: string, status: string) => {
  // Gửi status dưới dạng raw string trong body
  return await api.put(`/api/admin/orders/${orderId}/status`, JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
