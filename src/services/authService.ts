import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider, facebookProvider } from '../config/firebase';
import { apiKeyService } from './apiKeyService';
import type { UserProfile, UserSettings } from '../types/auth';

const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: {
    mode: 'light',
    primary: '#AB39D2',
    secondary: '#4F46E5',
    chatBackground: 'solid'
  },
  language: 'en',
  notifications: {
    messages: {
      messagePreview: true,
      messageSound: true,
      messageLED: true
    },
    groups: {
      groupPreview: true,
      groupSound: true,
      groupVibrate: true
    },
    calls: {
      callRingtone: 'default',
      callVibrate: true,
      missedCalls: true,
      ringtone: 'default'
    },
    volume: 100
  },
  privacy: {
    showOnlineStatus: true,
    showLastSeen: true,
    showReadReceipts: true
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false
  }
};

export const authService = {
  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return this.updateUserLogin(user);
  },

  async createUser(email: string, password: string, displayName: string): Promise<UserProfile> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(user, { displayName });
    await sendEmailVerification(user);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      settings: DEFAULT_USER_SETTINGS,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      status: 'online',
      contacts: [],
      blockedUsers: [],
      emailVerified: false,
      apiKey: await apiKeyService.initializeTranslationAccess(user.uid)
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  },

  async signInWithGoogle(): Promise<UserProfile> {
    const { user } = await signInWithPopup(auth, googleProvider);
    return this.updateUserLogin(user);
  },

  async signInWithFacebook(): Promise<UserProfile> {
    const { user } = await signInWithPopup(auth, facebookProvider);
    return this.updateUserLogin(user);
  },

  async verifyEmail(oobCode: string): Promise<void> {
    if (!auth.currentUser) throw new Error('No user logged in');
    
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      emailVerified: true
    });
  },

  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user logged in');

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);

    if (updates.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName
      });
    }
  },

  async updateUserAvatar(uid: string, file: File): Promise<string> {
    const fileRef = ref(storage, `avatars/${uid}`);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    await this.updateUserProfile(uid, { photoURL });
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL });
    }

    return photoURL;
  },

  async updateUserSettings(uid: string, settings: Partial<UserSettings>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { settings });
  },

  async getUserProfile(uid: string): Promise<UserProfile> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    return userDoc.data() as UserProfile;
  },

  async updateUserLogin(user: FirebaseUser): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const apiKey = await apiKeyService.initializeTranslationAccess(user.uid);

    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || undefined,
        settings: DEFAULT_USER_SETTINGS,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        status: 'online',
        contacts: [],
        blockedUsers: [],
        emailVerified: user.emailVerified,
        apiKey
      };
      await setDoc(userRef, userProfile);
      return userProfile;
    }

    await updateDoc(userRef, {
      lastLogin: Date.now(),
      status: 'online',
      apiKey
    });

    return {
      ...userDoc.data() as UserProfile,
      lastLogin: Date.now(),
      status: 'online',
      apiKey
    };
  }
};