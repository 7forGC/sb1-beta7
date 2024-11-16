import { doc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Session {
  id: string;
  userId: string;
  deviceInfo: {
    browser: string;
    os: string;
    ip: string;
    location?: string;
  };
  createdAt: number;
  lastActive: number;
  active: boolean;
}

export const sessionService = {
  async createSession(userId: string): Promise<string> {
    const deviceInfo = {
      browser: navigator.userAgent,
      os: navigator.platform,
      ip: await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
    };

    const session = {
      userId,
      deviceInfo,
      createdAt: Date.now(),
      lastActive: Date.now(),
      active: true
    };

    const docRef = await addDoc(collection(db, 'sessions'), session);
    return docRef.id;
  },

  async getSessions(userId: string): Promise<Session[]> {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      where('active', '==', true)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Session[];
  },

  async updateSession(sessionId: string) {
    await updateDoc(doc(db, 'sessions', sessionId), {
      lastActive: Date.now()
    });
  },

  async terminateSession(sessionId: string) {
    await updateDoc(doc(db, 'sessions', sessionId), {
      active: false,
      terminatedAt: Date.now()
    });
  },

  async terminateAllOtherSessions(userId: string, currentSessionId: string) {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      where('active', '==', true)
    );

    const snapshot = await getDocs(q);
    const promises = snapshot.docs
      .filter(doc => doc.id !== currentSessionId)
      .map(doc => this.terminateSession(doc.id));

    await Promise.all(promises);
  }
};