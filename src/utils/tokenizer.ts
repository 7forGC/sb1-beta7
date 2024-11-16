// Simplified SentencePiece-style tokenizer
export async function loadTokenizer() {
  const response = await fetch('/models/tokenizer/vocab.json');
  const vocab = await response.json();

  return {
    encode(text: string): number[] {
      // Basic subword tokenization
      const tokens: number[] = [];
      let current = '';
      
      for (const char of text.toLowerCase()) {
        current += char;
        if (vocab[current]) {
          tokens.push(vocab[current]);
          current = '';
        }
      }
      
      // Handle remaining characters
      if (current && vocab[current]) {
        tokens.push(vocab[current]);
      }

      return tokens;
    },

    decode(tokens: number[]): string {
      // Convert token IDs back to text
      const reverseVocab = Object.fromEntries(
        Object.entries(vocab).map(([k, v]) => [v, k])
      );
      
      return tokens
        .map(token => reverseVocab[token] || '')
        .join('')
        .trim();
    },

    languages: [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'uk',
      'ar', 'hi', 'bn', 'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms'
    ]
  };
}