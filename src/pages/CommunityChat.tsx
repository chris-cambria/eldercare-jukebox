
import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Paperclip, Image, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  avatar?: string;
}

const MOCK_USERS = [
  { id: 'user1', name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop' },
  { id: 'user2', name: 'Anitha', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1376&auto=format&fit=crop' },
  { id: 'user3', name: 'Kumar', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1374&auto=format&fit=crop' },
  { id: 'user4', name: 'Lakshmi', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1461&auto=format&fit=crop' },
  { id: 'user5', name: 'Raj', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1374&auto=format&fit=crop' }
];

// Sample community data
const MOCK_COMMUNITIES = [
  {
    id: '1',
    name: 'Music Lovers',
    description: 'Share and discuss your favorite songs and artists.',
    members: [...MOCK_USERS],
    messages: [
      { id: 'm1', senderId: 'user2', content: 'Has anyone heard the new Ilaiyaraaja album?', timestamp: new Date(2023, 10, 10, 9, 30) },
      { id: 'm2', senderId: 'user3', content: 'Yes, it\'s wonderful! I especially like the third track.', timestamp: new Date(2023, 10, 10, 9, 35) },
      { id: 'm3', senderId: 'user4', content: 'I haven\'t listened to it yet. Will check it out today!', timestamp: new Date(2023, 10, 10, 10, 0) },
      { id: 'm4', senderId: 'user1', content: 'Can someone share a link to listen to it?', timestamp: new Date(2023, 10, 10, 10, 5) },
      { id: 'm5', senderId: 'user5', content: 'Here you go: www.example.com/music/ilaiyaraaja-new-album', timestamp: new Date(2023, 10, 10, 10, 10) },
      { id: 'm6', senderId: 'user2', content: 'Thank you!', timestamp: new Date(2023, 10, 10, 10, 12) }
    ]
  },
  {
    id: '2',
    name: 'Crochet Group',
    description: 'Tips, patterns and inspiration for crochet enthusiasts.',
    members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[3]],
    messages: [
      { id: 'm1', senderId: 'user3', content: 'I just finished a beautiful blanket pattern!', timestamp: new Date(2023, 10, 11, 14, 0) },
      { id: 'm2', senderId: 'user1', content: 'Would love to see pictures!', timestamp: new Date(2023, 10, 11, 14, 10) }
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

  // Find the community and format messages
  useEffect(() => {
    const community = MOCK_COMMUNITIES.find(c => c.id === id);
    if (community) {
      setCommunityName(community.name);
      
      // Format messages with user details
      const formattedMessages = community.messages.map(msg => {
        const sender = community.members.find(member => member.id === msg.senderId) || 
                      { id: msg.senderId, name: 'Unknown User', avatar: undefined };
        return {
          id: msg.id,
          senderId: msg.senderId,
          senderName: sender.name,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isCurrentUser: msg.senderId === currentUserId,
          avatar: sender.avatar
        };
      });
      
      setMessages(formattedMessages);
    }
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      isCurrentUser: true,
      avatar: MOCK_USERS[0].avatar
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleMicClick = () => {
    toast.info("Voice recording is not available in this demo");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <p className="text-sm opacity-80">{messages.length} messages</p>
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
                <p className="text-xs font-medium mb-1 text-primary">{message.senderName}</p>
              )}
              <p className="text-sm break-words">{message.content}</p>
              <p className="text-xs mt-1 opacity-70 text-right">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-background border-t">
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            className="text-muted-foreground hover:text-primary"
            onClick={() => toast.info("Attachment feature not available in demo")}
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button 
            type="button" 
            className="text-muted-foreground hover:text-primary"
            onClick={() => toast.info("Image upload not available in demo")}
          >
            <Image className="h-5 w-5" />
          </button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
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
    </div>
  );
};

export default CommunityChat;
