import api from './api';

export interface UpdateQuantityPayload {
  cartItemId: string;
  quantity: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  status: string;
}

export const addToCartApi = async (payload: AddToCartPayload) => {
  return await api.post('/api/Cart/add-to-cart', payload);
};

export const updateCartQuantityApi = async (payload: UpdateQuantityPayload) => {
  return await api.put('/api/Cart/update-quantity', payload);
};

export const removeCartItemApi = async (cartItemId: string) => {
  return await api.delete(`/api/Cart/${cartItemId}`);
};

export const getCartApi = async () => {
  return await api.get('/api/Cart');
};

export const clearCartApi = async () => {
  return await api.delete('/api/Cart/clear-cart');
};
