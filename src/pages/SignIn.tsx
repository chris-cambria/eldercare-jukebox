
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle authentication here
    // This is just a mockup for demonstration
    toast({
      title: isSignUp ? "Account created!" : "Welcome back!",
      description: isSignUp 
        ? "Your account has been created successfully." 
        : "You have been logged in successfully.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Bell className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          {isSignUp 
            ? "Sign up to manage your medication reminders and connect with the community." 
            : "Sign in to access your personalized elder care assistant."}
        </p>
        
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp 
                ? "Already have an account?" 
                : "Don't have an account yet?"}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-primary hover:underline focus:outline-none"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
