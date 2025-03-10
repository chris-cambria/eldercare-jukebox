
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KeyRound, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SignIn = ({ setIsAuthenticated }: SignInProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would validate the code against a backend
    // For this demo, we'll accept any 4-digit code
    setTimeout(() => {
      if (code.length === 4 && /^\d{4}$/.test(code)) {
        // Set authentication state
        localStorage.setItem("authenticated", "true");
        setIsAuthenticated(true);
        
        toast({
          title: "ஆறாவெல்-க்கு வரவேற்கிறோம்!",
          description: "நீங்கள் வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்.",
        });
        navigate('/');
      } else {
        toast({
          title: "தவறான குறியீடு",
          description: "4 இலக்க குறியீட்டை உள்ளிடவும்.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">ஆறாவெல்-க்கு வரவேற்கிறோம்</CardTitle>
          <CardDescription className="text-xl">
            உங்கள் 4 இலக்க அணுகல் குறியீட்டை உள்ளிடவும்
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
                <Input
                  className="pl-12 text-2xl py-6"
                  type="text"
                  placeholder="4 இலக்க குறியீடு"
                  maxLength={4}
                  value={code}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setCode(value);
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-xl py-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  சரிபார்க்கிறது...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  உள்நுழைய
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
