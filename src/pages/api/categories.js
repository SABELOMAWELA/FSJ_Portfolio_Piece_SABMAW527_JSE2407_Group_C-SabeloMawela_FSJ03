import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * API endpoint to fetch all categories from the Firestore database.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * 
 * @returns {Promise<void>} - Returns a JSON response with the list of category names.
 */
export default async function handler(req, res) {
  const categoryCollection = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoryCollection);
  const categories = categorySnapshot.docs.map(doc => doc.data().name);
  res.status(200).json(categories);
}
