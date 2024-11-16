import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export const useGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', { id: user.uid })
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(groupsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createGroup = async (groupData: any) => {
    if (!user) throw new Error('Not authenticated');
    return await addDoc(collection(db, 'groups'), groupData);
  };

  const updateGroup = async (groupId: string, updates: any) => {
    if (!user) throw new Error('Not authenticated');
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, updates);
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) throw new Error('Not authenticated');
    const groupRef = doc(db, 'groups', groupId);
    await deleteDoc(groupRef);
  };

  return {
    groups,
    loading,
    createGroup,
    updateGroup,
    deleteGroup
  };
};