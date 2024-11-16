export interface UserSettings {
  theme: {
    mode: 'light' | 'dark';
    primary: string;
    secondary: string;
    chatBackground: string;
  };
  language: string;
  notifications: {
    messages: {
      messagePreview: boolean;
      messageSound: boolean;
      messageLED: boolean;
    };
    groups: {
      groupPreview: boolean;
      groupSound: boolean;
      groupVibrate: boolean;
    };
    calls: {
      callRingtone: string;
      callVibrate: boolean;
      missedCalls: boolean;
      ringtone: string;
    };
    volume: number;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    showReadReceipts: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
  };
  translation: {
    openAiKey?: string;
    usageCount: number;
    lastReset: number;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  settings: UserSettings;
  createdAt: number;
  lastLogin: number;
  status: 'online' | 'offline' | 'away';
  bio?: string;
  contacts: string[];
  blockedUsers: string[];
  emailVerified: boolean;
  apiKey: string;
  phone?: string;
  location?: string;
  birthdate?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}