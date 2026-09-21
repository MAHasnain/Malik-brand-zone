'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function CartInitializer() {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return null;
}