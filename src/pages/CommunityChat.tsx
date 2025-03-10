import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Paperclip, Image, User, Flag, X, Check, Play, Pause } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecordButton from '@/components/RecordButton';
import { useVoiceNavigation } from '../providers/VoiceNavigationProvider';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  avatar?: string;
  isVoiceMessage?: boolean;
  voiceUrl?: string;
  reportCount?: number;
}

const MOCK_USERS = [
  { id: 'user1', name: 'நீங்கள்', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop' },
  { id: 'user2', name: 'அனிதா', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop' },
  { id: 'user3', name: 'குமார்', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1374&auto=format&fit=crop' },
  { id: 'user4', name: 'லட்சுமி', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1461&auto=format&fit=crop' },
  { id: 'user5', name: 'ராஜ்', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1374&auto=format&fit=crop' }
];

// Sample community data
const MOCK_COMMUNITIES = [
  {
    id: '1',
    name: 'இசை ரசிகர்கள்',
    description: 'உங்கள் விருப்பமான பாடல்கள் மற்றும் கலைஞர்களைப் பற்றி பகிர்ந்து விவாதிக்கவும்.',
    members: [...MOCK_USERS],
    messages: [
      { id: 'm1', senderId: 'user2', content: 'யாராவது புதிய இளையராஜா ஆல்பத்தைக் கேட்டீர்களா?', timestamp: new Date(2023, 10, 10, 9, 30) },
      { id: 'm2', senderId: 'user3', content: 'ஆமாம், அது அருமையாக இருக்கிறது! குறிப்பாக மூன்றாவது பாடல் எனக்கு பிடித்திருக்கிறது.', timestamp: new Date(2023, 10, 10, 9, 35) },
      { id: 'm3', senderId: 'user4', content: 'நான் இன்னும் கேட்கவில்லை. இன்று கேட்பேன்!', timestamp: new Date(2023, 10, 10, 10, 0) },
      { id: 'm4', senderId: 'user1', content: 'யாராவது அதைக் கேட்க ஒரு லிங்க் பகிர முடியுமா?', timestamp: new Date(2023, 10, 10, 10, 5) },
      { id: 'm5', senderId: 'user5', content: 'இதோ: www.example.com/music/ilaiyaraaja-new-album', timestamp: new Date(2023, 10, 10, 10, 10), reportCount: 0 },
      { id: 'm6', senderId: 'user2', content: 'நன்றி!', timestamp: new Date(2023, 10, 10, 10, 12), reportCount: 0 }
    ]
  },
  {
    id: '2',
    name: 'குரோஷே குழு',
    description: 'குரோஷே ஆர்வலர்களுக்கான குறிப்புகள், மாதிரிகள் மற்றும் உத்வேகம்.',
    members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[3]],
    messages: [
      { id: 'm1', senderId: 'user3', content: 'நான் ஒரு அழகான போர்வை வடிவமைப்பை முடித்துவிட்டேன்!', timestamp: new Date(2023, 10, 11, 14, 0) },
      { id: 'm2', senderId: 'user1', content: 'படங்களைப் பார்க்க விரும்புகிறேன்!', timestamp: new Date(2023, 10, 11, 14, 10) }
    ]
  },
  // More sample communities...
];

const CommunityChat = () => {
  const { id } = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [communityName, setCommunityName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'user1'; // In a real app, this would be the logged-in user's ID
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [reportConfirmOpen, setReportConfirmOpen] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { speak } = useVoiceNavigation();

  // Find the community and format messages
  useEffect(() => {
    const community = MOCK_COMMUNITIES.find(c => c.id === id);
    if (community) {
      setCommunityName(community.name);
      
      // Format messages with user details and report counts
      const formattedMessages = community.messages.map(msg => {
        const sender = community.members.find(member => member.id === msg.senderId) || 
                      { id: msg.senderId, name: 'தெரியாத பயனர்', avatar: undefined };
        return {
          id: msg.id,
          senderId: msg.senderId,
          senderName: sender.name,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isCurrentUser: msg.senderId === currentUserId,
          avatar: sender.avatar,
          reportCount: msg.reportCount || 0
        };
      });
      
      setMessages(formattedMessages);
      
      // Announce the room for accessibility
      speak(`${community.name} குழுவில் நீங்கள் இணைந்துள்ளீர்கள். ${formattedMessages.length} செய்திகள் உள்ளன.`);
    }
  }, [id, speak]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isVoiceMode && audioBlob) {
      sendVoiceMessage();
      return;
    }
    
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'நீங்கள்',
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
      avatar: MOCK_USERS[0].avatar,
      reportCount: 0
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setIsRecording(false);
  };

  const sendVoiceMessage = () => {
    if (!audioBlob) return;
    
    const voiceUrl = URL.createObjectURL(audioBlob);
    
    const newMsg: Message = {
      id: `voice-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'நீங்கள்',
      content: 'குரல் செய்தி',
      timestamp: new Date(),
      isCurrentUser: true,
      avatar: MOCK_USERS[0].avatar,
      isVoiceMessage: true,
      voiceUrl: voiceUrl,
      reportCount: 0
    };
    
    setMessages([...messages, newMsg]);
    setAudioBlob(null);
    setIsVoiceMode(false);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    setNewMessage('');
  };

  const handleMicClick = () => {
    if (isVoiceMode) {
      setIsRecording(!isRecording);
    } else {
      toggleVoiceMode();
    }
  };

  const handleReport = (messageId: string) => {
    setReportingMessageId(messageId);
    setReportConfirmOpen(true);
  };

  const confirmReport = () => {
    if (!reportingMessageId) return;
    
    // Update report count for the message
    const updatedMessages = messages.map(msg => {
      if (msg.id === reportingMessageId) {
        const newReportCount = (msg.reportCount || 0) + 1;
        return { ...msg, reportCount: newReportCount };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
    toast.success("செய்தி புகாரளிக்கப்பட்டது. நன்றி!");
    setReportConfirmOpen(false);
    setReportingMessageId(null);
  };

  const togglePlayAudio = (audioUrl: string, messageId: string) => {
    if (playingAudio === messageId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
    } else {
      // Start playing
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAudio(messageId);
        
        // Reset when audio ends
        audioRef.current.onended = () => {
          setPlayingAudio(null);
        };
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserReported = (senderId: string) => {
    // Check if this user has 3+ reported messages
    const reportedCount = messages.filter(
      msg => msg.senderId === senderId && (msg.reportCount || 0) >= 3
    ).length;
    
    return reportedCount > 0;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-primary text-primary-foreground">
        <Link to="/community" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{communityName}</h1>
          <p className="text-sm opacity-80">{messages.length} செய்திகள்</p>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f5f5f5]">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isCurrentUser && (
              <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                {message.avatar ? (
                  <AvatarImage src={message.avatar} alt={message.senderName} />
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            <div 
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isCurrentUser 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-white text-foreground rounded-tl-none'
              }`}
            >
              {!message.isCurrentUser && (
                <p className={`text-xs font-medium mb-1 ${isUserReported(message.senderId) ? 'text-red-900 font-bold' : 'text-primary'}`}>
                  {message.senderName}
                </p>
              )}
              
              {message.isVoiceMessage ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => togglePlayAudio(message.voiceUrl!, message.id)}
                    className="h-8 w-8 rounded-full"
                  >
                    {playingAudio === message.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="text-sm">குரல் செய்தி</span>
                </div>
              ) : (
                <p className="text-sm break-words">{message.content}</p>
              )}
              
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </p>
                
                {!message.isCurrentUser && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-500"
                    onClick={() => handleReport(message.id)}
                  >
                    <Flag className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      {isVoiceMode ? (
        <div className="p-4 bg-background border-t">
          <div className="flex flex-col items-center">
            <h3 className="text-lg mb-2">குரல் செய்தி</h3>
            {audioBlob ? (
              <div className="flex flex-col items-center gap-4">
                <audio ref={audioRef} src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAudioBlob(null)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    மீண்டும் செய்
                  </Button>
                  <Button
                    onClick={sendVoiceMessage}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    அனுப்பு
                  </Button>
                </div>
              </div>
            ) : (
              <RecordButton
                onRecordingComplete={handleRecordingComplete}
                maxDuration={60}
              />
            )}
            <Button
              variant="ghost"
              className="mt-4"
              onClick={toggleVoiceMode}
            >
              <X className="mr-2 h-4 w-4" />
              செய்தி பகுதிக்குத் திரும்பு
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="p-3 bg-background border-t">
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="text-muted-foreground hover:text-primary"
              onClick={() => toast.info("டெமோவில் இணைப்பு அம்சம் இல்லை")}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button 
              type="button" 
              className="text-muted-foreground hover:text-primary"
              onClick={() => toast.info("டெமோவில் படம் பதிவேற்றம் இல்லை")}
            >
              <Image className="h-5 w-5" />
            </button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="ஒரு செய்தியைத் தட்டச்சு செய்யவும்"
              className="flex-1"
            />
            {newMessage.trim() ? (
              <Button type="submit" size="icon" className="rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                type="button" 
                size="icon" 
                className="rounded-full" 
                onClick={handleMicClick}
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>
      )}
      
      {/* Report Confirmation Dialog */}
      <Dialog open={reportConfirmOpen} onOpenChange={setReportConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>இந்த செய்தியைப் புகாரளிக்கவா?</DialogTitle>
            <DialogDescription>
              இந்த செய்தி உங்களுக்கு தகாத அல்லது தீங்கு விளைவிக்கும் என நினைத்தால் புகாரளிக்கவும்.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setReportConfirmOpen(false)}
              className="sm:flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              வேண்டாம்
            </Button>
            <Button
              onClick={confirmReport}
              className="sm:flex-1"
            >
              <Flag className="mr-2 h-4 w-4" />
              ஆம், புகாரளி
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden audio element for playing voice messages */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default CommunityChat;
