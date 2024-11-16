import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Message } from '../types';

export const messageService = {
  async sendMessage(
    senderId: string, 
    receiverId: string, 
    text: string, 
    language: string
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'messages'), {
      senderId,
      receiverId,
      text,
      language,
      timestamp: serverTimestamp(),
      translated: false
    });
    return docRef.id;
  },

  subscribeToMessages(userId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    });
  }
};