import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    // We can add a reference to the user who created it (if needed)
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Apply the pagination plugin
productSchema.plugin(mongoosePaginate);

/**
 * @typedef {mongoose.Document & {
 * name: string,
 * description: string,
 * price: number,
 * stock: number,
 * category: string
 * }} ProductDocument
 *
 * @typedef {mongoose.PaginateModel<ProductDocument>} PaginatedProductModel
 */

/**
 * @type {PaginatedProductModel}
 */
export const Product = mongoose.model('Product', productSchema);