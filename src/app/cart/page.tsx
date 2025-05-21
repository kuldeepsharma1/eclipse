'use client';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCallback, useMemo, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, } = useCartStore();
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  // Memoized calculations for performance
  const { subtotal, shipping, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 150 ? 0 : 10;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  // Quantity update with timeout for smooth UX
  const handleQuantityChange = useCallback(
    (id: string, newQuantity: number) => {
      setIsUpdating((prev) => ({ ...prev, [id]: true }));
      updateQuantity(id, Math.max(1, newQuantity));
      setIsUpdating((prev) => ({ ...prev, [id]: false }));
    },
    [updateQuantity]
  );

  const handleClearCart = () => {

    toast.success('Cart cleared');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-600 border-red-300"
            onClick={handleClearCart}
          >
            Clear Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our shop to find something you love!
          </p>
          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Cart Items ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b last:border-0"
                  >
                    <div className="relative w-24 h-24 mr-4">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        priority={false}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.category || 'N/A'}</p>
                      <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-300"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isUpdating[item.id] || item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-gray-700">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-300"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isUpdating[item.id]}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        onClick={() => {
                          removeItem(item.id);
                          toast.success(`${item.name} removed from cart`);
                        }}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={items.length === 0}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}