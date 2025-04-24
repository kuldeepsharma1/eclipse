// components/shop/ProductCard.tsx
import Image from 'next/image'; // Use Next.js Image for optimization
import Link from 'next/link';


// Define a Product type (or import from a shared types file)
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  color?: string; // Optional properties
  size?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-zinc-900 hover:bg-black text-white py-4 text-sm">
            Quick Add
          </button>
        </div>

        {/* Product badges */}
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-white px-3 py-1.5 text-xs font-medium">
            New
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-zinc-900">{product.name}</h3>
          <p className="text-sm text-zinc-600">${product.price.toFixed(2)}</p>
        </div>
        {product.color && (
          <div className="mt-2 flex gap-1.5">
            <div className="w-3 h-3 rounded-full border shadow-sm bg-zinc-900" />
            <div className="w-3 h-3 rounded-full border shadow-sm bg-zinc-100" />
          </div>
        )}
      </div>
    </Link>
  );
}