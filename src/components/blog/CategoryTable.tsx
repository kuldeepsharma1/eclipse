'use client';

import { useState } from 'react';
import { deleteCategory } from '@/actions/categoryActions';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface Ancestor {
  name: string;
}

interface Category {
  _id: string;
  name: string;
  ancestors: Ancestor[];
  isActive: boolean;
  isFeatured: boolean;
}

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLoading(id);
    const result = await deleteCategory(id);
    if (result.success) {
      router.refresh();
    }
    setLoading(null);
  };
console.log(categories);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {category.ancestors.map((a: Ancestor) => a.name).join('>')}  {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowra</span>p">
                <span className={`px-2 py-1 text-xs rounded ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {category.isFeatured ? '✓' : '-'}
              </td>
          
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/category/edit/${category._id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading === category._id}
                  onClick={() => handleDelete(category._id)}
                >
                  {loading === category._id ? 'Deleting...' : 'Delete'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
