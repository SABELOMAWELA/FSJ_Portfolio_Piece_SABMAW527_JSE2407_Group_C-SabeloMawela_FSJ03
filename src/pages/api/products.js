import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import Fuse from 'fuse.js';

/**
 * API endpoint to handle product retrieval with pagination, filtering, and search.
 * 
 * @param {object} req - The HTTP request object.
 * @param {object} req.query - The query parameters from the HTTP request.
 * @param {number} [req.query.page=1] - The page number for pagination.
 * @param {number} [req.query.pageSize=20] - The number of items per page for pagination.
 * @param {string} [req.query.category] - The category to filter products by.
 * @param {string} [req.query.search] - The search term to filter products by.
 * @param {string} [req.query.sort] - The sort order, either 'asc' or 'desc' for sorting by price.
 * @param {object} res - The HTTP response object.
 * 
 * @returns {object} JSON response with the list of filtered, sorted, and paginated products.
 */
export default async function handler(req, res) {
  const { page = 1, pageSize = 20, category, search, sort } = req.query;
  const productCollection = collection(db, 'products');
  let q = query(productCollection);

  // Filtering by category
  if (category) {
    q = query(q, where('category', '==', category));
  }

  // Sorting by price or default order
  if (sort) {
    q = query(q, orderBy('price', sort === 'desc' ? 'desc' : 'asc'));
  } else {
    q = query(q, orderBy('id')); // Default order
  }

  // Calculate start index for pagination
  const startIndex = (page - 1) * pageSize;

  // Get the first set of products or next set
  if (page > 1) {
    const lastVisible = await getLastVisibleProduct(page - 1, pageSize, sort);
    q = query(q, startAfter(lastVisible), limit(pageSize));
  } else {
    q = query(q, limit(pageSize));
  }

  const productSnapshot = await getDocs(q);
  const products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Searching with Fuse.js
  if (search) {
    const fuse = new Fuse(products, { keys: ['title'], threshold: 0.4 });
    const filteredProducts = fuse.search(search).map(result => result.item);
    return res.status(200).json(filteredProducts);
  }

  res.status(200).json(products);
}

/**
 * Helper function to get the last visible product of the previous page for pagination.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} pageSize - The number of items per page for pagination.
 * @param {string} [sort] - The sort order, either 'asc' or 'desc' for sorting by price.
 * 
 * @returns {object} The last visible product document from the Firestore collection.
 */
async function getLastVisibleProduct(page, pageSize, sort) {
  const productCollection = collection(db, 'products');
  let q = query(productCollection);

  // Respect the current sorting order in pagination
  if (sort) {
    q = query(q, orderBy('price', sort === 'desc' ? 'desc' : 'asc'));
  } else {
    q = query(q, orderBy('id')); // Default sorting by id
  }

  q = query(q, limit(page * pageSize));
  const productSnapshot = await getDocs(q);
  return productSnapshot.docs[productSnapshot.docs.length - 1];
}
