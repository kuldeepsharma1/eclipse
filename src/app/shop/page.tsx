import { Filters } from '@/components/General/shop/Filters';
import { ProductGrid } from '@/components/General/shop/ProductGrid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FilterIcon } from 'lucide-react'; 

export default function ShopPage() {

  const products = Array.from({ length: 12 }).map((_, i) => ({
    id: `prod-${i + 1}`,
    name: `Eclipse Signature Tee ${i + 1}`,
    price: 29.99 + i * 2,
    imageUrl: `https://images.unsplash.com/photo-1640465978467-fa011a5dfb0a`, 
    color: i % 3 === 0 ? 'Black' : i % 3 === 1 ? 'White' : 'Grey',
    size: ['S', 'M', 'L', 'XL'][i % 4],
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-zinc-100">
        <div className="container mx-auto">
          <div className="py-20">
            <h1 className="text-2xl font-normal tracking-[-0.02em] text-zinc-900">All Products</h1>
            <p className="mt-4 text-base text-zinc-500">Shop our collection of premium essentials.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-6 border-b border-zinc-100">
          {/* Mobile Filter Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                className="lg:hidden text-zinc-600 hover:text-zinc-900"
                size="sm"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-6">
              <Filters />
            </SheetContent>
          </Sheet>

          {/* Product Count & Sort */}
          <div className="flex items-center gap-6">
            <p className="text-sm text-zinc-500">{products.length} products</p>
            <select className="text-sm border-0 bg-transparent focus:ring-0 pl-2 pr-8 py-1.5 text-zinc-600">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-10 py-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-none">
            <Filters />
          </aside>

          {/* Products */}
          <div className="flex-1">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}