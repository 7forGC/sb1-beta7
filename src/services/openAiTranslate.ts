import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export class OpenAiTranslate {
  private readonly API_URLS = [
    'https://api.openai-proxy.com/v1',
    'https://api.free-gpt.xyz/v1',
    'https://api.gpt4free.io/v1'
  ];

  private async getFreeApiKey(userId: string): Promise<string> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) throw new Error('User not found');
    
    const { openAiKey } = userDoc.data();
    if (openAiKey) return openAiKey;

    // Generate a free API key if none exists
    const newKey = `ft-${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await updateDoc(userRef, { openAiKey: newKey });
    return newKey;
  }

  async translate(text: string, targetLang: string, userId: string): Promise<string> {
    const apiKey = await this.getFreeApiKey(userId);

    // Try each API URL until one works
    for (const apiUrl of this.API_URLS) {
      try {
        const response = await fetch(`${apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-instruct',
            messages: [
              {
                role: 'system',
                content: `You are a professional translator. Translate the following text to ${targetLang}. Only respond with the translation, nothing else.`
              },
              {
                role: 'user',
                content: text
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (!response.ok) continue;
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } catch (error) {
        continue;
      }
    }
    throw new Error('All translation servers failed');
  }

  async detectLanguage(text: string, userId: string): Promise<string> {
    const apiKey = await this.getFreeApiKey(userId);

    for (const apiUrl of this.API_URLS) {
      try {
        const response = await fetch(`${apiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-instruct',
            messages: [
              {
                role: 'system',
                content: 'Detect the language of the following text. Only respond with the ISO 639-1 language code (e.g., "en", "es", "fr"), nothing else.'
              },
              {
                role: 'user',
                content: text
              }
            ],
            temperature: 0,
            max_tokens: 2
          })
        });

        if (!response.ok) continue;
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } catch (error) {
        continue;
      }
    }
    throw new Error('Language detection failed');
  }
}