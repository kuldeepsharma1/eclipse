// components/shop/Filters.tsx
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface FilterOptions {
  categories: Array<{ id: string; label: string }>;
  brands: Array<{ id: string; label: string }>;
  sizes: string[];
  colors: Array<{ name: string; value: string }>;
  maxPrice: number;
}

interface FiltersProps {
  options: FilterOptions;
  selectedFilters: {
    categories: string[];
    brands: string[];
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
  };
  onFilterChange: (filterType: string, value: any) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function Filters({ 
  options, 
  selectedFilters, 
  onFilterChange, 
  onReset,
  activeFilterCount 
}: FiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="font-normal">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-muted-foreground hover:text-primary"
          >
            Clear all
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-180px)] pr-4">
        <Accordion
          type="multiple"
          defaultValue={['categories', 'brands', 'size', 'color', 'price']}
          className="w-full space-y-4"
        >
          {/* Categories */}
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-2">
              Categories
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-2">
                {options.categories.map((category) => (
                  <Label
                    key={category.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                  >
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedFilters.categories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        onFilterChange('categories', 
                          checked 
                            ? [...selectedFilters.categories, category.id]
                            : selectedFilters.categories.filter(id => id !== category.id)
                        )
                      }
                    />
                    <span className="text-sm text-foreground">{category.label}</span>
                  </Label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands */}
          <AccordionItem value="brands" className="border-none">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-2">
              Brands
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-2">
                {options.brands.map((brand) => (
                  <Label
                    key={brand.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                  >
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedFilters.brands.includes(brand.id)}
                      onCheckedChange={(checked) => 
                        onFilterChange('brands', 
                          checked 
                            ? [...selectedFilters.brands, brand.id]
                            : selectedFilters.brands.filter(id => id !== brand.id)
                        )
                      }
                    />
                    <span className="text-sm text-foreground">{brand.label}</span>
                  </Label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sizes */}
          <AccordionItem value="size" className="border-none">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-2">
              Size
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <ToggleGroup
                type="multiple"
                value={selectedFilters.sizes}
                onValueChange={(values) => onFilterChange('sizes', values)}
                className="flex flex-wrap gap-2"
              >
                {options.sizes.map((size) => (
                  <ToggleGroupItem
                    key={size}
                    value={size}
                    aria-label={`Size ${size}`}
                    className="h-10 px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {size}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Colors */}
          <AccordionItem value="color" className="border-none">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-2">
              Color
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <div className="flex flex-wrap gap-3">
                {options.colors.map((color) => (
                  <Button
                    key={color.value}
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      onFilterChange('colors', 
                        selectedFilters.colors.includes(color.value)
                          ? selectedFilters.colors.filter(c => c !== color.value)
                          : [...selectedFilters.colors, color.value]
                      );
                    }}
                    className={cn(
                      'w-8 h-8 rounded-full border transition-all duration-200',
                      selectedFilters.colors.includes(color.value) && 'ring-2 ring-primary ring-offset-2',
                      (color.value === '#FFFFFF' || color.value === '#FAF9F6') && 'border-neutral-300'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="text-base font-medium hover:no-underline py-2">
              Price Range
            </AccordionTrigger>
            <AccordionContent className="pt-6 px-1 pb-4">
              <Slider
                value={selectedFilters.priceRange}
                max={options.maxPrice}
                min={0}
                step={5}
                minStepsBetweenThumbs={1}
                onValueChange={(value) => onFilterChange('priceRange', value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-3">
                <span>${selectedFilters.priceRange[0]}</span>
                <span>${selectedFilters.priceRange[1]}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.categories.map((categoryId) => (
              <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                {options.categories.find(c => c.id === categoryId)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange('categories', 
                    selectedFilters.categories.filter(id => id !== categoryId)
                  )}
                />
              </Badge>
            ))}
            {selectedFilters.brands.map((brandId) => (
              <Badge key={brandId} variant="secondary" className="flex items-center gap-1">
                {options.brands.find(b => b.id === brandId)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange('brands', 
                    selectedFilters.brands.filter(id => id !== brandId)
                  )}
                />
              </Badge>
            ))}
            {selectedFilters.sizes.map((size) => (
              <Badge key={size} variant="secondary" className="flex items-center gap-1">
                Size {size}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onFilterChange('sizes', 
                    selectedFilters.sizes.filter(s => s !== size)
                  )}
                />
              </Badge>
            ))}
            {selectedFilters.colors.map((colorValue) => {
              const colorName = options.colors.find(c => c.value === colorValue)?.name;
              return (
                <Badge key={colorValue} variant="secondary" className="flex items-center gap-1">
                  <span
                    className="h-3 w-3 rounded-full inline-block mr-1"
                    style={{ backgroundColor: colorValue }}
                  />
                  {colorName}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onFilterChange('colors', 
                      selectedFilters.colors.filter(c => c !== colorValue)
                    )}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


