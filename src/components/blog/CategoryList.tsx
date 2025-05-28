'use client';

import Link from 'next/link';

interface CategoryListProps {
  categories: {
    name: string;
    slug: string;
    description?: string;
    ancestors: { name: string; slug: string }[];
    isActive: boolean;
    isFeatured: boolean;
  }[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.slug} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <Link href={`/category/${category.slug}`} className="flex-1">
                <h3 className="text-lg font-medium text-blue-600 hover:underline">
                  {category.ancestors.map((a) => a.name).join(' > ')} {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  {category.isActive && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
                  )}
                  {category.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Featured</span>
                  )}
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}