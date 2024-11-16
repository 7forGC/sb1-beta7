export class LingvaTranslate {
  private readonly API_URLS = [
    'https://lingva.ml',
    'https://lingva.garudalinux.org',
    'https://lingva.pussthecat.org'
  ];

  async translate(text: string, targetLang: string): Promise<string> {
    for (const apiUrl of this.API_URLS) {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/auto/${targetLang}/${encodeURIComponent(text)}`
        );

        if (!response.ok) continue;
        const data = await response.json();
        return data.translation;
      } catch (error) {
        continue;
      }
    }
    throw new Error('All Lingva servers failed');
  }

  async detectLanguage(text: string): Promise<string> {
    for (const apiUrl of this.API_URLS) {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/detect/${encodeURIComponent(text)}`
        );

        if (!response.ok) continue;
        const data = await response.json();
        return data.language;
      } catch (error) {
        continue;
      }
    }
    throw new Error('Language detection failed');
  }
}