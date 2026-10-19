'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from './types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  vatTotal: number;
  shippingTotal: number;
  total: number;
  requiresRequisition: boolean;
  promoCode: string;
  discountAmount: number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('adrenaline_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedPromo = localStorage.getItem('adrenaline_promo');
      if (savedPromo) {
        setPromoCode(savedPromo);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('adrenaline_cart', JSON.stringify(items));
        if (promoCode) {
          localStorage.setItem('adrenaline_promo', promoCode);
        } else {
          localStorage.removeItem('adrenaline_promo');
        }
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [items, promoCode, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountAmount(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'MAT10' || clean === 'WELCOME10') {
      setPromoCode(clean);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountAmount(0);
  };

  // Recalculate financial totals
  const subtotalBeforeDiscount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = promoCode ? subtotalBeforeDiscount * 0.1 : 0;
  const subtotal = Math.max(0, subtotalBeforeDiscount - discount);
  const vatTotal = subtotal * 0.2; // 20% UK VAT
  const shippingTotal = subtotal > 0 ? 0.0 : 0; // Free tracked UK courier for school orders
  const total = subtotal + vatTotal + shippingTotal;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const requiresRequisition = items.some(
    (item) => item.product.requires_headteacher_requisition === 1
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        vatTotal,
        shippingTotal,
        total,
        requiresRequisition,
        promoCode,
        discountAmount: discount,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
