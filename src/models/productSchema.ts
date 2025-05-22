import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";


interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  categories: mongoose.Types.ObjectId[];
  brand?: string;
  variants: {
    name: string;
    sku: string;
    price: number;
    discountPrice?: number;
    stock: number;
    attributes: { key: string; value: string }[];
  }[];
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  thumbnail: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  taxRate: number;
  isActive: boolean;
  isFeatured: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  metadata: Map<string, string | number | boolean | null>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
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
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => /^[A-Z0-9-]+$/.test(value),
        message: "SKU must contain only uppercase letters, numbers, and hyphens",
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "At least one category is required"],
      },
    ],
    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    variants: [
      {
        name: {
          type: String,
          required: [true, "Variant name is required"],
          trim: true,
          maxlength: [50, "Variant name cannot exceed 50 characters"],
        },
        sku: {
          type: String,
          required: [true, "Variant SKU is required"],
          trim: true,
          validate: {
            validator: (value: string) => /^[A-Z0-9-]+$/.test(value),
            message: "Variant SKU must contain only uppercase letters, numbers, and hyphens",
          },
        },
        price: {
          type: Number,
          required: [true, "Variant price is required"],
          min: [0, "Price cannot be negative"],
        },
        discountPrice: {
          type: Number,
          min: [0, "Discount price cannot be negative"],
          validate: {
            validator: function (this: { price: number }, value: number) {
              return !value || value <= this.price;
            },
            message: "Discount price cannot exceed the original price",
          },
        },
        stock: {
          type: Number,
          required: [true, "Stock quantity is required"],
          min: [0, "Stock cannot be negative"],
          default: 0,
        },
        attributes: [
          {
            key: { type: String, required: true, trim: true },
            value: { type: String, required: true, trim: true },
          },
        ],
      },
    ],
    price: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (value: number) {
          return !value || value <= this.price;
        },
        message: "Discount price cannot exceed the base price",
      },
    },
    stock: {
      type: Number,
      required: [true, "Base stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        type: String,
        validate: {
          validator: (value: string) => validator.isURL(value, { require_protocol: true }),
          message: "Invalid image URL",
        },
      },
    ],
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
      validate: {
        validator: (value: string) => validator.isURL(value, { require_protocol: true }),
        message: "Invalid thumbnail URL",
      },
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: { type: Number, min: [0, "Length cannot be negative"] },
      width: { type: Number, min: [0, "Width cannot be negative"] },
      height: { type: Number, min: [0, "Height cannot be negative"] },
    },
    taxRate: {
      type: Number,
      min: [0, "Tax rate cannot be negative"],
      default: 0,
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
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

// Pre-save hook to ensure unique variant SKUs
productSchema.pre("save", async function (next) {
  const variantSkus = this.variants.map((v) => v.sku);
  if (new Set(variantSkus).size !== variantSkus.length) {
    throw new Error("Variant SKUs must be unique within the product");
  }
  next();
});

export const Product = mongoose.models?.Product || mongoose.model<IProduct>("Product", productSchema);