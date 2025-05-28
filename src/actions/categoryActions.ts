'use server';

import { revalidatePath } from 'next/cache';

import { Category, ICategory } from '@/models/categorySchema';
import connectDB from '@/lib/db';
import { auth } from '@/auth';
import { Types } from 'mongoose';


export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  try {
    await connectDB();
    const parentValue = formData.get('parent');
    const categoryData: Partial<ICategory> = {
      name: formData.get('name') as string,
      parent: parentValue && parentValue !== 'none' ? new Types.ObjectId(parentValue as string) : undefined,
      image: formData.get('image') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      seo: {
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        keywords: formData.get('keywords')?.toString().split(',').map(kw => kw.trim()) || [],
      },
    
    };

    await Category.create(categoryData);
    revalidatePath('/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find({  }).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function getFeaturedCategories() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true, isFeatured: true }).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  try {
    await connectDB();
    const parentValue = formData.get('parent');
    const updateData: Partial<ICategory> = {
      name: formData.get('name') as string,
      parent: parentValue && parentValue !== 'none' ? new Types.ObjectId(parentValue as string) : undefined,
      image: formData.get('image') as string,
      isActive: formData.get('isActive') === 'true',
      isFeatured: formData.get('isFeatured') === 'true',
      seo: {
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        keywords: formData.get('keywords')?.toString().split(',').map(kw => kw.trim()) || [],
      },
    };

    await Category.findByIdAndUpdate(categoryId, updateData);
    revalidatePath('/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  try {
    await connectDB();
    await Category.findByIdAndDelete(categoryId);
    revalidatePath('/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectDB();
    const category = await Category.findById(id).lean();
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    return { error: (error as Error).message };
  }
}