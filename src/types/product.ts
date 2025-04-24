export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  brand?: string;
  features?: string[];
  color?: string;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;

  // Enterprise fields
  sku: string;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  seoMetadata?: SEOMetadata;
  shippingInfo?: ShippingInfo;
  taxInfo?: TaxInfo;
  status: 'active' | 'outOfStock' | 'discontinued' | 'comingSoon';
  relatedProducts?: string[];
  categories?: string[];
  tags?: string[];
  warranty?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  returnPolicy?: {
    duration: string;
    condition: string;
  };
  ratingsBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  origin?: string;
  careInstructions?: string[];
  modelWearing?: {
    height: string;
    size: string;
  };
  sustainability?: {
    ecoFriendlyDyes: boolean;
    waterSavingTechnology: boolean;
    recyclablePackaging: boolean;
  };
  customerQuestions?: {
    question: string;
    answer: string;
  }[];
  availabilityStatus?: {
    stockLevel: number;
    restockDate?: string;
  };
  analytics?: {
    views: number;
    sales: number;
    conversionRate: number;
    averageRating: number;
  };
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  images: string[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl?: string;
}

export interface ShippingInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingClass: string;
  freeShipping: boolean;
  restrictions?: string[];
}

export interface TaxInfo {
  taxable: boolean;
  taxClass: string;
  taxRate: number;
  taxCode?: string;
}