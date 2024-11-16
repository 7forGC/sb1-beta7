import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Users,
  X,
  MonitorStop,
  Monitor,
  Settings,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useVideoEffects } from '../hooks/useVideoEffects';

interface VideoCallProps {
  isGroup?: boolean;
  participants?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  onClose: () => void;
  onAddParticipant?: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ 
  isGroup = false,
  participants = [],
  onClose,
  onAddParticipant 
}) => {
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { currentEffect, changeEffect } = useVideoEffects();

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Simulate connection delay
        setTimeout(() => setConnecting(false), 1500);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setConnecting(false);
      }
    };

    if (!isVideoOff) {
      startVideo();
    }

    return () => {
      const stream = localVideoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isVideoOff]);

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Connecting Overlay */}
      {connecting && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="text-lg">Connecting...</p>
        </div>
      )}

      <div className="relative h-full flex">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="relative h-full rounded-xl overflow-hidden bg-gray-800">
            {/* Grid of participants */}
            <div className={`grid gap-4 h-full ${
              isGroup ? 'grid-cols-2 md:grid-cols-3' : ''
            }`}>
              {/* Local video */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {isVideoOff ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
                        <VideoOff size={32} className="text-white" />
                      </div>
                      <p className="mt-2 text-white">Camera Off</p>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  You {isMuted && '(Muted)'}
                </div>
              </div>

              {/* Remote participants */}
              {participants.map((participant) => (
                <div key={participant.id} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {isVideoOff ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <img
                        src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}`}
                        alt={participant.name}
                        className="w-20 h-20 rounded-full"
                      />
                    </div>
                  ) : (
                    <video autoPlay playsInline className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                    {participant.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel (Chat or Settings) */}
        {(showChat || showSettings) && (
          <div className="w-80 bg-white border-l">
            <div className="p-4 border-b">
              <h3 className="font-medium">
                {showChat ? 'Chat' : 'Settings'}
              </h3>
            </div>
            {showChat ? (
              <div className="p-4">
                {/* Chat implementation */}
                <div className="text-center text-gray-500">
                  <MessageCircle size={32} className="mx-auto mb-2" />
                  <p>Chat coming soon</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Effect
                  </label>
                  <select
                    value={currentEffect}
                    onChange={(e) => changeEffect(localVideoRef.current?.srcObject as MediaStreamTrack, e.target.value as any)}
                    className="w-full rounded-lg border-gray-300"
                  >
                    <option value="none">None</option>
                    <option value="blur">Background Blur</option>
                    <option value="virtual">Virtual Background</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-black/50">
          <div className="max-w-3xl mx-auto flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full ${
                isMuted ? 'bg-red-600' : 'bg-gray-700'
              } text-white hover:opacity-90`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-600' : 'bg-gray-700'
              } text-white hover:opacity-90`}
            >
              {isVideoOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full ${
                isScreenSharing ? 'bg-green-600' : 'bg-gray-700'
              } text-white hover:opacity-90`}
            >
              {isScreenSharing ? <MonitorStop size={24} /> : <Monitor size={24} />}
            </button>

            <button
              onClick={() => setIsSpeakerOff(!isSpeakerOff)}
              className={`p-4 rounded-full ${
                isSpeakerOff ? 'bg-red-600' : 'bg-gray-700'
              } text-white hover:opacity-90`}
            >
              {isSpeakerOff ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            {isGroup && (
              <button
                onClick={onAddParticipant}
                className="p-4 rounded-full bg-gray-700 text-white hover:opacity-90"
              >
                <Users size={24} />
              </button>
            )}

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-4 rounded-full ${
                showChat ? 'bg-primary' : 'bg-gray-700'
              } text-white hover:opacity-90`}
            >
              <MessageCircle size={24} />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-4 rounded-full ${
                showSettings ? 'bg-primary' : 'bg-gray-700'
              } text-white hover:opacity-90`}
            >
              <Settings size={24} />
            </button>

            <button
              onClick={onClose}
              className="p-4 rounded-full bg-red-600 text-white hover:opacity-90"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/60"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};