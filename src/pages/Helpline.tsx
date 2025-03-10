
import Header from '../components/Header';
import { Phone, MessageSquare, Info, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoiceNavigation } from '../providers/VoiceNavigationProvider';
import { useEffect } from 'react';

const Helpline = () => {
  const { speak } = useVoiceNavigation();

  useEffect(() => {
    // Announce the page when it loads for accessibility
    speak("உதவி எண் பக்கத்திற்கு வரவேற்கிறோம். உங்களுக்கு உதவி தேவைப்பட்டால், 9843265783 என்ற எண்ணை அழைக்கவும்.");
  }, [speak]);

  const handleCall = () => {
    window.open('tel:9843265783', '_self');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-8 text-center">உதவி எண்</h1>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">உங்களுக்கு உதவி தேவையா?</CardTitle>
              <CardDescription className="text-xl mt-2">
                எங்கள் உதவி குழு உங்களுக்கு உதவ தயாராக உள்ளது
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center">
              <div className="text-primary mb-4">
                <Phone className="h-16 w-16 mx-auto" />
              </div>
              
              <p className="text-2xl font-bold mb-6 text-center">
                9843265783
              </p>
              
              <p className="text-lg text-center mb-8">
                24/7 உதவிக்கு எங்களை அழைக்கவும். எங்கள் நிபுணர்கள் உங்களுக்கு உதவுவார்கள்.
              </p>
              
              <Button 
                size="lg" 
                className="text-xl py-6 px-8 w-full md:w-auto"
                onClick={handleCall}
              >
                <Phone className="mr-2 h-6 w-6" />
                இப்போது அழைக்கவும்
              </Button>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 text-center">
              <p className="text-muted-foreground">
                காலை 9 மணி முதல் மாலை 8 மணி வரை திங்கள் முதல் சனி வரை கிடைக்கும்
              </p>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  செய்தி ஆதரவு
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  உங்களுக்கு அழைப்பு விடுப்பதற்கு வசதியில்லை என்றால், செய்தி மூலம் எங்களை தொடர்பு கொள்ளலாம்.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  செய்தி அனுப்பவும்
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  அடிக்கடி கேட்கப்படும் கேள்விகள்
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  பொதுவான கேள்விகளுக்கான பதில்களைக் காணவும் மற்றும் ஆன்லைன் ஆதரவு ஆவணங்களை அணுகவும்.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  FAQ பார்க்கவும்
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Helpline;
