import React, { useRef, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { userService } from '../services/userService';

interface StoryUploaderProps {
  onClose: () => void;
}

export const StoryUploader: React.FC<StoryUploaderProps> = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { user } = useStore();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Stop recording after 60 seconds
      setTimeout(() => {
        stopRecording();
        clearInterval(timer);
      }, 60000);

    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        if (user) {
          setUploading(true);
          try {
            await userService.uploadStory(user.uid, blob);
            onClose();
          } catch (error) {
            console.error('Error uploading story:', error);
          } finally {
            setUploading(false);
          }
        }

        // Stop all tracks
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
    }
  };

  return (
    <div className="relative">
      {!isRecording && !uploading && (
        <button
          onClick={startRecording}
          className="w-full aspect-square rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center hover:border-primary/50 transition-colors bg-gray-50"
        >
          <div className="text-center">
            <Camera size={24} className="mx-auto mb-2 text-primary" />
            <span className="text-sm text-gray-600">Record Story</span>
          </div>
        </button>
      )}

      {isRecording && (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="px-2 py-1 rounded-full bg-red-500 text-white text-sm">
              {countdown}s
            </span>
            <button
              onClick={stopRecording}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};