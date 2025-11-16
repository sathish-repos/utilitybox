import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Automatically exclude from queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false, // Exclude by default, only select when needed
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: {
      // Clean up the output
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Ensure password is never sent
        delete ret.isActive;
      },
    },
  }
);

// --- Mongoose Middleware (Hooks) ---

/**
 * Pre-save hook to hash password before saving a new user.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// --- Mongoose Instance Methods ---

/**
 * Compare entered password with the hashed password in the database.
 * @param {string} candidatePassword - The password to check.
 * @returns {Promise<boolean>} - True if the password matches.
 */
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  // 'this.password' is available here, even with 'select: false',
  // because this method is called on a document that *explicitly* selected it.
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);