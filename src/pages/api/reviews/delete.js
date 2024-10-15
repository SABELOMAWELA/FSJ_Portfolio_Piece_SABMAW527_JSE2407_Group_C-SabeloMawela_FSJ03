import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '../../../lib/firebaseAdmin';

initFirebaseAdmin();

/**
 * API endpoint to handle deleting a review from a product.
 * 
 * @param {object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method used for the request.
 * @param {object} req.headers - The headers from the HTTP request.
 * @param {string} req.headers.authorization - The authorization header containing the user's ID token.
 * @param {object} req.body - The body of the request.
 * @param {string} req.body.productId - The ID of the product from which the review is being deleted.
 * @param {string} req.body.reviewId - The ID of the review to be deleted.
 * @param {object} res - The HTTP response object.
 * 
 * @returns {object} JSON response with the result of the operation.
 */
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const { productId, reviewId } = req.body; // Make sure the client sends productId and reviewId in the body

    if (!productId || !reviewId) {
      return res.status(400).json({ message: 'Product ID and Review ID are required' });
    }

    // Get a reference to the product document
    const productRef = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = productSnapshot.data();
    const updatedReviews = productData.reviews.filter((review) => review.id !== reviewId);

    // Update the product document with the filtered reviews array
    await updateDoc(productRef, {
      reviews: updatedReviews,
    });

    res.status(200).json({ message: 'Review deleted successfully from the product' });
  } catch (error) {
    console.error('Error deleting review from product:', error);
    res.status(500).json({ message: 'Failed to delete review from product' });
  }
}
