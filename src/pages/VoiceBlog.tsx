
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
    title: 'My Gardening Tips',
    description: 'Sharing some tips on how to take care of indoor plants',
    audioUrl: '/voice-blog-1.mp3', // Placeholder
    duration: 95, // seconds
    recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'published',
  },
  {
    id: '2',
    title: 'Favorite Song Memories',
    description: 'Remembering the songs from my youth',
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
      toast.error("Please provide a title and record an audio message");
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
    toast.success("Voice blog post saved successfully");
    
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
        <h1 className="text-3xl font-bold mb-6">Voice Blog</h1>
        
        {/* Record New Voice Blog */}
        <section className="mb-12 bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Record a New Voice Blog</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center p-6">
              <RecordButton onRecordingComplete={handleRecordingComplete} maxDuration={300} />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  placeholder="Give your voice blog a title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={newPost.description}
                  onChange={handleInputChange}
                  placeholder="Add a brief description of what your voice blog is about"
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleSavePost}
                disabled={!recordedBlob || !newPost.title}
                className="w-full mt-2"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Voice Blog
              </Button>
              
              <p className="text-xs text-muted-foreground mt-2">
                Your voice blog will be submitted for review. After conversion to text, 
                it may be monetized on third-party platforms with your permission.
              </p>
            </div>
          </div>
        </section>
        
        {/* Voice Blog List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Voice Blogs</h2>
          
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
                          Pending Review
                        </span>
                      )}
                      {blog.status === 'published' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                          Published
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
                        <span className="text-sm font-medium">Voice Recording</span>
                        <span className="text-xs text-muted-foreground block">
                          {formatTime(blog.duration)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {blog.status === 'published' ? (
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Shared with community
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          Awaiting review
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Developer note about monetization */}
                  <div className="mt-4 text-xs text-muted-foreground border-t pt-4">
                    <p>
                      <strong>Note for developers:</strong> After recording, the voice blog is stored in the database. 
                      Developers can access the voice message, manually convert it to text, and then upload it to a 
                      third-party website for monetization. Users in the same community will receive a notification 
                      24 hours after upload.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            
            {voiceBlogs.length === 0 && (
              <div className="text-center py-8">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No voice blogs yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start recording to create your first voice blog.
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
