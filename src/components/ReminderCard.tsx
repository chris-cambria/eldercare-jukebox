
import { useState } from 'react';
import { Pill, Coffee, Activity, Bell, Volume2, VolumeX } from 'lucide-react';
import { toast } from "sonner";

export type ReminderType = 'medication' | 'meal' | 'exercise';

interface ReminderCardProps {
  id: string;
  type: ReminderType;
  title: string;
  time: string;
  description?: string;
  voiceAlert?: string; // Path to the audio file
  isActive: boolean;
  onToggle: (id: string) => void;
}

const ReminderCard = ({
  id,
  type,
  title,
  time,
  description,
  voiceAlert,
  isActive,
  onToggle,
}: ReminderCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const getIcon = () => {
    switch (type) {
      case 'medication':
        return <Pill className="h-6 w-6" />;
      case 'meal':
        return <Coffee className="h-6 w-6" />;
      case 'exercise':
        return <Activity className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'medication':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'meal':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'exercise':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handlePlay = () => {
    if (!voiceAlert) {
      toast.error("No voice alert available for this reminder");
      return;
    }

    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    const newAudio = new Audio(voiceAlert);
    setAudio(newAudio);
    
    newAudio.onended = () => {
      setIsPlaying(false);
    };
    
    newAudio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error("Could not play audio");
      setIsPlaying(false);
    });
    
    setIsPlaying(true);
  };

  return (
    <div 
      className={`rounded-lg border p-4 transition-all duration-300 card-hover ${getTypeColor()}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm opacity-80">{time}</p>
          </div>
        </div>
        
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={isActive}
            onChange={() => onToggle(id)}
          />
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-primary' : 'bg-gray-300'}`}>
            <div 
              className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </div>
        </label>
      </div>
      
      {description && (
        <p className="text-sm mb-4 opacity-90">{description}</p>
      )}
      
      {voiceAlert && (
        <button
          onClick={handlePlay}
          className="flex items-center text-sm font-medium rounded-md p-2 hover:bg-white/50 transition-colors focus-ring"
          aria-label={isPlaying ? "Stop audio" : "Play audio alert"}
        >
          {isPlaying ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
          {isPlaying ? "Stop Audio" : "Play Voice Alert"}
        </button>
      )}
      
      {/* Comment for customization */}
      {/* 
        To add custom Tamil comedy voice clips:
        1. Add your MP3 files to the public folder
        2. Pass the file path to the voiceAlert prop like: "/audio/your-clip.mp3"
      */}
    </div>
  );
};

export default ReminderCard;
