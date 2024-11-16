import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export const useLists = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'lists'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLists(listsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createList = async (listData: any) => {
    if (!user) throw new Error('Not authenticated');
    return await addDoc(collection(db, 'lists'), {
      ...listData,
      userId: user.uid,
      createdAt: Date.now()
    });
  };

  const updateList = async (listId: string, updates: any) => {
    if (!user) throw new Error('Not authenticated');
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, updates);
  };

  const deleteList = async (listId: string) => {
    if (!user) throw new Error('Not authenticated');
    const listRef = doc(db, 'lists', listId);
    await deleteDoc(listRef);
  };

  return {
    lists,
    loading,
    createList,
    updateList,
    deleteList
  };
};