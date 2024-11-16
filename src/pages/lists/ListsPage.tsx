import React, { useState } from 'react';
import { 
  List,
  Plus,
  Search,
  Star,
  Archive,
  X,
  Edit,
  UserPlus
} from 'lucide-react';
import { useLists } from '../../hooks/useLists';
import { CreateListModal } from './CreateListModal';
import { EditListModal } from './EditListModal';
import { AddMembersModal } from './AddMembersModal';

export const ListsPage = () => {
  const { lists, createList, updateList, deleteList } = useLists();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = async (listData: any) => {
    await createList(listData);
    setShowCreateModal(false);
  };

  const handleUpdateList = async (listId: string, updates: any) => {
    await updateList(listId, updates);
    setShowEditModal(false);
    setSelectedList(null);
  };

  const handleDeleteList = async (listId: string) => {
    await deleteList(listId);
    setShowEditModal(false);
    setSelectedList(null);
  };

  const handleAddMembers = async (listId: string, members: any[]) => {
    await updateList(listId, {
      members: [...(selectedList.members || []), ...members]
    });
    setShowAddMembersModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Lists</h1>
              <p className="text-gray-600 mt-1">Organize your contacts and conversations</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Create List</span>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lists */}
        <div className="divide-y">
          {filteredLists.length > 0 ? (
            filteredLists.map((list) => (
              <div key={list.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {list.type === 'favorites' ? (
                        <Star className="w-5 h-5 text-primary" />
                      ) : list.type === 'archived' ? (
                        <Archive className="w-5 h-5 text-primary" />
                      ) : (
                        <List className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{list.name}</h3>
                      <p className="text-sm text-gray-500">
                        {list.members?.length || 0} members
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedList(list);
                        setShowAddMembersModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-primary"
                      title="Add Members"
                    >
                      <UserPlus size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedList(list);
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No lists found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Create a list to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateList}
        />
      )}

      {/* Edit List Modal */}
      {showEditModal && selectedList && (
        <EditListModal
          list={selectedList}
          onClose={() => {
            setShowEditModal(false);
            setSelectedList(null);
          }}
          onUpdate={handleUpdateList}
          onDelete={handleDeleteList}
        />
      )}

      {/* Add Members Modal */}
      {showAddMembersModal && selectedList && (
        <AddMembersModal
          list={selectedList}
          onClose={() => {
            setShowAddMembersModal(false);
            setSelectedList(null);
          }}
          onAddMembers={(members) => handleAddMembers(selectedList.id, members)}
        />
      )}
    </div>
  );
};