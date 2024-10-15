import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const categoryCollection = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoryCollection);
  const categories = categorySnapshot.docs.map(doc => doc.data().name);
  res.status(200).json(categories);
}
