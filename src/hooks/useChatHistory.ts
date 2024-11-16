import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

interface ChatHistoryItem {
  id: string;
  type: 'messages' | 'audio-call' | 'video-call';
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  content?: string;
  timestamp: number;
  duration?: number;
  status: 'active' | 'archived' | 'deleted';
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'history'),
          where('userId', '==', user.uid),
          where('status', '!=', 'deleted'),
          orderBy('status'),
          orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatHistoryItem[];

        setHistory(historyData);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  const exportHistory = async () => {
    const historyData = history.map(item => ({
      ...item,
      exportedAt: new Date().toISOString()
    }));

    const blob = new Blob([JSON.stringify(historyData, null, 2)], {
      type: 'application/json'
    });

    return URL.createObjectURL(blob);
  };

  const deleteHistory = async (itemId: string) => {
    if (!user) return;

    try {
      const historyRef = doc(db, 'history', itemId);
      await updateDoc(historyRef, { status: 'deleted' });
      setHistory(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting history:', error);
      throw error;
    }
  };

  const archiveChat = async (itemId: string) => {
    if (!user) return;

    try {
      const historyRef = doc(db, 'history', itemId);
      await updateDoc(historyRef, { status: 'archived' });
      setHistory(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, status: 'archived' } : item
        )
      );
    } catch (error) {
      console.error('Error archiving chat:', error);
      throw error;
    }
  };

  return {
    history,
    loading,
    exportHistory,
    deleteHistory,
    archiveChat
  };
};