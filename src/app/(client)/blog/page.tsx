'use client';

import { useState, useEffect } from 'react';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { getBlogPosts } from '@/actions/blogActions';
import type { BlogPost } from '@/types/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getBlogPosts();
        if (response.error) {
          throw new Error(response.error);
        }
        setPosts(response.data || []);
        setFilteredPosts(response.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch blog posts');
        setIsLoading(false);
        setPosts([]);
        setFilteredPosts([]);
      }
    };

    fetchPosts();
  }, []);

  // Get unique categories from posts
  const categories = ['all', ...new Set(posts.flatMap(post => post.categories || []))];

  // Filter posts based on category and search query
  useEffect(() => {
    let result = [...posts];

    if (activeCategory !== 'all') {
      result = result.filter(post => 
        post.categories.includes(activeCategory)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPosts(result);
  }, [activeCategory, searchQuery, posts]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Eclipse Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest trends, style guides, and fashion insights
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>
          
          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="w-full md:w-auto overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
            >
              <div className="bg-muted h-48 rounded-t-lg" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <BlogGrid posts={filteredPosts} />
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}
