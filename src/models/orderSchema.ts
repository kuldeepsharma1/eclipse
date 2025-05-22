import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

// Interface for TypeScript type safety
interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    productId: mongoose.Types.ObjectId;
    variantId?: string;
    quantity: number;
    price: number;
    discountPrice?: number;
  }[];
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  payment: {
    method: "credit_card" | "paypal" | "bank_transfer" | "cod";
    status: "pending" | "completed" | "failed" | "refunded";
    transactionId?: string;
    paidAt?: Date;
  };
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  shippingMethod: string;
  trackingNumber?: string;
  orderedAt: Date;
  deliveredAt?: Date;
  notes?: string;
  metadata: Map<string, string | number | boolean | object>;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EclipseUser",
      required: [true, "User is required"],
    },
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => /^[A-Z0-9-]+$/.test(value),
        message: "Order number must contain only uppercase letters, numbers, and hyphens",
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        variantId: {
          type: String, // Matches variant SKU or ID
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
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
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    taxAmount: {
      type: Number,
      required: [true, "Tax amount is required"],
      min: [0, "Tax amount cannot be negative"],
    },
    shippingAmount: {
      type: Number,
      required: [true, "Shipping amount is required"],
      min: [0, "Shipping amount cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "GBP", "EUR", "CAD"], // Add more as needed
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    payment: {
      method: {
        type: String,
        enum: ["credit_card", "paypal", "bank_transfer", "cod"],
        required: [true, "Payment method is required"],
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: {
        type: String,
        trim: true,
      },
      paidAt: {
        type: Date,
      },
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
        maxlength: [100, "Street address cannot exceed 100 characters"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxlength: [50, "City cannot exceed 50 characters"],
      },
      state: {
        type: String,
        trim: true,
        maxlength: [50, "State cannot exceed 50 characters"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        maxlength: [50, "Country cannot exceed 50 characters"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
        validate: {
          validator: (value: string) => validator.isPostalCode(value, "any"),
          message: "Invalid postal code format",
        },
      },
    },
    billingAddress: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
        maxlength: [100, "Street address cannot exceed 100 characters"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        maxlength: [50, "City cannot exceed 50 characters"],
      },
      state: {
        type: String,
        trim: true,
        maxlength: [50, "State cannot exceed 50 characters"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        maxlength: [50, "Country cannot exceed 50 characters"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
        validate: {
          validator: (value: string) => validator.isPostalCode(value, "any"),
          message: "Invalid postal code format",
        },
      },
    },
    shippingMethod: {
      type: String,
      required: [true, "Shipping method is required"],
      trim: true,
      maxlength: [50, "Shipping method cannot exceed 50 characters"],
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    orderedAt: {
      type: Date,
      required: [true, "Order date is required"],
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
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
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderedAt: 1 });

export const Order = mongoose.models?.Order || mongoose.model<IOrder>("Order", orderSchema);