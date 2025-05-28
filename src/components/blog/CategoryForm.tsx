'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, updateCategory } from '@/actions/categoryActions';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ICategory } from '@/models/categorySchema';

interface CategoryFormProps {
  category?: ICategory & { _id: string };
  mode?: 'create' | 'edit';
}

export default function CategoryForm({ category, mode = 'create' }: CategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<(ICategory & { _id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  //   const  session  = getUserSession();

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      const result = await getCategories();
      if (!('error' in result)) {
        setCategories(result);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  //   if (!session) return null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    const result = mode === 'create'
      ? await createCategory(formData)
      : await updateCategory(category!._id, formData);

    if (result.success) {
      setSuccess(`Category ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      router.refresh();
      if (mode === 'create') {
        // Reset form
        const form = document.querySelector('form') as HTMLFormElement;
        form?.reset();
      }
    } else {
      setError(result.error || `Failed to ${mode} category`);
    }
  }

  if (loading) return <div className="text-center">Loading categories...</div>;

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Category Name"
          required
          className="w-full"
          defaultValue={category?.name}
        />
      </div>
      <div>
        <Textarea
          name="description"
          placeholder="Category Description (max 1000 characters)"
          maxLength={1000}
          className="w-full"
          defaultValue={category?.description}
        />
      </div>
      <div>
        <Select name="parent" defaultValue={category?.parent ? category.parent.toString() : 'none'}>
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat._id.toString()}>
                {cat.ancestors.map((a: { name: string }) => a.name).join(' > ')} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="url"
          name="image"
          placeholder="Category Image URL"
          className="w-full"
          defaultValue={category?.image}
        />
      </div>
      <div>
        <Select name="isActive" defaultValue={String(category?.isActive)}>
          <SelectTrigger>
            <SelectValue placeholder="Select active status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select name="isFeatured" defaultValue={String(category?.isFeatured)}>
          <SelectTrigger>
            <SelectValue placeholder="Select featured status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="text"
          name="metaTitle"
          placeholder="SEO Meta Title (max 70 characters)"
          maxLength={70}
          className="w-full"
          defaultValue={category?.seo.metaTitle}
        />
      </div>
      <div>
        <Textarea
          name="metaDescription"
          placeholder="SEO Meta Description (max 160 characters)"
          maxLength={160}
          className="w-full"
          defaultValue={category?.seo.metaDescription}
        />
      </div>
      <div>
        <Input
          type="text"
          name="keywords"
          placeholder="SEO Keywords (comma-separated)"
          className="w-full"
          defaultValue={category?.seo.keywords}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <SubmitButton mode={mode} />
    </form>
  );
}

function SubmitButton({ mode }: { mode?: 'create' | 'edit'; }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? 'Creating...'
        : mode === 'edit'
          ? 'Update Category'
          : 'Create Category'}
    </Button>

  );
}