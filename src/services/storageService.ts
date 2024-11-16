import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { ref, listAll, getMetadata, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && error?.code === 'storage/retry-limit-exceeded') {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const storageService = {
  async getStorageUsage(userId: string): Promise<Record<string, number>> {
    const usage: Record<string, number> = {
      images: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      other: 0
    };

    try {
      const userStorageRef = ref(storage, `users/${userId}`);
      const filesList = await retry(() => listAll(userStorageRef));

      // Process files in batches to avoid overwhelming the storage
      const BATCH_SIZE = 10;
      for (let i = 0; i < filesList.items.length; i += BATCH_SIZE) {
        const batch = filesList.items.slice(i, i + BATCH_SIZE);
        const metadataPromises = batch.map(fileRef => 
          retry(() => getMetadata(fileRef))
        );
        
        const metadataResults = await Promise.allSettled(metadataPromises);
        
        metadataResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            const metadata = result.value;
            const size = metadata.size;
            const contentType = metadata.contentType || '';

            if (contentType.startsWith('image/')) {
              usage.images += size;
            } else if (contentType.startsWith('video/')) {
              usage.videos += size;
            } else if (contentType.startsWith('audio/')) {
              usage.audio += size;
            } else if (contentType.includes('document') || contentType.includes('pdf')) {
              usage.documents += size;
            } else {
              usage.other += size;
            }
          }
        });

        // Add a small delay between batches
        if (i + BATCH_SIZE < filesList.items.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return usage;
    } catch (error) {
      console.error('Error getting storage usage:', error);
      // Return zeros if there's an error
      return {
        images: 0,
        videos: 0,
        audio: 0,
        documents: 0,
        other: 0
      };
    }
  },

  async clearCache(userId: string): Promise<void> {
    try {
      const cacheRef = ref(storage, `cache/${userId}`);
      const cacheFiles = await retry(() => listAll(cacheRef));

      // Delete files in batches
      const BATCH_SIZE = 5;
      for (let i = 0; i < cacheFiles.items.length; i += BATCH_SIZE) {
        const batch = cacheFiles.items.slice(i, i + BATCH_SIZE);
        const deletePromises = batch.map(fileRef => 
          retry(() => deleteObject(fileRef))
        );
        
        await Promise.allSettled(deletePromises);

        // Add a small delay between batches
        if (i + BATCH_SIZE < cacheFiles.items.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw new Error('Failed to clear cache. Please try again later.');
    }
  },

  async deleteUnusedFiles(userId: string): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const userStorageRef = ref(storage, `users/${userId}`);
      const filesList = await retry(() => listAll(userStorageRef));

      // Delete files in batches
      const BATCH_SIZE = 5;
      for (let i = 0; i < filesList.items.length; i += BATCH_SIZE) {
        const batch = filesList.items.slice(i, i + BATCH_SIZE);
        
        const metadataPromises = batch.map(async (fileRef) => {
          try {
            const metadata = await retry(() => getMetadata(fileRef));
            const lastAccessed = new Date(metadata.updated);
            
            if (lastAccessed < thirtyDaysAgo) {
              await retry(() => deleteObject(fileRef));
            }
          } catch (error) {
            console.warn(`Failed to process file ${fileRef.fullPath}:`, error);
          }
        });

        await Promise.allSettled(metadataPromises);

        // Add a small delay between batches
        if (i + BATCH_SIZE < filesList.items.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error deleting unused files:', error);
      throw new Error('Failed to delete unused files. Please try again later.');
    }
  },

  async calculateTotalUsage(userId: string): Promise<number> {
    try {
      const usage = await this.getStorageUsage(userId);
      return Object.values(usage).reduce((total, size) => total + size, 0);
    } catch (error) {
      console.error('Error calculating total usage:', error);
      return 0;
    }
  }
};