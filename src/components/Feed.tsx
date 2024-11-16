import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useImageCompression } from '../hooks/useImageCompression';

const DEMO_POSTS = [
  {
    id: '1',
    user: {
      name: 'Ana Marković',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    content: 'Beautiful sunset at the beach! 🌅',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    likes: 124,
    comments: 8,
    timestamp: new Date().getTime() - 3600000,
  },
  {
    id: '2',
    user: {
      name: 'Marko Petrović',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
    content: 'Just finished my morning coffee ☕',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    likes: 89,
    comments: 5,
    timestamp: new Date().getTime() - 7200000,
  },
];

export const Feed = () => {
  const { user } = useAuth();
  const { compressImage } = useImageCompression();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    return `${minutes}m`;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      setSelectedImage(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;

    setLoading(true);
    try {
      // Handle post creation here
      // Reset form
      setNewPostContent('');
      setSelectedImage(null);
      setPreviewUrl(null);
      setShowNewPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Post Button */}
      <button
        onClick={() => setShowNewPost(true)}
        className="w-full px-4 py-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-left text-gray-500"
      >
        What's on your mind?
      </button>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Post</h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
              />

              {previewUrl && (
                <div className="relative mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center space-x-2 text-primary cursor-pointer">
                  <ImageIcon size={20} />
                  <span>Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleCreatePost}
                  disabled={loading || (!newPostContent.trim() && !selectedImage)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {DEMO_POSTS.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{post.user.name}</h3>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Post Image */}
          <img
            src={post.image}
            alt=""
            className="w-full aspect-[4/3] object-cover"
          />

          {/* Post Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart size={24} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MessageCircle size={24} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 size={24} className="text-gray-600" />
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bookmark size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="font-medium">{post.likes} likes</div>
              <p>
                <span className="font-medium">{post.user.name}</span>{' '}
                {post.content}
              </p>
              <button className="text-gray-500 text-sm">
                View all {post.comments} comments
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};