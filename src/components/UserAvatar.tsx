import React from 'react';

interface UserAvatarProps {
  user: {
    photoURL?: string;
    displayName: string;
    settings?: {
      language: string;
    };
  } | null;
  size?: 'sm' | 'md' | 'lg';
  showLanguage?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md',
  showLanguage = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-32 h-32'
  };

  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-400">?</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <img
        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`}
        alt={user.displayName}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      {showLanguage && user.settings?.language && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-lg">
          <img
            src={`https://flagcdn.com/16x12/${user.settings.language === 'en' ? 'gb' : user.settings.language}.png`}
            alt={user.settings.language}
            className="w-4 h-3"
          />
        </div>
      )}
    </div>
  );
};