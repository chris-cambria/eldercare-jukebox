
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import voiceControl from '../services/voiceControl';
import { toast } from 'sonner';

type VoiceNavigationContextType = {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  toggleVoiceControl: () => void;
  isSupported: boolean;
};

const VoiceNavigationContext = createContext<VoiceNavigationContextType | undefined>(undefined);

export const VoiceNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const isSupported = voiceControl.isSupported();

  const setupVoiceCommands = () => {
    // Navigation commands
    voiceControl.registerCommand('முகப்பு', () => navigate('/'));
    voiceControl.registerCommand('நினைவூட்டல்கள்', () => navigate('/reminders'));
    voiceControl.registerCommand('சமூகம்', () => navigate('/community'));
    voiceControl.registerCommand('குரல் வலைப்பதிவு', () => navigate('/voice-blog'));
    voiceControl.registerCommand('உதவி', () => navigate('/helpline'));
    
    // Emergency command
    voiceControl.registerCommand('அவசரம்', () => {
      triggerEmergency();
    });
  };

  const triggerEmergency = () => {
    toast.error("அவசர கால்! 112 என்ற எண்ணுக்கு அழைப்பு செய்யப்படுகிறது...");
    
    // In a real app, this would trigger actual calls and messages
    voiceControl.speak("அவசர கால் ஏற்பாடு செய்யப்படுகிறது. தயவுசெய்து காத்திருக்கவும்");
    
    // Simulating a call
    setTimeout(() => {
      window.open(`tel:112`, '_self');
    }, 2000);
  };

  const startListening = () => {
    if (voiceControl.startListening()) {
      setIsListening(true);
      toast.success("குரல் கட்டுப்பாடு செயல்படுத்தப்பட்டது");
      voiceControl.speak("குரல் கட்டுப்பாடு இப்போது செயல்படுகிறது");
    } else {
      toast.error("குரல் கட்டுப்பாட்டை செயல்படுத்த முடியவில்லை");
    }
  };

  const stopListening = () => {
    voiceControl.stopListening();
    setIsListening(false);
    toast.info("குரல் கட்டுப்பாடு நிறுத்தப்பட்டது");
  };

  const toggleVoiceControl = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speak = (text: string) => {
    voiceControl.speak(text);
  };

  useEffect(() => {
    if (isSupported) {
      setupVoiceCommands();
    }
    
    return () => {
      if (isListening) {
        voiceControl.stopListening();
      }
    };
  }, []);

  return (
    <VoiceNavigationContext.Provider
      value={{
        isListening,
        startListening,
        stopListening,
        speak,
        toggleVoiceControl,
        isSupported
      }}
    >
      {children}
    </VoiceNavigationContext.Provider>
  );
};

export const useVoiceNavigation = (): VoiceNavigationContextType => {
  const context = useContext(VoiceNavigationContext);
  if (context === undefined) {
    throw new Error('useVoiceNavigation must be used within a VoiceNavigationProvider');
  }
  return context;
};
