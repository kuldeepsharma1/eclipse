import { IBlogPost } from "@/models/blogSchema";

export interface BlogAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface BlogComment {
  _id: string;
  user: BlogAuthor;
  content: string;
  createdAt: Date;
}

export type BlogPost = Omit<IBlogPost, 'author' | 'comments'> & {
  _id: string;
  author: BlogAuthor;
  comments: BlogComment[];
};

export interface CreateBlogInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published";
  publishedAt?: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {
  slug?: string;
}

export interface AddCommentInput {
  content: string;
}
