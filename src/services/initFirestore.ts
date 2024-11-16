import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const initializeFirestore = async () => {
  // Create initial collections
  const collections = ['users', 'messages', 'stories', 'posts', 'guestAccess'];
  
  for (const collectionName of collections) {
    const collectionRef = collection(db, collectionName);
    
    // Create a dummy document to initialize the collection
    const dummyDocRef = doc(collectionRef, 'init');
    await setDoc(dummyDocRef, {
      initialized: true,
      timestamp: new Date().toISOString()
    });
  }
};