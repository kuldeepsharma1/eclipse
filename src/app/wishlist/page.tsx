'use client';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import { Product } from '@/types/product';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (item: Product) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      sku: ''
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Save items you love for later by adding them to your wishlist from the shop.
          </p>
          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col transition-shadow hover:shadow-xl border-none bg-white"
            >
              <CardHeader className="relative p-0">
                <div className="w-full h-64 relative overflow-hidden rounded-t-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={false}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                  onClick={() => {
                    removeItem(item.id);
                    toast.success(`${item.name} removed from wishlist`);
                  }}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}