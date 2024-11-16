import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, X, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSound } from '../hooks/useSound';

interface AudioCallProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  onClose: () => void;
  isIncoming?: boolean;
  onAnswer?: () => void;
  onDecline?: () => void;
}

export const AudioCall: React.FC<AudioCallProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  onClose,
  isIncoming,
  onAnswer,
  onDecline
}) => {
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connecting, setConnecting] = useState(true);
  const { play, stop } = useSound();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isIncoming) {
      play('call', 'modern', 0.7);
    } else {
      // Simulate connection delay
      setTimeout(() => setConnecting(false), 1500);
    }

    return () => {
      stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isIncoming, play, stop]);

  useEffect(() => {
    if (!isIncoming && !connecting) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isIncoming, connecting]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    stop(); // Stop ringtone
    onAnswer?.();
  };

  const handleDecline = () => {
    stop(); // Stop ringtone
    onDecline?.();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 z-50 flex items-center justify-center">
      {/* Connecting Overlay */}
      {connecting && !isIncoming && (
        <div className="absolute inset-0 bg-black/50 z-50 flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="text-lg">Connecting...</p>
        </div>
      )}

      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center text-white">
            <div className="w-32 h-32 mx-auto mb-6">
              <div className="relative">
                <img
                  src={recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=random`}
                  alt={recipientName}
                  className="w-full h-full rounded-full object-cover border-4 border-white/20"
                />
                <div className="absolute inset-0 rounded-full bg-black/20" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{recipientName}</h2>
            <p className="text-white/80">
              {isIncoming ? 'Incoming audio call...' : formatDuration(callDuration)}
            </p>
          </div>

          {/* Controls */}
          <div className="px-8 pb-8">
            <div className="flex justify-center space-x-6">
              {isIncoming ? (
                <>
                  <button
                    onClick={handleDecline}
                    className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff size={32} />
                  </button>
                  <button
                    onClick={handleAnswer}
                    className="p-4 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors"
                  >
                    <Phone size={32} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full ${
                      isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    } transition-colors`}
                  >
                    {isMuted ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                  <button
                    onClick={() => setIsSpeakerOff(!isSpeakerOff)}
                    className={`p-4 rounded-full ${
                      isSpeakerOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    } transition-colors`}
                  >
                    {isSpeakerOff ? <VolumeX size={32} /> : <Volume2 size={32} />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <PhoneOff size={32} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Close button */}
        {!isIncoming && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>
    </div>
  );
};