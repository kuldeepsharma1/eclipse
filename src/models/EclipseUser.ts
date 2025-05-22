import mongoose, { Document } from "mongoose";
import validator from "validator";


interface IEclipseUser extends Document {
  name?: string;
  firstName?: string;
  lastName?: string; 
  email: string;
  password?: string;
  role: "user" | "admin" | "vendor" | "support";
  image?: string;
  authProviderId?: string;
  authProviderType: "email" | "google";
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  phoneNumber?: string;
  addresses: {
    type: "billing" | "shipping";
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
  }[];
  orders: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  cart: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    addedAt: Date;
  }[];
  preferences: {
    currency: string;
    language: string;
    marketingEmails: boolean;
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
    };
  };
  lastLogin?: Date;
  accountStatus: "active" | "suspended" | "deactivated";
  createdAt: Date;
  updatedAt: Date;

}

const userSchema = new mongoose.Schema<IEclipseUser>(
  {
   name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
    //  validate: {
    //     validator: function (value: string) {
    //       // Only validate if password is provided
    //       if (!value) return true;
    //       return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
    //     },
    //     message:
    //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    //   },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "vendor", "support"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    image: {
      type: String,
      validate: {
        validator: (value: string) => validator.isURL(value, { require_protocol: true }),
        message: "Invalid image URL",
      },
    },
    authProviderId: {
      type: String,
      index: true,
    },
    authProviderType: {
      type: String,
      enum: ["email", "google"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: (value: string) => validator.isMobilePhone(value, "any"),
        message: "Invalid phone number format",
      },
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["billing", "shipping"],
          required: true,
        },
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
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "GBP", "EUR", "CAD"],
      },
      language: {
        type: String,
        default: "en",
        enum: ["en", "es", "fr", "de"],
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      notifications: {
        orderUpdates: {
          type: Boolean,
          default: true,
        },
        promotions: {
          type: Boolean,
          default: true,
        },
      },
    },
    lastLogin: {
      type: Date,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




// Indexes for performance
userSchema.index({ authProviderId: 1, authProviderType: 1 });
userSchema.index({ "addresses.country": 1 });
userSchema.index({ accountStatus: 1 });

// Pre-save hook to parse Google OAuth name and ensure one default address
userSchema.pre("save", async function (next) {
  if (this.addresses.length > 0) {
    const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
    if (defaultAddresses.length > 1) {
      defaultAddresses.slice(1).forEach((addr) => (addr.isDefault = false));
    }
  }
  next();
});

export const EclipseUser = mongoose.models?.EclipseUser || mongoose.model<IEclipseUser>("EclipseUser", userSchema);