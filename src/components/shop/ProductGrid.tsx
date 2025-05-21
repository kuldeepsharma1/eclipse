
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { toast } from 'sonner';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCartStore();
  const { addItem:addWishlistItem, removeItem, isInWishlist } = useWishlistStore();

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No products found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group relative overflow-hidden">
          <Link href={`/product/${product.id}`}>
            <CardHeader className="p-0">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {product.isNew && (
                <span className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-full text-xs font-medium text-primary-foreground">
                  New
                </span>
              )}
              {product.discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full text-xs font-medium text-white">
                  {product.discount}% OFF
                </span>
              )}
            </CardHeader>
          </Link>

          <CardContent className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <Link href={`/product/${product.id}`} className="flex-1">
                <h3 className="font-medium line-clamp-2 hover:underline">
                  {product.name}
                </h3>
              </Link>
              {product.rating && (
                <div className="flex items-center ml-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">
                ${product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>

            {product.brand && (
              <p className="mt-1 text-sm text-muted-foreground">
                {product.brand}
              </p>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                  sku: ''
                });
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button
              variant={isInWishlist(product.id) ? 'destructive' : 'outline'}
              className="w-full"
              onClick={() => {
                if (isInWishlist(product.id)) {
                  removeItem(product.id);
                  toast.success(`${product.name} removed from wishlist`);
                } else {
                  addWishlistItem(product);
                  toast.success(`${product.name} added to wishlist`);
                }
              }}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${
                  isInWishlist(product.id) ? 'fill-current' : ''
                }`}
              />
              {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
