import React, { useState } from 'react';
import { X, Upload, Users, UserPlus, UserMinus, Settings, Trash2 } from 'lucide-react';

interface GroupSettingsModalProps {
  group: any;
  onClose: () => void;
  onUpdate: (groupId: string, updates: any) => Promise<void>;
  onDelete: (groupId: string) => Promise<void>;
}

export const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  group,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    try {
      const updates = {
        name: name.trim(),
        description: description.trim(),
      };

      if (avatar) {
        // Handle avatar upload
        // updates.avatar = await uploadGroupAvatar(avatar);
      }

      await onUpdate(group.id, updates);
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Group Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Settings size={18} />
              <span>General</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users size={18} />
              <span>Members</span>
            </div>
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'general' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Group avatar"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : group.avatar ? (
                    <img
                      src={group.avatar}
                      alt={group.name}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
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
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => onDelete(group.id)}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                >
                  <Trash2 size={18} />
                  <span>Delete Group</span>
                </button>

                <div className="flex space-x-3">
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
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Members List */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Members ({group.members.length})</h3>
                <button className="flex items-center space-x-2 text-primary hover:text-primary-dark">
                  <UserPlus size={18} />
                  <span>Add Members</span>
                </button>
              </div>

              <div className="space-y-2">
                {group.members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    {member.role !== 'admin' && (
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};