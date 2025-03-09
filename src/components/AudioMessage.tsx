
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, User, RotateCcw, Volume2 } from 'lucide-react';

interface AudioMessageProps {
  id: string;
  senderName: string;
  timestamp: string;
  audioUrl: string;
  isCurrentUser: boolean;
}

const AudioMessage = ({
  id,
  senderName,
  timestamp,
  audioUrl,
  isCurrentUser
}: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    });
    
    return () => {
      audio.pause();
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [audioUrl]);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setProgress((audioRef.current.currentTime / duration) * 100);
      }
    }, 100);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      audioRef.current.play();
      startTimer();
    }
    
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground ml-12' 
            : 'bg-secondary text-secondary-foreground mr-12'
        }`}
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <span className="font-medium text-sm">{senderName}</span>
            <span className="text-xs opacity-75 ml-2">{timestamp}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayPause}
            className={`rounded-full p-2 ${
              isCurrentUser 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-background/20 hover:bg-background/30'
            } transition-colors focus-ring`}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex-1">
            <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/50 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <button
            onClick={resetAudio}
            className={`rounded-full p-2 ${
              isCurrentUser 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-background/20 hover:bg-background/30'
            } transition-colors focus-ring`}
            aria-label="Reset audio"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center mt-2 text-xs opacity-75">
          <Volume2 className="h-3 w-3 mr-1" />
          <span>Audio message</span>
        </div>
      </div>
    </div>
  );
};

export default AudioMessage;
