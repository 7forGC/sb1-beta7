import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Search,
  MessageSquare,
  Video,
  Phone,
  MoreVertical,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGroups } from '../../hooks/useGroups';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupSettingsModal } from './GroupSettingsModal';

export const GroupsPage = () => {
  const { user } = useAuth();
  const { groups, createGroup, updateGroup, deleteGroup } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async (groupData: any) => {
    await createGroup(groupData);
    setShowCreateModal(false);
  };

  const handleUpdateGroup = async (groupId: string, updates: any) => {
    await updateGroup(groupId, updates);
    setShowSettingsModal(false);
    setSelectedGroup(null);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      await deleteGroup(groupId);
      setShowSettingsModal(false);
      setSelectedGroup(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Groups</h1>
              <p className="text-gray-600 mt-1">Manage your group conversations</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <div className="flex items-center space-x-2">
                <UserPlus size={20} />
                <span>Create Group</span>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Groups List */}
        <div className="divide-y">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {group.avatar ? (
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.members.length} members
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MessageSquare size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone size={20} className="text-gray-600" />
                    </button>
                    <div className="relative group">
                      <button 
                        onClick={() => {
                          setSelectedGroup(group);
                          setShowSettingsModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No groups found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Create a group to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {/* Group Settings Modal */}
      {showSettingsModal && selectedGroup && (
        <GroupSettingsModal
          group={selectedGroup}
          onClose={() => {
            setShowSettingsModal(false);
            setSelectedGroup(null);
          }}
          onUpdate={handleUpdateGroup}
          onDelete={handleDeleteGroup}
        />
      )}
    </div>
  );
};