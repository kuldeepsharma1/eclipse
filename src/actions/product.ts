"use server"

import data from '@/db/products';
import { Product } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  // Simulate DB delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return data.map(item => ({
    id: item.id,
    name: item.title,
    price: parseFloat(item.newPrice),
    category: item.category,
    image: item.img,
    rating: item.star,
    reviews: parseInt(item.reviews.replace(/[^0-9]/g, '')),
    brand: item.company,
    color: item.color,
    sku: item.sku || `${item.company}-${item.id}`.toUpperCase(),
    variants: item.variants,
    specifications: item.specifications,
    seoMetadata: item.seoMetadata,
    shippingInfo: item.shippingInfo || {
      weight: 0.5,
      dimensions: {
        length: 20,
        width: 15,
        height: 5
      },
      shippingClass: "standard",
      freeShipping: item.price > 100,
      restrictions: []
    },
    taxInfo: item.taxInfo || {
      taxable: true,
      taxClass: "standard",
      taxRate: 0.10,
      taxCode: `${item.category}-001`.toUpperCase()
    },
    status: item.stock === 0 ? 'outOfStock' : 'active',
    relatedProducts: item.relatedProducts || [],
    categories: item.categories || [item.category],
    tags: item.tags || [],
    warranty: item.warranty || "30-day standard warranty",
    stock: item.stock || 100,
    description: item.description || `High-quality ${item.title} from ${item.company}. Perfect for any occasion.`,
    features: item.features || [
      `Premium quality ${item.category}`,
      `Made by ${item.company}`,
      `Available in ${item.color}`,
      "Fast shipping available",
      "30-day warranty included"
    ],
    isNew: item.isNew || false,
    isSale: item.isSale || false,
    discount: item.discount || null
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function getRelatedProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  const products = await getProducts();
  
  // First try to get explicitly defined related products
  if (product.relatedProducts && product.relatedProducts.length) {
    const related = products.filter(p => 
      product.relatedProducts!.includes(p.id) && p.id !== product.id
    );
    if (related.length >= limit) return related.slice(0, limit);
  }
  
  // Otherwise, find products in the same category
  const sameCategory = products.filter(p => 
    p.category === product.category && p.id !== product.id
  );
  
  // If not enough in same category, add products from same brand
  if (sameCategory.length < limit) {
    const sameBrand = products.filter(p => 
      p.brand === product.brand && 
      p.category !== product.category && 
      p.id !== product.id
    );
    return [...sameCategory, ...sameBrand].slice(0, limit);
  }
  
  return sameCategory.slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts();
  const searchTerms = query.toLowerCase().split(' ');
  
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.brand,
      ...(product.tags || []),
      ...(product.features || []),
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(product => 
    product.categories?.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    ) || 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(product => 
    product.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}
