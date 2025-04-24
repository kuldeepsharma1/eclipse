'use client';
import { useState, useEffect, useTransition } from 'react';
import { getProducts } from '@/app/actions/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { Loader2, Star, ShoppingCart, Filter, Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
// Sort Options
const sortOptions = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
  { label: 'Rating: High to Low', value: 'rating-desc' },
];

// Shop Page Component
export default function ShopPage() {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [sortBy, setSortBy] = useState('price-asc');

  const { addItem } = useCartStore();
  const { items: wishlistItems, addWishlistItem, removeItem, isInWishlist } = useWishlistStore();



  // Fetch products
  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setIsLoading(false);
      }
    });
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product: Product) => {
      const inCategory = category === 'all' || product.category === category;
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      return inCategory && inPriceRange;
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Filters Component
  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Category</h3>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full border-gray-300">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Footwear">Footwear</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Price Range</h3>
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full border-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Handle wishlist toggle
  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addWishlistItem({ ...product });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Shop Eclipse</h1>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-gray-300">
                <Filter className="h-5 w-5 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
                <SheetDescription>
                  <FiltersContent />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {!isMobile && (
          <div className="col-span-1">
            <Card className="sticky top-6 shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <FiltersContent />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="col-span-1 lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product: Product) => (
                <Card
                  key={product.id}
                  className="h-full flex flex-col transition-shadow hover:shadow-xl border-none"
                >
                  <CardHeader className="relative p-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover rounded-t-lg"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow p-5">
                    <div className="flex justify-between items-start mb-3">
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1 text-gray-600">{product.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex flex-col space-y-3">
                    <Button
                      onClick={() => {
                        addItem({ id: product.id, name: product.name,image:product.image, price: product.price, quantity: 1 });
                        toast.success(`${product.name} added to cart`);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant={isInWishlist(product.id) ? 'default' : 'outline'}
                      onClick={() => handleWishlistToggle(product)}
                      className={`w-full ${isInWishlist(product.id)
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Heart
                        className={`mr-2 h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''
                          }`}
                      />
                      {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}