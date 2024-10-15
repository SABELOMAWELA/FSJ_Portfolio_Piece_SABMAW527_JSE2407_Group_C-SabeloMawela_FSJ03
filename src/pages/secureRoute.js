import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '../../../lib/firebaseAdmin';

initFirebaseAdmin();

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
