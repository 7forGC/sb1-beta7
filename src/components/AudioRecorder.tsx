import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Send, X } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (blob: Blob) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onAudioReady(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setDuration(seconds);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {isRecording ? (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 font-medium">{formatDuration(duration)}</span>
          </div>
        ) : (
          <button
            onClick={startRecording}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            <Mic size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isRecording && (
          <>
            <button
              onClick={stopRecording}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            >
              <Send size={20} />
            </button>
            <button
              onClick={onCancel}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};