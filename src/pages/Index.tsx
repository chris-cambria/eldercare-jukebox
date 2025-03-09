
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
    title: 'Blood Pressure Medicine',
    time: '8:00 AM',
    description: 'Take with water after breakfast',
    voiceAlert: '/medication-reminder.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '2',
    type: 'meal' as ReminderType,
    title: 'Lunch Time',
    time: '12:30 PM',
    description: 'Remember to have a balanced meal',
    voiceAlert: '/meal-reminder.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '3',
    type: 'exercise' as ReminderType,
    title: 'Evening Walk',
    time: '6:00 PM',
    description: '30 minutes light walking',
    voiceAlert: '/exercise-reminder.mp3', // Placeholder path
    isActive: true,
  },
];

// Placeholder communities - Replace with actual data
const communitySamples = [
  {
    id: '1',
    name: 'Music Lovers',
    description: 'Share and discuss your favorite songs and artists',
    memberCount: 24,
    messageCount: 156,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Crochet Group',
    description: 'Tips, patterns and inspiration for crochet enthusiasts',
    memberCount: 18,
    messageCount: 87,
  },
  {
    id: '3',
    name: 'Tailoring Circle',
    description: 'For those who love sewing and tailoring',
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
          <h1 className="text-4xl font-bold mb-6 text-center">Elder Care Assistant</h1>
          <p className="text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your companion for medication reminders, meals, exercise, 
            and staying connected with your community.
          </p>
          
          <Carousel images={placeholderImages} interval={5000} />
        </section>
        
        {/* Recent Reminders */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Reminders</h2>
            <Link 
              to="/reminders"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span className="mr-1">View All</span>
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
            <h2 className="text-2xl font-bold">Featured Communities</h2>
            <Link 
              to="/community"
              className="flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span className="mr-1">View All</span>
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
            <h2 className="text-2xl font-bold mb-4">Share Your Stories</h2>
            <p className="text-muted-foreground mb-6">
              Record voice messages to share your experiences, stories, and knowledge 
              with others in your community.
            </p>
            
            <Link 
              to="/voice-blog"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-ring"
            >
              Start Recording
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
