import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import Fuse from 'fuse.js';

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

// Helper to get the last visible product of the previous page
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
