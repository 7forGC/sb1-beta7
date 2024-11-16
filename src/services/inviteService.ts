import { doc, setDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const inviteService = {
  async trackInvite(inviterId: string, method: 'email' | 'sms' | 'qr' | 'link') {
    const inviterRef = doc(db, 'invites', inviterId);
    const inviterDoc = await getDoc(inviterRef);

    if (!inviterDoc.exists()) {
      await setDoc(inviterRef, {
        totalInvites: 1,
        methods: {
          [method]: 1
        },
        lastInvite: Date.now()
      });
    } else {
      await setDoc(inviterRef, {
        totalInvites: increment(1),
        [`methods.${method}`]: increment(1),
        lastInvite: Date.now()
      }, { merge: true });
    }
  },

  async validateInviteCode(code: string) {
    // Validate and process invite code
    const inviteRef = doc(db, 'inviteCodes', code);
    const inviteDoc = await getDoc(inviteRef);
    
    if (!inviteDoc.exists()) {
      throw new Error('Invalid invite code');
    }

    const data = inviteDoc.data();
    if (data.expiresAt < Date.now()) {
      throw new Error('Invite code expired');
    }

    if (data.maxUses && data.uses >= data.maxUses) {
      throw new Error('Invite code reached maximum uses');
    }

    await setDoc(inviteRef, {
      uses: increment(1),
      lastUsed: Date.now()
    }, { merge: true });

    return data.inviterId;
  }
};