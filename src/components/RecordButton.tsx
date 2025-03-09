
import { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle, Check } from 'lucide-react';
import { toast } from "sonner";

interface RecordButtonProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // in seconds
}

const RecordButton = ({ onRecordingComplete, maxDuration = 60 }: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      stopRecording();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Reset state
      chunksRef.current = [];
      setRecordingTime(0);
      setRecordingBlob(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up data handling
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordingBlob(blob);
        onRecordingComplete(blob);
        
        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        streamRef.current = null;
        mediaRecorderRef.current = null;
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => {
          if (prevTime >= maxDuration) {
            stopRecording();
            return prevTime;
          }
          return prevTime + 1;
        });
      }, 1000);
      
      // Auto-stop after max duration
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, maxDuration * 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressPercentage = () => {
    return (recordingTime / maxDuration) * 100;
  };

  return (
    <div className="flex flex-col items-center">
      {isRecording ? (
        <div className="relative">
          <svg className="w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={176}
              strokeDashoffset={176 - (176 * getProgressPercentage()) / 100}
              className="text-primary transition-all duration-100"
              transform="rotate(-90 32 32)"
            />
          </svg>
          
          <button
            onClick={stopRecording}
            className="absolute inset-0 flex items-center justify-center bg-red-500 text-white rounded-full focus-ring scale-75 transform transition-transform hover:scale-80"
            aria-label="Stop recording"
          >
            <Square className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <button
          onClick={startRecording}
          className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center focus-ring hover:bg-primary/90 transition-colors"
          aria-label="Start recording"
        >
          <Mic className="h-6 w-6" />
        </button>
      )}
      
      {isRecording ? (
        <div className="mt-4 text-center animate-pulse text-red-500 font-medium">
          Recording {formatTime(recordingTime)}
        </div>
      ) : recordingBlob ? (
        <div className="mt-4 text-center text-green-600 flex items-center">
          <Check className="h-4 w-4 mr-1" />
          <span>Recording saved ({formatTime(recordingTime)})</span>
        </div>
      ) : (
        <div className="mt-4 text-center text-muted-foreground">
          Tap to start recording
        </div>
      )}
    </div>
  );
};

export default RecordButton;
