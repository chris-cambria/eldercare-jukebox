
import { useState } from 'react';
import { Plus, Pill, Coffee, Activity, Bell, X, Clock } from 'lucide-react';
import Header from '../components/Header';
import ReminderCard, { ReminderType } from '../components/ReminderCard';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from "sonner";

// Placeholder data - Replace with actual data fetching in production
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
    type: 'medication' as ReminderType,
    title: 'நீரிழிவு மருந்து',
    time: '9:00 AM',
    description: 'காலை உணவுக்குப் பிறகு எடுக்கவும்',
    voiceAlert: '/medication-reminder-2.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '3',
    type: 'meal' as ReminderType,
    title: 'காலை உணவு',
    time: '8:00 AM',
    description: 'காலை உணவைத் தவிர்க்காதீர்கள்',
    voiceAlert: '/meal-reminder.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '4',
    type: 'meal' as ReminderType,
    title: 'மதிய உணவு நேரம்',
    time: '12:30 PM',
    description: 'சமச்சீரான உணவு சாப்பிட மறக்காதீர்கள்',
    voiceAlert: '/meal-reminder-2.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '5',
    type: 'exercise' as ReminderType,
    title: 'காலை நீட்சி',
    time: '7:30 AM',
    description: '10 நிமிடங்கள் மென்மையான நீட்சிப்பயிற்சி',
    voiceAlert: '/exercise-reminder.mp3', // Placeholder path
    isActive: true,
  },
  {
    id: '6',
    type: 'exercise' as ReminderType,
    title: 'மாலை நடைப்பயிற்சி',
    time: '6:00 PM',
    description: '30 நிமிடங்கள் இலேசான நடைப்பயிற்சி',
    voiceAlert: '/exercise-reminder-2.mp3', // Placeholder path
    isActive: true,
  },
];

const Reminders = () => {
  const [reminders, setReminders] = useState(initialReminders);
  const [filter, setFilter] = useState<ReminderType | 'all'>('all');
  const [newReminder, setNewReminder] = useState({
    title: '',
    type: 'medication' as ReminderType,
    time: '',
    description: '',
    voiceAlert: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive } 
        : reminder
    ));
    
    // Show toast notification
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      const status = !reminder.isActive ? 'செயல்படுத்தப்பட்டது' : 'செயலற்றதாக்கப்பட்டது';
      toast(`${status} நினைவூட்டல்: ${reminder.title}`);
    }
  };

  const filteredReminders = filter === 'all' 
    ? reminders 
    : reminders.filter(reminder => reminder.type === filter);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setNewReminder(prev => ({ ...prev, type: value as ReminderType }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newReminder.title || !newReminder.time) {
      toast.error("அனைத்து தேவையான புலங்களையும் நிரப்பவும்");
      return;
    }
    
    // Create new reminder
    const id = (reminders.length + 1).toString();
    const createdReminder = {
      id,
      ...newReminder,
      isActive: true,
    };
    
    setReminders([...reminders, createdReminder]);
    toast.success(`நினைவூட்டல் உருவாக்கப்பட்டது: ${newReminder.title}`);
    
    // Reset form
    setNewReminder({
      title: '',
      type: 'medication',
      time: '',
      description: '',
      voiceAlert: '',
    });
    
    setIsDialogOpen(false);
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">நினைவூட்டல்கள்</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                நினைவூட்டல் சேர்க்க
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
              <DialogTitle>புதிய நினைவூட்டல் உருவாக்கு</DialogTitle>
              <DialogDescription>
                மருந்து, உணவு அல்லது உடற்பயிற்சிக்கான புதிய நினைவூட்டலை உருவாக்கவும்.
              </DialogDescription>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">தலைப்பு</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={newReminder.title}
                    onChange={handleInputChange}
                    placeholder="எ.கா., இரத்த அழுத்த மருந்து"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>வகை</Label>
                  <RadioGroup 
                    value={newReminder.type} 
                    onValueChange={handleTypeChange}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medication" id="medication" />
                      <Label htmlFor="medication" className="flex items-center cursor-pointer">
                        <Pill className="h-4 w-4 mr-1" />
                        மருந்து
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="meal" id="meal" />
                      <Label htmlFor="meal" className="flex items-center cursor-pointer">
                        <Coffee className="h-4 w-4 mr-1" />
                        உணவு
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exercise" id="exercise" />
                      <Label htmlFor="exercise" className="flex items-center cursor-pointer">
                        <Activity className="h-4 w-4 mr-1" />
                        உடற்பயிற்சி
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">நேரம்</Label>
                  <Input 
                    id="time"
                    name="time"
                    type="time"
                    value={newReminder.time}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">விளக்கம் (விருப்பமானது)</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={newReminder.description}
                    onChange={handleInputChange}
                    placeholder="இந்த நினைவூட்டலைப் பற்றிய கூடுதல் விவரங்கள்"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voiceAlert">குரல் எச்சரிக்கை (விருப்பமானது)</Label>
                  <Input 
                    id="voiceAlert"
                    name="voiceAlert"
                    value={newReminder.voiceAlert}
                    onChange={handleInputChange}
                    placeholder="ஒலிக் கோப்பிற்கான பாதை, எ.கா., /audio/reminder.mp3"
                  />
                  <p className="text-xs text-muted-foreground">
                    தமிழ் நகைச்சுவை ஒலிக் கோப்புகளை பொது கோப்புறையில் சேர்த்து பாதையைக் குறிப்பிடவும்.
                  </p>
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
        
        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex items-center"
          >
            <Bell className="h-4 w-4 mr-2" />
            அனைத்தும்
          </Button>
          
          <Button 
            variant={filter === 'medication' ? 'default' : 'outline'}
            onClick={() => setFilter('medication')}
            className="flex items-center"
          >
            <Pill className="h-4 w-4 mr-2" />
            மருந்துகள்
          </Button>
          
          <Button 
            variant={filter === 'meal' ? 'default' : 'outline'}
            onClick={() => setFilter('meal')}
            className="flex items-center"
          >
            <Coffee className="h-4 w-4 mr-2" />
            உணவுகள்
          </Button>
          
          <Button 
            variant={filter === 'exercise' ? 'default' : 'outline'}
            onClick={() => setFilter('exercise')}
            className="flex items-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            உடற்பயிற்சி
          </Button>
        </div>
        
        {/* Reminder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              {...reminder}
              onToggle={toggleReminder}
            />
          ))}
          
          {filteredReminders.length === 0 && (
            <div className="col-span-full py-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {filter !== 'all' ? `${filter === 'medication' ? 'மருந்து' : filter === 'meal' ? 'உணவு' : 'உடற்பயிற்சி'} நினைவூட்டல்கள் எதுவும் இல்லை` : "நினைவூட்டல்கள் எதுவும் இல்லை"}
              </h3>
              <p className="text-muted-foreground">
                {filter !== 'all' 
                  ? `இன்னும் எந்த ${filter === 'medication' ? 'மருந்து' : filter === 'meal' ? 'உணவு' : 'உடற்பயிற்சி'} நினைவூட்டல்களும் இல்லை.` 
                  : "இன்னும் எந்த நினைவூட்டல்களும் இல்லை."}
              </p>
              <Button 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                நினைவூட்டல் சேர்க்க
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reminders;
