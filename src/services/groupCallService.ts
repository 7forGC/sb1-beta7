import { collection, addDoc, updateDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface GroupCallData {
  id?: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    joined: boolean;
  }[];
  type: 'audio' | 'video';
  status: 'active' | 'ended';
  startedAt: number;
  endedAt?: number;
}

export const groupCallService = {
  async initiateGroupCall(callData: Omit<GroupCallData, 'id' | 'status' | 'startedAt'>): Promise<string> {
    const cleanCallData = Object.fromEntries(
      Object.entries({
        ...callData,
        status: 'active',
        startedAt: Date.now()
      }).filter(([_, value]) => value !== undefined)
    );

    const call = await addDoc(collection(db, 'groupCalls'), cleanCallData);
    return call.id;
  },

  async updateCallStatus(callId: string, status: GroupCallData['status'], endedAt?: number) {
    const callRef = doc(db, 'groupCalls', callId);
    const updateData: Partial<GroupCallData> = { status };
    if (endedAt) {
      updateData.endedAt = endedAt;
    }
    await updateDoc(callRef, updateData);
  },

  async addParticipant(callId: string, participant: GroupCallData['participants'][0]) {
    const callRef = doc(db, 'groupCalls', callId);
    await updateDoc(callRef, {
      participants: [...(await this.getParticipants(callId)), participant]
    });
  },

  async removeParticipant(callId: string, participantId: string) {
    const callRef = doc(db, 'groupCalls', callId);
    const participants = await this.getParticipants(callId);
    await updateDoc(callRef, {
      participants: participants.filter(p => p.id !== participantId)
    });
  },

  async getParticipants(callId: string): Promise<GroupCallData['participants']> {
    const callRef = doc(db, 'groupCalls', callId);
    const call = await callRef.get();
    return call.data()?.participants || [];
  },

  subscribeToGroupCalls(userId: string, callback: (call: GroupCallData) => void) {
    const q = query(
      collection(db, 'groupCalls'),
      where('participants', 'array-contains', { id: userId }),
      where('status', '==', 'active')
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          callback({
            id: change.doc.id,
            ...change.doc.data()
          } as GroupCallData);
        }
      });
    });
  }
};