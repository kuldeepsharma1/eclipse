'use client'
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-neutral-600 mb-8">Save items you love for later.</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <div className="relative p-4">
                <div className="w-full h-48 bg-neutral-100 rounded-lg mb-4"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 text-red-500 hover:text-red-600"
                  onClick={() => removeItem(item.id)}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-neutral-600 mb-4">${item.price.toFixed(2)}</p>
                <Button 
                  className="w-full"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
