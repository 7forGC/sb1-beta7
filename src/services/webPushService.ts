import { getMessaging, getToken } from 'firebase/messaging';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const PUBLIC_VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY'; // Replace with your VAPID key

export const webPushService = {
  async requestPermission(userId: string) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const messaging = getMessaging();
        const token = await getToken(messaging, { vapidKey: PUBLIC_VAPID_KEY });
        
        // Save the token to Firestore
        await setDoc(doc(db, 'pushTokens', userId), {
          token,
          createdAt: new Date().toISOString(),
          platform: 'web',
          active: true
        });

        return token;
      }
      throw new Error('Notification permission denied');
    } catch (error) {
      console.error('Push notification error:', error);
      throw error;
    }
  },

  async updateToken(userId: string, token: string) {
    try {
      await updateDoc(doc(db, 'pushTokens', userId), {
        token,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Token update error:', error);
      throw error;
    }
  }
};