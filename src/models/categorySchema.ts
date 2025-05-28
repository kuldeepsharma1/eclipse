import mongoose, {  Document } from "mongoose";
import validator from "validator";


export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  ancestors: { id: mongoose.Types.ObjectId; name: string; slug: string }[];
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => /^[a-z0-9-]+$/.test(value),
        message: "Slug must contain only lowercase letters, numbers, and hyphens",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    ancestors: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        slug: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    image: {
      type: String,
      validate: {
        validator: (value: string) => validator.isURL(value, { require_protocol: true }),
        message: "Invalid image URL",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, isFeatured: 1 });

categorySchema.pre('validate', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});
// Pre-save hook to populate ancestors
categorySchema.pre("save", async function (next) {
  if (this.isModified("parent") || this.isNew) {
    this.ancestors = [];
    if (this.parent) {
      let currentParent = await mongoose.model("Category").findById(this.parent);
      const ancestors = [];
      while (currentParent) {
        ancestors.unshift({
          id: currentParent._id,
          name: currentParent.name,
          slug: currentParent.slug,
        });
        currentParent = currentParent.parent
          ? await mongoose.model("Category").findById(currentParent.parent)
          : null;
      }
      this.ancestors = ancestors;
    }
  }
  next();
});

export const Category = mongoose.models?.Category || mongoose.model<ICategory>("Category", categorySchema);