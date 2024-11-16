import React, { useState } from 'react';
import { X, Trash2, UserPlus, UserMinus, AlertCircle, Loader2 } from 'lucide-react';
import { UserAvatar } from '../../components/UserAvatar';

interface EditListModalProps {
  list: any;
  onClose: () => void;
  onUpdate: (listId: string, updates: any) => Promise<void>;
  onDelete: (listId: string) => Promise<void>;
}

export const EditListModal: React.FC<EditListModalProps> = ({
  list,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('List name is required');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(list.id, {
        name: name.trim(),
        description: description.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async () => {
    setLoading(true);
    try {
      await onDelete(list.id);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setLoading(true);
    try {
      const updatedMembers = list.members.filter((m: any) => m.id !== memberId);
      await onUpdate(list.id, { members: updatedMembers });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit List</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                List Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                placeholder="Enter list name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
                placeholder="Enter list description"
                rows={3}
              />
            </div>

            {/* Members Section */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Members ({list.members?.length || 0})</h3>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark"
                >
                  <UserPlus size={18} />
                  <span>Add Members</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {list.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={member} size="sm" showLanguage={true} />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          {member.role || 'Member'}
                        </div>
                      </div>
                    </div>
                    {member.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={loading}
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}

                {list.members?.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No members in this list
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors"
                disabled={loading}
              >
                <Trash2 size={18} />
                <span>Delete List</span>
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Delete List</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this list? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteList}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Delete List</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};