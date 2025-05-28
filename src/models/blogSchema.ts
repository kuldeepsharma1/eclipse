import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: mongoose.Types.ObjectId;
  featuredImage: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published";
  publishedAt: Date;
  readTime: number;
  likes: number;
  views: number;
  comments: Array<{
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
    canonicalUrl: string;
  };
  metadata: Map<string, string | number | boolean | null>;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => /^[a-z0-9-]+$/.test(value),
        message: "Slug must contain only lowercase letters, numbers, and hyphens",
      },
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "EclipseUser",
      required: true,
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
      validate: {
        validator: (value: string) => validator.isURL(value),
        message: "Invalid image URL",
      },
    },
    categories: [{
      type: String,
      trim: true,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    readTime: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: "EclipseUser",
        required: true,
      },
      content: {
        type: String,
        required: true,
        maxlength: [1000, "Comment cannot exceed 1000 characters"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [70, "Meta title cannot exceed 70 characters"],
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [{ type: String, trim: true }],
      ogImage: String,
      canonicalUrl: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ author: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ categories: 1 });
blogPostSchema.index({ tags: 1 });

blogPostSchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});
// Calculate readTime before saving
blogPostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

export const BlogPost = mongoose.models?.BlogPost || mongoose.model<IBlogPost>("BlogPost", blogPostSchema);
