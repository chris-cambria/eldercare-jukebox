
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Coffee, Activity, ArrowRight, Bell } from 'lucide-react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import ReminderCard, { ReminderType } from '../components/ReminderCard';
import CommunityCard from '../components/CommunityCard';

// Placeholder data - Replace with actual data fetching in production
const placeholderImages = [
  "https://images.unsplash.com/photo-1454418747937-bd95bb945625?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1373&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=1528&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1569161031678-f49b4b9ca1c2?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=1470&auto=format&fit=crop"
];

// Placeholder reminders - Replace with actual data
const initialReminders = [
  {
    id: '1',
    type: 'medication' as ReminderType,
    title: 'இரத்த அழுத்த மருந்து',
    time: '8:00 AM',
    description: 'காலை உணவுக்குப் பிறகு தண்ணீருடன் எடுக்கவும்',
    voiceAlert: '/medication-reminder.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '2',
    type: 'meal' as ReminderType,
    title: 'மதிய உணவு நேரம்',
    time: '12:30 PM',
    description: 'சமச்சீரான உணவு சாப்பிட மறக்காதீர்கள்',
    voiceAlert: '/meal-reminder.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '3',
    type: 'exercise' as ReminderType,
    title: 'மாலை நடைப்பயிற்சி',
    time: '6:00 PM',
    description: '30 நிமிடங்கள் இலேசான நடைப்பயிற்சி',
    voiceAlert: '/exercise-reminder.mp3', // Placeholder path
    isActive: true,
  },
];

// Placeholder communities - Replace with actual data
const communitySamples = [
  {
    id: '1',
    name: 'இசை ரசிகர்கள்',
    description: 'உங்கள் விருப்பமான பாடல்கள் மற்றும் கலைஞர்களைப் பற்றி பகிர்ந்து விவாதிக்கவும்',
    memberCount: 24,
    messageCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'குரோஷே குழு',
    description: 'குரோஷே ஆர்வலர்களுக்கான குறிப்புகள், மாதிரிகள் மற்றும் உத்வேகம்',
    memberCount: 18,
    messageCount: 87,
  },
  {
    id: '3',
    name: 'தையல் வட்டம்',
    description: 'தையல் மற்றும் தைக்கும் கலையை விரும்புபவர்களுக்கு',
    memberCount: 12,
    messageCount: 45,
  },
];

const Index = () => {
  const [reminders, setReminders] = useState(initialReminders);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive } 
        : reminder
    ));
  };

  /* 
  * To customize the carousel images:
  * Replace placeholderImages array with your own image URLs
  * The carousel will automatically update with your images
  */

  /* 
  * To customize voice alerts:
  * Add your Tamil comedy audio clips to the public folder
  * Update the voiceAlert paths in the initialReminders array
  * Examples: "/audio/tamil-comedy-1.mp3", "/audio/tamil-comedy-2.mp3", etc.
  */

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 pb-16">
        {/* Hero Section with Carousel */}
        <section className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-6 text-center">முதியோர் பராமரிப்பு உதவியாளர்</h1>
          <p className="text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            மருந்து நினைவூட்டல்கள், உணவுகள், உடற்பயிற்சி மற்றும் சமூகத்துடன் 
            இணைந்திருப்பதற்கான உங்கள் துணை.
          </p>
          
          <Carousel images={placeholderImages} interval={5000} />
        </section>
        
        {/* Recent Reminders */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">சமீபத்திய நினைவூட்டல்கள்</h2>
            <Link 
              to="/reminders"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span className="mr-1">அனைத்தையும் காண</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reminders.slice(0, 3).map(reminder => (
              <ReminderCard
                key={reminder.id}
                {...reminder}
                onToggle={toggleReminder}
              />
            ))}
          </div>
        </section>
        
        {/* Featured Communities */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">சிறப்பு சமூகங்கள்</h2>
            <Link 
              to="/community"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span className="mr-1">அனைத்தையும் காண</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communitySamples.map(community => (
              <CommunityCard
                key={community.id}
                {...community}
              />
            ))}
          </div>
        </section>
        
        {/* Voice Blog Promo */}
        <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">உங்கள் கதைகளைப் பகிரவும்</h2>
            <p className="text-muted-foreground mb-6">
              உங்கள் அனுபவங்கள், கதைகள் மற்றும் அறிவை சமூகத்தில் உள்ளவர்களுடன் 
              பகிர்ந்து கொள்ள குரல் செய்திகளைப் பதிவு செய்யுங்கள்.
            </p>
            
            <Link 
              to="/voice-blog"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-ring"
            >
              பதிவு செய்யத் தொடங்கு
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
