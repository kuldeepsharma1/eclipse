"use server";

import connectDB from "@/lib/db";
import { BlogPost } from "@/models/blogSchema";

import { BlogPost as BlogType } from "@/types/blog";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
interface BlogResponse<T> {
  data: T | null;
  error: string | null;
}
const blogPostSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(300),
  author: z.string(),
  featuredImage: z.string().url(),
  categories: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published']),
  publishedAt: z.date().optional(),
  seo: z.object({
    metaTitle: z.string().max(70).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().url().optional(),
    canonicalUrl: z.string().url().optional(),
  }).optional(),
}).strict();
export async function getBlogPosts(): Promise<BlogResponse<BlogType[]>> {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .populate("author", "firstName lastName image")
      .lean();
    return { data: posts, error: null };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { data: null, error: "Failed to fetch blog posts" };
  }
}

export async function getBlogPost(slug: string): Promise<BlogResponse<BlogPost>> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: "published" })
      .populate("author", "firstName lastName image")
      .populate("comments.user", "firstName lastName image")
      .lean();
    
    if (!post) {
      return { data: null, error: "Blog post not found" };
    }

    // Increment views
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    
    return { data: post, error: null };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { data: null, error: "Failed to fetch blog post" };
  }
}

export async function createBlogPost(data: z.infer<typeof blogPostSchema>): Promise<BlogResponse<BlogPost>> {
  try {
    await connectDB();
    
    // Validate input
    const validatedData = blogPostSchema.parse({
      ...data,
      author: new mongoose.Types.ObjectId(data.author),
    });

    // Check for duplicate slug
    const existingPost = await BlogPost.findOne({ slug: validatedData.slug });
    if (existingPost) {
      return { data: null, error: 'Slug already exists' };
    }

    const post = await BlogPost.create({
      ...validatedData,
      readTime: 0, // Will be calculated by schema pre-save hook
      likes: 0,
      views: 0,
      comments: [],
      metadata: new Map(),
    });

    revalidatePath('/blog');
    return { data: post.toObject(), error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    console.error('Error creating blog post:', error);
    return { data: null, error: 'Failed to create blog post' };
  }
}

export async function updateBlogPost(slug: string, data: Partial<BlogPost>): Promise<BlogResponse<BlogPost>> {
  try {
    await connectDB();
    const post = await BlogPost.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true }
    ).populate("author", "firstName lastName image");
    
    if (!post) {
      return { data: null, error: "Blog post not found" };
    }
    
    revalidatePath(`/blog/${slug}`);
    return { data: post, error: null };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { data: null, error: "Failed to update blog post" };
  }
}

export async function deleteBlogPost(slug: string): Promise<BlogResponse<boolean>> {
  try {
    await connectDB();
    const result = await BlogPost.findOneAndDelete({ slug });
    if (!result) {
      return { data: false, error: "Blog post not found" };
    }
    revalidatePath("/blog");
    return { data: true, error: null };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { data: false, error: "Failed to delete blog post" };
  }
}

export async function likeBlogPost(slug: string): Promise<BlogResponse<BlogPost>> {
  try {
    await connectDB();
    const post = await BlogPost.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } },
      { new: true }
    ).populate("author", "firstName lastName image");

    if (!post) {
      return { data: null, error: "Blog post not found" };
    }

    revalidatePath(`/blog/${slug}`);
    return { data: post, error: null };
  } catch (error) {
    console.error("Error liking blog post:", error);
    return { data: null, error: "Failed to like blog post" };
  }
}

export async function addComment(
  slug: string, 
  userId: string, 
  content: string
): Promise<BlogResponse<BlogPost>> {
  try {
    await connectDB();
    const post = await BlogPost.findOneAndUpdate(
      { slug },
      {
        $push: {
          comments: {
            user: userId,
            content,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("comments.user", "firstName lastName image");

    if (!post) {
      return { data: null, error: "Blog post not found" };
    }

    revalidatePath(`/blog/${slug}`);
    return { data: post, error: null };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { data: null, error: "Failed to add comment" };
  }
}
