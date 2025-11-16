/**
 * Parses query parameters for pagination, sorting, etc.
 * @param {object} query - The req.query object.
 * @returns {object} - An options object for mongoose-paginate-v2 or services.
 */
export const buildQueryOptions = (query) => {
  const options = {};

  // Pagination
  options.page = parseInt(query.page, 10) || 1;
  options.limit = parseInt(query.limit, 10) || 10;

  // Max limit
  if (options.limit > 100) {
    options.limit = 100;
  }

  // Sorting
  // Example: ?sortBy=price:desc,name:asc
  if (query.sortBy) {
    options.sort = query.sortBy;
  } else {
    options.sort = { createdAt: 'desc' };
  }

  // TODO: Add 'select' (field projection) or 'populate' logic here if needed

  return options;
};
