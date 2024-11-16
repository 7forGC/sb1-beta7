import { collection, addDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface CallData {
  id?: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string | null;
  recipientId: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'accepted' | 'declined' | 'ended';
  startedAt: number;
  endedAt?: number;
}

export const callService = {
  async initiateCall(callData: Omit<CallData, 'id' | 'status' | 'startedAt'>): Promise<string> {
    // Remove undefined values to prevent Firestore errors
    const cleanCallData = Object.fromEntries(
      Object.entries({
        ...callData,
        status: 'ringing',
        startedAt: Date.now()
      }).filter(([_, value]) => value !== undefined)
    );

    const call = await addDoc(collection(db, 'calls'), cleanCallData);
    return call.id;
  },

  async updateCallStatus(callId: string, status: CallData['status'], endedAt?: number) {
    const callRef = doc(db, 'calls', callId);
    const updateData: Partial<CallData> = { status };
    if (endedAt) {
      updateData.endedAt = endedAt;
    }
    await updateDoc(callRef, updateData);
  },

  subscribeToIncomingCalls(userId: string, callback: (call: CallData) => void) {
    const q = query(
      collection(db, 'calls'),
      where('recipientId', '==', userId),
      where('status', '==', 'ringing')
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          callback({
            id: change.doc.id,
            ...change.doc.data()
          } as CallData);
        }
      });
    });
  }
};