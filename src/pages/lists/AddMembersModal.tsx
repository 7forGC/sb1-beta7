import React, { useState } from 'react';
import { X, Search, Check, UserPlus } from 'lucide-react';
import { UserAvatar } from '../../components/UserAvatar';

// Demo users - replace with actual user data from your backend
const DEMO_USERS = [
  { 
    id: '1', 
    displayName: 'Ana M.', 
    status: 'online', 
    settings: { language: 'sr' }, 
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  { 
    id: '2', 
    displayName: 'Marko P.', 
    status: 'online', 
    settings: { language: 'en' }, 
    photoURL: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
  },
  { 
    id: '3', 
    displayName: 'Jana N.', 
    status: 'online', 
    settings: { language: 'de' }, 
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  }
];

interface AddMembersModalProps {
  list: any;
  onClose: () => void;
  onAddMembers: (members: any[]) => void;
}

export const AddMembersModal: React.FC<AddMembersModalProps> = ({
  list,
  onClose,
  onAddMembers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const existingMemberIds = new Set(list.members?.map((m: any) => m.id) || []);
  
  const filteredUsers = DEMO_USERS.filter(user => 
    !existingMemberIds.has(user.id) &&
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const selectedMembers = DEMO_USERS.filter(user => 
        selectedUsers.includes(user.id)
      );
      await onAddMembers(selectedMembers);
    } catch (error) {
      console.error('Error adding members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Members to {list.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* User List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={user} size="md" showLanguage={true} />
                      <div>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-sm text-gray-500">{user.status}</div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedUsers.includes(user.id)
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedUsers.includes(user.id) && <Check size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserPlus size={48} className="mx-auto mb-4" />
                <p>No users found to add</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMembers}
              disabled={loading || selectedUsers.length === 0}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Adding...' : `Add ${selectedUsers.length} Member${selectedUsers.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};