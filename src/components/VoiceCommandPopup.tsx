
import { useState, useEffect } from 'react';
import { useVoiceNavigation } from '../providers/VoiceNavigationProvider';
import { Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VoiceCommandPopup = () => {
  const { isListening } = useVoiceNavigation();
  const [showHelp, setShowHelp] = useState(false);
  const [showActiveCommand, setShowActiveCommand] = useState(false);
  const [activeCommand, setActiveCommand] = useState('');

  useEffect(() => {
    // Show help dialog when voice control starts for the first time
    if (isListening) {
      const hasSeenHelp = localStorage.getItem('has-seen-voice-help');
      if (!hasSeenHelp) {
        setShowHelp(true);
        localStorage.setItem('has-seen-voice-help', 'true');
      }
    } else {
      setShowActiveCommand(false);
    }
  }, [isListening]);

  // Simulate detecting active command (in a real app, this would come from voice service)
  useEffect(() => {
    if (isListening) {
      const timer = setInterval(() => {
        // This is just a simulation for UI purposes
        const commands = ['முகப்பு செல்க', 'நினைவூட்டல்கள் செல்க', 'சமூகம் செல்க', 'குரல் வலைப்பதிவு செல்க', ''];
        const randomIndex = Math.floor(Math.random() * commands.length);
        const command = commands[randomIndex];
        
        if (command) {
          setActiveCommand(command);
          setShowActiveCommand(true);
          
          // Hide the active command indicator after 3 seconds
          setTimeout(() => {
            setShowActiveCommand(false);
          }, 3000);
        }
      }, 10000); // Show a command every 10 seconds
      
      return () => clearInterval(timer);
    }
  }, [isListening]);

  return (
    <>
      {/* Help popup */}
      {showHelp && (
        <div className="voice-command-help">
          <Button 
            className="absolute top-2 right-2" 
            variant="ghost" 
            size="icon"
            onClick={() => setShowHelp(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Mic className="h-12 w-12 text-primary mx-auto mb-4" />
          
          <h3 className="text-2xl font-bold mb-4">குரல் கட்டுப்பாட்டு வழிமுறைகள்</h3>
          
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-semibold">வழிசெலுத்த:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>"முகப்பு செல்க"</li>
                <li>"நினைவூட்டல்கள் செல்க"</li>
                <li>"சமூகம் செல்க"</li>
                <li>"குரல் வலைப்பதிவு செல்க"</li>
                <li>"உதவி எண் செல்க"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">அவசர உதவிக்கு:</h4>
              <ul className="list-disc pl-5">
                <li>"அவசரம்"</li>
              </ul>
            </div>
          </div>
          
          <Button 
            className="mt-6 w-full"
            onClick={() => setShowHelp(false)}
          >
            புரிந்தது
          </Button>
        </div>
      )}
      
      {/* Active command indicator */}
      {showActiveCommand && (
        <div className="voice-command-active flex items-center">
          <Mic className="h-5 w-5 mr-2 animate-pulse" />
          <span>{activeCommand}</span>
        </div>
      )}
    </>
  );
};

export default VoiceCommandPopup;
