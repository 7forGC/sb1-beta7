import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  addDoc,
  deleteDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { User, Story, Post } from '../types';

export const userService = {
  async updateUserStatus(userId: string, status: 'online' | 'offline' | 'away'): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status });
  },

  async updateUserLanguage(userId: string, language: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { language });
  },

  async uploadMedia(file: File): Promise<string> {
    const fileRef = ref(storage, `media/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  },

  async uploadStory(userId: string, file: Blob): Promise<string> {
    try {
      // Upload video file
      const fileRef = ref(storage, `stories/${userId}/${Date.now()}.webm`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // Create story document
      const story: Omit<Story, 'id'> = {
        userId,
        mediaUrl: url,
        mediaType: 'video',
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        views: [],
        likes: []
      };

      const docRef = await addDoc(collection(db, 'stories'), story);
      return docRef.id;
    } catch (error) {
      console.error('Error uploading story:', error);
      throw new Error('Failed to upload story');
    }
  },

  async markStoryAsViewed(storyId: string, userId: string): Promise<void> {
    if (!storyId || !userId) {
      throw new Error('Invalid story ID or user ID');
    }

    try {
      const storyRef = doc(db, 'stories', storyId);
      const storyDoc = await getDoc(storyRef);
      
      if (!storyDoc.exists()) {
        throw new Error('Story not found');
      }

      const story = storyDoc.data() as Story;
      
      // Initialize views array if it doesn't exist
      if (!Array.isArray(story.views)) {
        await updateDoc(storyRef, { views: [] });
      }

      // Add user to views array if not already viewed
      if (!story.views?.includes(userId)) {
        await updateDoc(storyRef, {
          views: arrayUnion(userId)
        });
      }
    } catch (error) {
      console.error('Error marking story as viewed:', error);
      throw error; // Re-throw to handle in the component
    }
  },

  async createPost(post: Omit<Post, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: serverTimestamp()
      });

      const userRef = doc(db, 'users', post.userId);
      await updateDoc(userRef, {
        posts: arrayUnion(docRef.id)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  },

  async toggleFollowUser(followerId: string, targetId: string): Promise<void> {
    try {
      const followerRef = doc(db, 'users', followerId);
      const targetRef = doc(db, 'users', targetId);

      const followerDoc = await getDocs(query(collection(db, 'users'), where('following', 'array-contains', targetId)));
      const isFollowing = !followerDoc.empty;

      if (isFollowing) {
        await updateDoc(followerRef, { following: arrayRemove(targetId) });
        await updateDoc(targetRef, { followers: arrayRemove(followerId) });
      } else {
        await updateDoc(followerRef, { following: arrayUnion(targetId) });
        await updateDoc(targetRef, { followers: arrayUnion(followerId) });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw new Error('Failed to update follow status');
    }
  },

  async toggleFavoriteUser(userId: string, targetId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(query(collection(db, 'users'), where('favorites', 'array-contains', targetId)));
      const isFavorite = !userDoc.empty;

      await updateDoc(userRef, {
        favorites: isFavorite ? arrayRemove(targetId) : arrayUnion(targetId)
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  }
};