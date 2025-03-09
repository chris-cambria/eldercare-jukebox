
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
    name: 'Music Lovers',
    description: 'Share and discuss your favorite songs and artists. From classical to film music, explore and enjoy music together.',
    memberCount: 24,
    messageCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Crochet Group',
    description: 'Tips, patterns and inspiration for crochet enthusiasts. Learn new techniques and showcase your work.',
    memberCount: 18,
    messageCount: 87,
    imageUrl: 'https://images.unsplash.com/photo-1604536713137-68e32548cd5c?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Tailoring Circle',
    description: 'For those who love sewing and tailoring. Share patterns, get advice on garment construction, and more.',
    memberCount: 12,
    messageCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Gardening Group',
    description: 'Discuss plants, gardening tips, and share your green thumb successes. Seasonal advice for all types of gardens.',
    memberCount: 32,
    messageCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Book Club',
    description: 'A place to discuss books, share recommendations, and engage in thoughtful literary conversations.',
    memberCount: 15,
    messageCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1471&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Recipe Exchange',
    description: 'Share your favorite recipes, cooking tips, and culinary traditions from different regions.',
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
      toast.error("Please fill in all required fields");
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
    toast.success(`Created community: ${newCommunity.name}`);
    
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
            <h1 className="text-3xl font-bold">Communities</h1>
            <p className="text-muted-foreground mt-1">Join groups and connect with others</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search communities..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Community
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Create New Community</DialogTitle>
                <DialogDescription>
                  Create a new community group where people can send audio messages to each other.
                </DialogDescription>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Community Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newCommunity.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Music Lovers"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={newCommunity.description}
                      onChange={handleInputChange}
                      placeholder="Describe what this community is about"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
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
                      <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create Community</Button>
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
              <h3 className="text-xl font-medium mb-2">No communities found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No communities matching "${searchQuery}"` 
                  : "There are no communities available yet."}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Community
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
