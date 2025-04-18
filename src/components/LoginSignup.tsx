
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginSignupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: "Welcome back to Raahi!",
      duration: 3000,
    });
    onClose();
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sign Up Successful",
      description: "Welcome to Raahi! Your account has been created.",
      duration: 3000,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-raahi-blue">
            <span className="text-raahi-orange">R</span>aahi Account
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" className="pl-10" placeholder="you@example.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-raahi-blue hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type="password" className="pl-10" required />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-raahi-blue hover:bg-raahi-blue-dark">
                Login
              </Button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-raahi-blue hover:underline font-medium"
                  onClick={() => setActiveTab('signup')}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="name" className="pl-10" placeholder="John Doe" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="signup-email" type="email" className="pl-10" placeholder="you@example.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="signup-password" type="password" className="pl-10" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="confirm-password" type="password" className="pl-10" required />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-raahi-orange hover:bg-raahi-orange-dark">
                Create Account
              </Button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-raahi-blue hover:underline font-medium"
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignup;
