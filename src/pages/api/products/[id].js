import { db } from "@/lib/firebase"; // Ensure correct import from firebase.js
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  // Only allow GET method
  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch the document from Firestore
    const productDoc = doc(db, 'products', id);
    const productSnapshot = await getDoc(productDoc);

    // Check if the document exists
    if (!productSnapshot.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the product data with its ID
    const product = { id: productSnapshot.id, ...productSnapshot.data() };
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
