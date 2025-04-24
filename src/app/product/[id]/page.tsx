'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, Truck, ShoppingCart, Heart, Share2, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { toast } from 'sonner';
import { getProducts } from '@/app/actions/product';

// Create metadata component
function ProductMetadata({ product }: { product: Product }) {
  if (!product?.seoMetadata) return null;

  return (
    <>
      <title>{product.seoMetadata.title}</title>
      <meta name="description" content={product.seoMetadata.description} />
      <meta name="keywords" content={product.seoMetadata.keywords.join(', ')} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.seoMetadata.title} />
      <meta property="og:description" content={product.seoMetadata.description} />
      <meta property="og:image" content={product.seoMetadata.ogImage} />
      {product.seoMetadata.canonicalUrl && (
        <meta property="og:url" content={product.seoMetadata.canonicalUrl} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="product" />
      <meta name="twitter:title" content={product.seoMetadata.title} />
      <meta name="twitter:description" content={product.seoMetadata.description} />
      <meta name="twitter:image" content={product.seoMetadata.ogImage} />

      {/* Product specific metadata */}
      <meta property="product:price:amount" content={product.price.toString()} />
      <meta property="product:price:currency" content="USD" />
      <meta property="product:availability" content={product.status === 'active' ? 'in stock' : 'out of stock'} />
      <meta property="product:condition" content="new" />
      <meta property="product:brand" content={product.brand || ''} />
      <meta property="product:category" content={product.category} />
      {product.sku && <meta property="product:sku" content={product.sku} />}
      
      {/* Canonical URL */}
      {product.seoMetadata.canonicalUrl && (
        <link rel="canonical" href={product.seoMetadata.canonicalUrl} />
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: [product.image],
          description: product.description,
          sku: product.sku,
          brand: {
            "@type": "Brand",
            name: product.brand
          },
          offers: {
            "@type": "Offer",
            url: product.seoMetadata.canonicalUrl,
            priceCurrency: "USD",
            price: product.price,
            availability: product.status === 'active' 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "Eclipse Store"
            }
          }
        })}
      </script>
    </>
  );
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { addWishlistItem, removeItem, isInWishlist } = useWishlistStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products.find(p => p.id === params.id);
        if (found) {
          setProduct(found);
          setAllProducts(products);
          if (found.variants?.length) {
            setSelectedVariant(found.variants[0].id);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const variant = product.variants?.find(v => v.id === selectedVariant);
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: variant?.price || product.price,
      image: product.image,
      quantity,
      sku: variant?.sku || product.sku,
      variant: variant ? {
        id: variant.id,
        name: variant.name,
        attributes: variant.attributes
      } : undefined
    };

    addItem(itemToAdd);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addWishlistItem(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants?.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.price;
  const inStock = currentVariant ? currentVariant.stock > 0 : (product.stock || 0) > 0;

  const breadcrumbItems = [
    { label: 'Shop', href: '/shop' },
    ...(product.categories?.slice(0, -1).map(category => ({
      label: category,
      href: `/shop?category=${encodeURIComponent(category.toLowerCase())}`
    })) || []),
    { label: product.name, href: `/product/${product.id}` }
  ];

  return (
    <>
      {product && <ProductMetadata product={product} />}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        {/* Rest of the product page content... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={currentVariant?.images?.[activeImageIndex] || product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {(currentVariant?.images?.length || 0) > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {currentVariant?.images.map((img, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 
                      ${activeImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 15vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${
                        index < (product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600">SKU: {currentVariant?.sku || product.sku}</div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  ${currentPrice.toFixed(2)}
                </span>
                {product.discount && (
                  <span className="text-lg text-gray-500 line-through">
                    ${(currentPrice / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="px-2 py-1 text-sm font-medium text-white bg-red-500 rounded-full">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Available Options</h3>
                <RadioGroup value={selectedVariant} onValueChange={setSelectedVariant}>
                  <div className="grid grid-cols-2 gap-4">
                    {product.variants.map((variant) => (
                      <div key={variant.id}>
                        <RadioGroupItem
                          value={variant.id}
                          id={variant.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={variant.id}
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 p-4 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 cursor-pointer"
                        >
                          <span className="text-sm font-medium">{variant.name}</span>
                          <span className="text-sm text-gray-500">
                            ${variant.price.toFixed(2)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!inStock}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!inStock}
                  >
                    +
                  </Button>
                </div>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant={isInWishlist(product.id) ? 'default' : 'outline'}
                  size="icon"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product.id) ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                </Button>
              </div>

              {/* Stock Status */}
              {inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="h-5 w-5" />
                  <span>In Stock - Ready to Ship</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-600">{product.description}</p>
                    {product.features && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Key Features:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="text-gray-600">{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specifications" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {product.specifications && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="border-b pb-2">
                            <dt className="text-sm font-medium text-gray-500">{key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    {product.shippingInfo && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Shipping Information:</h4>
                          <p className="text-gray-600">
                            {product.shippingInfo.freeShipping 
                              ? 'Free Shipping Available' 
                              : 'Standard Shipping Rates Apply'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Product Dimensions:</h4>
                          <p className="text-gray-600">
                            {product.shippingInfo.dimensions.length}" L x{' '}
                            {product.shippingInfo.dimensions.width}" W x{' '}
                            {product.shippingInfo.dimensions.height}" H
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Weight:</h4>
                          <p className="text-gray-600">{product.shippingInfo.weight} kg</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Additional Information Accordions */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="returns">
                <AccordionTrigger>Returns & Warranty</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {product.returnPolicy && (
                      <p className="text-gray-600">
                        {product.returnPolicy.duration} return period. 
                        Condition: {product.returnPolicy.condition}
                      </p>
                    )}
                    {product.warranty && (
                      <p className="text-gray-600">Warranty: {product.warranty}</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sustainability">
                <AccordionTrigger>Sustainability</AccordionTrigger>
                <AccordionContent>
                  {product.sustainability && (
                    <div className="space-y-2">
                      {product.sustainability.ecoFriendlyDyes && (
                        <p className="text-gray-600">✓ Eco-friendly dyes used</p>
                      )}
                      {product.sustainability.waterSavingTechnology && (
                        <p className="text-gray-600">✓ Water-saving technology</p>
                      )}
                      {product.sustainability.recyclablePackaging && (
                        <p className="text-gray-600">✓ Recyclable packaging</p>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="questions">
                <AccordionTrigger>Common Questions</AccordionTrigger>
                <AccordionContent>
                  {product.customerQuestions && (
                    <div className="space-y-4">
                      {product.customerQuestions.map((qa, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <h4 className="font-medium text-gray-900 mb-2">{qa.question}</h4>
                          <p className="text-gray-600">{qa.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products with updated implementation */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.slice(0, 4).map((relatedId) => {
                const relatedProduct = allProducts.find(p => p.id === relatedId);
                if (!relatedProduct) return null;

                return (
                  <Card
                    key={relatedId}
                    className="h-full flex flex-col transition-shadow hover:shadow-xl border-none"
                  >
                    <CardHeader className="relative p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover rounded-t-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                      {relatedProduct.isNew && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">{relatedProduct.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => {
                          addItem({ 
                            id: relatedProduct.id, 
                            name: relatedProduct.name, 
                            image: relatedProduct.image, 
                            price: relatedProduct.price, 
                            quantity: 1,
                            sku: relatedProduct.sku
                          });
                          toast.success(`${relatedProduct.name} added to cart`);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}