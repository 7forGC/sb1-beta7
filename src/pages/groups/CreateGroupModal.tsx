import React, { useState } from 'react';
import { X, Upload, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreate: (groupData: any) => Promise<void>;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreate }) => {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    try {
      const groupData = {
        name: groupName.trim(),
        description: description.trim(),
        avatar: null as string | null,
        createdBy: user?.uid,
        members: [
          {
            id: user?.uid,
            role: 'admin',
            joinedAt: Date.now()
          }
        ],
        createdAt: Date.now()
      };

      if (avatar) {
        // Handle avatar upload
        // groupData.avatar = await uploadGroupAvatar(avatar);
      }

      await onCreate(groupData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Group avatar"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary-dark">
                  <Upload size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                placeholder="Enter group name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                placeholder="Enter group description"
                rows={3}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};