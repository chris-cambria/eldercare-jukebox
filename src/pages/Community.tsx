
import { useState } from 'react';
import { Search, Users, Plus, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import CommunityCard, { CommunityCardProps } from '../components/CommunityCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

// Placeholder data - Replace with actual data fetching in production
const initialCommunities: CommunityCardProps[] = [
  {
    id: '1',
    name: 'இசை ரசிகர்கள்',
    description: 'உங்கள் விருப்பமான பாடல்கள் மற்றும் கலைஞர்களைப் பற்றி பகிர்ந்து விவாதிக்கவும். கிளாசிக்கிலிருந்து திரைப்பட இசை வரை, ஒன்றாக இசையை ஆராய்ந்து மகிழுங்கள்.',
    memberCount: 24,
    messageCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'குரோஷே குழு',
    description: 'குரோஷே ஆர்வலர்களுக்கான குறிப்புகள், மாதிரிகள் மற்றும் உத்வேகம். புதிய நுட்பங்களைக் கற்றுக்கொள்ளுங்கள் மற்றும் உங்கள் படைப்புகளை காட்சிப்படுத்துங்கள்.',
    memberCount: 18,
    messageCount: 87,
    imageUrl: 'https://images.unsplash.com/photo-1604536713137-68e32548cd5c?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'தையல் வட்டம்',
    description: 'தையல் மற்றும் தைக்கும் கலையை விரும்புபவர்களுக்கு. ஆடை தயாரிப்பு, மாதிரிகள், ஆலோசனைகள் மற்றும் பலவற்றை பகிர்ந்து கொள்ளுங்கள்.',
    memberCount: 12,
    messageCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'தோட்டக்கலை குழு',
    description: 'தாவரங்கள், தோட்டக்கலை குறிப்புகள் மற்றும் உங்கள் வெற்றிகளைப் பகிர்ந்து கொள்ளுங்கள். எல்லா வகையான தோட்டங்களுக்கும் பருவகால ஆலோசனைகள்.',
    memberCount: 32,
    messageCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'புத்தக குழு',
    description: 'புத்தகங்களை விவாதிக்க, பரிந்துரைகளைப் பகிர மற்றும் சிந்தனையைத் தூண்டும் இலக்கிய உரையாடல்களில் ஈடுபட ஒரு இடம்.',
    memberCount: 15,
    messageCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1471&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'சமையல் குறிப்புகள்',
    description: 'உங்கள் விருப்பமான சமையல் குறிப்புகள், சமையல் உத்திகள் மற்றும் வெவ்வேறு பகுதிகளில் இருந்து சமையல் பாரம்பரியங்களைப் பகிர்ந்து கொள்ளுங்கள்.',
    memberCount: 27,
    messageCount: 175,
    imageUrl: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=1467&auto=format&fit=crop',
  },
];

const Community = () => {
  const [communities, setCommunities] = useState<CommunityCardProps[]>(initialCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCommunity(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newCommunity.name || !newCommunity.description) {
      toast.error("அனைத்து தேவையான புலங்களையும் நிரப்பவும்");
      return;
    }
    
    // Create new community
    const id = (communities.length + 1).toString();
    const createdCommunity: CommunityCardProps = {
      id,
      ...newCommunity,
      memberCount: 1, // Start with creator as member
      messageCount: 0, // No messages yet
    };
    
    setCommunities([...communities, createdCommunity]);
    toast.success(`சமூகம் உருவாக்கப்பட்டது: ${newCommunity.name}`);
    
    // Reset form
    setNewCommunity({
      name: '',
      description: '',
      imageUrl: '',
    });
    
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">சமூகங்கள்</h1>
            <p className="text-muted-foreground mt-1">குழுக்களில் சேருங்கள் மற்றும் மற்றவர்களுடன் இணையுங்கள்</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="சமூகங்களைத் தேடுங்கள்..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  சமூகம் உருவாக்க
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>புதிய சமூகம் உருவாக்கு</DialogTitle>
                <DialogDescription>
                  மக்கள் ஒருவருக்கொருவர் ஒலிச் செய்திகளை அனுப்பக்கூடிய புதிய சமூகக் குழுவை உருவாக்கவும்.
                </DialogDescription>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">சமூகத்தின் பெயர்</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newCommunity.name}
                      onChange={handleInputChange}
                      placeholder="எ.கா., இசை ரசிகர்கள்"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">விளக்கம்</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={newCommunity.description}
                      onChange={handleInputChange}
                      placeholder="இந்த சமூகம் எதைப் பற்றியது என்பதை விவரிக்கவும்"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">படத்தின் URL (விருப்பமானது)</Label>
                    <Input 
                      id="imageUrl"
                      name="imageUrl"
                      value={newCommunity.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <DialogClose asChild>
                      <Button variant="outline" type="button">ரத்து செய்</Button>
                    </DialogClose>
                    <Button type="submit">உருவாக்கு</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommunities.map(community => (
            <CommunityCard
              key={community.id}
              {...community}
            />
          ))}
          
          {filteredCommunities.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">சமூகங்கள் எதுவும் கிடைக்கவில்லை</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `"${searchQuery}" உடன் பொருந்தும் சமூகங்கள் எதுவும் இல்லை` 
                  : "இன்னும் சமூகங்கள் எதுவும் இல்லை."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  சமூகம் உருவாக்க
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
