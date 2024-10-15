import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '../lib/firebase';

initFirebaseAdmin();

/**
 * API handler for verifying Firebase ID tokens and granting access to authenticated users.
 *
 * @param {import('next').NextApiRequest} req - The API request object.
 * @param {import('next').NextApiResponse} res - The API response object.
 * @returns {Promise<void>} - A promise that resolves when the handler finishes processing.
 *
 * @description
 * This function checks the request for an Authorization header containing a valid Firebase ID token.
 * If the token is valid, the user's UID is returned, granting access. If the token is invalid or missing,
 * appropriate error responses are returned.
 */
export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the 'Bearer TOKEN'
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return res.status(200).json({ message: 'Access granted', uid: decodedToken.uid });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
