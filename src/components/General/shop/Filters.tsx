// components/shop/Filters.tsx
'use client'; // Needed for stateful components

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
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names (like in shadcn setup)

// Mock filter options (replace with dynamic data later)
// Consider fetching these from your backend/API
const filterOptions = {
  categories: [
    { id: 'basics', label: 'Basics' },
    { id: 'graphic', label: 'Graphic Tees' },
    { id: 'oversized', label: 'Oversized Fit' },
    { id: 'limited', label: 'Limited Edition' },
    { id: 'new', label: 'New Arrivals' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    // Using hex for more control, especially for white/black variants
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Grey', value: '#808080' },
    { name: 'Charcoal', value: '#36454F' },
    { name: 'Navy', value: '#000080' },
    // Add more sophisticated colors if needed
    { name: 'Off-White', value: '#FAF9F6' },
  ],
  maxPrice: 150, // Example max price
};

export function Filters() {
  // State for filters
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, filterOptions.maxPrice]);

  // Handlers for filter changes
  const handleCategoryChange = (categoryId: string, checked: boolean | 'indeterminate') => {
    setSelectedCategories(prev =>
      checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    );
    // Add logic to apply filters immediately or wait for Apply button
  };

  const handleSizeChange = (newSizes: string[]) => {
    setSelectedSizes(newSizes);
    // Add logic to apply filters
  };

  const handleColorChange = (colorValue: string) => {
    setSelectedColors(prev =>
      prev.includes(colorValue)
        ? prev.filter(c => c !== colorValue)
        : [...prev, colorValue]
    );
    // Add logic to apply filters
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
    // Debounce this or apply on release if needed
  };

  // Handler for resetting all filters
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, filterOptions.maxPrice]);
    // Add logic to re-fetch/reset products
  };

  // Handler to apply filters (if not applying on change)
  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      price: priceRange,
    });
    // Add actual filtering logic here (e.g., update URL params, call API)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-lg font-semibold">Filters</h2>
         <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-primary">
           Reset All
         </Button>
      </div>

      <Accordion
        type="multiple"
        // Default open sections - adjust as needed
        defaultValue={['categories', 'size', 'color', 'price']}
        className="w-full"
      >
        {/* --- Category Filter --- */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            Category
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid gap-2">
              {filterOptions.categories.map((category) => (
                <Label
                  key={category.id}
                  htmlFor={`cat-${category.id}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                >
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                  />
                  <span className="font-normal text-sm text-foreground">
                    {category.label}
                  </span>
                </Label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* --- Size Filter --- */}
        <AccordionItem value="size">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            Size
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {/* Using ToggleGroup for multi-select */}
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={selectedSizes}
              onValueChange={handleSizeChange}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2"
              aria-label="Select sizes"
            >
              {filterOptions.sizes.map((size) => (
                <ToggleGroupItem
                  key={size}
                  value={size}
                  aria-label={`Select size ${size}`}
                  className="h-10 text-xs sm:text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {size}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>

        {/* --- Color Filter --- */}
        <AccordionItem value="color">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            Color
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="flex flex-wrap gap-3">
              {filterOptions.colors.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  size="icon"
                  onClick={() => handleColorChange(color.value)}
                  className={cn(
                    'w-8 h-8 rounded-full border-muted transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    // Add border for light colors like white for visibility
                    (color.value === '#FFFFFF' || color.value === '#FAF9F6') && 'border-neutral-300 dark:border-neutral-700',
                    // Style for selected state
                    selectedColors.includes(color.value) && 'ring-2 ring-primary ring-offset-2'
                  )}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select color ${color.name}`}
                >
                  {/* Optional: Add a checkmark icon for selected state */}
                  {/* {selectedColors.includes(color.value) && <Check className="h-4 w-4 text-white mix-blend-difference" />} */}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* --- Price Filter --- */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-6 px-1">
            <Slider
              value={priceRange}
              max={filterOptions.maxPrice}
              min={0}
              step={5} // Adjust step as needed
              minStepsBetweenThumbs={1}
              onValueChange={handlePriceChange}
              className="w-full"
              aria-label="Price range slider"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-3">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* --- Apply Button (Optional) --- */}
      {/* If you want users to explicitly apply filters */}
    
      <Button onClick={handleApplyFilters} className="w-full mt-6">
        Apply Filters
      </Button>
      
    </div>
  );
}


