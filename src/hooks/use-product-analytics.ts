import { useEffect } from 'react';
import { Product } from '@/types/product';

interface ProductView {
  productId: string;
  timestamp: string;
  sessionId: string;
}

interface ProductInteraction {
  productId: string;
  action: 'view' | 'addToCart' | 'addToWishlist' | 'removeFromWishlist' | 'share';
  timestamp: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

// In a real application, these would be API calls to your analytics service
const trackProductView = async (view: ProductView) => {
  console.log('Product view tracked:', view);
  // Implement actual tracking logic here
};

const trackProductInteraction = async (interaction: ProductInteraction) => {
  console.log('Product interaction tracked:', interaction);
  // Implement actual tracking logic here
};

export function useProductAnalytics(product: Product | null) {
  const sessionId = typeof window !== 'undefined' ? 
    localStorage.getItem('sessionId') || 
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : '';

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (product) {
      // Track product view
      trackProductView({
        productId: product.id,
        timestamp: new Date().toISOString(),
        sessionId
      });
    }
  }, [product, sessionId]);

  const trackInteraction = (
    action: ProductInteraction['action'],
    metadata?: Record<string, any>
  ) => {
    if (!product) return;

    trackProductInteraction({
      productId: product.id,
      action,
      timestamp: new Date().toISOString(),
      sessionId,
      metadata
    });
  };

  return {
    trackInteraction
  };
}