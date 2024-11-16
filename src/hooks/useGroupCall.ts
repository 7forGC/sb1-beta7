import { useState, useEffect, useCallback } from 'react';
import { groupCallService } from '../services/groupCallService';
import { useAuth } from './useAuth';

export const useGroupCall = () => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = groupCallService.subscribeToGroupCalls(user.uid, (call) => {
      // Only handle new incoming calls
      if (!activeCall && call.hostId !== user.uid) {
        setIncomingCall(call);
      }
    });

    return () => unsubscribe();
  }, [user, activeCall]);

  const initiateGroupCall = useCallback(async (participants: { id: string; name: string; avatar?: string }[]) => {
    if (!user) return;

    const callData = {
      hostId: user.uid,
      hostName: user.displayName || 'Unknown User',
      hostAvatar: user.photoURL,
      participants: participants.map(p => ({ ...p, joined: false })),
      type: 'video' as const
    };

    const callId = await groupCallService.initiateGroupCall(callData);
    setActiveCall({ id: callId, ...callData });
    return callId;
  }, [user]);

  const joinCall = useCallback(async (callId: string) => {
    if (!user) return;

    await groupCallService.addParticipant(callId, {
      id: user.uid,
      name: user.displayName || 'Unknown User',
      avatar: user.photoURL,
      joined: true
    });

    setActiveCall(incomingCall);
    setIncomingCall(null);
  }, [user, incomingCall]);

  const leaveCall = useCallback(async (callId: string) => {
    if (!user) return;

    await groupCallService.removeParticipant(callId, user.uid);
    setActiveCall(null);
  }, [user]);

  const endCall = useCallback(async (callId: string) => {
    await groupCallService.updateCallStatus(callId, 'ended', Date.now());
    setActiveCall(null);
  }, []);

  return {
    activeCall,
    incomingCall,
    initiateGroupCall,
    joinCall,
    leaveCall,
    endCall
  };
};