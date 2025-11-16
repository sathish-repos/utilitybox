import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    // We can also store the hashed token for extra security
    // tokenHashed: { type: String, required: true },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create an index on the token for faster lookups
tokenSchema.index({ token: 1 });
// Create a TTL index to automatically delete expired tokens
tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model('Token', tokenSchema);
