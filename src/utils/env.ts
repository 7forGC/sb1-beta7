/**
 * Utility to validate environment variables
 */
export const validateEnv = () => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate API key format
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Firebase API key format');
  }

  // Validate project ID format
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    throw new Error('Invalid Firebase project ID format');
  }

  return true;
};