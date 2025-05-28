// app/blog/create/page.tsx
'use client';

import {  useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createBlogPost } from '@/actions/blogActions';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

// Zod schema for form validation
const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt cannot exceed 300 characters'),
  featuredImage: z.string().url('Invalid image URL').min(1, 'Featured image is required'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']),
  seo: z.object({
    metaTitle: z.string().max(70, 'Meta title cannot exceed 70 characters').optional(),
    metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url('Invalid OG image URL').optional(),
    canonicalUrl: z.string().url('Invalid canonical URL').optional(),
  }).optional(),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      featuredImage: '',
      categories: [],
      tags: [],
      content: '',
      status: 'draft',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        ogImage: '',
        canonicalUrl: '',
      },
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const onSubmit = async (data: BlogPostForm) => {
    startTransition(async () => {
      try {
        const response = await createBlogPost({
          ...data,
          author: 'user123', // Replace with actual auth context
          publishedAt: data.status === 'published' ? new Date() : undefined,
        });

        if (response.error) {
          toast.error(response.error);
          return;
        }

        if (response.data) {
          toast.success('Blog post created successfully!');
          router.push(`/blog/${response.data.slug}`);
        }
      } catch (error) {
        toast.error(`Failed to create blog post ${error}`);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              form.setValue('slug', generateSlug(e.target.value));
                            }}
                            placeholder="Enter post title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="post-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Brief post description" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="https://example.com/image.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange([value])}
                          value={field.value[0] || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="style">Style</SelectItem>
                            <SelectItem value="trends">Trends</SelectItem>
                            <SelectItem value="guides">Guides</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value.join(', ')}
                            onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))}
                            placeholder="tag1, tag2, tag3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Post'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}