
// Simple voice recognition and speech synthesis service for Tamil language

class VoiceControlService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesisUtterance;
  private isListening: boolean = false;
  private commandCallbacks: Map<string, () => void> = new Map();
  
  constructor() {
    // Initialize speech synthesis
    this.synthesis = new SpeechSynthesisUtterance();
    this.synthesis.lang = 'ta-IN'; // Tamil language
    this.synthesis.rate = 0.9; // Slightly slower rate for clarity
    this.synthesis.pitch = 1;
    this.synthesis.volume = 1;
    
    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'ta-IN'; // Tamil language
      
      this.recognition.onresult = this.handleSpeechResult.bind(this);
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }
  
  private handleSpeechResult(event: SpeechRecognitionEvent) {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.trim().toLowerCase();
    console.log('Voice command detected:', command);
    
    // Check each registered command and see if the speech contains it
    this.commandCallbacks.forEach((callback, key) => {
      if (command.includes(key.toLowerCase())) {
        callback();
      }
    });
  }
  
  public registerCommand(command: string, callback: () => void) {
    this.commandCallbacks.set(command.toLowerCase(), callback);
    return () => this.commandCallbacks.delete(command.toLowerCase()); // Return function to unregister
  }
  
  public startListening() {
    if (!this.recognition) return false;
    
    if (!this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
        console.log('Voice recognition started');
        return true;
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        return false;
      }
    }
    return true;
  }
  
  public stopListening() {
    if (!this.recognition) return;
    
    if (this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
        console.log('Voice recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }
  
  public speak(text: string) {
    this.synthesis.text = text;
    window.speechSynthesis.speak(this.synthesis);
  }
  
  public isSupported(): boolean {
    return !!this.recognition;
  }
}

// Create singleton instance
const voiceControl = new VoiceControlService();

export default voiceControl;
