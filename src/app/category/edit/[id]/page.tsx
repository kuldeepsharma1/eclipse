
import { Suspense } from 'react';
import { getCategoryById } from '@/actions/categoryActions';
import CategoryForm from '@/components/blog/CategoryForm';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const category = await getCategoryById(params.id);

  if (!category || 'error' in category) {
    return <div>Error: Category not found</div>;
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Edit Category</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <CategoryForm category={category} mode="edit" />
      </Suspense>
    </main>
  );
}
