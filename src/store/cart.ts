
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {  ShippingInfo, TaxInfo } from '@/types/product';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku: string;
  category?: string;
  variant?: {
    id: string;
    name: string;
    attributes: Record<string, string>;
  };
  shippingInfo?: ShippingInfo;
  taxInfo?: TaxInfo;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
}

interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  price: number;
  estimatedDays: string;
  tracking?: boolean;
  restrictions?: {
    countries?: string[];
    minWeight?: number;
    maxWeight?: number;
    dimensions?: {
      maxLength?: number;
      maxWidth?: number;
      maxHeight?: number;
    };
  };
}

interface CartPromotion {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping' | 'bogo';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts?: string[];
  excludedProducts?: string[];
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  currentUses: number;
}

interface GiftWrapping {
  enabled: boolean;
  style?: string;
  message?: string;
  price: number;
}

interface CartState {
  items: CartItem[];
  shippingAddress?: {
    id: string;
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    sameAsShipping: boolean;
    address?: CartState['shippingAddress'];
  };
  selectedShippingMethod?: ShippingMethod;
  appliedPromotions: CartPromotion[];
  giftWrapping: GiftWrapping;
  notes?: string;
  lastModified: string;
  abandonedCartEmail?: string;
  currency: string;
  
  // Cart operations
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemVariant: (id: string, variantId: string, attributes: Record<string, string>) => void;
  
  // Shipping & Billing
  setShippingAddress: (address: CartState['shippingAddress']) => void;
  setBillingAddress: (address: CartState['billingAddress']) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  
  // Promotions & Discounts
  applyPromotion: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromotion: (code: string) => void;
  
  // Gift Options
  setGiftWrapping: (options: Partial<GiftWrapping>) => void;
  setOrderNotes: (notes: string) => void;
  
  // Cart Management
  clearCart: () => void;
  saveForLater: (itemId: string) => void;
  restoreCart: (abandonedCartId: string) => Promise<boolean>;
  
  // Cart Calculations
  getSubtotal: () => number;
  getTaxTotal: () => number;
  getShippingTotal: () => number;
  getDiscountTotal: () => number;
  getGiftWrappingTotal: () => number;
  getTotal: () => number;
  
  // Analytics & Recovery
  setAbandonedCartEmail: (email: string) => void;
  trackCartActivity: () => void;
  getCartMetrics: () => {
    totalItems: number;
    totalValue: number;
    averageItemValue: number;
    abandonedAt?: string;
    recoveryEmailSent?: boolean;
  };
}

const TAX_RATES: Record<string, number> = {
  'DEFAULT': 0.10,
  'REDUCED': 0.05,
  'EXEMPT': 0,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromotions: [],
      giftWrapping: {
        enabled: false,
        price: 5.99,
      },
      lastModified: new Date().toISOString(),
      currency: 'USD',

      addItem: (item) => set((state) => {
        const quantity = item.quantity || 1;
        const existingItem = state.items.find(
          (i) => i.id === item.id && 
          JSON.stringify(i.variant) === JSON.stringify(item.variant)
        );

        const updatedItems = existingItem
          ? state.items.map((i) =>
              i.id === item.id &&
              JSON.stringify(i.variant) === JSON.stringify(item.variant)
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [...state.items, { ...item, quantity }];

        return {
          items: updatedItems,
          lastModified: new Date().toISOString(),
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
        lastModified: new Date().toISOString(),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
        ),
        lastModified: new Date().toISOString(),
      })),

      updateItemVariant: (id, variantId, attributes) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                variant: {
                  id: variantId,
                  name: i.variant?.name || '',
                  attributes,
                },
              }
            : i
        ),
        lastModified: new Date().toISOString(),
      })),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      setBillingAddress: (billing) => set({ billingAddress: billing }),

      setShippingMethod: (method) => set({ selectedShippingMethod: method }),

      applyPromotion: async (code) => {
        // In a real app, validate promotion code with backend
        const mockPromotion: CartPromotion = {
          code,
          type: 'percentage',
          value: 10,
          minPurchase: 50,
          currentUses: 0,
        };

        const state = get();
        const subtotal = state.getSubtotal();

        if (subtotal < (mockPromotion.minPurchase || 0)) {
          return {
            success: false,
            message: `Minimum purchase of $${mockPromotion.minPurchase} required`,
          };
        }

        set((state) => ({
          appliedPromotions: [...state.appliedPromotions, mockPromotion],
          lastModified: new Date().toISOString(),
        }));

        return {
          success: true,
          message: 'Promotion applied successfully',
        };
      },

      removePromotion: (code) => set((state) => ({
        appliedPromotions: state.appliedPromotions.filter((p) => p.code !== code),
        lastModified: new Date().toISOString(),
      })),

      setGiftWrapping: (options) => set((state) => ({
        giftWrapping: { ...state.giftWrapping, ...options },
      })),

      setOrderNotes: (notes) => set({ notes }),

      clearCart: () => set({
        items: [],
        appliedPromotions: [],
        giftWrapping: {
          enabled: false,
          price: 5.99,
        },
        notes: undefined,
        lastModified: new Date().toISOString(),
      }),

      saveForLater: () => {
        // Implementation would move item to saved items list
      },

      restoreCart: async () => {
        // Implementation would restore cart from saved state
        return true;
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTaxTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => {
          const taxRate = item.taxInfo?.taxRate || TAX_RATES.DEFAULT;
          return sum + (item.price * item.quantity * taxRate);
        }, 0);
      },

      getShippingTotal: () => {
        const state = get();
        if (!state.selectedShippingMethod) return 0;
        
        const subtotal = state.getSubtotal();
        const freeShippingPromo = state.appliedPromotions.find(p => p.type === 'shipping');
        
        if (freeShippingPromo) return 0;
        if (subtotal >= 150) return 0; // Free shipping threshold
        
        return state.selectedShippingMethod.price;
      },

      getDiscountTotal: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        
        return state.appliedPromotions.reduce((sum, promotion) => {
          if (promotion.type === 'percentage') {
            const discount = subtotal * (promotion.value / 100);
            return sum + (promotion.maxDiscount 
              ? Math.min(discount, promotion.maxDiscount)
              : discount);
          }
          if (promotion.type === 'fixed') {
            return sum + promotion.value;
          }
          return sum;
        }, 0);
      },

      getGiftWrappingTotal: () => {
        const state = get();
        return state.giftWrapping.enabled ? state.giftWrapping.price : 0;
      },

      getTotal: () => {
        const state = get();
        return (
          state.getSubtotal() +
          state.getTaxTotal() +
          state.getShippingTotal() +
          state.getGiftWrappingTotal() -
          state.getDiscountTotal()
        );
      },

      setAbandonedCartEmail: (email) => set({ abandonedCartEmail: email }),

      trackCartActivity: () => {
        const state = get();
        const now = new Date().toISOString();
        
        // In a real app, this would send analytics data to a backend
        console.log('Cart activity tracked:', {
          items: state.items.length,
          total: state.getTotal(),
          timestamp: now,
        });
        
        set({ lastModified: now });
      },

      getCartMetrics: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = state.getTotal();
        
        return {
          totalItems,
          totalValue,
          averageItemValue: totalValue / totalItems,
          abandonedAt: state.lastModified,
          recoveryEmailSent: !!state.abandonedCartEmail,
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);