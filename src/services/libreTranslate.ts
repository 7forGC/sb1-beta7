export class LibreTranslate {
  private readonly API_URLS = [
    'https://libretranslate.de',
    'https://translate.argosopentech.com',
    'https://translate.terraprint.co'
  ];

  async translate(text: string, targetLang: string): Promise<string> {
    // Try each API URL until one works
    for (const apiUrl of this.API_URLS) {
      try {
        const response = await fetch(`${apiUrl}/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: 'auto',
            target: targetLang
          })
        });

        if (!response.ok) continue;
        const data = await response.json();
        return data.translatedText;
      } catch (error) {
        continue;
      }
    }
    throw new Error('All LibreTranslate servers failed');
  }

  async detectLanguage(text: string): Promise<string> {
    for (const apiUrl of this.API_URLS) {
      try {
        const response = await fetch(`${apiUrl}/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: text })
        });

        if (!response.ok) continue;
        const data = await response.json();
        return data[0].language;
      } catch (error) {
        continue;
      }
    }
    throw new Error('Language detection failed');
  }
}