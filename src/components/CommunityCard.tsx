
import { MessageSquare, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  messageCount: number;
  imageUrl?: string;
}

const CommunityCard = ({
  id,
  name,
  description,
  memberCount,
  messageCount,
  imageUrl
}: CommunityCardProps) => {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <>
      <div 
        className="block rounded-lg border border-border bg-card text-card-foreground p-5 transition-all duration-300 card-hover"
        onClick={() => setShowWarning(true)}
      >
        <div className="flex">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-4 overflow-hidden"
          >
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="h-8 w-8" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-2xl">{name}</h3>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <p className="text-xl text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            
            <div className="flex items-center mt-3 text-lg text-muted-foreground">
              <div className="flex items-center mr-4">
                <Users className="h-5 w-5 mr-1" />
                <span>{memberCount} உறுப்பினர்கள்</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-1" />
                <span>{messageCount} செய்திகள்</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">
              பாதுகாப்பு எச்சரிக்கை
            </DialogTitle>
            <DialogDescription className="text-xl">
              இந்த சமூகத்தில் இணைவதற்கு முன் பின்வரும் எச்சரிக்கைகளை கவனிக்கவும்:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <p className="text-xl">● மோசடிகளைப் பற்றி எச்சரிக்கையாக இருங்கள்.</p>
            <p className="text-xl">● உங்கள் தனிப்பட்ட தகவல்களை பகிர வேண்டாம்.</p>
            <p className="text-xl">● சந்தேகத்திற்குரிய செய்திகளைப் புகாரளிக்கவும்.</p>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                இரத்துசெய்
              </Button>
            </DialogClose>
            <Link to={`/community/${id}`}>
              <Button>
                தொடரவும்
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunityCard;
