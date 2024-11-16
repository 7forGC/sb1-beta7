import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

const GUEST_LIMIT = 3;
const GUEST_EXPIRY_HOURS = 24;

export const guestService = {
  async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  },

  async checkGuestAccess(ip: string): Promise<boolean> {
    const guestRef = doc(db, 'guestAccess', ip);
    const guestDoc = await getDoc(guestRef);

    if (!guestDoc.exists()) {
      // First time guest access
      await setDoc(guestRef, {
        count: 1,
        firstAccess: new Date().toISOString(),
        lastAccess: new Date().toISOString()
      });
      return true;
    }

    const data = guestDoc.data();
    const firstAccess = new Date(data.firstAccess);
    const now = new Date();
    const hoursDiff = (now.getTime() - firstAccess.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= GUEST_EXPIRY_HOURS) {
      // Reset counter after 24 hours
      await setDoc(guestRef, {
        count: 1,
        firstAccess: now.toISOString(),
        lastAccess: now.toISOString()
      });
      return true;
    }

    if (data.count >= GUEST_LIMIT) {
      return false;
    }

    // Increment counter
    await updateDoc(guestRef, {
      count: increment(1),
      lastAccess: now.toISOString()
    });
    return true;
  }
};