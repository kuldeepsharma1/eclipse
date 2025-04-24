'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { Filters, FilterOptions } from '@/components/General/shop/Filters';
import { ProductGrid } from '@/components/General/shop/ProductGrid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { getProducts } from '@/app/actions/product';
import { Product } from '@/types/product';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Filter options configuration
const filterOptions: FilterOptions = {
  categories: [
    { id: 'all', label: 'All Categories' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'sale', label: 'Sale' },
  ],
  brands: [
    { id: 'eclipse', label: 'Eclipse' },
    { id: 'nike', label: 'Nike' },
    { id: 'adidas', label: 'Adidas' },
    { id: 'puma', label: 'Puma' },
    { id: 'reebok', label: 'Reebok' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Grey', value: '#808080' },
    { name: 'Navy', value: '#000080' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
  ],
  maxPrice: 1000,
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

export default function ShopPage() {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [sortBy, setSortBy] = useState('featured');

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [0, filterOptions.maxPrice] as [number, number],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 12,
    total: 0,
  });

  // Calculate active filter count
  const activeFilterCount = 
    filters.categories.length +
    filters.brands.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice ? 1 : 0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filterProducts = useCallback(() => {
    startTransition(() => {
      let result = [...products];

      // Apply category filter
      if (filters.categories.length > 0) {
        result = result.filter(product => 
          filters.categories.includes(product.category.toLowerCase())
        );
      }

      // Apply brand filter
      if (filters.brands.length > 0) {
        result = result.filter(product => 
          filters.brands.includes(product.brand?.toLowerCase() || '')
        );
      }

      // Apply size filter
      if (filters.sizes.length > 0) {
        result = result.filter(product => 
          product.sizes?.some(size => filters.sizes.includes(size))
        );
      }

      // Apply color filter
      if (filters.colors.length > 0) {
        result = result.filter(product => 
          product.colors?.some(color => filters.colors.includes(color))
        );
      }

      // Apply price range filter
      result = result.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );

      // Apply sorting
      result.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
          case 'featured':
          default:
            return b.featured ? 1 : -1;
        }
      });

      setFilteredProducts(result);
      setPagination(prev => ({ ...prev, total: result.length }));
    });
  }, [products, filters, sortBy]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [0, filterOptions.maxPrice],
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Get paginated products
  const paginatedProducts = filteredProducts.slice(
    (pagination.page - 1) * pagination.perPage,
    pagination.page * pagination.perPage
  );

  const FiltersComponent = (
    <Filters
      options={filterOptions}
      selectedFilters={filters}
      onFilterChange={handleFilterChange}
      onReset={handleFilterReset}
      activeFilterCount={activeFilterCount}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold tracking-tight">Shop Collection</h1>
          <p className="mt-4 text-muted-foreground">
            Discover our curated collection of premium products.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between pb-6">
          {/* Mobile Filter Trigger */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                {FiltersComponent}
              </SheetContent>
            </Sheet>
          )}

          {/* Sort and Results Count */}
          <div className="flex items-center gap-4 ml-auto">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} results
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          {!isMobile && (
            <div className="col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="pb-4">
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  {FiltersComponent}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="h-[400px] animate-pulse">
                    <div className="h-64 bg-muted rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid products={paginatedProducts} />
                
                {/* Pagination */}
                {pagination.total > pagination.perPage && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ 
                      length: Math.ceil(pagination.total / pagination.perPage) 
                    }).map((_, i) => (
                      <Button
                        key={i}
                        variant={pagination.page === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}