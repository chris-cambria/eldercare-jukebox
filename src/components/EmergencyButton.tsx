
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EmergencyButton = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEmergency = () => {
    setConfirmOpen(true);
  };

  const confirmEmergency = () => {
    // Close dialog
    setConfirmOpen(false);
    
    // Show feedback
    toast.error("அவசர கால்! 112 என்ற எண்ணுக்கு அழைப்பு செய்யப்படுகிறது...");
    
    // In a real app, this would trigger the calls and SMS
    // Here we'll just simulate a call
    setTimeout(() => {
      window.open(`tel:112`, '_self');
      
      // Simulate sending messages to emergency contacts
      toast.info("அவசர தொடர்புகளுக்கு செய்திகள் அனுப்பப்பட்டன");
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={handleEmergency}
        className="emergency-button"
        aria-label="அவசர உதவி"
      >
        <AlertTriangle className="h-8 w-8" />
      </button>
      
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-red-600">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              அவசர உதவி
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              இது அவசரகால உதவிக்கான அழைப்பாகும். தொடர விரும்புகிறீர்களா?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <p className="text-center text-lg">
              உறுதிப்படுத்தினால், 112 என்ற எண்ணுக்கு அழைப்பு செய்யப்படும் மற்றும் உங்கள் அவசர தொடர்புகளுக்கு செய்தி அனுப்பப்படும்.
            </p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="sm:flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              ரத்து செய்
            </Button>
            <Button
              onClick={confirmEmergency}
              className="bg-red-600 hover:bg-red-700 sm:flex-1"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              ஆம், அவசர உதவி தேவை
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
