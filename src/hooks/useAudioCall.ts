import { useState, useEffect, useCallback } from 'react';
import { callService } from '../services/callService';
import { useAuth } from './useAuth';

export const useAudioCall = () => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = callService.subscribeToIncomingCalls(user.uid, (call) => {
      if (call.type === 'audio') {
        setIncomingCall(call);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const initiateCall = useCallback(async (recipientId: string, recipientName: string, recipientAvatar?: string) => {
    if (!user) return;

    const callData = {
      callerId: user.uid,
      callerName: user.displayName || 'Unknown User',
      ...(user.photoURL && { callerAvatar: user.photoURL }),
      recipientId,
      type: 'audio' as const
    };

    const callId = await callService.initiateCall(callData);

    setActiveCall({
      id: callId,
      recipientId,
      recipientName,
      ...(recipientAvatar && { recipientAvatar })
    });

    return callId;
  }, [user]);

  const answerCall = useCallback(async (callId: string) => {
    await callService.updateCallStatus(callId, 'accepted');
    setActiveCall(incomingCall);
    setIncomingCall(null);
  }, [incomingCall]);

  const declineCall = useCallback(async (callId: string) => {
    await callService.updateCallStatus(callId, 'declined', Date.now());
    setIncomingCall(null);
  }, []);

  const endCall = useCallback(async (callId: string) => {
    await callService.updateCallStatus(callId, 'ended', Date.now());
    setActiveCall(null);
  }, []);

  return {
    activeCall,
    incomingCall,
    initiateCall,
    answerCall,
    declineCall,
    endCall
  };
};