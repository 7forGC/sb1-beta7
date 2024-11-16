import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Story } from '../types';

export const storyService = {
  subscribeToStories(userId: string, callback: (stories: Story[]) => void) {
    const now = Timestamp.now();
    
    const q = query(
      collection(db, 'stories'),
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Story[];
      callback(stories);
    });
  },

  async toggleLike(storyId: string, userId: string): Promise<void> {
    const storyRef = doc(db, 'stories', storyId);
    const story = await getDocs(query(collection(db, 'stories'), where('likes', 'array-contains', userId)));
    const isLiked = !story.empty;

    await updateDoc(storyRef, {
      likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
  }
};