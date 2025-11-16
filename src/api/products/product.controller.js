import httpStatus from 'http-status';
import { asyncHandler } from '../../core/asyncHandler.js';
import { ApiResponse } from '../../core/ApiResponse.js';
import * as productService from '../../services/product.service.js';
import { ApiError } from '../../core/ApiError.js';
import { buildQueryOptions } from '../../utils/queryHelper.js';

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  new ApiResponse(httpStatus.CREATED, product, 'Product created successfully.').send(res);
});

/**
 * @desc    Get all products with pagination/filtering
 * @route   GET /api/v1/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  // Example filter: /products?name=Laptop
  const filter = req.query.name ? { name: { $regex: req.query.name, $options: 'i' } } : {};

  // Example options: /products?page=1&limit=5&sortBy=price:desc
  const options = buildQueryOptions(req.query);

  const result = await productService.queryProducts(filter, options);
  new ApiResponse(httpStatus.OK, result).send(res);
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }
  new ApiResponse(httpStatus.OK, product).send(res);
});

/**
 * @desc    Update a product by ID
 * @route   PATCH /api/v1/products/:id
 * @access  Private/Admin
 */
const updateProductById = asyncHandler(async (req, res) => {
  const product = await productService.updateProductById(req.params.id, req.body);
  new ApiResponse(httpStatus.OK, product, 'Product updated successfully.').send(res);
});

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProductById = asyncHandler(async (req, res) => {
  await productService.deleteProductById(req.params.id);
  new ApiResponse(httpStatus.OK, null, 'Product deleted successfully.').send(res);
});

export { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById };
