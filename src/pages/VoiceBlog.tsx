import { useState } from 'react';
import { Mic, Save, Calendar, Info, Clock, Play, Pause, User } from 'lucide-react';
import Header from '../components/Header';
import RecordButton from '../components/RecordButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface VoiceBlogPost {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  recordedAt: Date;
  status: 'pending' | 'published';
}

// Placeholder voice blog posts - Replace with actual data
const initialVoiceBlogs: VoiceBlogPost[] = [
  {
    id: '1',
    title: 'என் தோட்டக்கலை குறிப்புகள்',
    description: 'உள்ளரங்கத் தாவரங்களை எவ்வாறு பாதுகாப்பது என்பது குறித்த சில குறிப்புகளைப் பகிர்தல்',
    audioUrl: '/voice-blog-1.mp3', // Placeholder
    duration: 95, // seconds
    recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'published',
  },
  {
    id: '2',
    title: 'விருப்பமான பாடல் நினைவுகள்',
    description: 'என் இளமைக்கால பாடல்களை நினைவுகூர்தல்',
    audioUrl: '/voice-blog-2.mp3', // Placeholder
    duration: 128, // seconds
    recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'published',
  }
];

const VoiceBlog = () => {
  const [voiceBlogs, setVoiceBlogs] = useState<VoiceBlogPost[]>(initialVoiceBlogs);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
  });
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRecordingComplete = (blob: Blob) => {
    setRecordedBlob(blob);
    const url = URL.createObjectURL(blob);
    setRecordingUrl(url);
  };
  
  const handleSavePost = () => {
    if (!recordedBlob || !newPost.title) {
      toast.error("தலைப்பு மற்றும் ஒலிப் பதிவைப் கொடுக்கவும்");
      return;
    }
    
    // In a real application, you would upload the blob to a server
    // and get back a persistent URL. Here we just use the object URL.
    const newVoiceBlog: VoiceBlogPost = {
      id: (voiceBlogs.length + 1).toString(),
      title: newPost.title,
      description: newPost.description,
      audioUrl: recordingUrl || '',
      duration: 0, // Would be calculated from the actual blob
      recordedAt: new Date(),
      status: 'pending',
    };
    
    setVoiceBlogs([newVoiceBlog, ...voiceBlogs]);
    toast.success("குரல் வலைப்பதிவை வெற்றிகரமாக சேமிக்கப்பட்டது");
    
    // Reset form
    setNewPost({
      title: '',
      description: '',
    });
    setRecordedBlob(null);
    setRecordingUrl(null);
  };
  
  const togglePlayPause = (id: string, audioUrl: string) => {
    if (currentlyPlaying === id) {
      // Currently playing this audio, so pause it
      if (audioPlayer) {
        audioPlayer.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      // Pause any currently playing audio
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      // Play the new audio
      const newAudioPlayer = new Audio(audioUrl);
      setAudioPlayer(newAudioPlayer);
      
      newAudioPlayer.onended = () => {
        setCurrentlyPlaying(null);
      };
      
      newAudioPlayer.play().catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Could not play audio");
        setCurrentlyPlaying(null);
      });
      
      setCurrentlyPlaying(id);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-6">குரல் வலைப்பதிவு</h1>
        
        {/* Record New Voice Blog */}
        <section className="mb-12 bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">புதிய குரல் வலைப்பதிவைப் பதிவு செய்யவும்</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center p-6">
              <RecordButton onRecordingComplete={handleRecordingComplete} maxDuration={300} />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">தலைப்பு</Label>
                <Input 
                  id="title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  placeholder="உங்கள் குரல் வலைப்பதிவுக்கு ஒரு தலைப்பைக் கொடுங்கள்"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">விளக்கம் (விருப்பமானது)</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={newPost.description}
                  onChange={handleInputChange}
                  placeholder="உங்கள் குரல் வலைப்பதிவு என்னவாக இருக்கிறது என்பதை சுருக்கமாக விவரிக்கவும்"
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleSavePost}
                disabled={!recordedBlob || !newPost.title}
                className="w-full mt-2"
              >
                <Save className="h-4 w-4 mr-2" />
                குரல் வலைப்பதிவை சேமிக்கவும்
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2">
                உங்கள் குரல் வலைப்பதிவு மதிப்பாய்வுக்காக சமர்ப்பிக்கப்படும். உரைக்கு மாற்றப்பட்ட பின், 
                உங்கள் அனுமதியுடன் மூன்றாம் தரப்பு தளங்களில் பணமாக்கப்படலாம்.
              </p>
            </div>
          </div>
        </section>
        
        {/* Voice Blog List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">உங்கள் குரல் வலைப்பதிவுகள்</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {voiceBlogs.map((blog) => (
              <AccordionItem 
                key={blog.id} 
                value={blog.id}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/30">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 rounded-full bg-primary/10">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{blog.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(blog.recordedAt)}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(blog.duration)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {blog.status === 'pending' && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">
                          மதிப்பாய்வு நிலுவையில்
                        </span>
                      )}
                      {blog.status === 'published' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                          வெளியிடப்பட்டது
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="p-4 pt-2">
                  {blog.description && (
                    <p className="text-muted-foreground mb-4">{blog.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                    <div className="flex items-center">
                      <button
                        onClick={() => togglePlayPause(blog.id, blog.audioUrl)}
                        className="rounded-full p-2 bg-primary text-primary-foreground mr-3 hover:bg-primary/90 transition-colors focus-ring"
                        aria-label={currentlyPlaying === blog.id ? "Pause" : "Play"}
                      >
                        {currentlyPlaying === blog.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      
                      <div>
                        <span className="text-sm font-medium">குரல் பதிவு</span>
                        <span className="text-xs text-muted-foreground block">
                          {formatTime(blog.duration)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {blog.status === 'published' ? (
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          சமூகத்துடன் பகிரப்பட்டது
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          மதிப்பாய்வுக்காக காத்திருக்கிறது
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Developer note about monetization */}
                  <div className="mt-4 text-xs text-muted-foreground border-t pt-4">
                    <p>
                      <strong>மேம்பாட்டாளர்களுக்கான குறிப்பு:</strong> பதிவுக்குப் பிறகு, குரல் வலைப்பதிவு தரவுத்தளத்தில் சேமிக்கப்படுகிறது.
                      மேம்பாட்டாளர்கள் குரல் செய்தியை அணுகி, கைமுறையாக உரைக்கு மாற்றி, பிறகு அதை பணமாக்கலுக்காக மூன்றாம் தரப்பு
                      இணையதளத்தில் பதிவேற்றலாம். அதே சமூகத்தில் உள்ள பயனர்கள் பதிவேற்றப்பட்ட 24 மணிநேரத்திற்குப் பிறகு ஒரு
                      அறிவிப்பைப் பெறுவார்கள்.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            
            {voiceBlogs.length === 0 && (
              <div className="text-center py-8">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">இன்னும் குரல் வலைப்பதிவுகள் இல்லை</h3>
                <p className="text-muted-foreground mb-6">
                  உங்கள் முதல் குரல் வலைப்பதிவை உருவாக்க பதிவு செய்யத் தொடங்குங்கள்.
                </p>
              </div>
            )}
          </Accordion>
        </section>
      </main>
    </div>
  );
};

export default VoiceBlog;
