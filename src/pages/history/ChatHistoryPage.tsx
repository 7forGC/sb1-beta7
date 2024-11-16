import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Calendar,
  Download,
  Trash2,
  Archive,
  MessageSquare,
  Phone,
  Video,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChatHistory } from '../../hooks/useChatHistory';
import { format } from 'date-fns';

export const ChatHistoryPage = () => {
  const { user } = useAuth();
  const { history, loading, exportHistory, deleteHistory, archiveChat } = useChatHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'messages' | 'calls'>('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !selectedDate || 
      new Date(item.timestamp).toDateString() === selectedDate.toDateString();
    
    const matchesType = selectedType === 'all' || item.type === selectedType;

    return matchesSearch && matchesDate && matchesType;
  });

  const handleExport = async () => {
    try {
      const url = await exportHistory();
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chat History</h1>
              <p className="text-gray-600 mt-1">View and manage your conversation history</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Download size={20} />
                <span>Export History</span>
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Filter size={20} />
                <span>Filters</span>
                <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="all">All Types</option>
                  <option value="messages">Messages</option>
                  <option value="calls">Calls</option>
                </select>

                <input
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading history...</div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.participant.name)}`}
                      alt={item.participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{item.participant.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {item.type === 'messages' ? (
                          <MessageSquare size={16} />
                        ) : item.type === 'audio-call' ? (
                          <Phone size={16} />
                        ) : (
                          <Video size={16} />
                        )}
                        <span>{format(new Date(item.timestamp), 'PPp')}</span>
                      </div>
                      {item.content && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => archiveChat(item.id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Archive"
                    >
                      <Archive size={20} />
                    </button>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No history found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Your chat history will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};