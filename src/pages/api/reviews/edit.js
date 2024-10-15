import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '../../../lib/firebaseAdmin';
import { db } from '../../../lib/firebase'; 

initFirebaseAdmin();

/**
 * API endpoint to handle updating a review for a specific product.
 * 
 * @param {object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method used for the request.
 * @param {object} req.headers - The headers from the HTTP request.
 * @param {string} req.headers.authorization - The authorization header containing the user's ID token.
 * @param {object} req.body - The body of the request.
 * @param {string} req.body.reviewId - The ID of the review to be updated.
 * @param {string} req.body.productId - The ID of the product to which the review belongs.
 * @param {string} req.body.comment - The updated comment for the review.
 * @param {number} req.body.rating - The updated rating for the review.
 * @param {object} res - The HTTP response object.
 * 
 * @returns {object} JSON response with the result of the operation.
 */
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const { reviewId, productId, comment, rating } = req.body;

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Update the review in Firestore
    await db.collection('products').doc(productId).collection('reviews').doc(reviewId).update({
      comment,
      rating,
      updatedAt: new Date(),
    });

    return res.status(200).json({ message: 'Review updated' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating review' });
  }
}
