import React, { createContext, useContext, useState, useEffect } from 'react';
import { addToCartApi, updateCartQuantityApi, removeCartItemApi, getCartApi, clearCartApi } from './cartApi';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  cartItemId?: string;
  selected: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleSelectItem: (id: string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
  clearCart: () => void;
  subtotal: number;
  totalSelected: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    const items = savedCart ? JSON.parse(savedCart) : [];
    return items.map((item: any) => ({ ...item, selected: item.selected ?? true }));
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const initCart = async () => {
      if (token) {
        setLoading(true);
        try {
          const response = await getCartApi();
          if (response.data && response.data.length > 0) {
            const serverItems = response.data.map((item: any) => ({
              id: item.productId,
              name: item.productName || 'Sản phẩm',
              price: item.price,
              quantity: item.quantity,
              image: item.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
              cartItemId: item.id,
              selected: true
            }));
            setCartItems(serverItems);
          }
        } catch (error) {
          console.error("Lỗi khi tải giỏ hàng từ server:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    initCart();
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const addToCart = async (product: any) => {
    if (token) {
      try {
        await addToCartApi({
          productId: product.id,
          quantity: 1,
          status: 'Active'
        });
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng server:", error);
      }
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        selected: true
      }];
    });
  };

  const removeFromCart = async (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (token && itemToRemove?.cartItemId) {
      try {
        await removeCartItemApi(itemToRemove.cartItemId);
      } catch (error) {
        console.error("Lỗi khi xóa món khỏi server:", error);
      }
    }
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = async (id: string, delta: number) => {
    const itemToUpdate = cartItems.find(item => item.id === id);
    if (itemToUpdate) {
      const newQuantity = Math.max(1, itemToUpdate.quantity + delta);
      
      if (token && itemToUpdate.cartItemId) {
        try {
          await updateCartQuantityApi({
            cartItemId: itemToUpdate.cartItemId,
            quantity: newQuantity
          });
        } catch (error) {
          console.error("Lỗi khi cập nhật số lượng trên server:", error);
        }
      }

      setCartItems(prev => 
        prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
      );
    }
  };

  const toggleSelectItem = (id: string) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const toggleSelectAll = (isSelected: boolean) => {
    setCartItems(prev => prev.map(item => ({ ...item, selected: isSelected })));
  };

  const clearCart = async () => {
    if (token) {
      try {
        await clearCartApi();
      } catch (error) {
        console.error("Lỗi khi xóa sạch giỏ hàng server:", error);
      }
    }
    setCartItems([]);
    if (!token) localStorage.removeItem('cart');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalSelected = cartItems.reduce((acc, item) => 
    item.selected ? acc + item.price * item.quantity : acc, 0
  );

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleSelectItem,
      toggleSelectAll,
      clearCart, 
      subtotal, 
      totalSelected,
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
