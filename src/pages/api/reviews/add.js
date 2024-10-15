import { db } from '../../../lib/firebase'; 
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '../../../lib/firebaseAdmin';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

initFirebaseAdmin();

/**
 * API endpoint to handle adding reviews to a products.
 * 
 * @param {object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method used for the request.
 * @param {object} req.headers - The headers from the HTTP request.
 * @param {string} req.headers.authorization - The authorization header containing the user's ID token.
 * @param {object} req.body - The body of the request.
 * @param {string} req.body.productId - The ID of the product to which the review is being added.
 * @param {number} req.body.rating - The rating given by the user.
 * @param {string} req.body.comment - The comment provided by the user.
 * @param {object} res - The HTTP response object.
 * 
 * @returns {object} JSON response with the result of the operation.
 */
export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);
    const { productId, rating, comment } = req.body;

    // Check for missing required fields in the request body
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the review object
    const review = {
      productId,
      rating,
      comment,
      userId: decodedToken.uid,
      date: Timestamp.now(),
    };

    // Get a reference to the product document
    const productRef = doc(db, 'products', productId);

    // Update the product document by adding the review to the reviews array
    await updateDoc(productRef, {
      reviews: arrayUnion(review),
    });

    res.status(200).json({ message: 'Review added successfully to the product' });
  } catch (error) {
    console.error('Error adding review to product:', error);
    res.status(500).json({ message: 'Failed to add review to product' });
  }
}
