import httpStatus from 'http-status';
import { ApiError } from '../core/ApiError.js';
import { Product } from '../models/Product.model.js';

/**
 * Create a new product.
 * @param {object} productBody - The product data.
 * @returns {Promise<import('../models/Product.model.js').ProductDocument>}
 */
export const createProduct = async (productBody) => {
  // We could check for duplicate names, etc.
  return Product.create(productBody);
};

/**
 * Get a product by its ID.
 * @param {string} id - The product's ID.
 * @returns {Promise<import('../models/Product.model.js').ProductDocument>}
 */
export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

/**
 * Update a product by its ID.
 * @param {string} productId - The product's ID.
 * @param {object} updateBody - The fields to update.
 * @returns {Promise<import('../models/Product.model.js').ProductDocument>}
 */
export const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId); // Ensures product exists

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete a product by its ID.
 * @param {string} productId - The product's ID.
 * @returns {Promise<void>}
 */
export const deleteProductById = async (productId) => {
  const product = await getProductById(productId); // Ensures product exists
  await product.deleteOne();
};

/**
 * Query for products with pagination and filtering.
 * @param {object} filter - Mongoose filter criteria.
 * @param {object} options - Pagination options (limit, page, sortBy).
 * @returns {Promise<object>} - Paginated result from mongoose-paginate-v2.
 */
export const queryProducts = async (filter, options) => {
  // Use the .paginate() method provided by the plugin
  const result = await Product.paginate(filter, options);
  return result;
};
