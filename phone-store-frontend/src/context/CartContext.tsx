import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ProductVariant } from '../types';

export interface CartItem {
  productId: number;
  productName: string;
  productSlug: string;
  thumbnailUrl: string;
  variantId: number;
  color: string;
  storage: string;
  price: number;
  quantity: number;
  stockQuantity?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { id: number; name: string; slug: string; thumbnailUrl: string }, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeFromCart: (variantId: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('phone_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('phone_store_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Không thể lưu giỏ hàng vào localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (
    product: { id: number; name: string; slug: string; thumbnailUrl: string }, 
    variant: ProductVariant, 
    quantity = 1
  ) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.variantId === variant.id);
      if (existing) {
        return prev.map(item => 
          item.variantId === variant.id 
            ? { ...item, quantity: item.quantity + quantity, stockQuantity: variant.stockQuantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            thumbnailUrl: variant.imageUrl || product.thumbnailUrl,
            variantId: variant.id,
            color: variant.color,
            storage: variant.storage,
            price: variant.price,
            quantity,
            stockQuantity: variant.stockQuantity,
          }
        ];
      }
    });

    setToastMessage(`Đã thêm ${product.name} (${variant.color} - ${variant.storage}) vào giỏ hàng!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.variantId === variantId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (variantId: number) => {
    setCartItems(prev => prev.filter(item => item.variantId !== variantId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearToast = () => setToastMessage(null);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      totalCount, 
      totalPrice, 
      toastMessage, 
      clearToast 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được sử dụng trong CartProvider');
  }
  return context;
};
