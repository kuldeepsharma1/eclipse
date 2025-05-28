import { Suspense } from 'react';
import CategoryForm from '@/components/blog/CategoryForm';
import CategoryTable from '@/components/blog/CategoryTable';
import { getCategories } from '@/actions/categoryActions';



export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Category Management</h1>
        
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Category List</h2>
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoryTable categories={!('error' in categories) ? categories : []} />
          </Suspense>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Add New Category</h2>
          <Suspense fallback={<div>Loading form...</div>}>
            <CategoryForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
};