import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Plus, X, Upload, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DEMO_REELS = [
  {
    id: '1',
    user: {
      name: 'Ana Marković',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    video: 'https://example.com/video1.mp4',
    likes: 1234,
    comments: 89,
    description: 'Beautiful sunset at the beach! 🌅 #sunset #beach',
  },
  {
    id: '2',
    user: {
      name: 'Marko Petrović',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
    video: 'https://example.com/video2.mp4',
    likes: 856,
    comments: 45,
    description: 'Morning coffee vibes ☕ #coffee #morning',
  },
];

export const Reels = () => {
  const { user } = useAuth();
  const [currentReel, setCurrentReel] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showNewReels, setShowNewReels] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('Video size must be less than 100MB');
      return;
    }

    setSelectedVideo(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    if (selectedVideo || description) {
      setShowDiscardConfirm(true);
    } else {
      handleDiscard();
    }
  };

  const handleDiscard = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedVideo(null);
    setPreviewUrl(null);
    setDescription('');
    setShowNewReels(false);
    setShowDiscardConfirm(false);
  };

  const handleUploadReels = async () => {
    if (!selectedVideo || !description.trim()) return;

    setLoading(true);
    try {
      // Handle reels upload here
      handleDiscard();
    } catch (error) {
      console.error('Error uploading reels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Reels Button */}
      <div className="flex justify-end px-4">
        <button
          onClick={() => setShowNewReels(true)}
          className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Reels</span>
        </button>
      </div>

      {/* New Reels Modal */}
      {showNewReels && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-t-xl shadow-xl h-[50vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Reels</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(50vh-64px)]">
              {/* Video Preview/Upload */}
              {previewUrl ? (
                <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden mb-4 max-h-[50vh]">
                  <video
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                  <button
                    onClick={() => {
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setSelectedVideo(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[9/16] bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors mb-4 max-h-[50vh]"
                >
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-600">Upload Video</span>
                  <span className="text-sm text-gray-400 mt-1">9:16 format • Max 100MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    capture="environment"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Description */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a description..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 mb-4 resize-none"
                rows={3}
              />

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadReels}
                  disabled={loading || !selectedVideo || !description.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Check size={18} />
                  <span>{loading ? 'Publishing...' : 'Publish'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4">
            <h3 className="text-lg font-semibold mb-2">Discard Reels?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to discard your reels? Your video and description will be lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reels List */}
      <div className="space-y-6 px-4">
        {DEMO_REELS.map((reel, index) => (
          <div key={reel.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative aspect-[9/16] bg-black">
              <video
                ref={videoRef}
                src={reel.video}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                autoPlay={index === currentReel}
              />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={toggleMute}
                  className="p-2 bg-black/50 rounded-full text-white"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={reel.user.avatar}
                    alt={reel.user.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="text-white">
                    <h3 className="font-medium">{reel.user.name}</h3>
                    <p className="text-sm opacity-80">{reel.description}</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
                <button className="p-2 bg-black/50 rounded-full text-white">
                  <Heart size={24} />
                  <span className="text-sm block mt-1">{reel.likes}</span>
                </button>
                <button className="p-2 bg-black/50 rounded-full text-white">
                  <MessageCircle size={24} />
                  <span className="text-sm block mt-1">{reel.comments}</span>
                </button>
                <button className="p-2 bg-black/50 rounded-full text-white">
                  <Share2 size={24} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};