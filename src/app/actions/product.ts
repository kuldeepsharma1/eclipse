"use server"

import data from '@/db/products';
import { Product } from '@/types/product';

export async function getProducts(): Promise<Product[]> {
  // Simulate DB delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Convert the data to match Product interface
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
    isNew: Math.random() > 0.8, // Random new flag for demo
  }));
}
