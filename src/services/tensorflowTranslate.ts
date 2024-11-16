import * as tf from '@tensorflow/tfjs';
import { loadTokenizer } from '../utils/tokenizer';

export class TensorflowTranslate {
  private model: tf.LayersModel | null = null;
  private tokenizer: any | null = null;
  private loading = false;

  private async loadModel() {
    if (this.loading) {
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    if (this.model) return;

    this.loading = true;
    try {
      // Load the small multilingual model (~5MB)
      this.model = await tf.loadLayersModel('/models/translator/model.json');
      this.tokenizer = await loadTokenizer();
    } finally {
      this.loading = false;
    }
  }

  async translateOffline(text: string, targetLang: string): Promise<string> {
    await this.loadModel();
    if (!this.model || !this.tokenizer) {
      throw new Error('Model not loaded');
    }

    // Tokenize input text
    const tokens = this.tokenizer.encode(text);
    const inputTensor = tf.tensor2d([tokens]);

    // Perform translation
    const output = this.model.predict(inputTensor) as tf.Tensor;
    const predictions = await output.array();
    
    // Decode output tokens
    const translatedTokens = predictions[0];
    const translatedText = this.tokenizer.decode(translatedTokens);

    // Cleanup
    inputTensor.dispose();
    output.dispose();

    return translatedText;
  }

  async detectLanguageOffline(text: string): Promise<string> {
    await this.loadModel();
    if (!this.model || !this.tokenizer) {
      throw new Error('Model not loaded');
    }

    // Use the model's language detection head
    const tokens = this.tokenizer.encode(text);
    const inputTensor = tf.tensor2d([tokens]);
    const output = this.model.predict(inputTensor) as tf.Tensor;
    const predictions = await output.array();

    // Get the most likely language
    const langId = predictions[0].indexOf(Math.max(...predictions[0]));
    const language = this.tokenizer.languages[langId];

    // Cleanup
    inputTensor.dispose();
    output.dispose();

    return language;
  }

  // Online methods fallback to offline if needed
  async translate(text: string, targetLang: string): Promise<string> {
    return this.translateOffline(text, targetLang);
  }

  async detectLanguage(text: string): Promise<string> {
    return this.detectLanguageOffline(text);
  }
}