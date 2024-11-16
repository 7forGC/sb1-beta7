import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import speakeasy from 'speakeasy';

export const twoFactorService = {
  async setupTwoFactor(userId: string) {
    const secret = speakeasy.generateSecret({
      name: '7 for all GC'
    });

    await setDoc(doc(db, 'twoFactor', userId), {
      secret: secret.base32,
      enabled: false,
      createdAt: Date.now()
    });

    return {
      secret: secret.base32,
      otpAuthUrl: secret.otpauth_url
    };
  },

  async verifyAndEnable(userId: string, token: string) {
    const docRef = doc(db, 'twoFactor', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('2FA not set up');
    }

    const { secret } = docSnap.data();
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });

    if (verified) {
      await updateDoc(docRef, { enabled: true });
      return true;
    }
    return false;
  },

  async verify(userId: string, token: string) {
    const docRef = doc(db, 'twoFactor', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || !docSnap.data().enabled) {
      return true; // 2FA not enabled, consider verified
    }

    const { secret } = docSnap.data();
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });
  },

  async disable(userId: string) {
    const docRef = doc(db, 'twoFactor', userId);
    await updateDoc(docRef, { enabled: false });
  }
};