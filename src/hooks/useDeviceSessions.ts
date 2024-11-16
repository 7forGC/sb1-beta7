import { useState, useEffect } from 'react';
import { sessionService } from '../services/sessionService';
import { useAuth } from './useAuth';

export const useDeviceSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      
      try {
        const userSessions = await sessionService.getSessions(user.uid);
        setSessions(userSessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  const terminateSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      await sessionService.terminateSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  const terminateAllOtherSessions = async () => {
    if (!user) return;
    
    try {
      const currentSession = sessions.find(session => session.current);
      if (currentSession) {
        await sessionService.terminateAllOtherSessions(user.uid, currentSession.id);
        setSessions(prev => prev.filter(session => session.current));
      }
    } catch (error) {
      console.error('Error terminating other sessions:', error);
    }
  };

  return {
    sessions,
    loading,
    terminateSession,
    terminateAllOtherSessions
  };
};