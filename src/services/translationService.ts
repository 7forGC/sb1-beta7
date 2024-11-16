import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LibreTranslate } from './libreTranslate';
import { LingvaTranslate } from './lingvaTranslate';
import { TensorflowTranslate } from './tensorflowTranslate';
import { OpenAiTranslate } from './openAiTranslate';

const FREE_TRANSLATIONS_PER_DAY = 500;
const TRANSLATION_RESET_HOURS = 24;

export class TranslationService {
  private libreTranslate: LibreTranslate;
  private lingvaTranslate: LingvaTranslate;
  private tensorflowTranslate: TensorflowTranslate;
  private openAiTranslate: OpenAiTranslate;

  constructor() {
    this.libreTranslate = new LibreTranslate();
    this.lingvaTranslate = new LingvaTranslate();
    this.tensorflowTranslate = new TensorflowTranslate();
    this.openAiTranslate = new OpenAiTranslate();
  }

  async translateText(text: string, targetLang: string, userId: string): Promise<string> {
    try {
      // Check translation limits
      const stats = await this.getTranslationStats(userId);
      if (stats.count >= FREE_TRANSLATIONS_PER_DAY) {
        throw new Error(`Daily translation limit reached (${FREE_TRANSLATIONS_PER_DAY}). Try again tomorrow.`);
      }

      // Try each service in order until one succeeds
      const services = [
        this.openAiTranslate, // Try GPT-like service first
        this.libreTranslate,
        this.lingvaTranslate,
        this.tensorflowTranslate
      ];

      let lastError: Error | null = null;
      for (const service of services) {
        try {
          const result = await service.translate(text, targetLang, userId);
          await this.incrementTranslationCount(userId);
          return result;
        } catch (error) {
          console.warn(`Translation failed with ${service.constructor.name}:`, error);
          lastError = error as Error;
          continue;
        }
      }

      // If all services fail, use TensorFlow.js for offline translation
      try {
        const result = await this.tensorflowTranslate.translateOffline(text, targetLang);
        await this.incrementTranslationCount(userId);
        return result;
      } catch (error) {
        throw lastError || error;
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async detectLanguage(text: string, userId: string): Promise<string> {
    try {
      // Try each service in order
      const services = [
        this.openAiTranslate, // Try GPT-like service first
        this.libreTranslate,
        this.lingvaTranslate,
        this.tensorflowTranslate
      ];

      for (const service of services) {
        try {
          return await service.detectLanguage(text, userId);
        } catch (error) {
          console.warn(`Language detection failed with ${service.constructor.name}:`, error);
          continue;
        }
      }

      // Fallback to TensorFlow.js offline detection
      return await this.tensorflowTranslate.detectLanguageOffline(text);
    } catch (error) {
      console.error('Language detection error:', error);
      throw error;
    }
  }

  private async getTranslationStats(userId: string) {
    const statsRef = doc(db, 'translationStats', userId);
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      return { count: 0, lastReset: Date.now() };
    }
    
    const stats = statsDoc.data();
    const hoursSinceReset = (Date.now() - stats.lastReset) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= TRANSLATION_RESET_HOURS) {
      await updateDoc(statsRef, {
        count: 0,
        lastReset: Date.now()
      });
      return { count: 0, lastReset: Date.now() };
    }
    
    return stats;
  }

  private async incrementTranslationCount(userId: string) {
    const statsRef = doc(db, 'translationStats', userId);
    await updateDoc(statsRef, {
      count: increment(1)
    });
  }
}

export const translationService = new TranslationService();