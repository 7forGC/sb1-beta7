import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const PRESET_WALLPAPERS = [
  { id: 'default', name: 'Default', url: '/wallpapers/default.jpg' },
  { id: 'gradient1', name: 'Purple Gradient', url: '/wallpapers/gradient1.jpg' },
  { id: 'gradient2', name: 'Blue Gradient', url: '/wallpapers/gradient2.jpg' },
  { id: 'pattern1', name: 'Dots', url: '/wallpapers/pattern1.png' },
  { id: 'pattern2', name: 'Waves', url: '/wallpapers/pattern2.png' },
  { id: 'solid1', name: 'Light', url: '/wallpapers/solid1.jpg' },
  { id: 'solid2', name: 'Dark', url: '/wallpapers/solid2.jpg' }
];

const SOLID_COLORS = [
  { id: 'color1', name: 'Light Purple', color: '#F3E8FF' },
  { id: 'color2', name: 'Light Blue', color: '#E0F2FE' },
  { id: 'color3', name: 'Light Green', color: '#DCFCE7' },
  { id: 'color4', name: 'Light Pink', color: '#FCE7F3' },
  { id: 'color5', name: 'Light Gray', color: '#F3F4F6' }
];

export const ChatWallpapersPage = () => {
  const { user, updateSettings } = useAuth();
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    user?.settings?.theme?.chatBackground || 'default'
  );
  const [customWallpaper, setCustomWallpaper] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWallpaperSelect = async (wallpaperId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateSettings({
        theme: {
          ...user.settings.theme,
          chatBackground: wallpaperId
        }
      });
      setSelectedWallpaper(wallpaperId);
    } catch (error) {
      console.error('Error updating wallpaper:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomWallpaper = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Preview the image
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCustomWallpaper(file);

    setLoading(true);
    try {
      // Here you would typically upload the file to your storage
      // and get back a URL to store in the user's settings
      const wallpaperUrl = url; // Replace with actual upload logic
      
      await updateSettings({
        theme: {
          ...user.settings.theme,
          chatBackground: wallpaperUrl
        }
      });
      setSelectedWallpaper('custom');
    } catch (error) {
      console.error('Error uploading wallpaper:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Chat Wallpapers</h1>
          <p className="text-gray-600 mt-2">Customize your chat background</p>
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
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <Upload size={24} className="mb-2" />
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
              {PRESET_WALLPAPERS.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => handleWallpaperSelect(wallpaper.id)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedWallpaper === wallpaper.id
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img
                    src={wallpaper.url}
                    alt={wallpaper.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedWallpaper === wallpaper.id && (
                    <div className="absolute top-2 right-2 p-1 bg-primary text-white rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-black/50 text-white text-sm">
                    {wallpaper.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Solid Colors */}
          <div>
            <h2 className="text-lg font-medium mb-4">Solid Colors</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {SOLID_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleWallpaperSelect(color.id)}
                  className={`relative aspect-square rounded-lg border-2 transition-colors ${
                    selectedWallpaper === color.id
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  style={{ backgroundColor: color.color }}
                >
                  {selectedWallpaper === color.id && (
                    <div className="absolute top-2 right-2 p-1 bg-primary text-white rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};