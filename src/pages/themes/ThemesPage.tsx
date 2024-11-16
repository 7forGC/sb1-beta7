import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Palette, Image as ImageIcon, Check, Moon, Sun, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWallpaper } from '../../hooks/useWallpaper';

const THEME_PRESETS = [
  { name: 'Default', primary: '#AB39D2', secondary: '#4F46E5' },
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#2563EB' },
  { name: 'Forest', primary: '#22C55E', secondary: '#16A34A' },
  { name: 'Sunset', primary: '#F59E0B', secondary: '#DC2626' },
  { name: 'Lavender', primary: '#8B5CF6', secondary: '#6D28D9' },
];

const BACKGROUNDS = [
  { id: 'solid', name: 'Solid Color', type: 'color' },
  { id: 'gradient', name: 'Gradient', type: 'gradient' },
  { id: 'pattern1', name: 'Dots', type: 'pattern', url: '/patterns/dots.png' },
  { id: 'pattern2', name: 'Waves', type: 'pattern', url: '/patterns/waves.png' },
  { id: 'custom', name: 'Custom Image', type: 'custom' },
];

const SOLID_COLORS = [
  { id: 'color1', name: 'Light Purple', color: '#F3E8FF' },
  { id: 'color2', name: 'Light Blue', color: '#E0F2FE' },
  { id: 'color3', name: 'Light Green', color: '#DCFCE7' },
  { id: 'color4', name: 'Light Pink', color: '#FCE7F3' },
  { id: 'color5', name: 'Light Gray', color: '#F3F4F6' }
];

export const ThemesPage = () => {
  const { user, updateSettings } = useAuth();
  const { uploadWallpaper } = useWallpaper();
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS[0]);
  const [isDarkMode, setIsDarkMode] = useState(user?.settings?.theme?.mode === 'dark');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customWallpaper, setCustomWallpaper] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load saved settings
  useEffect(() => {
    if (user?.settings?.theme) {
      const { primary, secondary, chatBackground, mode } = user.settings.theme;
      setSelectedTheme({ name: 'Custom', primary, secondary });
      setSelectedBackground(BACKGROUNDS.find(bg => bg.id === chatBackground) || BACKGROUNDS[0]);
      setIsDarkMode(mode === 'dark');
    }
  }, [user]);

  const handleThemeChange = (theme: typeof THEME_PRESETS[0]) => {
    setSelectedTheme(theme);
    setError(null);
  };

  const handleBackgroundChange = (background: typeof BACKGROUNDS[0]) => {
    setSelectedBackground(background);
    setError(null);
  };

  const handleCustomWallpaper = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCustomWallpaper(file);
    setError(null);
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let wallpaperUrl = selectedBackground.id;

      if (selectedBackground.id === 'custom' && customWallpaper) {
        wallpaperUrl = await uploadWallpaper(customWallpaper);
      }

      await updateSettings({
        theme: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: selectedTheme.primary,
          secondary: selectedTheme.secondary,
          chatBackground: wallpaperUrl
        }
      });

      setSuccess('Settings saved successfully');
      
      // Apply theme to document
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.documentElement.style.setProperty('--color-primary', selectedTheme.primary);
      document.documentElement.style.setProperty('--color-secondary', selectedTheme.secondary);

    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Themes & Backgrounds</h1>
          <p className="text-gray-600 mt-2">Customize your app appearance</p>
        </div>

        <div className="p-6">
          {/* Custom Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Custom Wallpaper</h2>
            <label className="block">
              <div className="relative aspect-[3/4] max-w-xs border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-primary transition-colors">
                {previewUrl ? (
                  <div className="relative h-full">
                    <img
                      src={previewUrl}
                      alt="Custom wallpaper"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setCustomWallpaper(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <AlertCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-sm">Upload Image</span>
                    <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomWallpaper}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </label>
          </div>

          {/* Preset Wallpapers */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Preset Wallpapers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {BACKGROUNDS.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => handleBackgroundChange(wallpaper)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedBackground.id === wallpaper.id
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  {wallpaper.type === 'pattern' && wallpaper.url && (
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {wallpaper.type === 'custom' && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {wallpaper.type === 'color' && (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  {wallpaper.type === 'gradient' && (
                    <div className="w-full h-full bg-gradient-custom" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/50 text-white text-sm">
                    {wallpaper.name}
                  </div>
                  {selectedBackground.id === wallpaper.id && (
                    <div className="absolute top-2 right-2 p-1 bg-primary text-white rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Color Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTheme.name === theme.name
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{theme.name}</span>
                    {selectedTheme.name === theme.name && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="h-20 rounded-lg" style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                  }} />
                </button>
              ))}

              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-center h-full">
                  <Palette className="w-6 h-6 text-gray-500" />
                  <span className="ml-2">Custom Colors</span>
                </div>
              </button>
            </div>

            {showColorPicker && (
              <div className="mt-4 p-4 border rounded-lg">
                <ChromePicker
                  color={selectedTheme.primary}
                  onChange={(color) => {
                    setSelectedTheme({
                      ...selectedTheme,
                      primary: color.hex
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-600">Switch between light and dark themes</p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            {error && (
              <div className="mr-4 text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </div>
            )}
            {success && (
              <div className="mr-4 text-green-500 flex items-center">
                <Check size={16} className="mr-1" />
                {success}
              </div>
            )}
            <button
              onClick={saveSettings}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};