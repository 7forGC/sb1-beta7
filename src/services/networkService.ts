import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const networkService = {
  async getNetworkUsage(userId: string) {
    const statsRef = doc(db, 'networkStats', userId);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      const initialStats = {
        wifi: { downloaded: 0, uploaded: 0, total: 0 },
        mobile: { downloaded: 0, uploaded: 0, total: 0 },
        features: {
          messages: { downloaded: 1024 * 1024 * 5, uploaded: 1024 * 1024 * 2, total: 1024 * 1024 * 7 },
          calls: { downloaded: 1024 * 1024 * 15, uploaded: 1024 * 1024 * 15, total: 1024 * 1024 * 30 },
          media: { downloaded: 1024 * 1024 * 50, uploaded: 1024 * 1024 * 20, total: 1024 * 1024 * 70 }
        },
        total: 1024 * 1024 * 107 // Sum of all features
      };

      await setDoc(statsRef, initialStats);
      return initialStats;
    }

    return statsDoc.data();
  },

  async updateNetworkStats(userId: string, stats: any) {
    const statsRef = doc(db, 'networkStats', userId);
    await updateDoc(statsRef, stats);
  },

  async resetNetworkStats(userId: string) {
    const statsRef = doc(db, 'networkStats', userId);
    await setDoc(statsRef, {
      wifi: { downloaded: 0, uploaded: 0, total: 0 },
      mobile: { downloaded: 0, uploaded: 0, total: 0 },
      features: {},
      total: 0
    });
  }
};