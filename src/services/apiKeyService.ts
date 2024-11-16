import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const apiKeyService = {
  generateApiKey(userId: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 11);
    return `user-${userId}-${timestamp}-${randomString}`;
  },

  async saveApiKey(userId: string, apiKey: string): Promise<void> {
    const apiKeyDoc = doc(db, 'apiKeys', userId);
    await setDoc(apiKeyDoc, {
      key: apiKey,
      createdAt: Date.now(),
      lastUsed: null,
      isActive: true,
      provider: 'google',
      usageCount: 0,
      dailyLimit: 100
    });
  },

  async getApiKey(userId: string): Promise<string | null> {
    const apiKeyDoc = await getDoc(doc(db, 'apiKeys', userId));
    return apiKeyDoc.exists() ? apiKeyDoc.data().key : null;
  },

  async initializeTranslationAccess(userId: string): Promise<string> {
    // Check if user already has an API key
    const existingKey = await this.getApiKey(userId);
    if (existingKey) {
      return existingKey;
    }

    // Generate and save new API key
    const apiKey = this.generateApiKey(userId);
    await this.saveApiKey(userId, apiKey);
    return apiKey;
  },

  async updateUsageCount(userId: string): Promise<void> {
    const apiKeyDoc = doc(db, 'apiKeys', userId);
    await updateDoc(apiKeyDoc, {
      usageCount: increment(1),
      lastUsed: Date.now()
    });
  },

  async checkUsageLimit(userId: string): Promise<boolean> {
    const apiKeyDoc = await getDoc(doc(db, 'apiKeys', userId));
    if (!apiKeyDoc.exists()) return false;

    const data = apiKeyDoc.data();
    return data.usageCount < data.dailyLimit;
  }
};